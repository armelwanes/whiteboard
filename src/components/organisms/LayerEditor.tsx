import React from 'react';
import { useSceneStore } from '../../app/scenes';
import {
  useLayerEditor,
  useLayerCreationHandlers
} from '../molecules/layer-management';
import LayerEditorModals from './LayerEditorModals';
import LayerEditorCanvas from './LayerEditorCanvas';
import { useCurrentScene } from '@/app/scenes';

const LayerEditor: React.FC = () => {
  const scene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state) => state.showShapeToolbar);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const showAssetLibrary = useSceneStore((state) => state.showAssetLibrary);
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  const [selectedLayerId, setSelectedLayerId] = React.useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = React.useState<string | null>(null);

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
    handleCropComplete: handleCropCompleteBase,
    handleSelectAssetFromLibrary: handleSelectAssetBase
  } = useLayerCreationHandlers({
    sceneWidth,
    sceneHeight,
    selectedCamera,
    onAddLayer: handleAddLayer,
    onCloseShapeToolbar: () => setShowShapeToolbar(false)
  });

  const handleSave = () => {
    handleUpdateScene(editedScene);
  };

  // LayerEditorModals expects onCropComplete to take only croppedImageUrl
  const handleCropComplete = (croppedImageUrl: string) => {
    // If you need imageDimensions, you can retrieve from pendingImageData or elsewhere
    handleCropCompleteBase(croppedImageUrl, undefined, pendingImageData, editedScene.layers.length);
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleSelectAssetFromLibrary = (asset: any) => {
    handleSelectAssetBase(asset, editedScene.layers.length);
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
        onCloseAssetLibrary={() => setShowAssetLibrary(false)}
        onCloseCropModal={() => setShowCropModal(false)}
        onCloseThumbnailMaker={() => setShowThumbnailMaker(false)}
        onAddShape={handleAddShapeWrapper}
        onSelectAsset={handleSelectAssetFromLibrary}
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
