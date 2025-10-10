/**
 * Timeline and Synchronization System
 * Professional-grade animation control with keyframe-based animations
 */

/**
 * Interpolation types for animation curves
 */
export const InterpolationType = {
  LINEAR: 'linear',
  EASE_IN: 'ease_in',
  EASE_OUT: 'ease_out',
  EASE_IN_OUT: 'ease_in_out',
  EASE_IN_CUBIC: 'ease_in_cubic',
  EASE_OUT_CUBIC: 'ease_out_cubic',
  STEP: 'step',
  BEZIER: 'bezier',
};

/**
 * Apply easing function to progress value
 * @param {number} t - Progress value between 0 and 1
 * @param {string} interpolation - Interpolation type
 * @param {Array} bezierHandles - Bezier control points [x1, y1, x2, y2]
 * @returns {number} Eased value between 0 and 1
 */
export const applyEasing = (t, interpolation, bezierHandles = null) => {
  switch (interpolation) {
    case InterpolationType.LINEAR:
      return t;
    
    case InterpolationType.EASE_IN:
      return t * t;
    
    case InterpolationType.EASE_OUT:
      return t * (2 - t);
    
    case InterpolationType.EASE_IN_OUT:
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    case InterpolationType.EASE_IN_CUBIC:
      return t * t * t;
    
    case InterpolationType.EASE_OUT_CUBIC:
      const t1 = t - 1;
      return t1 * t1 * t1 + 1;
    
    case InterpolationType.STEP:
      return t < 1 ? 0 : 1;
    
    case InterpolationType.BEZIER:
      if (bezierHandles && bezierHandles.length === 4) {
        // Simplified cubic bezier approximation
        const [x1, y1, x2, y2] = bezierHandles;
        const t2 = t * t;
        const t3 = t2 * t;
        return 3 * (1 - t) * (1 - t) * t * y1 + 
               3 * (1 - t) * t2 * y2 + 
               t3;
      }
      return t;
    
    default:
      return t;
  }
};

/**
 * Interpolate between two values
 * @param {*} from - Start value
 * @param {*} to - End value
 * @param {number} t - Progress value between 0 and 1
 * @returns {*} Interpolated value
 */
export const interpolateValue = (from, to, t) => {
  // Number interpolation
  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * t;
  }
  
  // Array/Tuple interpolation (e.g., colors, positions)
  if (Array.isArray(from) && Array.isArray(to) && from.length === to.length) {
    return from.map((v, i) => interpolateValue(v, to[i], t));
  }
  
  // Object interpolation (e.g., {x, y} positions)
  if (typeof from === 'object' && typeof to === 'object' && from !== null && to !== null) {
    const result = {};
    for (const key in from) {
      if (key in to) {
        result[key] = interpolateValue(from[key], to[key], t);
      }
    }
    return result;
  }
  
  // For other types, switch at 50% progress
  return t < 0.5 ? from : to;
};

/**
 * Create a keyframe
 * @param {number} time - Time in seconds
 * @param {*} value - Keyframe value
 * @param {string} interpolation - Interpolation type
 * @param {Array} bezierHandles - Optional bezier control points
 * @returns {Object} Keyframe object
 */
export const createKeyframe = (time, value, interpolation = InterpolationType.LINEAR, bezierHandles = null) => {
  return {
    time,
    value,
    interpolation,
    bezierHandles,
  };
};

/**
 * Create a property track
 * @param {Array} keyframes - Array of keyframes
 * @returns {Object} Property track object
 */
export const createPropertyTrack = (keyframes = []) => {
  return {
    keyframes: keyframes.sort((a, b) => a.time - b.time), // Always sorted by time
  };
};

/**
 * Get value from property track at specific time
 * @param {Object} track - Property track
 * @param {number} time - Current time in seconds
 * @returns {*} Interpolated value at time
 */
export const getTrackValueAtTime = (track, time) => {
  if (!track || !track.keyframes || track.keyframes.length === 0) {
    return null;
  }
  
  const keyframes = track.keyframes;
  
  // Before first keyframe
  if (time <= keyframes[0].time) {
    return keyframes[0].value;
  }
  
  // After last keyframe
  if (time >= keyframes[keyframes.length - 1].time) {
    return keyframes[keyframes.length - 1].value;
  }
  
  // Find surrounding keyframes
  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i];
    const next = keyframes[i + 1];
    
    if (time >= current.time && time <= next.time) {
      // Calculate progress between keyframes
      const duration = next.time - current.time;
      const progress = (time - current.time) / duration;
      
      // Apply easing
      const easedProgress = applyEasing(progress, current.interpolation, current.bezierHandles);
      
      // Interpolate value
      return interpolateValue(current.value, next.value, easedProgress);
    }
  }
  
  return keyframes[keyframes.length - 1].value;
};

/**
 * Create a time marker
 * @param {number} time - Time in seconds
 * @param {string} label - Marker label
 * @param {string} color - Marker color
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Time marker
 */
export const createTimeMarker = (time, label, color = '#ffcc00', metadata = {}) => {
  return {
    time,
    label,
    color,
    metadata,
  };
};

/**
 * Create a sync point
 * @param {number} time - Time in seconds
 * @param {Array} elementIds - Array of element IDs to sync
 * @param {string} label - Sync point label
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Sync point
 */
export const createSyncPoint = (time, elementIds, label = '', metadata = {}) => {
  return {
    time,
    elementIds,
    label,
    metadata,
  };
};

/**
 * Create a loop segment
 * @param {number} startTime - Loop start time in seconds
 * @param {number} endTime - Loop end time in seconds
 * @param {number} loopCount - Number of times to loop (0 = infinite)
 * @param {string} label - Loop label
 * @returns {Object} Loop segment
 */
export const createLoopSegment = (startTime, endTime, loopCount = 1, label = '') => {
  return {
    startTime,
    endTime,
    loopCount,
    label,
  };
};

/**
 * Create a time remapping
 * @param {number} startTime - Remap start time in seconds
 * @param {number} endTime - Remap end time in seconds
 * @param {number} speedMultiplier - Speed multiplier (0.5 = slow motion, 2.0 = fast forward)
 * @param {string} easing - Easing function for speed transition
 * @returns {Object} Time remapping
 */
export const createTimeRemapping = (startTime, endTime, speedMultiplier = 1.0, easing = InterpolationType.LINEAR) => {
  return {
    startTime,
    endTime,
    speedMultiplier,
    easing,
  };
};

/**
 * Create a complete timeline
 * @param {number} duration - Total timeline duration in seconds
 * @param {number} frameRate - Frame rate (default 30 FPS)
 * @returns {Object} Timeline object
 */
export const createTimeline = (duration = 30.0, frameRate = 30) => {
  return {
    duration,
    frameRate,
    propertyTracks: {}, // { "layer.0.opacity": track, "camera.zoom": track, ... }
    markers: [],
    syncPoints: [],
    loopSegments: [],
    timeRemappings: [],
  };
};

/**
 * Add property track to timeline
 * @param {Object} timeline - Timeline object
 * @param {string} propertyPath - Property path (e.g., "layer.0.opacity")
 * @param {Object} track - Property track
 */
export const addPropertyTrack = (timeline, propertyPath, track) => {
  timeline.propertyTracks[propertyPath] = track;
};

/**
 * Get value from timeline at specific time
 * @param {Object} timeline - Timeline object
 * @param {string} propertyPath - Property path
 * @param {number} time - Current time in seconds
 * @returns {*} Value at time
 */
export const getTimelineValue = (timeline, propertyPath, time) => {
  const track = timeline.propertyTracks[propertyPath];
  if (!track) return null;
  
  // Apply time remapping if exists
  let remappedTime = time;
  for (const remap of timeline.timeRemappings || []) {
    if (time >= remap.startTime && time <= remap.endTime) {
      const progress = (time - remap.startTime) / (remap.endTime - remap.startTime);
      const easedProgress = applyEasing(progress, remap.easing);
      const remapDuration = (remap.endTime - remap.startTime) * remap.speedMultiplier;
      remappedTime = remap.startTime + easedProgress * remapDuration;
      break;
    }
  }
  
  // Apply loop segments if exists
  for (const loop of timeline.loopSegments || []) {
    if (remappedTime >= loop.startTime && remappedTime <= loop.endTime) {
      const loopDuration = loop.endTime - loop.startTime;
      const loopProgress = (remappedTime - loop.startTime) % loopDuration;
      remappedTime = loop.startTime + loopProgress;
      break;
    }
  }
  
  return getTrackValueAtTime(track, remappedTime);
};

/**
 * Export timeline to JSON
 * @param {Object} timeline - Timeline object
 * @returns {string} JSON string
 */
export const exportTimelineToJSON = (timeline) => {
  return JSON.stringify(timeline, null, 2);
};

/**
 * Import timeline from JSON
 * @param {string} jsonString - JSON string
 * @returns {Object} Timeline object
 */
export const importTimelineFromJSON = (jsonString) => {
  return JSON.parse(jsonString);
};

/**
 * Get all active markers at time
 * @param {Object} timeline - Timeline object
 * @param {number} time - Current time in seconds
 * @param {number} tolerance - Time tolerance in seconds
 * @returns {Array} Active markers
 */
export const getMarkersAtTime = (timeline, time, tolerance = 0.1) => {
  return (timeline.markers || []).filter(marker => 
    Math.abs(marker.time - time) <= tolerance
  );
};

/**
 * Get all active sync points at time
 * @param {Object} timeline - Timeline object
 * @param {number} time - Current time in seconds
 * @param {number} tolerance - Time tolerance in seconds
 * @returns {Array} Active sync points
 */
export const getSyncPointsAtTime = (timeline, time, tolerance = 0.1) => {
  return (timeline.syncPoints || []).filter(sync => 
    Math.abs(sync.time - time) <= tolerance
  );
};

export default {
  InterpolationType,
  applyEasing,
  interpolateValue,
  createKeyframe,
  createPropertyTrack,
  getTrackValueAtTime,
  createTimeMarker,
  createSyncPoint,
  createLoopSegment,
  createTimeRemapping,
  createTimeline,
  addPropertyTrack,
  getTimelineValue,
  exportTimelineToJSON,
  importTimelineFromJSON,
  getMarkersAtTime,
  getSyncPointsAtTime,
};
