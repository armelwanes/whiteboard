

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useAssetLibraryStore } from './useAssetLibraryStore';

import type { Asset } from './types';

interface AssetGridProps {
    assets: Asset[];
}

const AssetGrid: React.FC<AssetGridProps> = ({ assets }) => {
    const {
        selectedAssetId,
        editingAssetId,
        editName,
        editTags,
        handleSelectAsset,
        handleEditAsset,
        handleDeleteAsset,
        handleSaveEdit,
        handleCancelEdit,
        setEditName,
        setEditTags,
        formatSize,
        formatDate
    } = useAssetLibraryStore();
    if (assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Aucun asset trouvé</p>
                <p className="text-sm mt-2">Ajoutez des images pour commencer</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map((asset: Asset) => (
                <div
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    className={`bg-secondary/30 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${selectedAssetId === asset.id
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
                        {editingAssetId === asset.id ? (
                            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-secondary text-white text-sm px-2 py-1 rounded border border-border"
                                    placeholder="Nom"
                                />
                                <input
                                    type="text"
                                    value={editTags}
                                    onChange={(e) => setEditTags(e.target.value)}
                                    className="w-full bg-secondary text-white text-xs px-2 py-1 rounded border border-border"
                                    placeholder="Tags (séparés par virgule)"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => handleSaveEdit(asset.id, e)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                    >
                                        ✔
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-600 hover:bg-secondary text-white px-2 py-1 rounded text-xs"
                                    >
                                        ✖
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
                                        {asset.tags.slice(0, 2).map((tag: string) => (
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
                                        onClick={(e) => handleEditAsset(asset, e)}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteAsset(asset.id, e)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AssetGrid;