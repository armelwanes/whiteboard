import { create } from 'zustand';

interface SceneState {
  // UI state only - no data operations
  selectedSceneIndex: number;
  selectedLayerId: string | null;
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showCropModal: boolean;
  pendingImageData: any | null;
  
  // UI Actions only
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  
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

export const useSceneStore = create<SceneState>((set) => ({
  ...initialState,
  
  // UI Actions only
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  reset: () => set(initialState),
}));
