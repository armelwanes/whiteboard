import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssetSortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortByChange: (value: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export const AssetSortControls: React.FC<AssetSortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold mb-3 text-sm">Trier par</h3>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-full bg-secondary/30 text-white border border-border rounded px-3 py-2 text-sm">
          <SelectValue placeholder="Sélectionner un tri" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="uploadDate">Date d'upload</SelectItem>
          <SelectItem value="lastUsed">Dernière utilisation</SelectItem>
          <SelectItem value="usageCount">Utilisation</SelectItem>
          <SelectItem value="name">Nom</SelectItem>
          <SelectItem value="size">Taille</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSortOrderChange('asc')}
          className={`flex-1 px-3 py-1 rounded text-xs ${
            sortOrder === 'asc'
              ? 'bg-primary text-white'
              : 'bg-secondary/30 text-muted-foreground'
          }`}
        >
          ↑ Croissant
        </button>
        <button
          onClick={() => onSortOrderChange('desc')}
          className={`flex-1 px-3 py-1 rounded text-xs ${
            sortOrder === 'desc'
              ? 'bg-primary text-white'
              : 'bg-secondary/30 text-muted-foreground'
          }`}
        >
          ↓ Décroissant
        </button>
      </div>
    </div>
  );
};
