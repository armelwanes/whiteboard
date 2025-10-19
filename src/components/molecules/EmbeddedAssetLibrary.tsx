import React, { useState, useEffect } from 'react';
import { searchAssetsAsync, getAllTags } from '@/utils/assetManager';
import { Plus, Tag } from 'lucide-react';
import { Button } from '../atoms';
import type { Asset } from '@/utils/assetManager';

interface EmbeddedAssetLibraryProps {
  onBrowseAssets?: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

const EmbeddedAssetLibrary: React.FC<EmbeddedAssetLibraryProps> = ({
  onBrowseAssets,
  onSelectAsset,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = () => {
      const tags = getAllTags();
      setAllTags(tags);
    };
    loadTags();
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const results = await searchAssetsAsync({
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          sortBy: 'uploadDate',
          sortOrder: 'desc'
        });
        setAssets(results);
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Tag className="w-3 h-3" />
            <span>Filtrer par tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-primary hover:underline"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="space-y-3 py-4">
          <p className="text-xs text-muted-foreground text-center">
            {selectedTags.length > 0
              ? `Aucun asset avec les tags sélectionnés`
              : `Aucun asset disponible`}
          </p>
          <Button
            onClick={onBrowseAssets}
            size="sm"
            variant="outline"
            className="w-full gap-1"
          >
            <Plus className="w-3 h-3" />
            Ajouter des assets
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className="relative cursor-pointer group bg-secondary/30 rounded border border-border hover:border-primary transition-all hover:shadow-md overflow-hidden"
              >
                <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-1.5 bg-secondary/50">
                  <p className="text-xs text-white truncate font-medium">
                    {asset.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {asset.width} × {asset.height}
                  </p>
                </div>
                {asset.tags.length > 0 && (
                  <div className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    {asset.tags.slice(0, 1).map(tag => (
                      <span key={tag}>#{tag}</span>
                    ))}
                    {asset.tags.length > 1 && <span>+{asset.tags.length - 1}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Button
            onClick={onBrowseAssets}
            size="sm"
            variant="outline"
            className="w-full gap-1"
          >
            <Plus className="w-3 h-3" />
            Gérer tous les assets
          </Button>
        </>
      )}
    </div>
  );
};

export default EmbeddedAssetLibrary;
