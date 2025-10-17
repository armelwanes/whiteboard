import React from 'react';
import { ImageCropModal } from '../molecules';
import ShapeToolbar from './ShapeToolbar';
import AssetLibrary from './AssetLibrary';
import ThumbnailMaker from './ThumbnailMaker';

interface LayerEditorModalsProps {
  showShapeToolbar: boolean;
  showAssetLibrary: boolean;
  showCropModal: boolean;
  showThumbnailMaker: boolean;
  pendingImageData: any;
  scene: any;
  onCloseShapeToolbar: () => void;
  onCloseAssetLibrary: () => void;
  onCloseCropModal: () => void;
  onCloseThumbnailMaker: () => void;
  onAddShape: (shapeLayer: any) => void;
  onSelectAsset: (asset: any) => void;
  onCropComplete: (croppedImageUrl: string) => void;
  onCropCancel: () => void;
  onSaveThumbnail: (updatedScene: any) => void;
}

const LayerEditorModals: React.FC<LayerEditorModalsProps> = ({
  showShapeToolbar,
  showAssetLibrary,
  showCropModal,
  showThumbnailMaker,
  pendingImageData,
  scene,
  onCloseThumbnailMaker,
  onCropComplete,
  onCropCancel,
  onSaveThumbnail
}) => {
  return (
    <>
      {showShapeToolbar && (
        <ShapeToolbar />
      )}

      {showAssetLibrary && (
        <AssetLibrary />
      )}

      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={onCropComplete}
          onCancel={onCropCancel}
        />
      )}

      {showThumbnailMaker && (
        <ThumbnailMaker
          scene={scene}
          onClose={onCloseThumbnailMaker}
          onSave={onSaveThumbnail}
        />
      )}
    </>
  );
};

export default LayerEditorModals;
