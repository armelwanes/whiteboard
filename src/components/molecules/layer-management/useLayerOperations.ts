import { useCallback } from 'react';

export const useLayerOperations = () => {
  
  const deleteLayer = useCallback((scene: any, layerId: string) => {
    const updatedLayers = scene.layers.filter((l: any) => l.id !== layerId);
    return { ...scene, layers: updatedLayers };
  }, []);

  const duplicateLayer = useCallback((scene: any, layerId: string) => {
    const layerToDuplicate = scene.layers.find((l: any) => l.id === layerId);
    if (!layerToDuplicate) return scene;

    const newLayer = {
      ...layerToDuplicate,
      id: `layer-${Date.now()}`,
      name: `${layerToDuplicate.name || 'Layer'} (copie)`,
      z_index: (layerToDuplicate.z_index || 0) + 1
    };

    return {
      ...scene,
      layers: [...scene.layers, newLayer]
    };
  }, []);

  const moveLayer = useCallback((scene: any, layerId: string, direction: 'up' | 'down') => {
    const layerIndex = scene.layers.findIndex((l: any) => l.id === layerId);
    if (layerIndex === -1) return scene;

    const sortedLayers = [...scene.layers].sort((a: any, b: any) =>
      (a.z_index || 0) - (b.z_index || 0)
    );
    const sortedIndex = sortedLayers.findIndex((l: any) => l.id === layerId);

    if (direction === 'up' && sortedIndex > 0) {
      const temp = sortedLayers[sortedIndex].z_index;
      sortedLayers[sortedIndex].z_index = sortedLayers[sortedIndex - 1].z_index;
      sortedLayers[sortedIndex - 1].z_index = temp;
    } else if (direction === 'down' && sortedIndex < sortedLayers.length - 1) {
      const temp = sortedLayers[sortedIndex].z_index;
      sortedLayers[sortedIndex].z_index = sortedLayers[sortedIndex + 1].z_index;
      sortedLayers[sortedIndex + 1].z_index = temp;
    }

    return { ...scene, layers: sortedLayers };
  }, []);

  const updateLayer = useCallback((scene: any, updatedLayer: any) => {
    const updatedLayers = scene.layers.map((l: any) =>
      l.id === updatedLayer.id ? updatedLayer : l
    );
    return { ...scene, layers: updatedLayers };
  }, []);

  return {
    deleteLayer,
    duplicateLayer,
    moveLayer,
    updateLayer
  };
};
