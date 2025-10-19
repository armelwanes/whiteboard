import React, { useState, useRef } from 'react';
import ReactCrop, { PercentCrop, PixelCrop } from 'react-image-crop';
// @ts-ignore: allow importing CSS for the cropper styles (handled by bundler)
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../atoms';
import { X, Check, Crop as CropIcon } from 'lucide-react';
import TagSelector from './TagSelector';
import { getAllTags } from '@/utils/assetManager';

interface ImageCropModalProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string, imageDimensions?: { width: number; height: number }, tags?: string[]) => void;
  onCancel: () => void;
}

/**
 * ImageCropModal - Modal component for cropping images
 * Allows users to select a portion of an uploaded image before using it
 * Now with automatic background removal feature
 */
const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<PercentCrop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags] = useState<string[]>(getAllTags());
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleCropComplete = async () => {
    setIsRemovingBackground(true);
    let finalImageUrl = imageUrl;
    let imageDimensions: { width: number; height: number } | undefined = undefined;
    try {
      const image = imgRef.current;
      if (!image) {
        console.error('Image reference not available');
        return;
      }

      if (!completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
        imageDimensions = {
          width: image.naturalWidth,
          height: image.naturalHeight
        };
        finalImageUrl = imageUrl;
      } else {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        imageDimensions = {
          width: canvas.width,
          height: canvas.height
        };
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
          );
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
          if (!blob) {
            console.error('Canvas is empty');
          } else {
            finalImageUrl = URL.createObjectURL(blob);
          }
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsRemovingBackground(false);
      setTimeout(() => {
        onCropComplete(finalImageUrl, imageDimensions, selectedTags);
      }, 0);
    }
  };

  const handleSkipCrop = async () => {
    setIsRemovingBackground(true);
    let finalImageUrl = imageUrl;
    let imageDimensions: { width: number; height: number } | undefined = undefined;
    try {
      if (imgRef.current) {
        imageDimensions = {
          width: imgRef.current.naturalWidth,
          height: imgRef.current.naturalHeight
        };
      }
    } catch (error) {
      console.error('Error getting image dimensions:', error);
    } finally {
      setIsRemovingBackground(false);
      setTimeout(() => {
        onCropComplete(finalImageUrl, imageDimensions, selectedTags);
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 overflow-hidden border border-gray-200 dark:border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border">
          <div className="flex items-center gap-2">
            <CropIcon className="w-5 h-5 text-blue-600 dark:text-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crop Image</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-colors"
            disabled={isRemovingBackground}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-6 max-h-[70vh] overflow-auto bg-gray-50 dark:bg-secondary/30/50">
          {isRemovingBackground ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 dark:text-foreground font-medium">Processing image...</p>
              <p className="text-sm text-gray-500 dark:text-muted-foreground">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  // ReactCrop may return PixelCrop (unit='px') or PercentCrop (unit='%').
                  // Convert pixel crop to percent using the displayed image dimensions.
                  const unit = (c as any)?.unit;
                  if (unit === '%') {
                    setCrop(c as unknown as PercentCrop);
                    return;
                  }
                  if (unit === 'px') {
                    const p = c as unknown as PixelCrop;
                    const img = imgRef.current;
                    if (img && img.width && img.height) {
                      const percentCrop: PercentCrop = {
                        unit: '%',
                        x: (p.x / img.width) * 100,
                        y: (p.y / img.height) * 100,
                        width: (p.width / img.width) * 100,
                        height: (p.height / img.height) * 100
                      };
                      setCrop(percentCrop as unknown as PercentCrop);
                    }
                  }
                }}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
                className=' bg-white'
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '60vh' }}
                />
              </ReactCrop>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-secondary/30/20 border-t border-gray-200 dark:border-border">
          <p className="text-xs text-gray-600 dark:text-muted-foreground text-center">
            Drag to select the area to keep, or click "Use Full Image" to skip cropping
          </p>
        </div>

        {/* Tag Selection Section */}
        <div className="px-6 py-4 bg-white dark:bg-secondary/30 border-t border-gray-200 dark:border-border">
          <TagSelector
            selectedTags={selectedTags}
            availableTags={availableTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-border bg-white dark:bg-secondary/30">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isRemovingBackground}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkipCrop}
            disabled={isRemovingBackground}
            className="flex items-center gap-2"
          >
            Use Full Image
          </Button>
          <Button
            onClick={handleCropComplete}
            disabled={isRemovingBackground}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
          >
            <Check className="w-4 h-4" />
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
