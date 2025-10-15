// Scene types
export const SceneAnimationType = {
  FADE: 'fade',
  SLIDE: 'slide',
  ZOOM: 'zoom',
  NONE: 'none',
};

export const LayerType = {
  IMAGE: 'image',
  TEXT: 'text',
  SHAPE: 'shape',
  VIDEO: 'video',
  AUDIO: 'audio',
};

export const LayerMode = {
  DRAW: 'draw',
  STATIC: 'static',
  ANIMATED: 'animated',
};

// Type definitions (for JSDoc)
/**
 * @typedef {Object} Layer
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} mode
 * @property {Object} position
 * @property {number} position.x
 * @property {number} position.y
 * @property {number} z_index
 * @property {number} scale
 * @property {number} opacity
 * @property {number} [skip_rate]
 * @property {string} [image_path]
 * @property {string} [text]
 */

/**
 * @typedef {Object} Camera
 * @property {string} id
 * @property {string} name
 * @property {Object} position
 * @property {number} scale
 * @property {Object} [animation]
 */

/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {number} duration
 * @property {string} animation
 * @property {string|null} backgroundImage
 * @property {Layer[]} layers
 * @property {Camera[]} cameras
 * @property {Camera[]} sceneCameras
 * @property {Object} multiTimeline
 * @property {Object} audio
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export default {
  SceneAnimationType,
  LayerType,
  LayerMode,
};
