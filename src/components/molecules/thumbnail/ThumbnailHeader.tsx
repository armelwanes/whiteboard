import React from 'react';
import { ImageIcon, X } from 'lucide-react';

interface ThumbnailHeaderProps {
  onClose: () => void;
}

export const ThumbnailHeader: React.FC<ThumbnailHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Éditeur de Miniature</h2>
          <p className="text-sm text-white/80">Éditeur interactif - Drag & Drop - 1280x720</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
