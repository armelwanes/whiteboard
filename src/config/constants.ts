export const STORAGE_KEYS = {
  SCENES: 'whiteboard-scenes',
  ASSETS: 'whiteboard-assets',
  ASSET_CACHE: 'whiteboard-asset-cache',
  SETTINGS: 'whiteboard-settings',
} as const;

export const DEFAULT_SCENE_DURATION = 5;

export const ANIMATION_TYPES = [
  'fade',
  'slide',
  'zoom',
  'none',
] as const;

export const EXPORT_FORMATS = {
  JSON: 'json',
  PNG: 'png',
  JPG: 'jpg',
  WEBM: 'webm',
  MP4: 'mp4',
} as const;

export const MAX_HISTORY_STATES = 50;

export const CANVAS_DEFAULTS = {
  WIDTH: 1920,
  HEIGHT: 1080,
  BACKGROUND: '#ffffff',
} as const;

export default {
  STORAGE_KEYS,
  DEFAULT_SCENE_DURATION,
  ANIMATION_TYPES,
  EXPORT_FORMATS,
  MAX_HISTORY_STATES,
  CANVAS_DEFAULTS,
};
