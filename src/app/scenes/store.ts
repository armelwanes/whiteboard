import { create } from 'zustand';
import { Scene, Layer, Camera, ScenePayload } from './types';
import scenesService from './api/scenesService';

interface SceneState {
  // Scene data
  selectedSceneIndex: number;
  selectedLayerId: string | null;
  
  // UI state
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showCropModal: boolean;
  pendingImageData: any | null;
  
  // UI Actions
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  
  // Scene Management Actions
  createScene: (payload?: ScenePayload, scenes?: Scene[]) => Promise<void>;
  updateScene: (sceneId: string, data: Partial<Scene>) => Promise<void>;
  deleteScene: (sceneId: string, scenes: Scene[]) => Promise<void>;
  duplicateScene: (sceneId: string) => Promise<void>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;
  
  // Layer Management Actions
  addLayer: (sceneId: string, layer: Layer) => Promise<void>;
  updateLayer: (sceneId: string, layerId: string, data: Partial<Layer>) => Promise<void>;
  deleteLayer: (sceneId: string, layerId: string) => Promise<void>;
  
  // Camera Management Actions
  addCamera: (sceneId: string, camera: Camera) => Promise<void>;
  
  // Reset all state
  reset: () => void;
}

const initialState = {
  selectedSceneIndex: 0,
  selectedLayerId: null,
  showAssetLibrary: false,
  showShapeToolbar: false,
  showCropModal: false,
  pendingImageData: null,
};

export const useSceneStore = create<SceneState>((set, get) => ({
  ...initialState,
  
  // UI Actions
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  // Scene Management Actions
  createScene: async (payload = {}, scenes = []) => {
    await scenesService.create(payload);
    set({ selectedSceneIndex: scenes.length });
  },
  
  updateScene: async (sceneId: string, data: Partial<Scene>) => {
    await scenesService.update(sceneId, data);
  },
  
  deleteScene: async (sceneId: string, scenes: Scene[]) => {
    await scenesService.delete(sceneId);
    const { selectedSceneIndex } = get();
    if (selectedSceneIndex >= scenes.length - 1) {
      set({ selectedSceneIndex: Math.max(0, scenes.length - 2) });
    }
  },
  
  duplicateScene: async (sceneId: string) => {
    await scenesService.duplicate(sceneId);
  },
  
  reorderScenes: async (sceneIds: string[]) => {
    await scenesService.reorder(sceneIds);
  },
  
  // Layer Management Actions
  addLayer: async (sceneId: string, layer: Layer) => {
    await scenesService.addLayer(sceneId, layer);
  },
  
  updateLayer: async (sceneId: string, layerId: string, data: Partial<Layer>) => {
    await scenesService.updateLayer(sceneId, layerId, data);
  },
  
  deleteLayer: async (sceneId: string, layerId: string) => {
    await scenesService.deleteLayer(sceneId, layerId);
    const { selectedLayerId } = get();
    if (selectedLayerId === layerId) {
      set({ selectedLayerId: null });
    }
  },
  
  // Camera Management Actions
  addCamera: async (sceneId: string, camera: Camera) => {
    await scenesService.addCamera(sceneId, camera);
  },
  
  reset: () => set(initialState),
}));
