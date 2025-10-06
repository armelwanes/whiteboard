import React, { useState, useEffect, useRef } from 'react';
import Scene from './Scene';
import Timeline from './Timeline';

const AnimationContainer = ({ scenes = [] }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  // Calculate total duration
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

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

  return (
    <div className="animation-container w-full h-full flex flex-col bg-gray-950">
      {/* Main animation area */}
      <div className="animation-stage flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {scenes.map((scene, index) => (
          <Scene
            key={scene.id}
            {...scene}
            isActive={currentSceneIndex === index}
          />
        ))}
        
        {/* Loading state */}
        {scenes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl">No scenes available</p>
          </div>
        )}
      </div>

      {/* Timeline controls */}
      <div className="timeline-container p-4">
        <Timeline
          currentTime={currentTime}
          totalDuration={totalDuration}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          scenes={scenes}
          currentSceneIndex={currentSceneIndex}
        />
      </div>
    </div>
  );
};

export default AnimationContainer;
