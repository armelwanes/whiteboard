import React from 'react';
import { Download, ImageIcon } from 'lucide-react';

interface ThumbnailActionsProps {
  onDownload: () => void;
  onSave?: () => void;
}

export const ThumbnailActions: React.FC<ThumbnailActionsProps> = ({ 
  onDownload, 
  onSave 
}) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onDownload}
        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
      >
        <Download className="w-5 h-5" />
        Télécharger PNG
      </button>
      {onSave && (
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
        >
          <ImageIcon className="w-5 h-5" />
          Enregistrer
        </button>
      )}
    </div>
  );
};
