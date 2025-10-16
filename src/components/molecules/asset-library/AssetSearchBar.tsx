import React from 'react';
import { Search } from 'lucide-react';

interface AssetSearchBarProps {
  searchQuery: string;
  selectedTags: string[];
  onSearchChange: (query: string) => void;
}

export const AssetSearchBar: React.FC<AssetSearchBarProps> = ({
  searchQuery,
  selectedTags,
  onSearchChange
}) => {
  return (
    <div className="bg-gray-850 p-4 border-b border-border flex-shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par nom..."
          className="w-full bg-secondary/30 text-white border border-border rounded pl-10 pr-4 py-2"
        />
      </div>
      {(searchQuery || selectedTags.length > 0) && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {searchQuery && (
            <span className="text-xs bg-primary text-white px-2 py-1 rounded">
              Recherche: "{searchQuery}"
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
