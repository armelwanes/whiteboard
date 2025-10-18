/**
 * Asset Manager - Centralized system for managing uploaded images and resources
 * Provides asset storage, tagging, search, and caching capabilities
 */

const ASSETS_STORAGE_KEY = 'whiteboard-assets';
const ASSET_CACHE_KEY = 'whiteboard-asset-cache';
const MAX_CACHE_SIZE = 50;

import assetDB from './assetDB';

export interface Asset {
  id: string;
  name: string;
  dataUrl: string;
  type: string;
  size: number;
  width: number;
  height: number;
  tags: string[];
  uploadDate: number;
  lastUsed: number;
  usageCount: number;
}

export interface AssetData {
  name: string;
  dataUrl: string;
  type: string;
  tags?: string[];
}

export interface SearchCriteria {
  query?: string;
  tags?: string[];
  sortBy?: 'name' | 'uploadDate' | 'lastUsed' | 'usageCount' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface AssetStats {
  totalCount: number;
  totalSize: number;
  totalSizeMB: string;
  uniqueTags: number;
  mostUsed: Asset | null;
}

export interface AssetCache {
  [key: string]: number;
}

/**
 * Get all assets from storage
 * @returns {Array} Array of asset objects
 */
export function getAllAssets(): Asset[] {
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // If localStorage empty, try IndexedDB (async) - but keep sync API: return [] for now
    // Consumers that need IDB can call assetDB.getAllAssetsFromIDB() directly if needed
    return [];
  } catch (error) {
    console.error('Error loading assets:', error);
    return [];
  }
}

/**
 * Save assets to storage
 * @param {Array} assets - Array of asset objects
 */
function saveAssets(assets: Asset[]): void {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
    console.debug('[assetManager] saved assets to localStorage', assets.length);
  } catch (error) {
    console.error('Error saving assets:', error);
    if ((error as any).name === 'QuotaExceededError') {
      // Aggressive cleanup: keep only the most recent 10 or most frequently used assets
      const cleanedAssets = aggressiveCleanup(assets);
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(cleanedAssets));
        console.log(`[assetManager] Aggressive cleanup: reduced from ${assets.length} to ${cleanedAssets.length} assets`);
      } catch (retryError) {
        console.error('Failed to save assets after aggressive cleanup:', retryError);
        // Fallback to IndexedDB
        assetDB.saveAllAssetsToIDB(assets).then(() => {
          console.debug('[assetManager] saved assets to IndexedDB after quota exceeded');
        }).catch((idbErr) => {
          console.error('[assetManager] failed to save assets to IndexedDB:', idbErr);
        });
      }
    }
  }
}

/**
 * Get asset cache (frequently used assets)
 * @returns {Object} Cache object with asset IDs as keys
 */
function getAssetCache(): AssetCache {
  try {
    const stored = localStorage.getItem(ASSET_CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading asset cache:', error);
    return {};
  }
}

/**
 * Update asset cache
 * @param {Object} cache - Cache object
 */
function saveAssetCache(cache: AssetCache): void {
  try {
    localStorage.setItem(ASSET_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving asset cache:', error);
  }
}

/**
 * Get image dimensions from data URL
 * @param {string} dataUrl - Base64 data URL
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Add a new asset to the library
 * @param {Object} assetData - Asset data (name, dataUrl, type, tags)
 * @returns {Promise<Object>} The created asset object
 */
export async function addAsset(assetData: AssetData): Promise<Asset> {
  const { name, dataUrl, type, tags = [] } = assetData;
  
  const dimensions = await getImageDimensions(dataUrl);
  
  const size = Math.round((dataUrl.length * 3) / 4);
  
  const asset: Asset = {
    id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    dataUrl,
    type,
    size,
    width: dimensions.width,
    height: dimensions.height,
    tags: tags.map(tag => tag.toLowerCase().trim()),
    uploadDate: Date.now(),
    lastUsed: Date.now(),
    usageCount: 0
  };
  
  const assets = getAllAssets();
  assets.push(asset);
  saveAssets(assets);
  
  updateAssetCache(asset.id);
  
  return asset;
}

/**
 * Get asset by ID
 * @param {string} assetId - Asset ID
 * @returns {Object|null} Asset object or null if not found
 */
export function getAssetById(assetId: string): Asset | null {
  const assets = getAllAssets();
  const asset = assets.find(a => a.id === assetId);
  
  if (asset) {
    updateAssetUsage(assetId);
  }
  
  return asset || null;
}

/**
 * Update asset usage statistics
 * @param {string} assetId - Asset ID
 */
function updateAssetUsage(assetId: string): void {
  const assets = getAllAssets();
  const assetIndex = assets.findIndex(a => a.id === assetId);
  
  if (assetIndex !== -1) {
    assets[assetIndex].lastUsed = Date.now();
    assets[assetIndex].usageCount = (assets[assetIndex].usageCount || 0) + 1;
    saveAssets(assets);
    updateAssetCache(assetId);
  }
}

/**
 * Update asset cache with frequently used assets
 * @param {string} assetId - Asset ID to add to cache
 */
function updateAssetCache(assetId: string): void {
  const cache = getAssetCache();
  cache[assetId] = Date.now();
  
  const cacheEntries = Object.entries(cache)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_CACHE_SIZE);
  
  const newCache = Object.fromEntries(cacheEntries);
  saveAssetCache(newCache);
}

/**
 * Get frequently used assets (from cache)
 * @returns {Array} Array of cached asset objects
 */
export function getCachedAssets(): Asset[] {
  const cache = getAssetCache();
  const cachedIds = Object.keys(cache);
  const assets = getAllAssets();
  
  return assets
    .filter(asset => cachedIds.includes(asset.id))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
}

// Async: get all assets, preferring localStorage but falling back to IndexedDB
export async function getAllAssetsAsync(): Promise<Asset[]> {
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // fallback to IndexedDB
    const idbAssets = await assetDB.getAllAssetsFromIDB();
    return idbAssets;
  } catch (err) {
    console.error('[assetManager] getAllAssetsAsync failed', err);
    return [];
  }
}

export async function getCachedAssetsAsync(): Promise<Asset[]> {
  try {
    const cache = getAssetCache();
    const cachedIds = Object.keys(cache);
    const assets = await getAllAssetsAsync();
    return assets
      .filter(asset => cachedIds.includes(asset.id))
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  } catch (err) {
    console.error('[assetManager] getCachedAssetsAsync failed', err);
    return [];
  }
}

export async function searchAssetsAsync(criteria: SearchCriteria = {}): Promise<Asset[]> {
  try {
    const { query = '', tags = [], sortBy = 'uploadDate', sortOrder = 'desc' } = criteria;
    const assets = await getAllAssetsAsync();
    let results = assets;

    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(asset => asset.name.toLowerCase().includes(searchTerm));
    }

    if (tags.length > 0) {
      const searchTags = tags.map(tag => tag.toLowerCase().trim());
      results = results.filter(asset => searchTags.some(tag => asset.tags.includes(tag)));
    }

    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'uploadDate': comparison = a.uploadDate - b.uploadDate; break;
        case 'lastUsed': comparison = (a.lastUsed || 0) - (b.lastUsed || 0); break;
        case 'usageCount': comparison = (a.usageCount || 0) - (b.usageCount || 0); break;
        case 'size': comparison = a.size - b.size; break;
        default: comparison = a.uploadDate - b.uploadDate;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  } catch (err) {
    console.error('[assetManager] searchAssetsAsync failed', err);
    return [];
  }
}

/**
 * Search assets by name, tags, or other criteria
 * @param {Object} criteria - Search criteria
 * @returns {Array} Filtered array of assets
 */
export function searchAssets(criteria: SearchCriteria = {}): Asset[] {
  const { query = '', tags = [], sortBy = 'uploadDate', sortOrder = 'desc' } = criteria;
  let assets = getAllAssets();
  
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    assets = assets.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm)
    );
  }
  
  if (tags.length > 0) {
    const searchTags = tags.map(tag => tag.toLowerCase().trim());
    assets = assets.filter(asset => 
      searchTags.some(tag => asset.tags.includes(tag))
    );
  }
  
  assets.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'uploadDate':
        comparison = a.uploadDate - b.uploadDate;
        break;
      case 'lastUsed':
        comparison = (a.lastUsed || 0) - (b.lastUsed || 0);
        break;
      case 'usageCount':
        comparison = (a.usageCount || 0) - (b.usageCount || 0);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      default:
        comparison = a.uploadDate - b.uploadDate;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  return assets;
}

/**
 * Update asset metadata (name, tags)
 * @param {string} assetId - Asset ID
 * @param {Object} updates - Object with fields to update
 * @returns {Object|null} Updated asset or null if not found
 */
export function updateAsset(assetId: string, updates: Partial<Pick<Asset, 'name' | 'tags'>>): Asset | null {
  const assets = getAllAssets();
  const assetIndex = assets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) return null;
  
  const allowedFields = ['name', 'tags'] as const;
  const safeUpdates: Partial<Asset> = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === 'tags') {
        // Ensure tags is always an array of strings
        const tagsValue = updates[field];
        if (Array.isArray(tagsValue)) {
          safeUpdates.tags = tagsValue.map(tag => tag.toLowerCase().trim());
        }
      } else if (field === 'name') {
        if (typeof updates[field] === 'string') {
          safeUpdates.name = updates[field] as string;
        }
      }
    }
  }
  
  assets[assetIndex] = { ...assets[assetIndex], ...safeUpdates };
  saveAssets(assets);
  
  return assets[assetIndex];
}

/**
 * Delete asset by ID
 * @param {string} assetId - Asset ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteAsset(assetId: string): boolean {
  const assets = getAllAssets();
  const filteredAssets = assets.filter(a => a.id !== assetId);
  
  if (filteredAssets.length === assets.length) {
    return false;
  }
  
  saveAssets(filteredAssets);
  
  const cache = getAssetCache();
  delete cache[assetId];
  saveAssetCache(cache);
  
  return true;
}

/**
 * Get all unique tags from assets
 * @returns {Array} Array of unique tag strings
 */
export function getAllTags(): string[] {
  const assets = getAllAssets();
  const tagSet = new Set<string>();
  
  assets.forEach(asset => {
    asset.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get asset statistics
 * @returns {Object} Statistics object
 */
export function getAssetStats(): AssetStats {
  const assets = getAllAssets();
  
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  const totalCount = assets.length;
  const uniqueTags = getAllTags().length;
  
  return {
    totalCount,
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    uniqueTags,
    mostUsed: assets.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0] || null
  };
}

/**
 * Clean up old unused assets (for storage management)
 * Removes assets that haven't been used in 90 days and have low usage count
 */
function cleanupOldAssets(): void {
  const assets = getAllAssets();
  const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
  
  const filteredAssets = assets.filter(asset => {
    const isRecent = asset.lastUsed > ninetyDaysAgo;
    const isFrequentlyUsed = (asset.usageCount || 0) >= 3;
    return isRecent || isFrequentlyUsed;
  });
  
  saveAssets(filteredAssets);
  
  console.log(`Cleaned up ${assets.length - filteredAssets.length} old assets`);
}

/**
 * Aggressive cleanup when quota is exceeded
 * Keeps only the most recent 10 or most frequently used assets
 * @param {Array} assets - Array of asset objects
 * @returns {Array} Filtered assets array
 */
function aggressiveCleanup(assets: Asset[]): Asset[] {
  // Sort by combined score: recent usage and usage count
  const scoredAssets = assets.map(asset => ({
    asset,
    score: (asset.usageCount || 0) * 2 + (Date.now() - asset.lastUsed < 7 * 24 * 60 * 60 * 1000 ? 10 : 0)
  }));
  
  // Sort by score descending and keep top 10
  scoredAssets.sort((a, b) => b.score - a.score);
  const kept = scoredAssets.slice(0, 10).map(s => s.asset);
  
  return kept;
}

/**
 * Clear all assets (use with caution)
 */
export function clearAllAssets(): void {
  localStorage.removeItem(ASSETS_STORAGE_KEY);
  localStorage.removeItem(ASSET_CACHE_KEY);
}

/**
 * Export assets as JSON
 * @returns {string} JSON string of all assets
 */
export function exportAssets(): string {
  const assets = getAllAssets();
  return JSON.stringify(assets, null, 2);
}

/**
 * Import assets from JSON
 * @param {string} jsonData - JSON string of assets
 * @param {boolean} merge - If true, merge with existing assets; if false, replace
 * @returns {number} Number of assets imported
 */
export function importAssets(jsonData: string, merge: boolean = true): number {
  try {
    const importedAssets = JSON.parse(jsonData);
    
    if (!Array.isArray(importedAssets)) {
      throw new Error('Invalid assets data format');
    }
    
    const existingAssets = merge ? getAllAssets() : [];
    
    const existingIds = new Set(existingAssets.map(a => a.id));
    const newAssets = importedAssets.filter((asset: Asset) => !existingIds.has(asset.id));
    
    const finalAssets = [...existingAssets, ...newAssets];
    saveAssets(finalAssets);
    
    return newAssets.length;
  } catch (error) {
    console.error('Error importing assets:', error);
    return 0;
  }
}

