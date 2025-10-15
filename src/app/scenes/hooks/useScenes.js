// Hook for managing scenes state
import { useState, useEffect, useCallback } from 'react';
import scenesService from '../api/scenesService';
import sampleStory from '../../../data/scenes';

/**
 * Hook for managing scenes
 * Provides CRUD operations and state management for scenes
 */
export const useScenes = () => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load scenes on mount
  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      
      // If no scenes exist, initialize with sample story
      if (result.data.length === 0) {
        const initialScenes = sampleStory || [];
        await scenesService.bulkUpdate(initialScenes);
        setScenes(initialScenes);
      } else {
        setScenes(result.data);
      }
    } catch (err) {
      console.error('Error loading scenes:', err);
      setError(err.message);
      setScenes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createScene = useCallback(async (sceneData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const newScene = await scenesService.create(sceneData);
      setScenes(prev => [...prev, newScene]);
      return newScene;
    } catch (err) {
      console.error('Error creating scene:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScene = useCallback(async (id, sceneData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedScene = await scenesService.update(id, sceneData);
      setScenes(prev => 
        prev.map(scene => scene.id === id ? updatedScene : scene)
      );
      return updatedScene;
    } catch (err) {
      console.error('Error updating scene:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteScene = useCallback(async (id) => {
    if (scenes.length <= 1) {
      throw new Error('Vous devez avoir au moins une scène');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await scenesService.delete(id);
      setScenes(prev => prev.filter(scene => scene.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting scene:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [scenes.length]);

  const duplicateScene = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const duplicated = await scenesService.duplicate(id);
      const index = scenes.findIndex(s => s.id === id);
      
      setScenes(prev => {
        const newScenes = [...prev];
        newScenes.splice(index + 1, 0, duplicated);
        return newScenes;
      });
      
      return duplicated;
    } catch (err) {
      console.error('Error duplicating scene:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [scenes]);

  const reorderScenes = useCallback(async (sceneIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const reordered = await scenesService.reorder(sceneIds);
      setScenes(reordered);
      return reordered;
    } catch (err) {
      console.error('Error reordering scenes:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveScene = useCallback((index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return;
    }
    
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    
    setScenes(newScenes);
    
    // Persist reordering in background
    const sceneIds = newScenes.map(s => s.id);
    scenesService.reorder(sceneIds).catch(err => {
      console.error('Error persisting scene order:', err);
    });
  }, [scenes]);

  return {
    scenes,
    loading,
    error,
    loadScenes,
    createScene,
    updateScene,
    deleteScene,
    duplicateScene,
    reorderScenes,
    moveScene,
  };
};

export default useScenes;
