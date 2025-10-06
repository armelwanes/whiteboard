import React from 'react';

const Timeline = ({ 
  currentTime, 
  totalDuration, 
  isPlaying, 
  onPlayPause, 
  onSeek,
  scenes = []
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * totalDuration;
    onSeek(newTime);
  };

  return (
    <div className="timeline bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={onPlayPause}
          className="play-pause-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <div className="time-display text-lg font-mono">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>
      </div>

      {/* Progress bar */}
      <div 
        className="progress-bar h-3 bg-gray-700 rounded-full cursor-pointer mb-2 relative overflow-hidden"
        onClick={handleSeek}
      >
        <div 
          className="progress-fill h-full bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
        
        {/* Scene markers */}
        {scenes.map((scene, index) => {
          const sceneStart = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
          const position = (sceneStart / totalDuration) * 100;
          return (
            <div
              key={scene.id}
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
              style={{ left: `${position}%` }}
              title={scene.title}
            />
          );
        })}
      </div>

      {/* Scene labels */}
      <div className="scenes-list flex flex-wrap gap-2 mt-3">
        {scenes.map((scene, index) => {
          const sceneStart = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
          const sceneEnd = sceneStart + scene.duration;
          const isActive = currentTime >= sceneStart && currentTime < sceneEnd;
          
          return (
            <button
              key={scene.id}
              onClick={() => onSeek(sceneStart)}
              className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {index + 1}. {scene.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
