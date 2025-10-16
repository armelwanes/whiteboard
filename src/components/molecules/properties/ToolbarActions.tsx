import React from 'react';
import { Upload, Library, Type as TextIcon, Square as ShapeIcon } from 'lucide-react';

export interface ToolbarActionsProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onOpenAssetLibrary: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddText?: () => void;
  onAddShape?: () => void;
}

export const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  fileInputRef,
  onOpenAssetLibrary,
  onImageUpload,
  onAddText,
  onAddShape
}) => {
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onOpenAssetLibrary}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-3 rounded flex items-center gap-2 transition-colors text-sm"
          title="Bibliothèque d'assets"
        >
          <Library className="w-4 h-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-3 rounded flex items-center gap-2 transition-colors text-sm"
          title="Ajouter une image"
        >
          <Upload className="w-4 h-4" />
        </button>
        {onAddText && (
          <button
            onClick={onAddText}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-3 rounded flex items-center gap-2 transition-colors text-sm"
            title="Ajouter du texte"
          >
            <TextIcon className="w-4 h-4" />
          </button>
        )}
        {onAddShape && (
          <button
            onClick={onAddShape}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-3 rounded flex items-center gap-2 transition-colors text-sm"
            title="Ajouter une forme"
          >
            <ShapeIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </>
  );
};
