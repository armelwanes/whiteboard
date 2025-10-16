import React, { useState, useEffect, useRef } from 'react';
import Scene from '../Scene';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import { ImageCropModal } from '../molecules';
import { createTimeline } from '../../utils/timelineSystem';
import ScenePanel from './ScenePanel';
import { useSceneStore } from '../../app/scenes';
import {
  useAnimationPlayback,
  useLayerCreation,
  useImageHandling,
  useLayerOperations,
  useFileUpload
} from '../molecules/layer-management';

interface AnimationContainerProps {
  scenes?: any[];
  updateScene: (sceneIndex: number, updates: any) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onDuplicateScene: (index: number) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onExportConfig: () => void;
  onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnimationContainer: React.FC<AnimationContainerProps> = ({ 
  scenes = [], 
  updateScene, 
  onAddScene, 
  onDeleteScene, 
  onDuplicateScene, 
  onMoveScene, 
  onExportConfig, 
  onImportConfig 
}) => {
  // Get state from Zustand store
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const showAssetLibrary = useSceneStore((state) => state.showAssetLibrary);
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const showShapeToolbar = useSceneStore((state) => state.showShapeToolbar);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [globalTimeline, setGlobalTimeline] = useState(() => {
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    return createTimeline(totalDuration, 30);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const { currentTime, isPlaying, setCurrentTime, setIsPlaying } = useAnimationPlayback(totalDuration);

  const currentScene = scenes[selectedSceneIndex];
  const defaultCamera = currentScene?.sceneCameras?.[0] || { zoom: 0.8, position: { x: 0.5, y: 0.5 }, width: 800, height: 450 };
  
  const { createTextLayer, createShapeLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: defaultCamera
  });

  const { handleCropComplete: handleImageCrop, handleSelectAssetFromLibrary: handleAssetSelection } = useImageHandling({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: defaultCamera
  });

  const { deleteLayer, duplicateLayer, moveLayer, updateLayer } = useLayerOperations();
  const { handleImageUpload: uploadImage } = useFileUpload();

  useEffect(() => {
    setGlobalTimeline(prev => ({
      ...prev,
      duration: totalDuration,
    }));
  }, [totalDuration]);

  useEffect(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulatedTime += scenes[i].duration;
      if (currentTime < accumulatedTime) {
        setCurrentSceneIndex(i);
        break;
      }
    }
    if (currentTime >= totalDuration) {
      setCurrentSceneIndex(scenes.length - 1);
    }
  }, [currentTime, scenes, totalDuration]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadImage(e, setPendingImageData, setShowCropModal);
  };

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions: any) => {
    if (!pendingImageData || !currentScene) return;

    const newLayer = await handleImageCrop(
      croppedImageUrl,
      imageDimensions,
      pendingImageData,
      currentScene.layers?.length || 0
    );

    if (newLayer) {
      updateScene(selectedSceneIndex, {
        ...currentScene,
        layers: [...(currentScene.layers || []), newLayer]
      });
      setSelectedLayerId(newLayer.id);
    }

    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleSelectAssetFromLibrary = (asset: any) => {
    if (!currentScene) return;

    const newLayer = handleAssetSelection(asset, currentScene.layers?.length || 0);

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    });
    setSelectedLayerId(newLayer.id);
    setShowAssetLibrary(false);
  };

  const handleAddText = () => {
    if (!currentScene) return;

    const newLayer = createTextLayer(currentScene.layers?.length || 0);

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    });
    setSelectedLayerId(newLayer.id);
  };

  const handleAddShape = (shapeLayer: any) => {
    if (!currentScene) return;

    const updatedShapeLayer = createShapeLayer(shapeLayer, currentScene.layers?.length || 0);

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), updatedShapeLayer]
    });
    setSelectedLayerId(updatedShapeLayer.id);
    setShowShapeToolbar(false);
  };

  const handleLayerOperation = (operation: 'delete' | 'duplicate' | 'move', layerId: string, direction?: 'up' | 'down') => {
    if (!currentScene) return;

    let updatedScene;
    switch (operation) {
      case 'delete':
        updatedScene = deleteLayer(currentScene, layerId);
        if (selectedLayerId === layerId) {
          setSelectedLayerId(null);
        }
        break;
      case 'duplicate':
        updatedScene = duplicateLayer(currentScene, layerId);
        break;
      case 'move':
        if (direction) {
          updatedScene = moveLayer(currentScene, layerId, direction);
        }
        break;
      default:
        return;
    }

    if (updatedScene) {
      updateScene(selectedSceneIndex, updatedScene);
    }
  };

  return (
    <div className="animation-container">
      {/* Asset Library Modal */}
      {showAssetLibrary && (
        <AssetLibrary
          onClose={() => setShowAssetLibrary(false)}
          onSelectAsset={handleSelectAssetFromLibrary}
        />
      )}

      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}

      {/* Image Crop Modal */}
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div className="grid grid-cols-12 gap-3 h-screen">
        {/* Zone 1 - Panneau de scènes (gauche) */}
        <div className="col-span-2 row-span-2 overflow-y-auto">

          <ScenePanel
            scenes={scenes}
            onAddScene={onAddScene}
            onDeleteScene={onDeleteScene}
            onDuplicateScene={onDuplicateScene}
            onMoveScene={onMoveScene}
            onExportConfig={onExportConfig}
            onImportConfig={onImportConfig}
          />
        </div>

        {/* Zone 3 - Éditeur de calques (centre) */}
        <div className="col-span-8 row-span-2 overflow-y-auto">
          {scenes[selectedSceneIndex] && (
            <LayerEditor
              scene={scenes[selectedSceneIndex]}
              onSave={(updatedScene) => {
                updateScene(selectedSceneIndex, updatedScene);
              }}
              onClose={() => { }}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
            />
          )}
        </div>

        {/* Zone 4 - Panneau de propriétés (droite) */}
        <div className="col-span-2 row-span-2 overflow-y-auto">
          {scenes[selectedSceneIndex] && (
            <PropertiesPanel
              scene={scenes[selectedSceneIndex]}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateScene={(updates) => updateScene(selectedSceneIndex, updates)}
              onUpdateLayer={(updatedLayer: any) => {
                const updatedScene = updateLayer(currentScene, updatedLayer);
                updateScene(selectedSceneIndex, updatedScene);
              }}
              onDeleteLayer={(layerId) => handleLayerOperation('delete', layerId)}
              onDuplicateLayer={(layerId) => handleLayerOperation('duplicate', layerId)}
              onMoveLayer={(layerId, direction) => handleLayerOperation('move', layerId, direction)}
              onImageUpload={handleImageUpload}
              onOpenAssetLibrary={() => setShowAssetLibrary(true)}
              onAddText={handleAddText}
              onAddShape={() => setShowShapeToolbar(true)}
              fileInputRef={fileInputRef}
            />
          )}
        </div>

        {/* Zone 5 - Liste des calques (bas, toute la largeur) */}
        <div className="col-span-12 ">
          {scenes[selectedSceneIndex] && (
            <LayersList
              scene={scenes[selectedSceneIndex]}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onDeleteLayer={(layerId) => handleLayerOperation('delete', layerId)}
              onDuplicateLayer={(layerId) => handleLayerOperation('duplicate', layerId)}
              onMoveLayer={(layerId, direction) => handleLayerOperation('move', layerId, direction)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationContainer;