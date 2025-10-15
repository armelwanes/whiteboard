// Scenes API Service
import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { STORAGE_KEYS } from '../../../config/constants';
import { createMultiTimeline } from '../../../utils/multiTimelineSystem';
import { createSceneAudioConfig } from '../../../utils/audioManager';

class ScenesService extends BaseService {
  constructor() {
    super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes);
  }

  // Create a new scene with defaults
  async create(payload) {
    const defaultScene = {
      id: `scene-${Date.now()}`,
      title: 'Nouvelle Scène',
      content: 'Ajoutez votre contenu ici...',
      duration: 5,
      backgroundImage: null,
      animation: 'fade',
      layers: [],
      cameras: [],
      sceneCameras: [],
      multiTimeline: createMultiTimeline(5),
      audio: createSceneAudioConfig(),
      ...payload,
    };

    return super.create(defaultScene);
  }

  // Duplicate a scene
  async duplicate(id) {
    await this.delay();
    const scene = await this.detail(id);
    
    const duplicatedScene = {
      ...scene,
      id: `scene-${Date.now()}`,
      title: `${scene.title} (Copie)`,
      multiTimeline: scene.multiTimeline || createMultiTimeline(scene.duration),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return super.create(duplicatedScene);
  }

  // Reorder scenes
  async reorder(sceneIds) {
    await this.delay();
    const allScenes = await this.list({ page: 1, limit: 1000 });
    const scenes = allScenes.data;
    
    // Reorder based on provided IDs
    const reordered = sceneIds.map(id => 
      scenes.find(scene => scene.id === id)
    ).filter(Boolean);

    return super.bulkUpdate(reordered);
  }

  // Add a layer to a scene
  async addLayer(sceneId, layer) {
    const scene = await this.detail(sceneId);
    const updatedLayers = [...(scene.layers || []), layer];
    
    return super.update(sceneId, {
      ...scene,
      layers: updatedLayers,
    });
  }

  // Update a layer in a scene
  async updateLayer(sceneId, layerId, layerData) {
    const scene = await this.detail(sceneId);
    const layers = scene.layers || [];
    const layerIndex = layers.findIndex(l => l.id === layerId);
    
    if (layerIndex === -1) {
      throw new Error(`Layer with id ${layerId} not found`);
    }
    
    layers[layerIndex] = { ...layers[layerIndex], ...layerData };
    
    return super.update(sceneId, {
      ...scene,
      layers,
    });
  }

  // Delete a layer from a scene
  async deleteLayer(sceneId, layerId) {
    const scene = await this.detail(sceneId);
    const layers = (scene.layers || []).filter(l => l.id !== layerId);
    
    return super.update(sceneId, {
      ...scene,
      layers,
    });
  }

  // Add a camera to a scene
  async addCamera(sceneId, camera) {
    const scene = await this.detail(sceneId);
    const updatedCameras = [...(scene.sceneCameras || []), camera];
    
    return super.update(sceneId, {
      ...scene,
      sceneCameras: updatedCameras,
    });
  }
}

export default new ScenesService();
