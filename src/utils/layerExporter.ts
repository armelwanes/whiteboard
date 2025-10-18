/**
 * Layer Export Utility
 * Exports individual layers from JSON scene data to PNG images
 * Does NOT use screenshot/toDataURL on visible stage - reconstructs from JSON
 */

/**
 * Export a single layer to PNG from JSON data
 * @param {object} layer - Layer object from JSON
 * @param {object} options - Export options
 * @param {number} options.width - Canvas width (default: uses camera width or 800)
 * @param {number} options.height - Canvas height (default: uses camera height or 450)
 * @param {string} options.background - Background color (default: '#FFFFFF', use 'transparent' for transparent)
 * @param {number} options.pixelRatio - Pixel ratio for high-res export (default: 1)
 * @param {number} options.sceneWidth - Scene width for positioning context (default: 1920)
 * @param {number} options.sceneHeight - Scene height for positioning context (default: 1080)
 * @param {string} options.sceneBackgroundImage - Optional scene background image URL to render behind the layer
 * @param {object} options.camera - Camera configuration for viewport-relative export. If provided, layer is positioned relative to camera viewport.
 * @param {boolean} options.useFullScene - If true, exports layer with full scene dimensions and real scene position (ignores camera)
 * @returns {Promise<string>} Data URL of the exported PNG
 */

export const exportLayerFromJSON = async (layer, options = {}) => {
  const {
    width,
    height,
    background = '#FFFFFF',
    pixelRatio = 1,
    sceneWidth = 1920,
    sceneHeight = 1080,
    sceneBackgroundImage = null,
    camera = null,
    useFullScene = false,
  } = options;

  // Determine canvas dimensions
  let canvasWidth = width;
  let canvasHeight = height;
  
  if (useFullScene) {
    // Use full scene dimensions for export
    canvasWidth = sceneWidth;
    canvasHeight = sceneHeight;
  } else if (camera) {
    // Use camera dimensions when camera is provided
    canvasWidth = camera.width || 800;
    canvasHeight = camera.height || 450;
  } else {
    // Fallback to provided dimensions or defaults
    canvasWidth = width || 1920;
    canvasHeight = height || 1080;
  }

  // Create canvas with pixel ratio scaling
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * pixelRatio;
  canvas.height = canvasHeight * pixelRatio;
  const ctx = canvas.getContext('2d');

  // Scale context for pixel ratio
  ctx.scale(pixelRatio, pixelRatio);

  // Fill background
  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Render scene background image FIRST (if provided)
  if (sceneBackgroundImage) {
    console.log('Rendering scene background:', sceneBackgroundImage, 'useFullScene:', useFullScene);
    if (useFullScene) {
      // For full scene mode, render background at full scene size without cropping
      await renderBackgroundImage(ctx, sceneBackgroundImage, canvasWidth, canvasHeight);
    } else {
      // For camera mode, render background cropped to camera viewport
      await renderBackgroundImage(ctx, sceneBackgroundImage, canvasWidth, canvasHeight, camera, sceneWidth, sceneHeight);
    }
  }

  // THEN render the layer
  console.log('Rendering layer:', layer.type, layer);
  try {
    let modifiedLayer;
    
    if (useFullScene) {
      // Full scene mode: use layer's real scene position
      modifiedLayer = {
        ...layer,
        position: {
          x: layer.position?.x || (sceneWidth / 2),
          y: layer.position?.y || (sceneHeight / 2)
        }
      };
    } else if (camera) {
      // Camera-relative positioning: calculate camera viewport and layer position relative to it
      const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
      const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);
      
      // Calculate layer position relative to camera viewport
      const layerX = (layer.position?.x || 0) - cameraX;
      const layerY = (layer.position?.y || 0) - cameraY;
      
      modifiedLayer = {
        ...layer,
        position: {
          x: layerX,
          y: layerY
        }
      };
    } else {
      // Legacy behavior: center the layer on the canvas
      modifiedLayer = {
        ...layer,
        position: {
          x: canvasWidth / 2,
          y: canvasHeight / 2
        }
      };
    }

    switch (layer.type) {
      case 'image':
        await renderImageLayerFromJSON(ctx, modifiedLayer);
        break;
      case 'text':
        renderTextLayerFromJSON(ctx, modifiedLayer);
        break;
      case 'shape':
        renderShapeLayerFromJSON(ctx, modifiedLayer);
        break;
      case 'whiteboard':
        renderWhiteboardLayerFromJSON(ctx, modifiedLayer);
        break;
      default:
        console.warn(`Unsupported layer type: ${layer.type}`);
    }
  } catch (error) {
    console.error('Error rendering layer:', error);
    throw new Error(`Failed to render layer ${layer.id}: ${error.message}`);
  }

  return canvas.toDataURL('image/png');
};

/**
 * Render scene background image
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} imageUrl - Background image URL
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {object} camera - Optional camera for viewport cropping
 * @param {number} sceneWidth - Scene width for camera cropping
 * @param {number} sceneHeight - Scene height for camera cropping
 */
const renderBackgroundImage = (ctx, imageUrl, width, height, camera = null, sceneWidth = 1920, sceneHeight = 1080) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        ctx.save();
        
        if (camera) {
          // Camera mode: crop background to camera viewport
          // Calculate camera viewport in scene coordinates
          const cameraX = (camera.position.x * sceneWidth) - (width / 2);
          const cameraY = (camera.position.y * sceneHeight) - (height / 2);
          
          // Scale background image to scene dimensions
          const scaleX = img.width / sceneWidth;
          const scaleY = img.height / sceneHeight;
          
          // Source rectangle in background image
          const srcX = cameraX * scaleX;
          const srcY = cameraY * scaleY;
          const srcWidth = width * scaleX;
          const srcHeight = height * scaleY;
          
          // Draw cropped section
          ctx.drawImage(
            img,
            srcX, srcY, srcWidth, srcHeight,  // source rectangle
            0, 0, width, height                // destination rectangle
          );
        } else {
          // Full scene mode or legacy: cover entire canvas
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        ctx.restore();
        resolve();
      } catch (error) {
        reject(error);
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
 * Render an image layer from JSON
 */
const renderImageLayerFromJSON = (ctx, layer) => {
  return new Promise((resolve, reject) => {
    console.log('Rendering image layer:', layer.image_path, 'position:', layer.position);
    
    if (!layer.image_path) {
      reject(new Error('Image layer missing image_path'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        console.log('Image loaded:', img.width, 'x', img.height);
        ctx.save();

        // Apply layer transformations
        const x = layer.position?.x || 0;
        const y = layer.position?.y || 0;
        const scale = layer.scale || 1.0;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
        const rotation = layer.rotation || 0;

        console.log('Drawing at:', { x, y, scale, opacity, rotation });

        ctx.globalAlpha = opacity;

        // Draw image with top-left corner at position (matching editor behavior)
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        
        // If there's rotation, we need to translate to center, rotate, then draw offset
        if (rotation) {
          // Translate to the center point of where the image will be
          ctx.translate(x + imgWidth / 2, y + imgHeight / 2);
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
            x,
            y,
            imgWidth,
            imgHeight
          );
        }

        ctx.restore();
        console.log('Image rendered successfully');
        resolve();
      } catch (error) {
        console.error('Error drawing image:', error);
        reject(error);
      }
    };

    img.onerror = (e) => {
      console.error('Image load error:', e);
      reject(new Error(`Failed to load image: ${layer.image_path}`));
    };

    img.src = layer.image_path;
  });
};

/**
 * Render a text layer from JSON
 */
const renderTextLayerFromJSON = (ctx, layer) => {
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

  ctx.save();

  const x = layer.position?.x || 0;
  const y = layer.position?.y || 0;

  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
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
 * Render a shape layer from JSON
 */
const renderShapeLayerFromJSON = (ctx, layer) => {
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

  ctx.save();

  const x = layer.position?.x || 0;
  const y = layer.position?.y || 0;

  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  if (rotation) {
    ctx.rotate(rotation * Math.PI / 180);
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || shapeConfig.strokeWidth || 1) * scale;

  const shapeType = shapeConfig.shape_type || shapeConfig.shape || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;
  const fillMode = shapeConfig.fill_mode || 'both';

  switch (shapeType) {
    case 'rectangle':
    case 'square':
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
 * Render a whiteboard/strokes layer from JSON
 */
const renderWhiteboardLayerFromJSON = (ctx, layer) => {
  const strokes = layer.strokes || [];
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;

  if (!strokes.length) {
    console.warn('Whiteboard layer has no strokes');
    return;
  }

  ctx.save();

  const x = layer.position?.x || 0;
  const y = layer.position?.y || 0;

  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
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

    // Draw stroke with smooth curves (quadratic curves for better smoothing)
    ctx.beginPath();
    
    if (points.length === 2) {
      // Simple line for 2 points
      ctx.moveTo(points[0].x * scale, points[0].y * scale);
      ctx.lineTo(points[1].x * scale, points[1].y * scale);
    } else {
      // Smooth curve for multiple points using quadratic curves
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
      
      // Draw last segment
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
 * Export multiple layers as a ZIP file
 * @param {Array} layers - Array of layer objects
 * @param {object} options - Export options (same as exportLayerFromJSON)
 * @param {Function} onProgress - Optional progress callback (currentIndex, totalLayers)
 * @returns {Promise<Blob>} ZIP file blob
 */
export const exportLayersAsZip = async (layers, options = {}, onProgress = null) => {
  // Note: This requires a ZIP library. For now, we'll export individually
  // In a real implementation, use JSZip or similar
  throw new Error('ZIP export not yet implemented. Use exportLayerFromJSON for individual exports.');
};

/**
 * Download a data URL as a file
 * @param {string} dataUrl - Data URL to download
 * @param {string} filename - Filename for download
 */
export const downloadDataUrl = (dataUrl, filename) => {
  try {
    // Pour les data URLs, conversion directe en blob est plus efficace
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
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading data URL:', error);
    // Fallback simple
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

/**
 * Validate layer JSON structure
 * @param {object} layer - Layer object to validate
 * @returns {object} Validation result { valid: boolean, errors: string[] }
 */
export const validateLayerJSON = (layer) => {
  const errors = [];

  if (!layer) {
    errors.push('Layer object is null or undefined');
    return { valid: false, errors };
  }

  if (!layer.id) {
    errors.push('Layer missing required field: id');
  }

  if (!layer.type) {
    errors.push('Layer missing required field: type');
  }

  const validTypes = ['image', 'text', 'shape', 'whiteboard'];
  if (layer.type && !validTypes.includes(layer.type)) {
    errors.push(`Invalid layer type: ${layer.type}. Must be one of: ${validTypes.join(', ')}`);
  }

  // Type-specific validation
  if (layer.type === 'image' && !layer.image_path) {
    errors.push('Image layer missing required field: image_path');
  }

  if (layer.type === 'text' && !layer.text_config) {
    errors.push('Text layer missing required field: text_config');
  }

  if (layer.type === 'shape' && !layer.shape_config) {
    errors.push('Shape layer missing required field: shape_config');
  }

  if (layer.type === 'whiteboard' && !layer.strokes) {
    errors.push('Whiteboard layer missing required field: strokes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Export scene with all layers
 * @param {object} scene - Scene object with layers array
 * @param {string} layerId - ID of the layer to export
 * @param {object} options - Export options
 * @returns {Promise<string>} Data URL of the exported PNG
 */
export const exportSceneLayer = async (scene, layerId, options = {}) => {
  if (!scene || !scene.layers) {
    throw new Error('Invalid scene object: missing layers array');
  }

  const layer = scene.layers.find(l => l.id === layerId);
  if (!layer) {
    throw new Error(`Layer not found: ${layerId}`);
  }

  // Validate layer
  const validation = validateLayerJSON(layer);
  if (!validation.valid) {
    throw new Error(`Invalid layer JSON: ${validation.errors.join(', ')}`);
  }

  return exportLayerFromJSON(layer, options);
};
