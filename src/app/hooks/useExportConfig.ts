import { useCallback } from 'react';
import { Scene } from '../scenes';

export function useExportConfig(scenes: Scene[]) {
  // Exporte la configuration complète avec images caméras
  const handleExportConfig = useCallback(async () => {
    try {
      const { exportAllCameras } = await import('../../utils/cameraExporter');
      const enhancedScenes = await Promise.all(scenes.map(async (scene: Scene) => {
        if (scene.sceneCameras && scene.sceneCameras.length > 0) {
          try {
            const cameraExports = await exportAllCameras(scene, 1920, 1080);
            const sceneCamerasWithImages = scene.sceneCameras.map((camera: any) => {
              const cameraExport = cameraExports.find((exp: any) => exp.camera.id === camera.id);
              return {
                ...camera,
                exportedImageDataUrl: cameraExport ? cameraExport.imageDataUrl : null,
                pixelPosition: cameraExport?.camera?.pixelPosition || cameraExport?.config?.pixelPosition || null,
                topLeftPixelPosition: cameraExport?.camera?.topLeftPixelPosition || cameraExport?.config?.topLeftPixelPosition || null
              };
            });
            return {
              ...scene,
              sceneCameras: sceneCamerasWithImages
            };
          } catch (err) {
            console.error('Error exporting cameras for scene:', scene.id, err);
            return scene;
          }
        }
        return scene;
      }));
      const config = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        scenes: enhancedScenes,
        metadata: {
          sceneCount: scenes.length,
          totalDuration: scenes.reduce((sum: number, s: Scene) => sum + s.duration, 0),
          includesCameraImages: true
        }
      };
      const jsonString = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whiteboard-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Configuration exportée avec succès avec les images des caméras!');
    } catch (error: any) {
      console.error('Error exporting config:', error);
      alert('Erreur lors de l\'export: ' + error.message);
    }
  }, [scenes]);

  return { handleExportConfig };
}
