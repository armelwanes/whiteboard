import React, { useState, useEffect } from 'react';
import { searchAssetsAsync, Asset } from '@/utils/assetManager';
import { Plus } from 'lucide-react';
import { Button } from '../atoms';

interface AssetCategoryGridProps {
  categoryTag: string;
  onBrowseAssets: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

const AssetCategoryGrid: React.FC<AssetCategoryGridProps> = ({
  categoryTag,
  onBrowseAssets,
  onSelectAsset,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const results = await searchAssetsAsync({
          tags: [categoryTag],
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
  }, [categoryTag]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground text-center">
          Aucun asset avec le tag "{categoryTag}"
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
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {assets.slice(0, 6).map((asset) => (
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
            {asset.tags.length > 1 && (
              <div className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                +{asset.tags.length - 1}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {assets.length > 6 && (
        <p className="text-xs text-muted-foreground text-center">
          +{assets.length - 6} autres assets
        </p>
      )}
      
      <Button
        onClick={onBrowseAssets}
        size="sm"
        variant="outline"
        className="w-full gap-1"
      >
        <Plus className="w-3 h-3" />
        Voir tous les assets
      </Button>
    </div>
  );
};

export default AssetCategoryGrid;
