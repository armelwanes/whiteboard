import React, { useState, useEffect, useRef } from 'react';
import Scene from './Scene';
import Timeline from './Timeline';
import MultiTimeline from './MultiTimeline';
import LayerEditor from './LayerEditor';
import { createTimeline } from '../utils/timelineSystem';

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

  const handlePlayPause = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    setCurrentTime(Math.max(0, Math.min(time, totalDuration)));
    lastTimeRef.current = Date.now();
  };

  const handleUpdateTimeline = (updatedTimeline) => {
    setGlobalTimeline(updatedTimeline);
  };

  const handleUpdateSceneMultiTimeline = (updatedMultiTimeline) => {
    if (scenes[currentSceneIndex]) {
      updateScene(currentSceneIndex, {
        ...scenes[currentSceneIndex],
        multiTimeline: updatedMultiTimeline,
      });
    }
  };

  // Get current scene's local time
  const getSceneLocalTime = () => {
    let accumulatedTime = 0;
    for (let i = 0; i < currentSceneIndex; i++) {
      accumulatedTime += scenes[i].duration;
    }
    return currentTime - accumulatedTime;
  };

  return (
    <div className="animation-container w-full h-full flex flex-col bg-gray-950">
      {/* Main animation area */}
      <div 
        className="animation-stage flex-1 min-h-0 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
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

      {/* Layer Editor Block above timeline */}
      {scenes[selectedSceneIndex] && (
        <LayerEditor
          scene={scenes[selectedSceneIndex]}
          onSave={(updatedScene) => {
            updateScene(selectedSceneIndex, updatedScene);
          }}
          onClose={() => {}}
        />
      )}

      {/* Timeline controls always visible at the bottom */}
      <div className="timeline-container p-4 space-y-4">
        {/* Global Timeline */}
        <Timeline
          currentTime={currentTime}
          totalDuration={totalDuration}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          scenes={scenes}
          currentSceneIndex={currentSceneIndex}
          timeline={globalTimeline}
          onUpdateTimeline={handleUpdateTimeline}
        />

        {/* Multi-Timeline for current scene */}
        {scenes[currentSceneIndex] && scenes[currentSceneIndex].multiTimeline && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-300">
                Scène {currentSceneIndex + 1}: {scenes[currentSceneIndex].title}
              </h3>
            </div>
            <MultiTimeline
              multiTimeline={scenes[currentSceneIndex].multiTimeline}
              currentTime={getSceneLocalTime()}
              onUpdateMultiTimeline={handleUpdateSceneMultiTimeline}
              isPlaying={isPlaying}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationContainer;
