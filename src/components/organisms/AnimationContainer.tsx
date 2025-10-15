import React, { useState, useEffect, useRef } from 'react';
import Scene from '../Scene';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import { createTimeline } from '../../utils/timelineSystem';

const AnimationContainer = ({ scenes = [], updateScene, selectedSceneIndex = 0 }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [globalTimeline, setGlobalTimeline] = useState(() => {
    // Initialize with empty timeline
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    return createTimeline(totalDuration, 30);
  });
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

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



  return (
    <div className="animation-container w-full h-full flex flex-col bg-gray-950">
      {/* Main animation area */}
      <div 
        className=" relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      >
        {scenes.map((scene, index) => (
          <Scene
            key={scene.id}
            {...scene}
            scene={scene}
            selectedSceneIndex={index}
            isActive={currentSceneIndex === index}
            updateScene={updateScene}
            currentTime={currentTime}
            timeline={globalTimeline}
          />
        ))}
        {/* Loading state */}
        {scenes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl">No scenes available</p>
          </div>
        )}
      </div>

      {/* Layer Editor Block above layers list */}
      {scenes[selectedSceneIndex] && (
        <LayerEditor
          scene={scenes[selectedSceneIndex]}
          onSave={(updatedScene) => {
            updateScene(selectedSceneIndex, updatedScene);
          }}
          onClose={() => {}}
        />
      )}

      {/* Layers list - horizontal scrollable display of current scene's layers */}
      <div className="layers-container p-4">
        {scenes[selectedSceneIndex] && (
          <LayersList
            scene={scenes[selectedSceneIndex]}
            selectedLayerId={null}
            onSelectLayer={(layerId) => {
              // Handle layer selection if needed
              console.log('Selected layer:', layerId);
            }}
            onUpdateLayer={(layer) => {
              const currentScene = scenes[selectedSceneIndex];
              const updatedLayers = currentScene.layers.map(l => 
                l.id === layer.id ? layer : l
              );
              updateScene(selectedSceneIndex, { ...currentScene, layers: updatedLayers });
            }}
            onDeleteLayer={(layerId) => {
              const currentScene = scenes[selectedSceneIndex];
              const updatedLayers = currentScene.layers.filter(l => l.id !== layerId);
              updateScene(selectedSceneIndex, { ...currentScene, layers: updatedLayers });
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
  );
};

export default AnimationContainer;
