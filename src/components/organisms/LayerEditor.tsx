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
  
  // Initialize with default camera to ensure we always have a camera reference
  const [selectedCamera, setSelectedCamera] = React.useState<any>(() => {
    // Try to get the default camera from the scene, otherwise create one
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

  // Also expose createImageLayer so we can fallback to direct creation if handlers fail
  const { createImageLayer } = useLayerCreation({ sceneWidth, sceneHeight, selectedCamera });

  const handleSave = useCallback(async () => {
    if (!scene?.id) return;
    
    // Persist the edited scene to the backend
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
  }, [scene?.id, editedScene, updateScene]);

  // Auto-save with debounce when editedScene changes
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Skip auto-save on initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Skip if no scene ID
    if (!scene?.id) {
      return;
    }

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editedScene, scene?.id, handleSave]);


  // LayerEditorModals expects onCropComplete to take croppedImageUrl and optionally imageDimensions
  const handleCropComplete = async (croppedImageUrl: string, imageDimensions?: { width: number; height: number }) => {
    const newLayer = await handleCropCompleteBase(croppedImageUrl, imageDimensions, pendingImageData, editedScene.layers.length);
    if (!newLayer) {
      // Fallback: try to create layer directly if handler failed
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
