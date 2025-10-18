/**
 * Scene Thumbnail Generator
 * Generates thumbnail images for scenes using the scene export logic
 */

import { exportSceneImage } from './sceneExporter';
import { Scene, Camera } from '../app/scenes/types';

/**
 * Generate a thumbnail image for a scene
 * @param {Scene} scene - The scene object to generate thumbnail for
 * @param {object} options - Thumbnail generation options
 * @param {number} options.thumbnailWidth - Thumbnail width (default: 160)
 * @param {number} options.thumbnailHeight - Thumbnail height (default: 120)
 * @returns {Promise<string>} Data URL of the thumbnail PNG
 */
export const generateSceneThumbnail = async (scene: Scene, options: {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
} = {}): Promise<string> => {
  const {
    thumbnailWidth = 160,
    thumbnailHeight = 120,
  } = options;

  try {
    // Check if scene has a default camera with required properties
    const defaultCamera = scene.sceneCameras?.find((cam: Camera) => (cam as any).isDefault);
    
    if (!defaultCamera || !(defaultCamera as any).width || !(defaultCamera as any).height) {
      console.warn('Scene has no default camera with dimensions, cannot generate thumbnail');
      return '';
    }

    // Use the exportSceneImage function to generate the thumbnail
    const sceneImage = await exportSceneImage(scene, {
      sceneWidth: 1920,
      sceneHeight: 1080,
      background: scene.backgroundImage ? 'transparent' : '#FFFFFF',
      pixelRatio: 1,
    });

    // The exported image is at camera resolution, now we need to resize it for thumbnail
    return await resizeImageToThumbnail(sceneImage, thumbnailWidth, thumbnailHeight);
  } catch (error) {
    console.error('Error generating scene thumbnail:', error);
    return '';
  }
};

/**
 * Resize an image data URL to thumbnail size
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

        // Draw the image scaled to thumbnail size
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/png'));
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
