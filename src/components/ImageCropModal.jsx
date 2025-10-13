import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';
import { X, Check, Crop } from 'lucide-react';

/**
 * ImageCropModal - Modal component for cropping images
 * Allows users to select a portion of an uploaded image before using it
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
  const imgRef = useRef(null);

  const handleCropComplete = () => {
    if (!completedCrop || !imgRef.current) {
      // If no crop was made, use the entire image
      onCropComplete(imageUrl);
      return;
    }

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

    // Convert canvas to blob and then to data URL
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      const croppedImageUrl = URL.createObjectURL(blob);
      onCropComplete(croppedImageUrl);
    }, 'image/png');
  };

  const handleSkipCrop = () => {
    onCropComplete(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Recadrer l'image</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-6 max-h-[70vh] overflow-auto bg-gray-800/50">
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
        </div>

        {/* Instructions */}
        <div className="px-6 py-3 bg-gray-800/30 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Faites glisser pour sélectionner la zone à conserver, ou cliquez sur "Utiliser l'image entière" pour ne pas recadrer
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkipCrop}
            className="flex items-center gap-2"
          >
            Utiliser l'image entière
          </Button>
          <Button
            onClick={handleCropComplete}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Appliquer le recadrage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
