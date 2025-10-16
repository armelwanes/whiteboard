import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Image as ImageIcon
} from 'lucide-react';
import {
  getCachedAssets,
  searchAssets,
  updateAsset,
  deleteAsset,
  getAllTags,
  getAssetStats,
  addAsset
} from '../../utils/assetManager';
import { ImageCropModal } from '../molecules';
import {
  AssetLibraryHeader,
  AssetSearchBar,
  AssetViewModeSelector,
  AssetSortControls,
  AssetTagsFilter,
  AssetCard
} from '../molecules/asset-library';

interface AssetLibraryProps {
  onClose: () => void;
  onSelectAsset: (asset: any) => void;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ onClose, onSelectAsset }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState('');
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'cached', 'recent'
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingImageData, setPendingImageData] = useState(null);
  const fileInputRef = useRef(null);

  const loadAssets = useCallback(() => {
    let loadedAssets;
    
    if (viewMode === 'cached') {
      loadedAssets = getCachedAssets();
    } else if (viewMode === 'recent') {
      loadedAssets = searchAssets({ sortBy: 'uploadDate', sortOrder: 'desc' }).slice(0, 20);
    } else {
      loadedAssets = searchAssets({
        query: searchQuery,
        tags: selectedTags,
        sortBy,
        sortOrder
      });
    }
    
    setAssets(loadedAssets);
  }, [searchQuery, selectedTags, sortBy, sortOrder, viewMode]);

  // Load assets and tags
  useEffect(() => {
    loadAssets();
    setAllTags(getAllTags());
    setStats(getAssetStats());
  }, [loadAssets]);

  const handleSelectAsset = (asset) => {
    if (onSelectAsset) {
      onSelectAsset(asset);
      onClose();
    } else {
      setSelectedAsset(asset);
    }
  };

  const handleDeleteAsset = (assetId, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet asset ?')) {
      deleteAsset(assetId);
      loadAssets();
      setAllTags(getAllTags());
      setStats(getAssetStats());
      if (selectedAsset?.id === assetId) {
        setSelectedAsset(null);
      }
    }
  };

  const handleEditAsset = (asset, e) => {
    e.stopPropagation();
    setEditingAssetId(asset.id);
    setEditName(asset.name);
    setEditTags(asset.tags.join(', '));
  };

  const handleSaveEdit = (assetId, e) => {
    e.stopPropagation();
    const tags = editTags.split(',').map(t => t.trim()).filter(t => t);
    updateAsset(assetId, { name: editName, tags });
    setEditingAssetId(null);
    loadAssets();
    setAllTags(getAllTags());
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingAssetId(null);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalImageUrl = event.target.result;
        
        // Store pending image data to show crop modal
        setPendingImageData({
          imageUrl: originalImageUrl,
          fileName: file.name,
          fileType: file.type
        });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropComplete = async () => {
    if (!pendingImageData) return;

    try {
      // Save ORIGINAL (uncropped) image to asset library
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: pendingImageData.imageUrl, // Save original, not cropped
        type: pendingImageData.fileType,
        tags: []
      });
      loadAssets();
      setAllTags(getAllTags());
      setStats(getAssetStats());
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Erreur lors de l\'ajout de l\'asset');
    }

    // Close modal and reset pending data
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <>
      {/* Image Crop Modal */}
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-border">
        <AssetLibraryHeader
          stats={stats}
          onClose={onClose}
          onAddAsset={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onImageUpload={handleImageUpload}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-64 bg-gray-850 border-r border-border p-4 overflow-y-auto flex-shrink-0">
            <AssetViewModeSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <AssetSortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
            />

            <AssetTagsFilter
              allTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onClearTags={() => setSelectedTags([])}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AssetSearchBar
              searchQuery={searchQuery}
              selectedTags={selectedTags}
              onSearchChange={setSearchQuery}
            />

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto p-2 bg-white">
              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Aucun asset trouvé</p>
                  <p className="text-sm mt-2">Ajoutez des images pour commencer</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {assets.map(asset => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`bg-secondary/30 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
                        selectedAsset?.id === asset.id
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
                                <Check className="w-3 h-3 mx-auto" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
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
                                onClick={(e) => handleEditAsset(asset, e)}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteAsset(asset.id, e)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AssetLibrary;
