import { useCallback } from 'react';
import { addAsset } from '../../../utils/assetManager';
import { useLayerCreation, LayerCreationOptions } from './useLayerCreation';

export const useImageHandling = (options: LayerCreationOptions) => {
  const { createImageLayer } = useLayerCreation(options);

  const handleCropComplete = useCallback(async (
    croppedImageUrl: string,
    imageDimensions: any,
    pendingImageData: any,
    layersLength: number
  ) => {
    if (!pendingImageData) return null;

    try {
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: pendingImageData.originalUrl,
        type: pendingImageData.fileType,
        tags: []
      });
    } catch (error) {
      console.error('Error saving asset to library:', error);
    }

    return createImageLayer(
      croppedImageUrl,
      pendingImageData.fileName,
      imageDimensions,
      layersLength
    );
  }, [createImageLayer]);

  const handleSelectAssetFromLibrary = useCallback((
    asset: any,
    layersLength: number
  ) => {
    return createImageLayer(
      asset.dataUrl,
      asset.name,
      { width: asset.width, height: asset.height },
      layersLength
    );
  }, [createImageLayer]);

  return {
    handleCropComplete,
    handleSelectAssetFromLibrary
  };
};
