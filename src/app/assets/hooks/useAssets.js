// Hook for managing assets
import { useState, useEffect, useCallback } from 'react';
import assetsService from '../api/assetsService';

/**
 * Hook for managing assets (images, audio, etc.)
 */
export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await assetsService.list({ page: 1, limit: 1000 });
      setAssets(result.data);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAsset = useCallback(async (assetData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newAsset = await assetsService.upload(assetData);
      setAssets(prev => [...prev, newAsset]);
      return newAsset;
    } catch (err) {
      console.error('Error uploading asset:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAsset = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await assetsService.delete(id);
      setAssets(prev => prev.filter(asset => asset.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAssetsByType = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtered = await assetsService.getByType(type);
      return filtered;
    } catch (err) {
      console.error('Error filtering assets:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAssets = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await assetsService.search(query);
      return results;
    } catch (err) {
      console.error('Error searching assets:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    loading,
    error,
    loadAssets,
    uploadAsset,
    deleteAsset,
    getAssetsByType,
    searchAssets,
  };
};

export default useAssets;
