import React from 'react';
import { X, ImageIcon as Image, Upload } from 'lucide-react';

interface AssetLibraryHeaderProps {
  stats: { totalCount: number; totalSizeMB: string } | null;
  onClose: () => void;
  onAddAsset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AssetLibraryHeader: React.FC<AssetLibraryHeaderProps> = ({
  stats,
  onClose,
  onAddAsset,
  fileInputRef,
  onImageUpload
}) => {
  return (
    <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <Image className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Bibliothèque d'Assets</h2>
        {stats && (
          <span className="text-sm text-muted-foreground">
            ({stats.totalCount} assets • {stats.totalSizeMB} MB)
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAddAsset}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
