/**
 * Camera Export Utility
 * Handles exporting camera views as images layer by layer
 */

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

  // Calculate camera viewport in scene coordinates
  const cameraX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraY = (camera.position.y * sceneHeight) - (camera.height / 2);

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
 */
const renderImageLayer = (ctx, layer, cameraX, cameraY) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const layerX = (layer.position?.x || 0) - cameraX;
      const layerY = (layer.position?.y || 0) - cameraY;
      const scale = layer.scale || 1.0;
      const opacity = layer.opacity || 1.0;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(
        img,
        layerX,
        layerY,
        img.width * scale,
        img.height * scale
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
 */
const renderTextLayer = (ctx, layer, cameraX, cameraY) => {
  const textConfig = layer.text_config || {};
  const text = textConfig.text || 'Text';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;

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
  ctx.fillText(text, layerX, layerY);
  ctx.restore();
};

/**
 * Render a shape layer to canvas
 */
const renderShapeLayer = (ctx, layer, cameraX, cameraY) => {
  const shapeConfig = layer.shape_config || {};
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity || 1.0;

  // Convert color
  let fillStyle = '#000000';
  if (Array.isArray(shapeConfig.fill_color)) {
    fillStyle = `rgba(${shapeConfig.fill_color.join(',')})`;
  } else if (typeof shapeConfig.fill_color === 'string') {
    fillStyle = shapeConfig.fill_color;
  }

  let strokeStyle = '#000000';
  if (Array.isArray(shapeConfig.stroke_color)) {
    strokeStyle = `rgba(${shapeConfig.stroke_color.join(',')})`;
  } else if (typeof shapeConfig.stroke_color === 'string') {
    strokeStyle = shapeConfig.stroke_color;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || 1) * scale;

  const shapeType = shapeConfig.shape_type || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;

  switch (shapeType) {
    case 'rectangle':
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fillRect(layerX, layerY, width, height);
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.strokeRect(layerX, layerY, width, height);
      }
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(layerX + width / 2, layerY + height / 2, width / 2, 0, 2 * Math.PI);
      if (shapeConfig.fill_mode !== 'stroke') {
        ctx.fill();
      }
      if (shapeConfig.fill_mode !== 'fill') {
        ctx.stroke();
      }
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(layerX, layerY);
      ctx.lineTo(layerX + width, layerY + height);
      ctx.stroke();
      break;
    // Add more shape types as needed
  }

  ctx.restore();
};

/**
 * Export all cameras from a scene
 * @param {object} scene - The scene object
 * @param {number} sceneWidth - Scene width in pixels
 * @param {number} sceneHeight - Scene height in pixels
 * @returns {Promise<Array>} Array of {camera, imageDataUrl} objects
 */
export const exportAllCameras = async (scene, sceneWidth = 9600, sceneHeight = 5400) => {
  const cameras = scene.sceneCameras || [];
  const exports = [];

  for (const camera of cameras) {
    const imageDataUrl = await exportCameraView(scene, camera, sceneWidth, sceneHeight);
    exports.push({
      camera: camera,
      imageDataUrl: imageDataUrl,
      cameraName: camera.name || 'Camera',
      isDefault: camera.isDefault || false,
    });
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
 * Export default camera view only
 * @param {object} scene - The scene object
 * @param {number} sceneWidth - Scene width in pixels
 * @param {number} sceneHeight - Scene height in pixels
 * @returns {Promise<string>} Data URL of the default camera view
 */
export const exportDefaultCameraView = async (scene, sceneWidth = 9600, sceneHeight = 5400) => {
  const cameras = scene.sceneCameras || [];
  const defaultCamera = cameras.find(cam => cam.isDefault);
  
  if (!defaultCamera) {
    throw new Error('No default camera found in scene');
  }

  return await exportCameraView(scene, defaultCamera, sceneWidth, sceneHeight);
};
