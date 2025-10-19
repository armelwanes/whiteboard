import React, { useState, useEffect, useRef } from 'react';
import { AssetStats as ManagerAssetStats, addAsset } from '../../utils/assetManager';
import { ImageCropModal } from '../molecules';
import {
  AssetLibraryHeader,
  AssetSearchBar,
  AssetViewModeSelector,
  AssetSortControls,
  AssetTagsFilter
} from '../molecules/asset-library';
import AssetGrid from '../molecules/asset-library/AssetGrid';
import { useAssetLibraryStore } from '../molecules/asset-library/useAssetLibraryStore';
import { useAssetLibraryActions } from '../molecules/asset-library/useAssetLibraryActions';
import { useSceneStore } from '@/app/scenes';

import type { Asset } from '../molecules/asset-library/types';

// Use the AssetStats type from assetManager, but only pass the required fields to AssetLibraryHeader
const getHeaderStats = (stats: ManagerAssetStats | null) => {
  if (!stats) return null;
  return {
    totalCount: stats.totalCount,
    totalSizeMB: stats.totalSizeMB
  };
};

const AssetLibrary: React.FC = () => {
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<ManagerAssetStats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Zustand store for all UI state
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    sortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    showCropModal,
    pendingImageData
  } = useAssetLibraryStore();


  // Use custom hook for all business logic
  const {
    loadAssets,
    toggleTag,
    handleImageUpload,
    handleCropCancel,
    handleSortByChange,
    refreshTagsAndStats
  } = useAssetLibraryActions(setAssets, setStats);

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions?: { width: number; height: number }, tags?: string[]) => {
    if (!pendingImageData) return;
    try {
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: croppedImageUrl,
        type: pendingImageData.fileType,
        tags: tags || []
      });
      loadAssets();
      refreshTagsAndStats();
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Erreur lors de l\'ajout de l\'asset');
    }
    setShowCropModal(false);
    setPendingImageData(null);
  };

  useEffect(() => {
    loadAssets();
    refreshTagsAndStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, searchQuery, selectedTags, sortBy, sortOrder]);

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
          stats={getHeaderStats(stats)}
          onClose={() => setShowAssetLibrary(false)}
          onAddAsset={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
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
              onSortByChange={handleSortByChange}
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
              <AssetGrid assets={assets} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AssetLibrary;