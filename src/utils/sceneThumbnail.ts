/**
 * Scene Thumbnail Generator
 * Generates thumbnail images for scenes using the scene export logic
 */

import { exportSceneImage } from './sceneExporter';
import { Scene, Camera } from '../app/scenes/types';

// Thumbnail configuration constants
export const THUMBNAIL_CONFIG = {
  WIDTH: 320,
  HEIGHT: 180,
  PIXEL_RATIO: 2,
  QUALITY: 0.95,
  BACKGROUND_COLOR: '#f5f5f5',
} as const;

/**
 * Generate a thumbnail image for a scene
 * @param {Scene} scene - The scene object to generate thumbnail for
 * @param {object} options - Thumbnail generation options
 * @param {number} options.thumbnailWidth - Thumbnail width (default: 320)
 * @param {number} options.thumbnailHeight - Thumbnail height (default: 180)
 * @returns {Promise<string>} Data URL of the thumbnail PNG
 */
export const generateSceneThumbnail = async (scene: Scene, options: {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
} = {}): Promise<string> => {
  const {
    thumbnailWidth = THUMBNAIL_CONFIG.WIDTH,
    thumbnailHeight = THUMBNAIL_CONFIG.HEIGHT,
  } = options;

  try {
    // Check if scene has a default camera with required properties
    const defaultCamera = scene.sceneCameras?.find((cam: Camera) => (cam as any).isDefault);
    
    if (!defaultCamera || !(defaultCamera as any).width || !(defaultCamera as any).height) {
      console.warn('Scene has no default camera with dimensions, cannot generate thumbnail');
      return '';
    }

    // Use the exportSceneImage function to generate the thumbnail with higher pixel ratio
    const sceneImage = await exportSceneImage(scene, {
      sceneWidth: 1920,
      sceneHeight: 1080,
      background: scene.backgroundImage ? 'transparent' : '#FFFFFF',
      pixelRatio: THUMBNAIL_CONFIG.PIXEL_RATIO,
    });

    // The exported image is at camera resolution, now we need to resize it for thumbnail
    return await resizeImageToThumbnail(sceneImage, thumbnailWidth, thumbnailHeight);
  } catch (error) {
    console.error('Error generating scene thumbnail:', error);
    return '';
  }
};

/**
 * Resize an image data URL to thumbnail size with proper aspect ratio
 * @param {string} dataUrl - Source image data URL
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {Promise<string>} Resized image data URL
 */
const resizeImageToThumbnail = (dataUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate aspect ratios
        const imgAspect = img.width / img.height;
        const targetAspect = width / height;
        
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        // Fit image to maintain aspect ratio (contain)
        if (imgAspect > targetAspect) {
          // Image is wider - fit to width
          drawHeight = width / imgAspect;
          offsetY = (height - drawHeight) / 2;
        } else {
          // Image is taller - fit to height
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
        }

        // Fill background
        ctx.fillStyle = THUMBNAIL_CONFIG.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);

        // Draw the image with proper aspect ratio
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        resolve(canvas.toDataURL('image/png', THUMBNAIL_CONFIG.QUALITY));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = dataUrl;
  });
};
