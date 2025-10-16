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
  onCropComplete: (croppedImageUrl: string, imageDimensions: any) => void;
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
  onCloseShapeToolbar,
  onCloseAssetLibrary,
  onCloseCropModal,
  onCloseThumbnailMaker,
  onAddShape,
  onSelectAsset,
  onCropComplete,
  onCropCancel,
  onSaveThumbnail
}) => {
  return (
    <>
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={onAddShape}
          onClose={onCloseShapeToolbar}
        />
      )}
      
      {showAssetLibrary && (
        <AssetLibrary
          onClose={onCloseAssetLibrary}
          onSelectAsset={onSelectAsset}
        />
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
