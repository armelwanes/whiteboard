/**
 * Asset Manager - Centralized system for managing uploaded images and resources
 * Provides asset storage, tagging, search, and caching capabilities
 */

const ASSETS_STORAGE_KEY = 'whiteboard-assets';
const ASSET_CACHE_KEY = 'whiteboard-asset-cache';
const MAX_CACHE_SIZE = 50; // Maximum number of cached assets

/**
 * Asset structure:
 * {
 *   id: string (unique identifier)
 *   name: string (asset name)
 *   dataUrl: string (base64 data URL)
 *   type: string (image/png, image/jpeg, etc.)
 *   size: number (file size in bytes)
 *   width: number (image width in pixels)
 *   height: number (image height in pixels)
 *   tags: string[] (array of tags)
 *   uploadDate: number (timestamp)
 *   lastUsed: number (timestamp, for caching)
 *   usageCount: number (how many times used)
 * }
 */

/**
 * Get all assets from storage
 * @returns {Array} Array of asset objects
 */
export function getAllAssets() {
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading assets:', error);
    return [];
  }
}

/**
 * Save assets to storage
 * @param {Array} assets - Array of asset objects
 */
function saveAssets(assets) {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  } catch (error) {
    console.error('Error saving assets:', error);
    // If quota exceeded, try to free up space
    if (error.name === 'QuotaExceededError') {
      cleanupOldAssets();
      // Try again
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
      } catch (retryError) {
        console.error('Failed to save assets after cleanup:', retryError);
      }
    }
  }
}

/**
 * Get asset cache (frequently used assets)
 * @returns {Object} Cache object with asset IDs as keys
 */
function getAssetCache() {
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
function saveAssetCache(cache) {
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
function getImageDimensions(dataUrl) {
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
export async function addAsset(assetData) {
  const { name, dataUrl, type, tags = [] } = assetData;
  
  // Get image dimensions
  const dimensions = await getImageDimensions(dataUrl);
  
  // Calculate approximate size (base64 data size)
  const size = Math.round((dataUrl.length * 3) / 4);
  
  const asset = {
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
  
  // Add to cache if it's a new upload
  updateAssetCache(asset.id);
  
  return asset;
}

/**
 * Get asset by ID
 * @param {string} assetId - Asset ID
 * @returns {Object|null} Asset object or null if not found
 */
export function getAssetById(assetId) {
  const assets = getAllAssets();
  const asset = assets.find(a => a.id === assetId);
  
  if (asset) {
    // Update usage stats
    updateAssetUsage(assetId);
  }
  
  return asset || null;
}

/**
 * Update asset usage statistics
 * @param {string} assetId - Asset ID
 */
function updateAssetUsage(assetId) {
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
function updateAssetCache(assetId) {
  const cache = getAssetCache();
  cache[assetId] = Date.now();
  
  // Keep only top MAX_CACHE_SIZE most recently used
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
export function getCachedAssets() {
  const cache = getAssetCache();
  const cachedIds = Object.keys(cache);
  const assets = getAllAssets();
  
  return assets
    .filter(asset => cachedIds.includes(asset.id))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
}

/**
 * Search assets by name, tags, or other criteria
 * @param {Object} criteria - Search criteria
 * @returns {Array} Filtered array of assets
 */
export function searchAssets(criteria = {}) {
  const { query = '', tags = [], sortBy = 'uploadDate', sortOrder = 'desc' } = criteria;
  let assets = getAllAssets();
  
  // Filter by query (name search)
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    assets = assets.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by tags
  if (tags.length > 0) {
    const searchTags = tags.map(tag => tag.toLowerCase().trim());
    assets = assets.filter(asset => 
      searchTags.some(tag => asset.tags.includes(tag))
    );
  }
  
  // Sort assets
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
export function updateAsset(assetId, updates) {
  const assets = getAllAssets();
  const assetIndex = assets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) return null;
  
  // Only allow updating certain fields
  const allowedFields = ['name', 'tags'];
  const safeUpdates = {};
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = field === 'tags' 
        ? updates[field].map(tag => tag.toLowerCase().trim())
        : updates[field];
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
export function deleteAsset(assetId) {
  const assets = getAllAssets();
  const filteredAssets = assets.filter(a => a.id !== assetId);
  
  if (filteredAssets.length === assets.length) {
    return false; // Asset not found
  }
  
  saveAssets(filteredAssets);
  
  // Remove from cache
  const cache = getAssetCache();
  delete cache[assetId];
  saveAssetCache(cache);
  
  return true;
}

/**
 * Get all unique tags from assets
 * @returns {Array} Array of unique tag strings
 */
export function getAllTags() {
  const assets = getAllAssets();
  const tagSet = new Set();
  
  assets.forEach(asset => {
    asset.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get asset statistics
 * @returns {Object} Statistics object
 */
export function getAssetStats() {
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
function cleanupOldAssets() {
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
 * Clear all assets (use with caution)
 */
export function clearAllAssets() {
  localStorage.removeItem(ASSETS_STORAGE_KEY);
  localStorage.removeItem(ASSET_CACHE_KEY);
}

/**
 * Export assets as JSON
 * @returns {string} JSON string of all assets
 */
export function exportAssets() {
  const assets = getAllAssets();
  return JSON.stringify(assets, null, 2);
}

/**
 * Import assets from JSON
 * @param {string} jsonData - JSON string of assets
 * @param {boolean} merge - If true, merge with existing assets; if false, replace
 * @returns {number} Number of assets imported
 */
export function importAssets(jsonData, merge = true) {
  try {
    const importedAssets = JSON.parse(jsonData);
    
    if (!Array.isArray(importedAssets)) {
      throw new Error('Invalid assets data format');
    }
    
    let existingAssets = merge ? getAllAssets() : [];
    
    // Filter out duplicates and add new assets
    const existingIds = new Set(existingAssets.map(a => a.id));
    const newAssets = importedAssets.filter(asset => !existingIds.has(asset.id));
    
    const finalAssets = [...existingAssets, ...newAssets];
    saveAssets(finalAssets);
    
    return newAssets.length;
  } catch (error) {
    console.error('Error importing assets:', error);
    return 0;
  }
}
