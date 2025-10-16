import { useCallback } from 'react';
import { useLayerCreation } from './useLayerCreation';
import { useImageHandling } from './useImageHandling';

export interface LayerCreationHandlersOptions {
  sceneWidth?: number;
  sceneHeight?: number;
  selectedCamera?: any;
  onAddLayer: (layer: any) => void;
  onCloseShapeToolbar?: () => void;
}

export const useLayerCreationHandlers = ({
  sceneWidth = 1920,
  sceneHeight = 1080,
  selectedCamera,
  onAddLayer,
  onCloseShapeToolbar
}: LayerCreationHandlersOptions) => {
  const { createTextLayer, createImageLayer, createShapeLayer } = useLayerCreation({
    sceneWidth,
    sceneHeight,
    selectedCamera
  });

  const { handleCropComplete: baseCropComplete, handleSelectAssetFromLibrary: baseSelectAsset } = useImageHandling({
    sceneWidth,
    sceneHeight,
    selectedCamera
  });

  const handleAddTextLayer = useCallback((layersLength: number) => {
    const newLayer = createTextLayer(layersLength);
    onAddLayer(newLayer);
  }, [createTextLayer, onAddLayer]);

  const handleAddShape = useCallback((shapeLayer: any, layersLength: number) => {
    const newLayer = createShapeLayer(shapeLayer, layersLength);
    onAddLayer(newLayer);
    if (onCloseShapeToolbar) {
      onCloseShapeToolbar();
    }
  }, [createShapeLayer, onAddLayer, onCloseShapeToolbar]);

  const handleCropCompleteWrapper = useCallback(async (
    croppedImageUrl: string,
    imageDimensions: any,
    pendingImageData: any,
    layersLength: number
  ) => {
    const newLayer = await baseCropComplete(
      croppedImageUrl,
      imageDimensions,
      pendingImageData,
      layersLength
    );
    if (newLayer) {
      onAddLayer(newLayer);
    }
    return newLayer;
  }, [baseCropComplete, onAddLayer]);

  const handleSelectAssetFromLibraryWrapper = useCallback((
    asset: any,
    layersLength: number
  ) => {
    const newLayer = baseSelectAsset(asset, layersLength);
    onAddLayer(newLayer);
  }, [baseSelectAsset, onAddLayer]);

  return {
    handleAddTextLayer,
    handleAddShape,
    handleCropComplete: handleCropCompleteWrapper,
    handleSelectAssetFromLibrary: handleSelectAssetFromLibraryWrapper
  };
};
