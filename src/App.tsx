import React, { useState, useEffect, useRef } from 'react';
import { AnimationContainer, ScenePanel, ShapeToolbar, AssetLibrary } from './components/organisms';
import HandWritingTest from './pages/HandWritingTest';
import ShadcnDemo from './components/ShadcnDemo';
import { useScenes, useScenesActions, Scene, Layer } from './app/scenes';
import { MAX_HISTORY_STATES } from './config/constants';

interface AssetData {
  dataUrl: string;
  name: string;
  [key: string]: any;
}

function App() {
  const { scenes, loading } = useScenes();
  const {
    createScene,
    updateScene: updateSceneAction,
    deleteScene: deleteSceneAction,
    duplicateScene: duplicateSceneAction,
  } = useScenesActions();

  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [showHandWritingTest, setShowHandWritingTest] = useState(false);
  const [showShadcnDemo, setShowShadcnDemo] = useState(false);
  const [showShapeToolbar, setShowShapeToolbar] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [history, setHistory] = useState<Scene[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  useEffect(() => {
    if (!isUndoRedoAction.current && scenes.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(scenes)));
      
      if (newHistory.length > MAX_HISTORY_STATES) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }
      setHistory(newHistory);
    }
    isUndoRedoAction.current = false;
  }, [scenes]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex - 1);
      console.log('Undo not yet implemented with new architecture');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex + 1);
      console.log('Redo not yet implemented with new architecture');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowShadcnDemo(!showShadcnDemo);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, showShadcnDemo]);

  const addScene = async () => {
    try {
      await createScene();
      setSelectedSceneIndex(scenes.length);
    } catch (error: any) {
      alert('Erreur lors de la création de la scène: ' + error.message);
    }
  };

  const deleteScene = async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;

    try {
      await deleteSceneAction(sceneId);
      if (selectedSceneIndex >= scenes.length - 1) {
        setSelectedSceneIndex(Math.max(0, scenes.length - 2));
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const duplicateScene = async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;

    try {
      await duplicateSceneAction(sceneId);
    } catch (error: any) {
      alert('Erreur lors de la duplication: ' + error.message);
    }
  };

  const updateScene = async (index: number, updatedScene: Partial<Scene>) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;

    try {
      await updateSceneAction({ id: sceneId, data: updatedScene });
    } catch (error) {
      console.error('Error updating scene:', error);
    }
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return;
    }
    
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    
    setSelectedSceneIndex(targetIndex);
  };

  const handleSelectAssetFromLibrary = (asset: AssetData) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    const newLayer: Partial<Layer> = {
      id: `layer-${Date.now()}`,
      image_path: asset.dataUrl,
      name: asset.name,
      position: { x: 100, y: 100 },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 10,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw' as any,
      type: 'image' as any,
    };

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer as Layer],
    });
  };

  const handleAddShape = (shapeLayer: Layer) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), shapeLayer],
    });
    setShowShapeToolbar(false);
  };

  const handleExportConfig = async () => {
    try {
      const { exportAllCameras } = await import('./utils/cameraExporter');
      
      const enhancedScenes = await Promise.all(scenes.map(async (scene) => {
        if (scene.sceneCameras && scene.sceneCameras.length > 0) {
          try {
            const cameraExports = await exportAllCameras(scene, 1920, 1080);
            
            const sceneCamerasWithImages = scene.sceneCameras.map(camera => {
              const cameraExport = cameraExports.find(exp => exp.camera.id === camera.id);
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
          totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
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
  };

  const handleImportConfig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (config.scenes && Array.isArray(config.scenes)) {
          const scenesService = (await import('./app/scenes')).scenesService;
          await scenesService.bulkUpdate(config.scenes);
          window.location.reload();
        } else {
          alert('Format de fichier invalide. Le fichier doit contenir un tableau "scenes".');
        }
      } catch (error: any) {
        alert('Erreur lors de la lecture du fichier JSON: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  if (showHandWritingTest) {
    return <HandWritingTest onBack={() => setShowHandWritingTest(false)} />;
  }

  if (showShadcnDemo) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowShadcnDemo(false)}
          className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          ← Retour à l'application
        </button>
        <ShadcnDemo />
      </div>
    );
  }

  if (loading && scenes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des scènes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app flex h-screen overflow-hidden bg-white">
      {/* Floating Demo Button */}
      <button
        onClick={() => setShowShadcnDemo(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        title="Voir la démo shadcn/ui (Ctrl+Shift+D)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium">Démo UI</span>
      </button>

      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}

      {showAssetLibrary && (
        <AssetLibrary
          onClose={() => setShowAssetLibrary(false)}
          onSelectAsset={handleSelectAssetFromLibrary}
        />
      )}

      <ScenePanel
        scenes={scenes}
        selectedSceneIndex={selectedSceneIndex}
        onSelectScene={setSelectedSceneIndex}
        onAddScene={addScene}
        onDeleteScene={deleteScene}
        onDuplicateScene={duplicateScene}
        onMoveScene={moveScene}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AnimationContainer 
          scenes={scenes} 
          selectedSceneIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
          updateScene={updateScene}
          onOpenShapeToolbar={() => setShowShapeToolbar(true)}
        />
      </div>
    </div>
  );
}

export default App;
