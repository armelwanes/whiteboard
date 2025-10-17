export interface Asset {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  tags: string[];
  uploadDate: number;
  usageCount: number;
  type: string;
}