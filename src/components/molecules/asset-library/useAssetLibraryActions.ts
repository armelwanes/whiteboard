import { useCallback } from 'react';
import {
    getCachedAssetsAsync,
    searchAssetsAsync,
    getAllTags,
    getAssetStats,
    addAsset,
    AssetStats as ManagerAssetStats
} from '../../../utils/assetManager';
import { useAssetLibraryStore } from './useAssetLibraryStore';
import type { Asset } from './types';

export function useAssetLibraryActions(setAssets: (assets: Asset[]) => void, setStats: (stats: ManagerAssetStats | null) => void) {
    const {
        searchQuery, selectedTags, sortBy, sortOrder, viewMode,
        setAllTags, setShowCropModal, setPendingImageData
    } = useAssetLibraryStore();

    const loadAssets = useCallback(async () => {
        let loadedAssets: Asset[] = [];
        try {
            if (viewMode === 'cached') {
                loadedAssets = await getCachedAssetsAsync();
            } else if (viewMode === 'recent') {
                loadedAssets = (await searchAssetsAsync({ sortBy: 'uploadDate', sortOrder: 'desc' })).slice(0, 20);
            } else {
                loadedAssets = await searchAssetsAsync({
                    query: searchQuery,
                    tags: selectedTags,
                    sortBy,
                    sortOrder
                });
            }
        } catch (err) {
            console.error('[useAssetLibraryActions] loadAssets failed', err);
        }
        setAssets(loadedAssets);
    }, [searchQuery, selectedTags, sortBy, sortOrder, viewMode, setAssets]);

    const refreshTagsAndStats = useCallback(() => {
        setAllTags(getAllTags());
        setStats(getAssetStats());
    }, [setAllTags, setStats]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            useAssetLibraryStore.getState().setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            useAssetLibraryStore.getState().setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const originalImageUrl = event.target?.result as string;
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

    const handleCropCancel = () => {
        setShowCropModal(false);
        setPendingImageData(null);
    };

    const handleSortByChange = (value: string) => {
        useAssetLibraryStore.getState().setSortBy(value as typeof sortBy);
    };

    return {
        loadAssets,
        toggleTag,
        handleImageUpload,
        handleCropCancel,
        handleSortByChange,
        refreshTagsAndStats
    };
}