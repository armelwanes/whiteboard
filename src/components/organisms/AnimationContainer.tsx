import React, { useState, useEffect, useRef } from 'react';
import Scene from '../Scene';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import { ImageCropModal } from '../molecules';
import { createTimeline } from '../../utils/timelineSystem';
import ScenePanel from './ScenePanel';
import { addAsset } from '../../utils/assetManager';

interface AnimationContainerProps {
  scenes?: any[];
  updateScene: (sceneIndex: number, updates: any) => void;
  selectedSceneIndex?: number;
  setSelectedSceneIndex: (index: number) => void;
  onSelectScene: (index: number) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onDuplicateScene: (index: number) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onExportConfig: () => void;
  onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnimationContainer: React.FC<AnimationContainerProps> = ({ scenes = [], updateScene, selectedSceneIndex = 0, setSelectedSceneIndex, onSelectScene, onAddScene, onDeleteScene, onDuplicateScene, onMoveScene, onExportConfig, onImportConfig }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showShapeToolbar, setShowShapeToolbar] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<any>(null);
  const [globalTimeline, setGlobalTimeline] = useState(() => {
    // Initialize with empty timeline
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    return createTimeline(totalDuration, 30);
  });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate total duration
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  // Update timeline duration when scenes change
  useEffect(() => {
    setGlobalTimeline(prev => ({
      ...prev,
      duration: totalDuration,
    }));
  }, [totalDuration]);

  // Determine current scene based on time
  useEffect(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulatedTime += scenes[i].duration;
      if (currentTime < accumulatedTime) {
        setCurrentSceneIndex(i);
        break;
      }
    }
    if (currentTime >= totalDuration) {
      setCurrentSceneIndex(scenes.length - 1);
    }
  }, [currentTime, scenes, totalDuration]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime(prevTime => {
          const newTime = prevTime + deltaTime;
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return newTime;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      lastTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const originalImageUrl = event.target?.result as string;
      
      // Store pending image data with file name and original URL
      setPendingImageData({
        imageUrl: originalImageUrl,
        fileName: file.name,
        originalUrl: originalImageUrl,
        fileType: file.type
      });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  };

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions: any) => {
    if (!pendingImageData) return;

    // Save ORIGINAL (uncropped) image to asset library
    try {
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: pendingImageData.originalUrl,
        type: pendingImageData.fileType,
        tags: []
      });
    } catch (error) {
      console.error('Error saving asset to library:', error);
    }

    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    const sceneWidth = 800;
    const sceneHeight = 600;
    
    // Calculate scale based on camera (80% default)
    let calculatedScale = 1.0;
    if (imageDimensions) {
      const maxWidth = sceneWidth * 0.64; // 80% of 800
      const maxHeight = sceneHeight * 0.64; // 80% of 600
      
      const scaleX = maxWidth / imageDimensions.width;
      const scaleY = maxHeight / imageDimensions.height;
      
      calculatedScale = Math.min(scaleX, scaleY, 1.0);
    }
    
    const scaledImageWidth = imageDimensions ? imageDimensions.width * calculatedScale : 0;
    const scaledImageHeight = imageDimensions ? imageDimensions.height * calculatedScale : 0;
    
    const initialX = (sceneWidth / 2) - (scaledImageWidth / 2);
    const initialY = (sceneHeight / 2) - (scaledImageHeight / 2);

    const newLayer = {
      id: `layer-${Date.now()}`,
      image_path: croppedImageUrl,
      name: pendingImageData.fileName,
      position: { x: initialX, y: initialY },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 10,
      scale: calculatedScale,
      opacity: 1.0,
      mode: 'draw',
      type: 'image',
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    });
    setSelectedLayerId(newLayer.id);
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleSelectAssetFromLibrary = (asset: any) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    const newLayer = {
      id: `layer-${Date.now()}`,
      image_path: asset.dataUrl,
      name: asset.name,
      position: { x: 100, y: 100 },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 10,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw',
      type: 'image',
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    });
    setSelectedLayerId(newLayer.id);
    setShowAssetLibrary(false);
  };

  const handleAddText = () => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    const sceneWidth = 800;
    const sceneHeight = 600;
    const text = 'Votre texte ici';
    const fontSize = 48;

    const newLayer = {
      id: `layer-${Date.now()}`,
      name: 'Texte',
      position: { x: sceneWidth / 2 - 150, y: sceneHeight / 2 - 25 },
      z_index: (currentScene.layers?.length || 0) + 1,
      skip_rate: 12,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw',
      type: 'text',
      text_config: {
        text: text,
        font: 'Arial',
        size: fontSize,
        color: [0, 0, 0],
        style: 'normal',
        line_height: 1.2,
        align: 'left'
      },
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), newLayer]
    });
    setSelectedLayerId(newLayer.id);
  };

  const handleAddShape = (shapeLayer: any) => {
    const currentScene = scenes[selectedSceneIndex];
    if (!currentScene) return;

    const updatedShapeLayer = {
      ...shapeLayer,
      z_index: (currentScene.layers?.length || 0) + 1,
    };

    updateScene(selectedSceneIndex, {
      ...currentScene,
      layers: [...(currentScene.layers || []), updatedShapeLayer]
    });
    setSelectedLayerId(updatedShapeLayer.id);
    setShowShapeToolbar(false);
  };

  return (
    <div className="animation-container">
      {/* Asset Library Modal */}
      {showAssetLibrary && (
        <AssetLibrary
          onClose={() => setShowAssetLibrary(false)}
          onSelectAsset={handleSelectAssetFromLibrary}
        />
      )}

      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}

      {/* Image Crop Modal */}
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div className="grid grid-cols-12 gap-3 h-screen">
        {/* Zone 1 - Panneau de scènes (gauche) */}
        <div className="col-span-2 row-span-2 overflow-y-auto">

          <ScenePanel
            scenes={scenes}
            selectedSceneIndex={selectedSceneIndex}
            onSelectScene={setSelectedSceneIndex}
            onAddScene={onAddScene}
            onDeleteScene={onDeleteScene}
            onDuplicateScene={onDuplicateScene}
            onMoveScene={onMoveScene}
            onExportConfig={onExportConfig}
            onImportConfig={onImportConfig}
          />
        </div>

        {/* Zone 3 - Éditeur de calques (centre) */}
        <div className="col-span-8 row-span-2 overflow-y-auto">
          {scenes[selectedSceneIndex] && (
            <LayerEditor
              scene={scenes[selectedSceneIndex]}
              onSave={(updatedScene) => {
                updateScene(selectedSceneIndex, updatedScene);
              }}
              onClose={() => { }}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
            />
          )}
        </div>

        {/* Zone 4 - Panneau de propriétés (droite) */}
        <div className="col-span-2 row-span-2 overflow-y-auto">
          {scenes[selectedSceneIndex] && (
            <PropertiesPanel
              scene={scenes[selectedSceneIndex]}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateScene={(updates) => updateScene(selectedSceneIndex, updates)}
              onUpdateLayer={(updatedLayer: any) => {
                const currentScene = scenes[selectedSceneIndex];
                const updatedLayers = currentScene.layers.map((l: any) =>
                  l.id === updatedLayer.id ? updatedLayer : l
                );
                updateScene(selectedSceneIndex, { ...currentScene, layers: updatedLayers });
              }}
              onDeleteLayer={(layerId) => {
                const currentScene = scenes[selectedSceneIndex];
                const updatedLayers = currentScene.layers.filter((l: any) => l.id !== layerId);
                updateScene(selectedSceneIndex, { ...currentScene, layers: updatedLayers });
                if (selectedLayerId === layerId) {
                  setSelectedLayerId(null);
                }
              }}
              onDuplicateLayer={(layerId) => {
                const currentScene = scenes[selectedSceneIndex];
                const layerToDuplicate = currentScene.layers.find((l: any) => l.id === layerId);
                if (layerToDuplicate) {
                  const newLayer = {
                    ...layerToDuplicate,
                    id: `layer-${Date.now()}`,
                    name: `${layerToDuplicate.name || 'Layer'} (copie)`,
                    z_index: (layerToDuplicate.z_index || 0) + 1
                  };
                  updateScene(selectedSceneIndex, {
                    ...currentScene,
                    layers: [...currentScene.layers, newLayer]
                  });
                }
              }}
              onMoveLayer={(layerId, direction) => {
                const currentScene = scenes[selectedSceneIndex];
                const layerIndex = currentScene.layers.findIndex((l: any) => l.id === layerId);
                if (layerIndex === -1) return;

                const sortedLayers = [...currentScene.layers].sort((a: any, b: any) =>
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

                updateScene(selectedSceneIndex, { ...currentScene, layers: sortedLayers });
              }}
              onImageUpload={handleImageUpload}
              onOpenAssetLibrary={() => setShowAssetLibrary(true)}
              onAddText={handleAddText}
              onAddShape={() => setShowShapeToolbar(true)}
              fileInputRef={fileInputRef}
            />
          )}
        </div>

        {/* Zone 5 - Liste des calques (bas, toute la largeur) */}
        <div className="col-span-12 ">
          {scenes[selectedSceneIndex] && (
            <LayersList
              scene={scenes[selectedSceneIndex]}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onDeleteLayer={(layerId) => {
                const currentScene = scenes[selectedSceneIndex];
                const updatedLayers = currentScene.layers.filter(l => l.id !== layerId);
                updateScene(selectedSceneIndex, { ...currentScene, layers: updatedLayers });
                if (selectedLayerId === layerId) {
                  setSelectedLayerId(null);
                }
              }}
              onDuplicateLayer={(layerId) => {
                const currentScene = scenes[selectedSceneIndex];
                const layerToDuplicate = currentScene.layers.find(l => l.id === layerId);
                if (layerToDuplicate) {
                  const newLayer = {
                    ...layerToDuplicate,
                    id: `layer-${Date.now()}`,
                    name: `${layerToDuplicate.name || 'Layer'} (copie)`,
                    z_index: (layerToDuplicate.z_index || 0) + 1
                  };
                  updateScene(selectedSceneIndex, {
                    ...currentScene,
                    layers: [...currentScene.layers, newLayer]
                  });
                }
              }}
              onMoveLayer={(layerId, direction) => {
                const currentScene = scenes[selectedSceneIndex];
                const layerIndex = currentScene.layers.findIndex(l => l.id === layerId);
                if (layerIndex === -1) return;

                const sortedLayers = [...currentScene.layers].sort((a, b) =>
                  (a.z_index || 0) - (b.z_index || 0)
                );
                const sortedIndex = sortedLayers.findIndex(l => l.id === layerId);

                if (direction === 'up' && sortedIndex > 0) {
                  const temp = sortedLayers[sortedIndex].z_index;
                  sortedLayers[sortedIndex].z_index = sortedLayers[sortedIndex - 1].z_index;
                  sortedLayers[sortedIndex - 1].z_index = temp;
                } else if (direction === 'down' && sortedIndex < sortedLayers.length - 1) {
                  const temp = sortedLayers[sortedIndex].z_index;
                  sortedLayers[sortedIndex].z_index = sortedLayers[sortedIndex + 1].z_index;
                  sortedLayers[sortedIndex + 1].z_index = temp;
                }

                updateScene(selectedSceneIndex, { ...currentScene, layers: sortedLayers });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationContainer;