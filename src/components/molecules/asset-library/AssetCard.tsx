import React from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  tags: string[];
  uploadDate: string;
  usageCount: number;
}

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  isEditing: boolean;
  editName: string;
  editTags: string;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditTagsChange: (value: string) => void;
  formatSize: (size: number) => string;
  formatDate: (date: string) => string;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  isEditing,
  editName,
  editTags,
  onSelect,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onEditTagsChange,
  formatSize,
  formatDate
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-secondary/30 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-primary shadow-xl'
          : 'border-border hover:border-border'
      }`}
    >
      {/* Image Thumbnail */}
      <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
        <img
          src={asset.dataUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Asset Info */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="w-full bg-secondary text-white text-sm px-2 py-1 rounded border border-border"
              placeholder="Nom"
            />
            <input
              type="text"
              value={editTags}
              onChange={(e) => onEditTagsChange(e.target.value)}
              className="w-full bg-secondary text-white text-xs px-2 py-1 rounded border border-border"
              placeholder="Tags (séparés par virgule)"
            />
            <div className="flex gap-1">
              <button
                onClick={onSaveEdit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
              >
                <Check className="w-3 h-3 mx-auto" />
              </button>
              <button
                onClick={onCancelEdit}
                className="flex-1 bg-gray-600 hover:bg-secondary text-white px-2 py-1 rounded text-xs"
              >
                <X className="w-3 h-3 mx-auto" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-white text-sm font-medium truncate mb-1">
              {asset.name}
            </p>
            <p className="text-muted-foreground text-xs mb-2">
              {asset.width} × {asset.height} • {formatSize(asset.size)}
            </p>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {asset.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {asset.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{asset.tags.length - 2}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{formatDate(asset.uploadDate)}</span>
              {asset.usageCount > 0 && (
                <span>Utilisé {asset.usageCount}×</span>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Éditer
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Suppr.
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
