import { create } from 'zustand';
import scenesService from './api/scenesService';
import { Scene, ScenePayload } from './types';

interface ScenesStore {
  scenes: Scene[];
  loading: boolean;
  selectedSceneIndex: number;
  setScenes: (scenes: Scene[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedSceneIndex: (index: number) => void;
  addScene: (payload?: ScenePayload) => Promise<void>;
  updateScene: (index: number, data: Partial<Scene>) => Promise<void>;
  deleteScene: (index: number) => Promise<void>;
  duplicateScene: (index: number) => Promise<void>;
  sortScenes: (fromIndex: number, toIndex: number) => Promise<void>;
  loadScenes: () => Promise<void>;
}

export const useScenesStore = create<ScenesStore>((set, get) => ({
  scenes: [],
  loading: false,
  selectedSceneIndex: 0,

  setScenes: (scenes) => set({ scenes }),
  
  setLoading: (loading) => set({ loading }),
  
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),

  loadScenes: async () => {
    set({ loading: true });
    try {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      
      if (result.data.length === 0) {
        const { default: sampleStory } = await import('../../data/scenes');
        const initialScenes = sampleStory || [];
        await scenesService.bulkUpdate(initialScenes);
        set({ scenes: initialScenes, loading: false });
      } else {
        set({ scenes: result.data, loading: false });
      }
    } catch (error) {
      console.error('Error loading scenes:', error);
      set({ loading: false });
    }
  },

  addScene: async (payload = {}) => {
    try {
      const newScene = await scenesService.create({
        duration: 10,
        layers: [],
        sceneCameras: [],
        ...payload,
      });
      
      const { scenes } = get();
      set({ 
        scenes: [...scenes, newScene],
        selectedSceneIndex: scenes.length
      });
    } catch (error) {
      console.error('Error creating scene:', error);
      throw error;
    }
  },

  updateScene: async (index, data) => {
    const { scenes } = get();
    const scene = scenes[index];
    if (!scene) return;

    try {
      const updatedScene = await scenesService.update(scene.id, data);
      const newScenes = [...scenes];
      newScenes[index] = updatedScene;
      set({ scenes: newScenes });
    } catch (error) {
      console.error('Error updating scene:', error);
      throw error;
    }
  },

  deleteScene: async (index) => {
    const { scenes, selectedSceneIndex } = get();
    const scene = scenes[index];
    if (!scene) return;

    try {
      await scenesService.delete(scene.id);
      const newScenes = scenes.filter((_, i) => i !== index);
      
      let newSelectedIndex = selectedSceneIndex;
      if (selectedSceneIndex >= newScenes.length) {
        newSelectedIndex = Math.max(0, newScenes.length - 1);
      }
      
      set({ 
        scenes: newScenes,
        selectedSceneIndex: newSelectedIndex
      });
    } catch (error) {
      console.error('Error deleting scene:', error);
      throw error;
    }
  },

  duplicateScene: async (index) => {
    const { scenes } = get();
    const scene = scenes[index];
    if (!scene) return;

    try {
      const duplicatedScene = await scenesService.duplicate(scene.id);
      const newScenes = [...scenes];
      newScenes.splice(index + 1, 0, duplicatedScene);
      set({ scenes: newScenes });
    } catch (error) {
      console.error('Error duplicating scene:', error);
      throw error;
    }
  },

  sortScenes: async (fromIndex, toIndex) => {
    const { scenes } = get();
    
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || 
        fromIndex >= scenes.length || toIndex >= scenes.length) {
      return;
    }

    const newScenes = [...scenes];
    const [movedScene] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, movedScene);

    try {
      const sceneIds = newScenes.map(scene => scene.id);
      await scenesService.reorder(sceneIds);
      set({ 
        scenes: newScenes,
        selectedSceneIndex: toIndex
      });
    } catch (error) {
      console.error('Error sorting scenes:', error);
      throw error;
    }
  },
}));
