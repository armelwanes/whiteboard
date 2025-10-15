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
    onSuccess: () => {
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
    invalidate: invalidateScenes,
  };
};
