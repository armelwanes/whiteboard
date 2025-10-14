import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Search, Tag, Trash2, Edit2, Check, 
  Image as ImageIcon, Clock, TrendingUp, Upload
} from 'lucide-react';
import {
  getCachedAssets,
  searchAssets,
  updateAsset,
  deleteAsset,
  getAllTags,
  getAssetStats,
  addAsset
} from '../utils/assetManager';

const AssetLibrary = ({ onClose, onSelectAsset }) => {
  const [assets, setAssets] = useState([]);
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
        try {
          await addAsset({
            name: file.name,
            dataUrl: event.target.result,
            type: file.type,
            tags: []
          });
          loadAssets();
          setAllTags(getAllTags());
          setStats(getAssetStats());
        } catch (error) {
          console.error('Error adding asset:', error);
          alert('Erreur lors de l\'ajout de l\'asset');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Bibliothèque d'Assets</h2>
            {stats && (
              <span className="text-sm text-gray-400">
                ({stats.totalCount} assets • {stats.totalSizeMB} MB)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-64 bg-gray-850 border-r border-gray-700 p-4 overflow-y-auto flex-shrink-0">
            {/* View Mode */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Affichage
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setViewMode('all')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    viewMode === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  Tous les assets
                </button>
                <button
                  onClick={() => setViewMode('cached')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                    viewMode === 'cached'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Plus utilisés
                </button>
                <button
                  onClick={() => setViewMode('recent')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                    viewMode === 'recent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Récents
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 text-sm">Trier par</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
              >
                <option value="uploadDate">Date d'upload</option>
                <option value="lastUsed">Dernière utilisation</option>
                <option value="usageCount">Utilisation</option>
                <option value="name">Nom</option>
                <option value="size">Taille</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 px-3 py-1 rounded text-xs ${
                    sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  ↑ Croissant
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 px-3 py-1 rounded text-xs ${
                    sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  ↓ Décroissant
                </button>
              </div>
            </div>

            {/* Tags Filter */}
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
                      onClick={() => toggleTag(tag)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                      }`}
                    >
                      # {tag}
                    </button>
                  ))
                )}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="w-full mt-2 text-xs text-blue-400 hover:text-blue-300"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="bg-gray-850 p-4 border-b border-gray-700 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom..."
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded pl-10 pr-4 py-2"
                />
              </div>
              {(searchQuery || selectedTags.length > 0) && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {searchQuery && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
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

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
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
                      className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
                        selectedAsset?.id === asset.id
                          ? 'border-blue-500 shadow-xl'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="aspect-square bg-gray-900 flex items-center justify-center overflow-hidden">
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
                              className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600"
                              placeholder="Nom"
                            />
                            <input
                              type="text"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              className="w-full bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
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
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
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
                            <p className="text-gray-400 text-xs mb-2">
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
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
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
  );
};

export default AssetLibrary;
