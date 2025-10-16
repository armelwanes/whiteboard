import React from 'react';
import { useSceneStore } from '../../app/scenes';
import { 
  useLayerEditor, 
  useLayerCreationHandlers
} from '../molecules/layer-management';
import LayerEditorModals from './LayerEditorModals';
import LayerEditorCanvas from './LayerEditorCanvas';

interface LayerEditorProps {
  scene: any;
  onClose: () => void;
  onSave: (scene: any) => void;
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string | null) => void;
}

const LayerEditor: React.FC<LayerEditorProps> = ({ 
  scene, 
  onClose, 
  onSave,
  selectedLayerId: externalSelectedLayerId,
  onSelectLayer: externalOnSelectLayer
}) => {
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

  const {
    editedScene,
    setEditedScene,
    selectedLayerId,
    setSelectedLayerId,
    selectedCamera,
    setSelectedCamera,
    showThumbnailMaker,
    setShowThumbnailMaker,
    handleChange,
    handleUpdateScene,
    handleUpdateLayer,
    handleAddLayer,
    handleDeleteLayer,
    handleDuplicateLayer,
    handleMoveLayer,
    handleLayerPropertyChange
  } = useLayerEditor({
    scene,
    selectedLayerId: externalSelectedLayerId,
    onSelectLayer: externalOnSelectLayer
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
    onSave(editedScene);
  };

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions: any) => {
    await handleCropCompleteBase(croppedImageUrl, imageDimensions, pendingImageData, editedScene.layers.length);
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
