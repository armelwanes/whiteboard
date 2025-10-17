import { useCallback } from 'react';
import { Scene, Layer } from '../scenes';

interface AssetData {
  dataUrl: string;
  name: string;
  [key: string]: any;
}

interface UseAppLogicProps {
  scenes: Scene[];
  selectedSceneIndex: number;
  setSelectedSceneIndex: (index: number) => void;
  invalidate: () => Promise<void>;
  createScene: (scene: Partial<Scene>, scenes: Scene[]) => Promise<void>;
  updateSceneAction: (sceneId: string, updates: Partial<Scene>) => Promise<void>;
  deleteSceneAction: (sceneId: string, scenes: Scene[]) => Promise<void>;
  duplicateSceneAction: (sceneId: string) => Promise<void>;
  reorderScenesAction: (sceneIds: string[]) => Promise<void>;
  setShowShapeToolbar: (show: boolean) => void;
}

export function useAppLogic({
  scenes,
  selectedSceneIndex,
  setSelectedSceneIndex,
  invalidate,
  createScene,
  updateSceneAction,
  deleteSceneAction,
  duplicateSceneAction,
  reorderScenesAction,
  setShowShapeToolbar,
}: UseAppLogicProps) {
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

  // Sélection d'un asset depuis la librairie
  const handleSelectAssetFromLibrary = useCallback((asset: AssetData) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;
    const newLayer: Partial<Layer> = {
      id: `layer-${Date.now()}`,
      image_path: asset.dataUrl,
      name: asset.name,
      position: { x: 100, y: 100 },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 10,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw' as any,
      type: 'image' as any,
    };
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer as Layer],
    });
  }, [scenes, selectedSceneIndex, updateScene]);

  // Ajout d'une forme
  const handleAddShape = useCallback((shapeLayer: Layer) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;
    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), shapeLayer],
    });
    setShowShapeToolbar(false);
  }, [scenes, selectedSceneIndex, updateScene, setShowShapeToolbar]);

  return {
    addScene,
    deleteScene,
    duplicateScene,
    updateScene,
    moveScene,
    handleSelectAssetFromLibrary,
    handleAddShape,
  };
}
