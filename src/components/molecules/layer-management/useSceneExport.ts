import { useCallback } from 'react';
import { 
  exportSceneImage, 
  downloadSceneImage 
} from '../../../utils/sceneExporter';
import { 
  exportDefaultCameraView, 
  exportAllCameras, 
  downloadImage 
} from '../../../utils/cameraExporter';
import { 
  exportLayerFromJSON, 
  downloadDataUrl, 
  validateLayerJSON 
} from '../../../utils/layerExporter';

export const useSceneExport = (sceneWidth = 1920, sceneHeight = 1080) => {
  
  const exportScene = useCallback(async (scene: any) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      const dataUrl = await exportSceneImage(scene, {
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
      });
      
      const filename = `scene-${scene.id}-complete-${timestamp}.png`;
      downloadSceneImage(dataUrl, filename);
      alert('Scène exportée avec succès!');
    } catch (error: any) {
      console.error('Error exporting scene:', error);
      alert('Erreur lors de l\'export de la scène: ' + error.message);
    }
  }, [sceneWidth, sceneHeight]);

  const exportDefaultCamera = useCallback(async (scene: any) => {
    try {
      const result = await exportDefaultCameraView(scene, sceneWidth, sceneHeight);
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (result.configOnly) {
        const configJson = JSON.stringify(result.config, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scene-${scene.id}-default-camera-config-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Configuration de la caméra par défaut exportée (JSON uniquement - caméra en position par défaut)');
      } else {
        downloadImage(result.imageDataUrl, `scene-${scene.id}-default-camera-${timestamp}.png`);
        alert('Vue caméra par défaut exportée avec succès!');
      }
    } catch (error: any) {
      console.error('Error exporting default camera:', error);
      alert('Erreur lors de l\'export de la caméra par défaut: ' + error.message);
    }
  }, [sceneWidth, sceneHeight]);

  const exportAllCamerasFunc = useCallback(async (scene: any) => {
    try {
      const exports = await exportAllCameras(scene, sceneWidth, sceneHeight);
      const timestamp = new Date().toISOString().split('T')[0];
      let imageCount = 0;
      let configCount = 0;
      
      exports.forEach((exp: any, index: number) => {
        const cameraName = exp.camera.name || `camera-${index}`;
        
        if (exp.configOnly) {
          const configJson = JSON.stringify(exp.config, null, 2);
          const blob = new Blob([configJson], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scene-${scene.id}-${cameraName}-config-${timestamp}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          configCount++;
        } else {
          const filename = `scene-${scene.id}-${cameraName}-${timestamp}.png`;
          downloadImage(exp.imageDataUrl, filename);
          imageCount++;
        }
      });
      
      alert(`${exports.length} caméra(s) exportée(s): ${imageCount} image(s), ${configCount} config(s) JSON (caméras par défaut)`);
    } catch (error: any) {
      console.error('Error exporting cameras:', error);
      alert('Erreur lors de l\'export des caméras: ' + error.message);
    }
  }, [sceneWidth, sceneHeight]);

  const exportLayer = useCallback(async (scene: any, layerId: string) => {
    const layer = scene.layers.find((l: any) => l.id === layerId);
    if (!layer) {
      alert('Couche non trouvée');
      return;
    }

    const validation = validateLayerJSON(layer);
    if (!validation.valid) {
      alert(`Couche invalide: ${validation.errors.join(', ')}`);
      return;
    }

    const cameras = scene.sceneCameras || [];
    const defaultCamera = cameras.find((cam: any) => cam.isDefault) || {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true
    };

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const dataUrl = await exportLayerFromJSON(layer, {
        camera: defaultCamera,
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
        sceneBackgroundImage: scene.backgroundImage,
      });
      
      const filename = `scene-${scene.id}-layer-${layer.name || layer.id}-${timestamp}.png`;
      downloadDataUrl(dataUrl, filename);
    } catch (error: any) {
      console.error('Error exporting layer:', error);
      alert(`Erreur lors de l'export de la couche: ${error.message}`);
    }
  }, [sceneWidth, sceneHeight]);

  const exportAllLayers = useCallback(async (scene: any) => {
    if (scene.layers.length === 0) {
      alert('Aucune couche à exporter');
      return;
    }

    const cameras = scene.sceneCameras || [];
    const defaultCamera = cameras.find((cam: any) => cam.isDefault) || {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true
    };

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      let successCount = 0;
      let errorCount = 0;

      for (const layer of scene.layers) {
        try {
          const validation = validateLayerJSON(layer);
          if (!validation.valid) {
            console.warn(`Skipping invalid layer ${layer.id}:`, validation.errors);
            errorCount++;
            continue;
          }

          const dataUrl = await exportLayerFromJSON(layer, {
            camera: defaultCamera,
            sceneWidth: sceneWidth,
            sceneHeight: sceneHeight,
            background: '#FFFFFF',
            pixelRatio: 1,
            sceneBackgroundImage: scene.backgroundImage,
          });
          
          const filename = `scene-${scene.id}-layer-${layer.name || layer.id}-${timestamp}.png`;
          downloadDataUrl(dataUrl, filename);
          successCount++;
        } catch (error) {
          console.error(`Error exporting layer ${layer.id}:`, error);
          errorCount++;
        }
      }

      alert(`Export terminé: ${successCount} couche(s) exportée(s), ${errorCount} erreur(s)`);
    } catch (error: any) {
      console.error('Error during batch export:', error);
      alert(`Erreur lors de l'export: ${error.message}`);
    }
  }, [sceneWidth, sceneHeight]);

  const exportLayerFullScene = useCallback(async (scene: any, layerId: string) => {
    const layer = scene.layers.find((l: any) => l.id === layerId);
    if (!layer) {
      alert('Couche non trouvée');
      return;
    }

    const validation = validateLayerJSON(layer);
    if (!validation.valid) {
      alert(`Couche invalide: ${validation.errors.join(', ')}`);
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const dataUrl = await exportLayerFromJSON(layer, {
        useFullScene: true,
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
        sceneBackgroundImage: scene.backgroundImage,
      });
      
      const filename = `scene-${scene.id}-layer-${layer.name || layer.id}-fullscene-${timestamp}.png`;
      downloadDataUrl(dataUrl, filename);
      alert(`Couche "${layer.name || layer.id}" exportée avec dimensions complètes de la scène!`);
    } catch (error: any) {
      console.error('Error exporting layer with full scene:', error);
      alert(`Erreur lors de l'export de la couche: ${error.message}`);
    }
  }, [sceneWidth, sceneHeight]);

  return {
    exportScene,
    exportDefaultCamera,
    exportAllCameras: exportAllCamerasFunc,
    exportLayer,
    exportAllLayers,
    exportLayerFullScene
  };
};
