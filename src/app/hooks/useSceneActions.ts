import { useCallback } from 'react';
import { Scene, Layer } from '../scenes';

interface UseSceneActionsProps {
  scenes: Scene[];
  invalidate: () => Promise<void>;
  createScene: (scene: Partial<Scene>, scenes: Scene[]) => Promise<void>;
  updateSceneAction: (sceneId: string, updates: Partial<Scene>) => Promise<void>;
  deleteSceneAction: (sceneId: string, scenes: Scene[]) => Promise<void>;
  duplicateSceneAction: (sceneId: string) => Promise<void>;
  reorderScenesAction: (sceneIds: string[]) => Promise<void>;
  setSelectedSceneIndex: (index: number) => void;
}

export function useSceneActions({
  scenes,
  invalidate,
  createScene,
  updateSceneAction,
  deleteSceneAction,
  duplicateSceneAction,
  reorderScenesAction,
  setSelectedSceneIndex,
}: UseSceneActionsProps) {
  // Ajout d'une scène
  const addScene = useCallback(async () => {
    try {
      await createScene({ duration: 10, layers: [], sceneCameras: [] }, scenes);
      await invalidate();
    } catch (error: any) {
      alert('Erreur lors de la création de la scène: ' + error.message);
    }
  }, [createScene, scenes, invalidate]);

  // Suppression d'une scène
  const deleteScene = useCallback(async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await deleteSceneAction(sceneId, scenes);
      await invalidate();
    } catch (error: any) {
      alert(error.message);
    }
  }, [deleteSceneAction, scenes, invalidate]);

  // Duplication d'une scène
  const duplicateScene = useCallback(async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await duplicateSceneAction(sceneId);
      await invalidate();
    } catch (error: any) {
      alert('Erreur lors de la duplication: ' + error.message);
    }
  }, [duplicateSceneAction, scenes, invalidate]);

  // Mise à jour d'une scène
  const updateScene = useCallback(async (index: number, updatedScene: Partial<Scene>) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await updateSceneAction(sceneId, updatedScene);
      await invalidate();
    } catch (error) {
      console.error('Error updating scene:', error);
    }
  }, [updateSceneAction, scenes, invalidate]);

  // Déplacement d'une scène
  const moveScene = useCallback(async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === scenes.length - 1)) {
      return;
    }
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    const sceneIds = newScenes.map((scene) => scene.id);
    try {
      await reorderScenesAction(sceneIds);
      setSelectedSceneIndex(targetIndex);
      await invalidate();
    } catch (error) {
      console.error('Error reordering scenes:', error);
    }
  }, [reorderScenesAction, scenes, setSelectedSceneIndex, invalidate]);

  return {
    addScene,
    deleteScene,
    duplicateScene,
    updateScene,
    moveScene,
  };
}
