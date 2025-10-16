import React from 'react';
import { Tag } from 'lucide-react';

interface AssetTagsFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export const AssetTagsFilter: React.FC<AssetTagsFilterProps> = ({
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags
}) => {
  return (
    <div>
      <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Tags ({allTags.length})
      </h3>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {allTags.length === 0 ? (
          <p className="text-gray-500 text-xs italic">Aucun tag disponible</p>
        ) : (
          allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-secondary/30 text-foreground hover:bg-secondary/80'
              }`}
            >
              # {tag}
            </button>
          ))
        )}
      </div>
      {selectedTags.length > 0 && (
        <button
          onClick={onClearTags}
          className="w-full mt-2 text-xs text-primary hover:text-blue-300"
        >
          Effacer les tags
        </button>
      )}
    </div>
  );
};
