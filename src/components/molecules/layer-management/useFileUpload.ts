import { useCallback } from 'react';
import { addAsset } from '../../../utils/assetManager';

export interface FileUploadHandlers {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, onPendingImage: (data: any) => void, onShowCrop: (show: boolean) => void) => Promise<void>;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>, onChange: (field: string, value: any) => void) => void;
  handleBackgroundMusicUpload: (e: React.ChangeEvent<HTMLInputElement>, onChange: (field: string, value: any) => void) => void;
  handleCropComplete: (croppedImageUrl: string, imageDimensions: any, pendingImageData: any, onLayerCreated: (layer: any) => void, onCropDone: () => void) => Promise<void>;
}

export const useFileUpload = (): FileUploadHandlers => {
  
  const handleImageUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    onPendingImage: (data: any) => void,
    onShowCrop: (show: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalImageUrl = event.target?.result;
        
        onPendingImage({
          imageUrl: originalImageUrl,
          fileName: file.name,
          originalUrl: originalImageUrl,
          fileType: file.type
        });
        onShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
    (e.target as HTMLInputElement).value = '';
  }, []);

  const handleBackgroundImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange('backgroundImage', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
    (e.target as HTMLInputElement).value = '';
  }, []);

  const handleBackgroundMusicUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange('backgroundMusic', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
    (e.target as HTMLInputElement).value = '';
  }, []);

  const handleCropComplete = useCallback(async (
    croppedImageUrl: string,
    imageDimensions: any,
    pendingImageData: any,
    onLayerCreated: (layer: any) => void,
    onCropDone: () => void
  ) => {
    if (!pendingImageData) return;

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

    onLayerCreated({
      croppedImageUrl,
      imageDimensions,
      fileName: pendingImageData.fileName
    });
    onCropDone();
  }, []);

  return {
    handleImageUpload,
    handleBackgroundImageUpload,
    handleBackgroundMusicUpload,
    handleCropComplete
  };
};
