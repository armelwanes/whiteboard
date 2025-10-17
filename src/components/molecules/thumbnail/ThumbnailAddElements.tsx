import React from 'react';
import { Upload, Type } from 'lucide-react';

interface ThumbnailAddElementsProps {
  onImageUpload: () => void;
  onAddText: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ThumbnailAddElements: React.FC<ThumbnailAddElementsProps> = ({
  onImageUpload,
  onAddText,
  imageUploadRef,
  onFileChange
}) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Type className="w-4 h-4" />
        Ajouter des éléments
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={onImageUpload}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Importer Image
        </button>
        <input
          ref={imageUploadRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        
        <button
          onClick={onAddText}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Type className="w-4 h-4" />
          Ajouter Texte
        </button>
      </div>
    </div>
  );
};
