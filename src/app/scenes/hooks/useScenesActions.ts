import { useMutation, useQueryClient } from '@tanstack/react-query';
import scenesService from '../api/scenesService';
import { scenesKeys } from '../config';
import { Scene, ScenePayload, Layer, Camera } from '../types';

export const useScenesActions = () => {
  const queryClient = useQueryClient();

  const invalidateScenes = () => {
    return queryClient.invalidateQueries({
      queryKey: scenesKeys.lists(),
      refetchType: 'all'
    });
  };

  const createScene = useMutation({
    mutationFn: (payload: ScenePayload = {}) => scenesService.create(payload),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const updateScene = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Scene> }) => 
      scenesService.update(id, data),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const deleteScene = useMutation({
    mutationFn: (id: string) => scenesService.delete(id),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const duplicateScene = useMutation({
    mutationFn: (id: string) => scenesService.duplicate(id),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const reorderScenes = useMutation({
    mutationFn: (sceneIds: string[]) => scenesService.reorder(sceneIds),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const addLayer = useMutation({
    mutationFn: ({ sceneId, layer }: { sceneId: string; layer: Layer }) => 
      scenesService.addLayer(sceneId, layer),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const updateLayer = useMutation({
    mutationFn: ({ sceneId, layerId, data }: { sceneId: string; layerId: string; data: Partial<Layer> }) => 
      scenesService.updateLayer(sceneId, layerId, data),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const deleteLayer = useMutation({
    mutationFn: ({ sceneId, layerId }: { sceneId: string; layerId: string }) => 
      scenesService.deleteLayer(sceneId, layerId),
    onSuccess: (_, variables) => {
      invalidateScenes();
    },
  });

  const addCamera = useMutation({
    mutationFn: ({ sceneId, camera }: { sceneId: string; camera: Camera }) => 
      scenesService.addCamera(sceneId, camera),
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const moveLayer = useMutation({
    mutationFn: async ({ sceneId, layerId, direction }: { sceneId: string; layerId: string; direction: 'up' | 'down' }) => {
      const scene = await scenesService.detail(sceneId);
      if (!scene || !scene.layers) return scene;
      
      const layers = [...scene.layers];
      const idx = layers.findIndex(l => l.id === layerId);
      if (idx === -1) return scene;
      
      const newIdx = direction === 'up' ? Math.max(0, idx - 1) : Math.min(layers.length - 1, idx + 1);
      if (newIdx === idx) return scene;
      
      // Move layer
      const [moved] = layers.splice(idx, 1);
      layers.splice(newIdx, 0, moved);
      
      // Update z_index for all layers
      layers.forEach((l, i) => {
        l.z_index = i + 1;
      });
      
      return scenesService.update(sceneId, { ...scene, layers });
    },
    onSuccess: () => {
      invalidateScenes();
    },
  });

  const duplicateLayer = useMutation({
    mutationFn: async ({ sceneId, layerId }: { sceneId: string; layerId: string }) => {
      const scene = await scenesService.detail(sceneId);
      if (!scene || !scene.layers) return scene;
      
      const layer = scene.layers.find(l => l.id === layerId);
      if (!layer) return scene;
      
      const newLayer = {
        ...layer,
        id: `layer-${Date.now()}`,
        name: `${layer.name || 'Layer'} (Copie)`,
        z_index: scene.layers.length + 1,
      };
      
      return scenesService.update(sceneId, {
        ...scene,
        layers: [...scene.layers, newLayer],
      });
    },
    onSuccess: () => {
      invalidateScenes();
    },
  });

  return {
    createScene: createScene.mutateAsync,
    isCreating: createScene.isPending,
    updateScene: updateScene.mutateAsync,
    isUpdating: updateScene.isPending,
    deleteScene: deleteScene.mutateAsync,
    isDeleting: deleteScene.isPending,
    duplicateScene: duplicateScene.mutateAsync,
    isDuplicating: duplicateScene.isPending,
    reorderScenes: reorderScenes.mutateAsync,
    isReordering: reorderScenes.isPending,
    addLayer: addLayer.mutateAsync,
    updateLayer: updateLayer.mutateAsync,
    deleteLayer: deleteLayer.mutateAsync,
    addCamera: addCamera.mutateAsync,
    moveLayer: moveLayer.mutateAsync,
    duplicateLayer: duplicateLayer.mutateAsync,
    invalidate: invalidateScenes,
  };
};
