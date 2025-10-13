/**
 * Camera Export Utility
 * Handles exporting camera views as images layer by layer
 */

/**
 * Check if a camera is at the default position
 * @param {object} camera - The camera configuration
 * @returns {boolean} True if camera is at default position
 */
export const isDefaultCameraPosition = (camera) => {
  const defaultX = 0.5;
  const defaultY = 0.5;
  const tolerance = 0.001; // Small tolerance for floating point comparison
  
  return (
    Math.abs(camera.position.x - defaultX) < tolerance &&
    Math.abs(camera.position.y - defaultY) < tolerance &&
    camera.isDefault === true
  );
};

/**
 * Export a camera view as an image with layers
 * @param {object} scene - The scene object
 * @param {object} camera - The camera configuration
 * @param {number} sceneWidth - Scene width in pixels
 * @param {number} sceneHeight - Scene height in pixels
 * @returns {Promise<string>} Data URL of the exported image
 */
export const exportCameraView = async (scene, camera, sceneWidth = 9600, sceneHeight = 5400) => {
  // Create a canvas for rendering
  const canvas = document.createElement('canvas');
  canvas.width = camera.width || 800;
  canvas.height = camera.height || 450;
  const ctx = canvas.getContext('2d');

  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate camera viewport in scene coordinates (centered on position)
  const cameraX = (camera.position.x * sceneWidth) - (canvas.width / 2);
  const cameraY = (camera.position.y * sceneHeight) - (canvas.height / 2);

  // Get layers sorted by z_index
  const layers = (scene.layers || []).slice().sort((a, b) => (a.z_index || 0) - (b.z_index || 0));

  // Render each layer
  for (const layer of layers) {
    if (layer.type === 'image' && layer.image_path) {
      await renderImageLayer(ctx, layer, cameraX, cameraY);
    } else if (layer.type === 'text') {
      renderTextLayer(ctx, layer, cameraX, cameraY);
    } else if (layer.type === 'shape') {
      renderShapeLayer(ctx, layer, cameraX, cameraY);
    }
  }

  return canvas.toDataURL('image/png');
};

/**
 * Render an image layer to canvas
 * Each layer is rendered with proper positioning relative to camera viewport
 */
const renderImageLayer = (ctx, layer, cameraX, cameraY) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Calculate layer position relative to camera viewport
      const layerX = (layer.position?.x || 0) - cameraX;
      const layerY = (layer.position?.y || 0) - cameraY;
      const scale = layer.scale || 1.0;
      const opacity = layer.opacity || 1.0;

      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Draw image centered on its position
      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;
      ctx.drawImage(
        img,
        layerX - (imgWidth / 2), // Center horizontally
        layerY - (imgHeight / 2), // Center vertically
        imgWidth,
        imgHeight
      );
      ctx.restore();
      resolve();
    };

    img.onerror = () => {
      console.warn('Failed to load image:', layer.image_path);
      resolve();
    };

    img.src = layer.image_path;
  });
};

/**
 * Render a text layer to canvas
 * Text is rendered at its position with proper alignment
 */
const renderTextLayer = (ctx, layer, cameraX, cameraY) => {
  const textConfig = layer.text_config || {};
  const text = textConfig.text || 'Text';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;
  const align = textConfig.align || 'left';

  // Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;

  // Convert color
  let fillStyle = '#000000';
  if (Array.isArray(textConfig.color)) {
    fillStyle = `#${textConfig.color.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  } else if (typeof textConfig.color === 'string') {
    fillStyle = textConfig.color;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle'; // Center text vertically on position
  
  // Handle multi-line text
  const lines = text.split('\n');
  const lineHeight = (textConfig.line_height || 1.2) * fontSize * scale;
  
  lines.forEach((line, index) => {
    const yOffset = (index - (lines.length - 1) / 2) * lineHeight;
    ctx.fillText(line, layerX, layerY + yOffset);
  });
  
  ctx.restore();
};

/**
 * Render a shape layer to canvas
 * Shapes are rendered centered on their position
 */
const renderShapeLayer = (ctx, layer, cameraX, cameraY) => {
  const shapeConfig = layer.shape_config || {};
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;

  // Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;

  // Convert color
  let fillStyle = '#000000';
  if (Array.isArray(shapeConfig.fill_color)) {
    fillStyle = `rgba(${shapeConfig.fill_color.join(',')})`;
  } else if (typeof shapeConfig.fill_color === 'string') {
    fillStyle = shapeConfig.fill_color;
  } else if (shapeConfig.fill) {
    fillStyle = shapeConfig.fill;
  }

  let strokeStyle = '#000000';
  if (Array.isArray(shapeConfig.stroke_color)) {
    strokeStyle = `rgba(${shapeConfig.stroke_color.join(',')})`;
  } else if (typeof shapeConfig.stroke_color === 'string') {
    strokeStyle = shapeConfig.stroke_color;
  } else if (shapeConfig.stroke) {
    strokeStyle = shapeConfig.stroke;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || shapeConfig.strokeWidth || 1) * scale;

  const shapeType = shapeConfig.shape_type || shapeConfig.shape || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;

  // Center shapes on their position
  const centerX = layerX;
  const centerY = layerY;

  switch (shapeType) {
    case 'rectangle':
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
      }
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI);
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fill();
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.stroke();
      }
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2, centerY - height / 2);
      ctx.lineTo(centerX + width / 2, centerY + height / 2);
      ctx.stroke();
      break;
    // Add more shape types as needed
  }

  ctx.restore();
};

/**
 * Export all cameras from a scene
 * Default cameras are exported as JSON config reference only
 * @param {object} scene - The scene object
 * @param {number} sceneWidth - Scene width in pixels
 * @param {number} sceneHeight - Scene height in pixels
 * @returns {Promise<Array>} Array of {camera, imageDataUrl, configOnly} objects
 */
export const exportAllCameras = async (scene, sceneWidth = 9600, sceneHeight = 5400) => {
  const cameras = scene.sceneCameras || [];
  const exports = [];

  for (const camera of cameras) {
    // Check if this is a default camera at default position
    const isDefaultPos = isDefaultCameraPosition(camera);
    
    if (isDefaultPos) {
      // For default camera, just save config reference
      exports.push({
        camera: camera,
        imageDataUrl: null, // No image for default camera
        cameraName: camera.name || 'Camera',
        isDefault: true,
        configOnly: true, // Flag to indicate this is config-only
        config: {
          id: camera.id,
          name: camera.name,
          position: camera.position,
          width: camera.width,
          height: camera.height,
          zoom: camera.zoom,
          isDefault: true,
        }
      });
    } else {
      // For custom cameras, export the actual image
      const imageDataUrl = await exportCameraView(scene, camera, sceneWidth, sceneHeight);
      exports.push({
        camera: camera,
        imageDataUrl: imageDataUrl,
        cameraName: camera.name || 'Camera',
        isDefault: camera.isDefault || false,
        configOnly: false,
      });
    }
  }

  return exports;
};

/**
 * Download an image from data URL
 * @param {string} dataUrl - Image data URL
 * @param {string} filename - Filename for download
 */
export const downloadImage = (dataUrl, filename) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Export a single layer as an image with white background
 * The layer is rendered at its position with proper centering
 * @param {object} layer - The layer to export
 * @param {number} canvasWidth - Canvas width (default: layer's natural size or 800)
 * @param {number} canvasHeight - Canvas height (default: layer's natural size or 450)
 * @returns {Promise<string>} Data URL of the exported layer image
 */
export const exportLayerAsImage = async (layer, canvasWidth = 800, canvasHeight = 450) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center the layer on the canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Render the layer based on its type
  if (layer.type === 'image' && layer.image_path) {
    await renderImageLayerCentered(ctx, layer, centerX, centerY);
  } else if (layer.type === 'text') {
    renderTextLayerCentered(ctx, layer, centerX, centerY);
  } else if (layer.type === 'shape') {
    renderShapeLayerCentered(ctx, layer, centerX, centerY);
  }

  return canvas.toDataURL('image/png');
};

/**
 * Render an image layer centered on canvas
 */
const renderImageLayerCentered = (ctx, layer, centerX, centerY) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const scale = layer.scale || 1.0;
      const opacity = layer.opacity || 1.0;
      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(
        img,
        centerX - (imgWidth / 2),
        centerY - (imgHeight / 2),
        imgWidth,
        imgHeight
      );
      ctx.restore();
      resolve();
    };

    img.onerror = () => {
      console.warn('Failed to load image:', layer.image_path);
      resolve();
    };

    img.src = layer.image_path;
  });
};

/**
 * Render a text layer centered on canvas
 */
const renderTextLayerCentered = (ctx, layer, centerX, centerY) => {
  const textConfig = layer.text_config || {};
  const text = textConfig.text || 'Text';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;
  const align = textConfig.align || 'center';

  // Convert color
  let fillStyle = '#000000';
  if (Array.isArray(textConfig.color)) {
    fillStyle = `#${textConfig.color.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  } else if (typeof textConfig.color === 'string') {
    fillStyle = textConfig.color;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  
  // Handle multi-line text
  const lines = text.split('\n');
  const lineHeight = (textConfig.line_height || 1.2) * fontSize * scale;
  
  lines.forEach((line, index) => {
    const yOffset = (index - (lines.length - 1) / 2) * lineHeight;
    ctx.fillText(line, centerX, centerY + yOffset);
  });
  
  ctx.restore();
};

/**
 * Render a shape layer centered on canvas
 */
const renderShapeLayerCentered = (ctx, layer, centerX, centerY) => {
  const shapeConfig = layer.shape_config || {};
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;

  // Convert color
  let fillStyle = '#000000';
  if (Array.isArray(shapeConfig.fill_color)) {
    fillStyle = `rgba(${shapeConfig.fill_color.join(',')})`;
  } else if (typeof shapeConfig.fill_color === 'string') {
    fillStyle = shapeConfig.fill_color;
  } else if (shapeConfig.fill) {
    fillStyle = shapeConfig.fill;
  }

  let strokeStyle = '#000000';
  if (Array.isArray(shapeConfig.stroke_color)) {
    strokeStyle = `rgba(${shapeConfig.stroke_color.join(',')})`;
  } else if (typeof shapeConfig.stroke_color === 'string') {
    strokeStyle = shapeConfig.stroke_color;
  } else if (shapeConfig.stroke) {
    strokeStyle = shapeConfig.stroke;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || shapeConfig.strokeWidth || 1) * scale;

  const shapeType = shapeConfig.shape_type || shapeConfig.shape || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;

  switch (shapeType) {
    case 'rectangle':
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
      }
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI);
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fill();
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.stroke();
      }
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2, centerY - height / 2);
      ctx.lineTo(centerX + width / 2, centerY + height / 2);
      ctx.stroke();
      break;
    // Add more shape types as needed
  }

  ctx.restore();
};

/**
 * Export default camera view
 * If camera is at default position, returns config object instead of image
 * @param {object} scene - The scene object
 * @param {number} sceneWidth - Scene width in pixels
 * @param {number} sceneHeight - Scene height in pixels
 * @returns {Promise<object>} Object with imageDataUrl or config
 */
export const exportDefaultCameraView = async (scene, sceneWidth = 9600, sceneHeight = 5400) => {
  const cameras = scene.sceneCameras || [];
  const defaultCamera = cameras.find(cam => cam.isDefault);
  
  if (!defaultCamera) {
    throw new Error('No default camera found in scene');
  }

  // Check if camera is at default position
  const isDefaultPos = isDefaultCameraPosition(defaultCamera);
  
  if (isDefaultPos) {
    // Return config reference instead of image
    return {
      configOnly: true,
      config: {
        id: defaultCamera.id,
        name: defaultCamera.name,
        position: defaultCamera.position,
        width: defaultCamera.width,
        height: defaultCamera.height,
        zoom: defaultCamera.zoom,
        isDefault: true,
      },
      imageDataUrl: null,
    };
  }

  // Export actual image for non-default position
  const imageDataUrl = await exportCameraView(scene, defaultCamera, sceneWidth, sceneHeight);
  return {
    configOnly: false,
    imageDataUrl: imageDataUrl,
  };
};
