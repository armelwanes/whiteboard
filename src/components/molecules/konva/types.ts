export const STAGE_WIDTH = 960;
export const STAGE_HEIGHT = 540;

export interface SceneObject {
  id: string;
  type: 'image' | 'text';
  [key: string]: any;
}

export interface SceneType {
  objects: SceneObject[];
  backgroundImage?: string;
  [key: string]: any;
}

export interface SceneImageProps {
  image: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
}

export interface SceneTextProps {
  text: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
}