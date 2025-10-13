import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';
import { X, Check, Crop, Eraser } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

/**
 * ImageCropModal - Modal component for cropping images
 * Allows users to select a portion of an uploaded image before using it
 * Now with automatic background removal feature
 */
const ImageCropModal = ({ imageUrl, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(true);
  const imgRef = useRef(null);

  const handleCropComplete = async () => {
    setIsRemovingBackground(true);
    
    let finalImageUrl = imageUrl;
    let processingError = null;
    
    try {
      if (!completedCrop || !imgRef.current) {
        // If no crop was made, use the entire image
        finalImageUrl = imageUrl;
      } else {
        // Create canvas to extract cropped image
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        
        const ctx = canvas.getContext('2d');
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

        // Convert canvas to blob URL
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) {
          console.error('Canvas is empty');
          processingError = 'Canvas is empty';
        } else {
          finalImageUrl = URL.createObjectURL(blob);
        }
      }
      
      // Apply background removal if enabled and no error occurred
      if (!processingError && removeBackgroundEnabled) {
        try {
          const imageBlob = await removeBackground(finalImageUrl);
          finalImageUrl = URL.createObjectURL(imageBlob);
        } catch (error) {
          console.warn('Background removal failed, using original image:', error);
          // Continue with the cropped image if background removal fails
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      processingError = error;
    } finally {
      // Always reset state and call callback in finally block
      setIsRemovingBackground(false);
      // Use setTimeout to ensure state update completes before callback
      setTimeout(() => {
        onCropComplete(finalImageUrl);
      }, 0);
    }
  };

  const handleSkipCrop = async () => {
    setIsRemovingBackground(true);
    
    let finalImageUrl = imageUrl;
    
    try {
      // Apply background removal if enabled
      if (removeBackgroundEnabled) {
        try {
          const imageBlob = await removeBackground(imageUrl);
          finalImageUrl = URL.createObjectURL(imageBlob);
        } catch (error) {
          console.warn('Background removal failed, using original image:', error);
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      // Always reset state and call callback in finally block
      setIsRemovingBackground(false);
      // Use setTimeout to ensure state update completes before callback
      setTimeout(() => {
        onCropComplete(finalImageUrl);
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crop Image</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            disabled={isRemovingBackground}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-6 max-h-[70vh] overflow-auto bg-gray-50 dark:bg-gray-800/50">
          {isRemovingBackground ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Processing image...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
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

        {/* Background Removal Toggle */}
        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={removeBackgroundEnabled}
              onChange={(e) => setRemoveBackgroundEnabled(e.target.checked)}
              disabled={isRemovingBackground}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <Eraser className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Automatically remove background
              </span>
            </div>
          </label>
        </div>

        {/* Instructions */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Drag to select the area to keep, or click "Use Full Image" to skip cropping
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
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
