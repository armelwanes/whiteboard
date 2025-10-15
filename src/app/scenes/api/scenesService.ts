import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { STORAGE_KEYS } from '../../../config/constants';
import { createMultiTimeline } from '../../../utils/multiTimelineSystem';
import { createSceneAudioConfig } from '../../../utils/audioManager';
import { Scene, ScenePayload, Layer, Camera } from '../types';

class ScenesService extends BaseService<Scene> {
  constructor() {
    super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes);
  }

  async create(payload: ScenePayload = {}): Promise<Scene> {
    const defaultScene: Partial<Scene> = {
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

  async duplicate(id: string): Promise<Scene> {
    await this.delay();
    const scene = await this.detail(id);
    
    const duplicatedScene: Partial<Scene> = {
      ...scene,
      id: `scene-${Date.now()}`,
      title: `${scene.title} (Copie)`,
      multiTimeline: scene.multiTimeline || createMultiTimeline(scene.duration),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return super.create(duplicatedScene);
  }

  async reorder(sceneIds: string[]): Promise<Scene[]> {
    await this.delay();
    const allScenes = await this.list({ page: 1, limit: 1000 });
    const scenes = allScenes.data;
    
    const reordered = sceneIds
      .map(id => scenes.find(scene => scene.id === id))
      .filter((scene): scene is Scene => scene !== undefined);

    return super.bulkUpdate(reordered);
  }

  async addLayer(sceneId: string, layer: Layer): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const updatedLayers = [...(scene.layers || []), layer];
    
    return super.update(sceneId, {
      ...scene,
      layers: updatedLayers,
    });
  }

  async updateLayer(sceneId: string, layerId: string, layerData: Partial<Layer>): Promise<Scene> {
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

  async deleteLayer(sceneId: string, layerId: string): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const layers = (scene.layers || []).filter(l => l.id !== layerId);
    
    return super.update(sceneId, {
      ...scene,
      layers,
    });
  }

  async addCamera(sceneId: string, camera: Camera): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const updatedCameras = [...(scene.sceneCameras || []), camera];
    
    return super.update(sceneId, {
      ...scene,
      sceneCameras: updatedCameras,
    });
  }
}

export default new ScenesService();
