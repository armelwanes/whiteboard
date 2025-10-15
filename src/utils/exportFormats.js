/**
 * Export Formats Utilities
 * Provides export functionality for various formats (GIF, WebM, PNG sequence)
 */

/**
 * Simple browser-based file download
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Name of the file
 */
function saveAs(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Social media presets for video export
 */
export const SOCIAL_MEDIA_PRESETS = {
  youtube: {
    name: 'YouTube',
    width: 1920,
    height: 1080,
    fps: 30,
    format: 'mp4',
    description: 'Full HD 1080p'
  },
  youtube_short: {
    name: 'YouTube Short',
    width: 1080,
    height: 1920,
    fps: 30,
    format: 'mp4',
    description: 'Vertical 9:16'
  },
  instagram_feed: {
    name: 'Instagram Feed',
    width: 1080,
    height: 1080,
    fps: 30,
    format: 'mp4',
    description: 'Square 1:1'
  },
  instagram_story: {
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    fps: 30,
    format: 'mp4',
    description: 'Vertical 9:16'
  },
  instagram_reel: {
    name: 'Instagram Reel',
    width: 1080,
    height: 1920,
    fps: 30,
    format: 'mp4',
    description: 'Vertical 9:16'
  },
  tiktok: {
    name: 'TikTok',
    width: 1080,
    height: 1920,
    fps: 30,
    format: 'mp4',
    description: 'Vertical 9:16'
  },
  facebook: {
    name: 'Facebook',
    width: 1280,
    height: 720,
    fps: 30,
    format: 'mp4',
    description: 'HD 720p'
  },
  twitter: {
    name: 'Twitter/X',
    width: 1280,
    height: 720,
    fps: 30,
    format: 'mp4',
    description: 'HD 720p'
  },
  linkedin: {
    name: 'LinkedIn',
    width: 1280,
    height: 720,
    fps: 30,
    format: 'mp4',
    description: 'HD 720p'
  }
};

/**
 * Capture canvas as image data
 * @param {HTMLCanvasElement} canvas - Canvas to capture
 * @param {string} format - Image format (png, jpeg, webp)
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<Blob>} Image blob
 */
export async function captureCanvas(canvas, format = 'png', quality = 1.0) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture canvas'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Export canvas as PNG
 * @param {HTMLCanvasElement} canvas - Canvas to export
 * @param {string} filename - Output filename
 */
export async function exportAsPNG(canvas, filename = 'export.png') {
  const blob = await captureCanvas(canvas, 'png');
  saveAs(blob, filename);
}

/**
 * Export canvas as JPEG
 * @param {HTMLCanvasElement} canvas - Canvas to export
 * @param {string} filename - Output filename
 * @param {number} quality - JPEG quality (0-1)
 */
export async function exportAsJPEG(canvas, filename = 'export.jpg', quality = 0.95) {
  const blob = await captureCanvas(canvas, 'jpeg', quality);
  saveAs(blob, filename);
}

/**
 * Export canvas as WebP
 * @param {HTMLCanvasElement} canvas - Canvas to export
 * @param {string} filename - Output filename
 * @param {number} quality - WebP quality (0-1)
 */
export async function exportAsWebP(canvas, filename = 'export.webp', quality = 0.9) {
  const blob = await captureCanvas(canvas, 'webp', quality);
  saveAs(blob, filename);
}

/**
 * Capture animation frames
 * @param {Function} renderFrame - Function to render each frame
 * @param {number} frameCount - Total number of frames
 * @param {HTMLCanvasElement} canvas - Canvas to capture
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array<Blob>>} Array of frame blobs
 */
export async function captureFrames(renderFrame, frameCount, canvas, onProgress) {
  const frames = [];
  
  for (let i = 0; i < frameCount; i++) {
    // Render frame
    await renderFrame(i);
    
    // Capture frame
    const blob = await captureCanvas(canvas, 'png');
    frames.push(blob);
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, frameCount);
    }
  }
  
  return frames;
}

/**
 * Export frames as PNG sequence
 * @param {Function} renderFrame - Function to render each frame
 * @param {number} frameCount - Total number of frames
 * @param {HTMLCanvasElement} canvas - Canvas to capture
 * @param {string} basename - Base filename
 * @param {Function} onProgress - Progress callback
 */
export async function exportAsPNGSequence(
  renderFrame,
  frameCount,
  canvas,
  basename = 'frame',
  onProgress
) {
  for (let i = 0; i < frameCount; i++) {
    // Render frame
    await renderFrame(i);
    
    // Capture and save frame
    const blob = await captureCanvas(canvas, 'png');
    const filename = `${basename}_${String(i).padStart(5, '0')}.png`;
    saveAs(blob, filename);
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, frameCount);
    }
    
    // Small delay to prevent browser hanging
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Create GIF from canvas frames using client-side GIF encoding
 * Note: This is a simplified implementation. For production use,
 * consider using a library like gif.js or jsgif
 * 
 * @param {Function} renderFrame - Function to render each frame
 * @param {number} frameCount - Total number of frames
 * @param {HTMLCanvasElement} canvas - Canvas to capture
 * @param {object} options - GIF options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Blob>} GIF blob
 */
export async function exportAsGIF(
  renderFrame,
  frameCount,
  canvas,
  options = {},
  onProgress
) {
  const {
    delay = 100, // ms between frames
    quality = 10, // 1-30, lower is better
    width = canvas.width,
    height = canvas.height
  } = options;

  // This is a placeholder for GIF export
  // In a real implementation, you would use a library like gif.js:
  // 
  // import GIF from 'gif.js';
  // const gif = new GIF({
  //   workers: 2,
  //   quality: quality,
  //   width: width,
  //   height: height
  // });
  //
  // for (let i = 0; i < frameCount; i++) {
  //   await renderFrame(i);
  //   gif.addFrame(canvas, { delay: delay, copy: true });
  //   if (onProgress) onProgress(i + 1, frameCount);
  // }
  //
  // return new Promise((resolve) => {
  //   gif.on('finished', (blob) => resolve(blob));
  //   gif.render();
  // });

  console.warn('GIF export requires gif.js library. Install with: npm install gif.js');
  
  // For now, export first frame as PNG
  await renderFrame(0);
  const blob = await captureCanvas(canvas, 'png');
  saveAs(blob, 'export.gif.png');
  
  return blob;
}

/**
 * Export as WebM video with alpha channel support
 * Uses MediaRecorder API
 * 
 * @param {HTMLCanvasElement} canvas - Canvas to record
 * @param {number} duration - Duration in seconds
 * @param {object} options - Recording options
 * @returns {Promise<Blob>} WebM video blob
 */
export async function exportAsWebM(canvas, duration, options = {}) {
  const {
    fps = 30,
    videoBitsPerSecond = 2500000,
    mimeType = 'video/webm;codecs=vp9'
  } = options;

  // Check if MediaRecorder supports WebM
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    throw new Error(`${mimeType} is not supported by this browser`);
  }

  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond
  });

  const chunks = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(e);
    };

    mediaRecorder.start();

    // Stop recording after duration
    setTimeout(() => {
      mediaRecorder.stop();
    }, duration * 1000);
  });
}

/**
 * Scale canvas to specific dimensions
 * @param {HTMLCanvasElement} sourceCanvas - Source canvas
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {HTMLCanvasElement} Scaled canvas
 */
export function scaleCanvas(sourceCanvas, targetWidth, targetHeight) {
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = targetWidth;
  scaledCanvas.height = targetHeight;
  
  const ctx = scaledCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  
  return scaledCanvas;
}

/**
 * Export with social media preset
 * @param {HTMLCanvasElement} canvas - Canvas to export
 * @param {string} presetName - Preset name from SOCIAL_MEDIA_PRESETS
 * @param {string} filename - Output filename
 */
export async function exportWithPreset(canvas, presetName, filename) {
  const preset = SOCIAL_MEDIA_PRESETS[presetName];
  
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  
  // Scale canvas to preset dimensions
  const scaledCanvas = scaleCanvas(canvas, preset.width, preset.height);
  
  // Export based on format
  switch (preset.format) {
    case 'png':
      await exportAsPNG(scaledCanvas, filename || `${presetName}_export.png`);
      break;
    case 'jpg':
    case 'jpeg':
      await exportAsJPEG(scaledCanvas, filename || `${presetName}_export.jpg`);
      break;
    case 'webp':
      await exportAsWebP(scaledCanvas, filename || `${presetName}_export.webp`);
      break;
    case 'mp4':
      console.warn('MP4 export requires server-side processing or ffmpeg.wasm');
      // Fallback to PNG for now
      await exportAsPNG(scaledCanvas, filename || `${presetName}_export.png`);
      break;
    default:
      await exportAsPNG(scaledCanvas, filename || `${presetName}_export.png`);
  }
}

/**
 * Estimate file size for export
 * @param {number} width - Export width
 * @param {number} height - Export height
 * @param {string} format - Export format
 * @param {number} duration - Duration in seconds (for video)
 * @returns {object} Size estimate
 */
export function estimateFileSize(width, height, format, duration = 1) {
  const pixels = width * height;
  
  let bytesPerPixel = 4; // RGBA
  let compressionRatio = 1;
  
  switch (format) {
    case 'png':
      compressionRatio = 0.3; // ~30% of raw size
      break;
    case 'jpeg':
      compressionRatio = 0.1; // ~10% of raw size
      break;
    case 'webp':
      compressionRatio = 0.08; // ~8% of raw size
      break;
    case 'gif':
      compressionRatio = 0.2; // ~20% of raw size
      bytesPerPixel = 1; // Indexed color
      break;
    case 'webm':
    case 'mp4':
      // Rough estimate: 2.5 Mbps
      const bitsPerSecond = 2500000;
      const bytes = (bitsPerSecond * duration) / 8;
      return {
        bytes,
        mb: (bytes / (1024 * 1024)).toFixed(2),
        formatted: formatBytes(bytes)
      };
  }
  
  const bytes = pixels * bytesPerPixel * compressionRatio * duration;
  
  return {
    bytes,
    mb: (bytes / (1024 * 1024)).toFixed(2),
    formatted: formatBytes(bytes)
  };
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Byte count
 * @returns {string} Formatted string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate export options
 * @param {object} options - Export options
 * @returns {object} Validation result
 */
export function validateExportOptions(options) {
  const errors = [];
  const warnings = [];
  
  if (options.width && (options.width < 1 || options.width > 4096)) {
    errors.push('Width must be between 1 and 4096');
  }
  
  if (options.height && (options.height < 1 || options.height > 4096)) {
    errors.push('Height must be between 1 and 4096');
  }
  
  if (options.fps && (options.fps < 1 || options.fps > 60)) {
    warnings.push('FPS should be between 1 and 60');
  }
  
  if (options.quality && (options.quality < 0 || options.quality > 1)) {
    errors.push('Quality must be between 0 and 1');
  }
  
  const sizeEstimate = estimateFileSize(
    options.width || 1920,
    options.height || 1080,
    options.format || 'png',
    options.duration || 1
  );
  
  if (sizeEstimate.bytes > 100 * 1024 * 1024) { // > 100 MB
    warnings.push(`Large file size: ${sizeEstimate.formatted}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export default {
  SOCIAL_MEDIA_PRESETS,
  captureCanvas,
  exportAsPNG,
  exportAsJPEG,
  exportAsWebP,
  exportAsPNGSequence,
  exportAsGIF,
  exportAsWebM,
  exportWithPreset,
  scaleCanvas,
  estimateFileSize,
  formatBytes,
  validateExportOptions
};
