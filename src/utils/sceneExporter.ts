/**
 * Scene Export Utility
 * Exports complete scenes with all layers combined using camera-based cropping
 */

/**
 * Export a complete scene as a single image from the default camera perspective
 * This combines all layers into a single image with the camera's dimensions
 * and crops based on the camera's viewport position
 * 
 * @param {object} scene - The scene object with layers and cameras
 * @param {object} options - Export options
 * @param {number} options.sceneWidth - Scene width in pixels (default: 1920)
 * @param {number} options.sceneHeight - Scene height in pixels (default: 1080)
 * @param {string} options.background - Background color (default: '#FFFFFF')
 * @param {number} options.pixelRatio - Pixel ratio for high-res export (default: 1)
 * @returns {Promise<string>} Data URL of the exported PNG
 */
export const exportSceneImage = async (scene, options = {}) => {
  const {
    sceneWidth = 1920,
    sceneHeight = 1080,
    background = '#FFFFFF',
    pixelRatio = 1,
  } = options;

  // Get the default camera
  const cameras = scene.sceneCameras || [];
  const defaultCamera = cameras.find(cam => cam.isDefault);
  
  if (!defaultCamera) {
    throw new Error('No default camera found in scene. Cannot export scene without a camera.');
  }

  // Use camera dimensions for canvas
  const canvasWidth = defaultCamera.width || 800;
  const canvasHeight = defaultCamera.height || 450;

  // Create canvas with pixel ratio scaling
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * pixelRatio;
  canvas.height = canvasHeight * pixelRatio;
  const ctx = canvas.getContext('2d');

  // Scale context for pixel ratio
  ctx.scale(pixelRatio, pixelRatio);

  // Fill background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Render scene background image if exists
  if (scene.backgroundImage) {
    await renderBackgroundImage(ctx, scene.backgroundImage, canvasWidth, canvasHeight, defaultCamera, sceneWidth, sceneHeight);
  }

  // Calculate camera viewport in scene coordinates
  const cameraX = (defaultCamera.position.x * sceneWidth) - (canvasWidth / 2);
  const cameraY = (defaultCamera.position.y * sceneHeight) - (canvasHeight / 2);

  // Get all visible layers sorted by z_index
  const layers = (scene.layers || [])
    .filter(layer => layer.visible !== false)
    .slice()
    .sort((a, b) => (a.z_index || 0) - (b.z_index || 0));

  // Render each layer
  for (const layer of layers) {
    try {
      switch (layer.type) {
        case 'image':
          if (layer.image_path) {
            await renderImageLayer(ctx, layer, cameraX, cameraY);
          }
          break;
        case 'text':
          renderTextLayer(ctx, layer, cameraX, cameraY);
          break;
        case 'shape':
          renderShapeLayer(ctx, layer, cameraX, cameraY);
          break;
        case 'whiteboard':
          renderWhiteboardLayer(ctx, layer, cameraX, cameraY);
          break;
        default:
          console.warn(`Unsupported layer type: ${layer.type}`);
      }
    } catch (error) {
      console.error(`Error rendering layer ${layer.id}:`, error);
      // Continue with other layers
    }
  }

  return canvas.toDataURL('image/png');
};

/**
 * Render scene background image with camera cropping
 */
const renderBackgroundImage = (ctx, imageUrl, canvasWidth, canvasHeight, camera, sceneWidth, sceneHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        ctx.save();
        
        // Calculate camera viewport position in scene
        const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
        const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);
        
        // Calculate source rectangle (portion of background image to show)
        const sourceX = (cameraX / sceneWidth) * img.width;
        const sourceY = (cameraY / sceneHeight) * img.height;
        const sourceWidth = (canvasWidth / sceneWidth) * img.width;
        const sourceHeight = (canvasHeight / sceneHeight) * img.height;
        
        // Draw the cropped portion of the background
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,  // source rectangle
          0, 0, canvasWidth, canvasHeight               // destination rectangle
        );
        
        ctx.restore();
        resolve();
      } catch (error) {
        console.error('Error rendering background:', error);
        resolve(); // Continue even if background fails
      }
    };

    img.onerror = () => {
      console.warn('Failed to load background image:', imageUrl);
      resolve(); // Continue even if background fails
    };

    img.src = imageUrl;
  });
};

/**
 * Render an image layer
 */
const renderImageLayer = (ctx, layer, cameraX, cameraY) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Calculate layer position relative to camera viewport
        const layerX = (layer.position?.x || 0) - cameraX;
        const layerY = (layer.position?.y || 0) - cameraY;
        const scale = layer.scale || 1.0;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
        const rotation = layer.rotation || 0;

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Draw image with top-left corner at position (matching editor behavior)
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        
        // If there's rotation, we need to translate to center, rotate, then draw offset
        if (rotation) {
          // Translate to the center point of where the image will be
          ctx.translate(layerX + imgWidth / 2, layerY + imgHeight / 2);
          ctx.rotate(rotation * Math.PI / 180);
          // Draw image centered on this rotated point
          ctx.drawImage(
            img,
            -imgWidth / 2,
            -imgHeight / 2,
            imgWidth,
            imgHeight
          );
        } else {
          // No rotation: simple top-left positioning
          ctx.drawImage(
            img,
            layerX,
            layerY,
            imgWidth,
            imgHeight
          );
        }
        
        ctx.restore();
        resolve();
      } catch (error) {
        console.error('Error drawing image layer:', error);
        resolve();
      }
    };

    img.onerror = () => {
      console.warn('Failed to load image:', layer.image_path);
      resolve();
    };

    img.src = layer.image_path;
  });
};

/**
 * Render a text layer
 */
const renderTextLayer = (ctx, layer, cameraX, cameraY) => {
  const textConfig = layer.text_config || {};
  const text = textConfig.text || '';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  const fontStyle = textConfig.style || 'normal';
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;
  const align = textConfig.align || 'left';
  const lineHeight = textConfig.line_height || 1.2;

  // Parse font style
  let fontWeight = 'normal';
  let fontStyleCSS = 'normal';
  if (fontStyle === 'bold') {
    fontWeight = 'bold';
  } else if (fontStyle === 'italic') {
    fontStyleCSS = 'italic';
  } else if (fontStyle === 'bold_italic') {
    fontWeight = 'bold';
    fontStyleCSS = 'italic';
  }

  // Parse color
  let fillStyle = '#000000';
  if (Array.isArray(textConfig.color)) {
    fillStyle = `rgb(${textConfig.color[0]}, ${textConfig.color[1]}, ${textConfig.color[2]})`;
  } else if (typeof textConfig.color === 'string') {
    fillStyle = textConfig.color;
  }

  // Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(layerX, layerY);
  if (rotation) {
    ctx.rotate(rotation * Math.PI / 180);
  }

  ctx.font = `${fontStyleCSS} ${fontWeight} ${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  // Render multi-line text
  const lines = text.split('\n');
  const lineHeightPx = fontSize * scale * lineHeight;

  lines.forEach((line, index) => {
    const yOffset = (index - (lines.length - 1) / 2) * lineHeightPx;
    ctx.fillText(line, 0, yOffset);
  });

  ctx.restore();
};

/**
 * Render a shape layer
 */
const renderShapeLayer = (ctx, layer, cameraX, cameraY) => {
  const shapeConfig = layer.shape_config || {};
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;

  // Parse fill color
  let fillStyle = '#000000';
  if (Array.isArray(shapeConfig.fill_color)) {
    fillStyle = `rgba(${shapeConfig.fill_color.join(',')})`;
  } else if (typeof shapeConfig.fill_color === 'string') {
    fillStyle = shapeConfig.fill_color;
  } else if (shapeConfig.fill) {
    fillStyle = shapeConfig.fill;
  }

  // Parse stroke color
  let strokeStyle = '#000000';
  if (Array.isArray(shapeConfig.stroke_color)) {
    strokeStyle = `rgba(${shapeConfig.stroke_color.join(',')})`;
  } else if (typeof shapeConfig.stroke_color === 'string') {
    strokeStyle = shapeConfig.stroke_color;
  } else if (shapeConfig.stroke) {
    strokeStyle = shapeConfig.stroke;
  }

  // Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(layerX, layerY);
  if (rotation) {
    ctx.rotate(rotation * Math.PI / 180);
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || shapeConfig.strokeWidth || 1) * scale;

  const shapeType = shapeConfig.shape_type || shapeConfig.shape || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;
  const fillMode = shapeConfig.fillMode || shapeConfig.fill_mode || 'both';

  switch (shapeType) {
    case 'rectangle':
      if (fillMode !== 'stroke') {
        ctx.fillRect(-width / 2, -height / 2, width, height);
      }
      if (fillMode !== 'fill') {
        ctx.strokeRect(-width / 2, -height / 2, width, height);
      }
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, width / 2, 0, 2 * Math.PI);
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;

    case 'line':
      ctx.beginPath();
      ctx.moveTo(-width / 2, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.stroke();
      break;

    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;

    case 'star': {
      const outerRadius = width / 2;
      const innerRadius = outerRadius * 0.5;
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;
    }

    default:
      console.warn(`Unsupported shape type: ${shapeType}`);
  }

  ctx.restore();
};

/**
 * Render a whiteboard/strokes layer
 */
const renderWhiteboardLayer = (ctx, layer, cameraX, cameraY) => {
  const strokes = layer.strokes || [];
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;

  if (!strokes.length) {
    return;
  }

  // Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(layerX, layerY);
  if (rotation) {
    ctx.rotate(rotation * Math.PI / 180);
  }

  // Render each stroke
  strokes.forEach((stroke) => {
    const points = stroke.points || [];
    if (points.length < 2) return;

    const strokeWidth = (stroke.strokeWidth || stroke.stroke_width || 2) * scale;
    const strokeColor = stroke.strokeColor || stroke.stroke_color || '#000000';
    const lineJoin = stroke.lineJoin || stroke.line_join || 'round';
    const lineCap = stroke.lineCap || stroke.line_cap || 'round';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = lineJoin;
    ctx.lineCap = lineCap;

    ctx.beginPath();
    
    if (points.length === 2) {
      ctx.moveTo(points[0].x * scale, points[0].y * scale);
      ctx.lineTo(points[1].x * scale, points[1].y * scale);
    } else {
      ctx.moveTo(points[0].x * scale, points[0].y * scale);
      
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2 * scale;
        const yc = (points[i].y + points[i + 1].y) / 2 * scale;
        ctx.quadraticCurveTo(
          points[i].x * scale,
          points[i].y * scale,
          xc,
          yc
        );
      }
      
      const lastPoint = points[points.length - 1];
      const secondLastPoint = points[points.length - 2];
      ctx.quadraticCurveTo(
        secondLastPoint.x * scale,
        secondLastPoint.y * scale,
        lastPoint.x * scale,
        lastPoint.y * scale
      );
    }

    ctx.stroke();
  });

  ctx.restore();
};

/**
 * Download a data URL as a file
 * @param {string} dataUrl - Data URL to download
 * @param {string} filename - Filename for download
 */
export const downloadSceneImage = (dataUrl, filename) => {
  try {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    const blob = new Blob([u8arr], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading scene image:', error);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
