/**
 * Camera Animator Utility
 * Handles camera sequences, transitions, and animations
 */

import { interpolate, interpolatePosition } from './easingFunctions.js';

/**
 * Default camera configuration
 */
export const DEFAULT_CAMERA = {
  zoom: 1.0,
  position: { x: 0.5, y: 0.5 },
  duration: 2.0,
  transition_duration: 0,
  easing: 'ease_out',
  width: 800,
  height: 450,
  locked: false,
  isDefault: false,
  pauseDuration: 0,
  movementType: 'ease_out',
};

/**
 * Create a default camera object
 * @param {object} overrides - Properties to override defaults
 * @returns {object} Camera configuration
 */
export const createCamera = (overrides = {}) => {
  return {
    ...DEFAULT_CAMERA,
    ...overrides,
    position: {
      ...DEFAULT_CAMERA.position,
      ...(overrides.position || {}),
    },
  };
};

/**
 * Create the initial default camera for a scene
 * This camera is centered and locked by default
 * @param {string} aspectRatio - Aspect ratio (e.g., '16:9', '4:3')
 * @returns {object} Default camera configuration
 */
export const createDefaultCamera = (aspectRatio = '16:9') => {
  // Calculate camera dimensions based on aspect ratio
  let cameraWidth = 800;
  let cameraHeight = 450;
  
  if (aspectRatio === '16:9') {
    cameraWidth = 800;
    cameraHeight = 450;
  } else if (aspectRatio === '4:3') {
    cameraWidth = 800;
    cameraHeight = 600;
  } else if (aspectRatio === '1:1') {
    cameraWidth = 600;
    cameraHeight = 600;
  }
  
  return {
    id: 'default-camera',
    name: 'Caméra Par Défaut',
    zoom: 1.0,
    position: { x: 0.5, y: 0.5 }, // Centered
    duration: 2.0,
    transition_duration: 0,
    easing: 'ease_out',
    width: cameraWidth,
    height: cameraHeight,
    locked: true,
    isDefault: true,
    pauseDuration: 0,
    movementType: 'ease_out',
  };
};

/**
 * Calculate camera state at a specific time in a camera sequence
 * @param {array} cameras - Array of camera configurations
 * @param {number} currentTime - Current time in seconds
 * @returns {object} Current camera state {zoom, position, cameraIndex}
 */
export const getCameraAtTime = (cameras, currentTime) => {
  if (!cameras || cameras.length === 0) {
    return { ...DEFAULT_CAMERA, cameraIndex: -1 };
  }

  let accumulatedTime = 0;
  let previousCamera = cameras[0];

  for (let i = 0; i < cameras.length; i++) {
    const camera = cameras[i];
    const transitionDuration = camera.transition_duration || 0;
    const holdDuration = camera.duration || 2.0;

    // Check if we're in the transition phase
    if (currentTime < accumulatedTime + transitionDuration) {
      const transitionProgress = (currentTime - accumulatedTime) / transitionDuration;
      return {
        zoom: interpolate(previousCamera.zoom, camera.zoom, transitionProgress, camera.easing),
        position: interpolatePosition(
          previousCamera.position,
          camera.position,
          transitionProgress,
          camera.easing
        ),
        cameraIndex: i,
        isTransitioning: true,
      };
    }

    accumulatedTime += transitionDuration;

    // Check if we're in the hold phase
    if (currentTime < accumulatedTime + holdDuration) {
      return {
        zoom: camera.zoom,
        position: { ...camera.position },
        cameraIndex: i,
        isTransitioning: false,
      };
    }

    accumulatedTime += holdDuration;
    previousCamera = camera;
  }

  // Return last camera state if time exceeds all cameras
  const lastCamera = cameras[cameras.length - 1];
  return {
    zoom: lastCamera.zoom,
    position: { ...lastCamera.position },
    cameraIndex: cameras.length - 1,
    isTransitioning: false,
  };
};

/**
 * Calculate total duration of a camera sequence
 * @param {array} cameras - Array of camera configurations
 * @returns {number} Total duration in seconds
 */
export const getTotalCameraDuration = (cameras) => {
  if (!cameras || cameras.length === 0) return 0;

  return cameras.reduce((total, camera) => {
    return total + (camera.transition_duration || 0) + (camera.duration || 0);
  }, 0);
};

/**
 * Apply layer-level camera transformation
 * @param {object} layer - Layer object with optional camera settings
 * @returns {object} Camera transformation to apply {zoom, position}
 */
export const getLayerCamera = (layer) => {
  if (!layer.camera) {
    return { zoom: 1.0, position: { x: 0.5, y: 0.5 } };
  }

  return {
    zoom: layer.camera.zoom || 1.0,
    position: layer.camera.position || { x: 0.5, y: 0.5 },
  };
};

/**
 * Calculate animation state for layer animations (zoom_in, zoom_out)
 * @param {object} animation - Animation configuration
 * @param {number} progress - Progress value between 0 and 1
 * @returns {object} Animation state {zoom, position}
 */
export const getLayerAnimationState = (animation, progress) => {
  if (!animation || !animation.type) {
    return null;
  }

  const { type, start_zoom = 1.0, end_zoom = 2.0, focus_position } = animation;

  if (type === 'zoom_in' || type === 'zoom_out') {
    const currentZoom = interpolate(start_zoom, end_zoom, progress, 'ease_out');
    return {
      zoom: currentZoom,
      position: focus_position || { x: 0.5, y: 0.5 },
    };
  }

  return null;
};

/**
 * Validate camera configuration
 * @param {object} camera - Camera configuration to validate
 * @returns {object} Validation result {valid, errors}
 */
export const validateCamera = (camera) => {
  const errors = [];

  if (camera.zoom !== undefined && (camera.zoom < 0.1 || camera.zoom > 10)) {
    errors.push('Zoom must be between 0.1 and 10');
  }

  if (camera.position) {
    if (camera.position.x < 0 || camera.position.x > 1) {
      errors.push('Position x must be between 0 and 1');
    }
    if (camera.position.y < 0 || camera.position.y > 1) {
      errors.push('Position y must be between 0 and 1');
    }
  }

  if (camera.duration !== undefined && camera.duration < 0) {
    errors.push('Duration must be positive');
  }

  if (camera.transition_duration !== undefined && camera.transition_duration < 0) {
    errors.push('Transition duration must be positive');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Normalize position coordinates to ensure they're within 0-1 range
 * @param {object} position - Position {x, y}
 * @returns {object} Normalized position {x, y}
 */
export const normalizePosition = (position) => {
  return {
    x: Math.max(0, Math.min(1, position.x)),
    y: Math.max(0, Math.min(1, position.y)),
  };
};

export default {
  createCamera,
  createDefaultCamera,
  getCameraAtTime,
  getTotalCameraDuration,
  getLayerCamera,
  getLayerAnimationState,
  validateCamera,
  normalizePosition,
  DEFAULT_CAMERA,
};
