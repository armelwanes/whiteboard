/**
 * Multi-Timeline System
 * Manages parallel synchronized timelines for scenes (Visual, Audio, Camera, FX)
 */

/**
 * Timeline track types
 */
export const TrackType = {
  VISUAL: 'visual',
  AUDIO: 'audio',
  CAMERA: 'camera',
  FX: 'fx',
};

/**
 * Create a timeline element
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @param {string} type - Element type
 * @param {Object} data - Element data
 * @param {string} label - Element label
 * @returns {Object} Timeline element
 */
export const createTimelineElement = (startTime, duration, type, data = {}, label = '') => {
  return {
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    startTime,
    duration,
    type,
    data,
    label: label || `${type} ${startTime.toFixed(1)}s`,
  };
};

/**
 * Create a timeline track
 * @param {string} trackType - Type of track (visual, audio, camera, fx)
 * @param {string} name - Track name
 * @param {Array} elements - Array of timeline elements
 * @returns {Object} Timeline track
 */
export const createTrack = (trackType, name = '', elements = []) => {
  return {
    id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: trackType,
    name: name || trackType.charAt(0).toUpperCase() + trackType.slice(1),
    elements: elements.sort((a, b) => a.startTime - b.startTime),
    enabled: true,
    locked: false,
    height: 60, // Default track height in pixels
  };
};

/**
 * Create multi-timeline for a scene
 * @param {number} duration - Scene duration in seconds
 * @returns {Object} Multi-timeline object
 */
export const createMultiTimeline = (duration) => {
  return {
    duration,
    tracks: [], // Array of tracks with dynamic addition/removal
    trackGroups: {
      [TrackType.VISUAL]: [],
      [TrackType.AUDIO]: [],
      [TrackType.CAMERA]: [],
      [TrackType.FX]: [],
    },
    syncMarkers: [], // Synchronization markers across tracks
  };
};

/**
 * Add a new track to multi-timeline
 * @param {Object} multiTimeline - Multi-timeline object
 * @param {string} trackType - Type of track to add
 * @param {string} name - Track name (optional)
 * @returns {Object} Updated multi-timeline
 */
export const addTrackToTimeline = (multiTimeline, trackType, name = '') => {
  const trackNumber = multiTimeline.trackGroups[trackType].length + 1;
  const defaultName = name || `${trackType.charAt(0).toUpperCase() + trackType.slice(1)} #${trackNumber}`;
  const newTrack = createTrack(trackType, defaultName);
  
  return {
    ...multiTimeline,
    tracks: [...multiTimeline.tracks, newTrack],
    trackGroups: {
      ...multiTimeline.trackGroups,
      [trackType]: [...multiTimeline.trackGroups[trackType], newTrack.id],
    },
  };
};

/**
 * Remove a track from multi-timeline
 * @param {Object} multiTimeline - Multi-timeline object
 * @param {string} trackId - ID of track to remove
 * @returns {Object} Updated multi-timeline
 */
export const removeTrackFromTimeline = (multiTimeline, trackId) => {
  const trackToRemove = multiTimeline.tracks.find(t => t.id === trackId);
  if (!trackToRemove) return multiTimeline;
  
  return {
    ...multiTimeline,
    tracks: multiTimeline.tracks.filter(t => t.id !== trackId),
    trackGroups: {
      ...multiTimeline.trackGroups,
      [trackToRemove.type]: multiTimeline.trackGroups[trackToRemove.type].filter(id => id !== trackId),
    },
  };
};

/**
 * Update track properties
 * @param {Object} multiTimeline - Multi-timeline object
 * @param {string} trackId - ID of track to update
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated multi-timeline
 */
export const updateTrackInTimeline = (multiTimeline, trackId, updates) => {
  return {
    ...multiTimeline,
    tracks: multiTimeline.tracks.map(track =>
      track.id === trackId ? { ...track, ...updates } : track
    ),
  };
};

/**
 * Reorder tracks within the timeline
 * @param {Object} multiTimeline - Multi-timeline object
 * @param {string} trackId - ID of track to move
 * @param {number} direction - Direction to move (-1 for up, 1 for down)
 * @returns {Object} Updated multi-timeline
 */
export const reorderTrack = (multiTimeline, trackId, direction) => {
  const trackIndex = multiTimeline.tracks.findIndex(t => t.id === trackId);
  if (trackIndex === -1) return multiTimeline;
  
  const newIndex = trackIndex + direction;
  if (newIndex < 0 || newIndex >= multiTimeline.tracks.length) return multiTimeline;
  
  const newTracks = [...multiTimeline.tracks];
  const [movedTrack] = newTracks.splice(trackIndex, 1);
  newTracks.splice(newIndex, 0, movedTrack);
  
  return {
    ...multiTimeline,
    tracks: newTracks,
  };
};

/**
 * Add element to track
 * @param {Object} track - Track object
 * @param {Object} element - Element to add
 * @returns {Object} Updated track
 */
export const addElementToTrack = (track, element) => {
  const updatedElements = [...track.elements, element].sort((a, b) => a.startTime - b.startTime);
  return {
    ...track,
    elements: updatedElements,
  };
};

/**
 * Update element in track
 * @param {Object} track - Track object
 * @param {string} elementId - Element ID
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated track
 */
export const updateElementInTrack = (track, elementId, updates) => {
  return {
    ...track,
    elements: track.elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ).sort((a, b) => a.startTime - b.startTime),
  };
};

/**
 * Delete element from track
 * @param {Object} track - Track object
 * @param {string} elementId - Element ID
 * @returns {Object} Updated track
 */
export const deleteElementFromTrack = (track, elementId) => {
  return {
    ...track,
    elements: track.elements.filter(el => el.id !== elementId),
  };
};

/**
 * Get all active elements at time across all tracks
 * @param {Object} multiTimeline - Multi-timeline object
 * @param {number} time - Current time in seconds
 * @returns {Array} Active elements with track info
 */
export const getActiveElements = (multiTimeline, time) => {
  const activeElements = [];
  
  multiTimeline.tracks.forEach(track => {
    if (!track.enabled) return;
    
    const trackActiveElements = track.elements.filter(element => {
      const endTime = element.startTime + element.duration;
      return time >= element.startTime && time <= endTime;
    });
    
    trackActiveElements.forEach(element => {
      activeElements.push({
        ...element,
        trackId: track.id,
        trackType: track.type,
        trackName: track.name,
      });
    });
  });
  
  return activeElements;
};

/**
 * Check if element overlaps with existing elements in track
 * @param {Object} track - Track object
 * @param {number} startTime - Element start time
 * @param {number} duration - Element duration
 * @param {string} excludeId - Element ID to exclude from check
 * @returns {boolean} True if overlaps
 */
export const checkElementOverlap = (track, startTime, duration, excludeId = null) => {
  const endTime = startTime + duration;
  
  return track.elements.some(element => {
    if (excludeId && element.id === excludeId) return false;
    
    const elementEndTime = element.startTime + element.duration;
    return (
      (startTime >= element.startTime && startTime < elementEndTime) ||
      (endTime > element.startTime && endTime <= elementEndTime) ||
      (startTime <= element.startTime && endTime >= elementEndTime)
    );
  });
};

/**
 * Snap time to grid
 * @param {number} time - Time in seconds
 * @param {number} gridSize - Grid size in seconds
 * @returns {number} Snapped time
 */
export const snapToGrid = (time, gridSize = 0.1) => {
  return Math.round(time / gridSize) * gridSize;
};

/**
 * Export multi-timeline to JSON
 * @param {Object} multiTimeline - Multi-timeline object
 * @returns {string} JSON string
 */
export const exportMultiTimelineToJSON = (multiTimeline) => {
  return JSON.stringify(multiTimeline, null, 2);
};

/**
 * Import multi-timeline from JSON
 * @param {string} jsonString - JSON string
 * @returns {Object} Multi-timeline object
 */
export const importMultiTimelineFromJSON = (jsonString) => {
  return JSON.parse(jsonString);
};

/**
 * Calculate track statistics
 * @param {Object} track - Track object
 * @returns {Object} Statistics
 */
export const getTrackStats = (track) => {
  return {
    elementCount: track.elements.length,
    totalDuration: track.elements.reduce((sum, el) => sum + el.duration, 0),
    coverage: track.elements.length > 0 
      ? (track.elements.reduce((sum, el) => sum + el.duration, 0) / track.elements[track.elements.length - 1]?.startTime || 1) * 100 
      : 0,
  };
};

export default {
  TrackType,
  createTimelineElement,
  createTrack,
  createMultiTimeline,
  addTrackToTimeline,
  removeTrackFromTimeline,
  updateTrackInTimeline,
  reorderTrack,
  addElementToTrack,
  updateElementInTrack,
  deleteElementFromTrack,
  getActiveElements,
  checkElementOverlap,
  snapToGrid,
  exportMultiTimelineToJSON,
  importMultiTimelineFromJSON,
  getTrackStats,
};
