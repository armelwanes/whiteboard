import React, { useEffect, useRef, useCallback } from 'react';
import { useSceneStore, useScenesActions } from '../../app/scenes';
import {
  useLayerEditor,
  useLayerCreationHandlers
} from '../molecules/layer-management';
import { useLayerCreation } from '../molecules/layer-management/useLayerCreation';
import LayerEditorModals from './LayerEditorModals';
import LayerEditorCanvas from './LayerEditorCanvas';
import { useCurrentScene } from '@/app/scenes';
import { createDefaultCamera } from '@/utils/cameraAnimator';

const LayerEditor: React.FC = () => {
  const scene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state) => state.showShapeToolbar);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const showAssetLibrary = useSceneStore((state) => state.showAssetLibrary);
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);

  // Use actions from useScenesActions hook for persistence
  const { updateScene } = useScenesActions();

  const sceneWidth = 1920;
  const sceneHeight = 1080;
  
  const [selectedCamera, setSelectedCamera] = React.useState<any>(() => {
    const defaultCam = scene?.sceneCameras?.find((cam: any) => cam.isDefault) || 
                       scene?.sceneCameras?.[0] || 
                       createDefaultCamera('16:9');
    return defaultCam;
  });

  const {
    editedScene,
    setEditedScene,
    showThumbnailMaker,
    setShowThumbnailMaker,
    handleUpdateScene,
    handleUpdateLayer,
    handleAddLayer
  } = useLayerEditor({
    scene,
    selectedLayerId,
    onSelectLayer: (layerId: string | null) => setSelectedLayerId(layerId)
  });

  const {
    handleAddShape,
    handleCropComplete: handleCropCompleteBase
  } = useLayerCreationHandlers({
    sceneWidth,
    sceneHeight,
    selectedCamera,
    onAddLayer: handleAddLayer,
    onCloseShapeToolbar: () => setShowShapeToolbar(false)
  });

  const { createImageLayer } = useLayerCreation({ sceneWidth, sceneHeight, selectedCamera });

  // Référence pour tracker l'état précédent et éviter les sauvegardes inutiles
  const lastSavedStateRef = useRef<string>('');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);
  const isSavingRef = useRef(false);

  // Fonction pour créer un hash simple de l'état (pour détecter les changements)
  const createStateHash = useCallback((state: any) => {
    return JSON.stringify({
      layers: state.layers?.map((l: any) => ({ id: l.id, ...l })),
      sceneCameras: state.sceneCameras,
      backgroundImage: state.backgroundImage,
      duration: state.duration,
      title: state.title,
      content: state.content,
      animation: state.animation,
      multiTimeline: state.multiTimeline,
      audio: state.audio,
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!scene?.id || isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      
      // Créer un hash de l'état actuel
      const currentStateHash = createStateHash(editedScene);
      
      // Vérifier si l'état a réellement changé
      if (currentStateHash === lastSavedStateRef.current) {
        console.log('[LayerEditor] No changes detected, skipping save');
        return;
      }

      console.log('[LayerEditor] Auto-saving scene...');
      
      await updateScene({ 
        id: scene.id, 
        data: {
          layers: editedScene.layers,
          sceneCameras: editedScene.sceneCameras,
          backgroundImage: editedScene.backgroundImage,
          duration: editedScene.duration,
          title: editedScene.title,
          content: editedScene.content,
          animation: editedScene.animation,
          multiTimeline: editedScene.multiTimeline,
          audio: editedScene.audio,
        }
      });

      // Mettre à jour l'état sauvegardé après une sauvegarde réussie
      lastSavedStateRef.current = currentStateHash;
      console.log('[LayerEditor] Scene saved successfully');
    } catch (err) {
      console.error('[LayerEditor] Auto-save failed', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [scene?.id, editedScene, updateScene, createStateHash]);

  // Gérer l'auto-sauvegarde avec debounce
  useEffect(() => {
    // Sauter à la première charge
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // Initialiser le hash de l'état sauvegardé
      lastSavedStateRef.current = createStateHash(editedScene);
      return;
    }

    if (!scene?.id) {
      return;
    }

    // Effacer le timeout précédent pour relancer le debounce
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Créer un nouveau timeout pour l'auto-save
    // Délai de 3 secondes après la DERNIÈRE modification (debounce)
    // La sauvegarde ne se fera que quand l'utilisateur arrête d'interagir
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 3000);

    // Cleanup lors du démontage
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editedScene, scene?.id, handleSave, createStateHash]);

  // Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoSaveTimeoutRef.current) {
        // Exécuter immédiatement la sauvegarde avant de quitter
        handleSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleSave]);

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions?: { width: number; height: number }) => {
    const newLayer = await handleCropCompleteBase(croppedImageUrl, imageDimensions, pendingImageData, editedScene.layers.length);
    if (!newLayer) {
      try {
        if (croppedImageUrl && pendingImageData) {
          const fallback = createImageLayer(
            croppedImageUrl,
            pendingImageData.fileName || 'image',
            imageDimensions || (pendingImageData.originalWidth && pendingImageData.originalHeight ? { width: pendingImageData.originalWidth, height: pendingImageData.originalHeight } : null),
            editedScene.layers.length
          );
          handleAddLayer(fallback);
        } else {
          console.warn('[LayerEditor] cannot create fallback image layer: missing data', { croppedImageUrl, pendingImageData });
        }
      } catch (err) {
        console.error('[LayerEditor] fallback createImageLayer failed', err);
      }
    }

    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleAddShapeWrapper = (shapeLayer: any) => {
    handleAddShape(shapeLayer, editedScene.layers.length);
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <LayerEditorModals
        showShapeToolbar={showShapeToolbar}
        showAssetLibrary={showAssetLibrary}
        showCropModal={showCropModal}
        showThumbnailMaker={showThumbnailMaker}
        pendingImageData={pendingImageData}
        scene={editedScene}
        onCloseShapeToolbar={() => setShowShapeToolbar(false)}
        onCloseThumbnailMaker={() => setShowThumbnailMaker(false)}
        onAddShape={handleAddShapeWrapper}
        onCropComplete={handleCropComplete}
        onCropCancel={handleCropCancel}
        onSaveThumbnail={(updatedScene) => {
          setEditedScene(updatedScene);
          setShowThumbnailMaker(false);
        }}
      />

      <LayerEditorCanvas
        scene={editedScene}
        selectedLayerId={selectedLayerId}
        onUpdateScene={handleUpdateScene}
        onUpdateLayer={handleUpdateLayer}
        onSelectLayer={setSelectedLayerId}
        onSelectCamera={setSelectedCamera}
        onSave={handleSave}
      />
    </div>
  );
};

export default LayerEditor;