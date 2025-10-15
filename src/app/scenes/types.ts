export enum SceneAnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  NONE = 'none',
}

export enum LayerType {
  IMAGE = 'image',
  TEXT = 'text',
  SHAPE = 'shape',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum LayerMode {
  DRAW = 'draw',
  STATIC = 'static',
  ANIMATED = 'animated',
}

export interface Position {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  mode: LayerMode;
  position: Position;
  z_index: number;
  scale: number;
  opacity: number;
  skip_rate?: number;
  image_path?: string;
  text?: string;
  [key: string]: any;
}

export interface CameraAnimation {
  [key: string]: any;
}

export interface Camera {
  id: string;
  name: string;
  position: Position;
  scale: number;
  animation?: CameraAnimation;
  [key: string]: any;
}

export interface MultiTimeline {
  [key: string]: any;
}

export interface AudioConfig {
  [key: string]: any;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  duration: number;
  animation: string;
  backgroundImage: string | null;
  layers: Layer[];
  cameras: Camera[];
  sceneCameras: Camera[];
  multiTimeline: MultiTimeline;
  audio: AudioConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ScenePayload {
  title?: string;
  content?: string;
  duration?: number;
  animation?: string;
  backgroundImage?: string | null;
  layers?: Layer[];
  cameras?: Camera[];
  sceneCameras?: Camera[];
  multiTimeline?: MultiTimeline;
  audio?: AudioConfig;
}
