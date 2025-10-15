import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2 } from 'lucide-react';

interface TimelineMarker {
  time: number;
  label: string;
  color: string;
  metadata: any;
}

interface TimelineData {
  markers?: TimelineMarker[];
  [key: string]: any;
}

interface TimelineProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  scenes?: any[];
  timeline?: TimelineData | null;
  onUpdateTimeline?: ((timeline: TimelineData) => void) | null;
}

const Timeline: React.FC<TimelineProps> = ({ 
  currentTime, 
  totalDuration, 
  isPlaying, 
  onPlayPause, 
  onSeek,
  scenes = [],
  timeline = null,
  onUpdateTimeline = null,
}) => {
  const [showKeyframes, setShowKeyframes] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * totalDuration;
    onSeek(newTime);
  };

  const handleSkipToStart = () => {
    onSeek(0);
  };

  const handleSkipToEnd = () => {
    onSeek(totalDuration);
  };

  const addMarker = () => {
    if (!timeline || !onUpdateTimeline) return;
    
    const newMarker = {
      time: currentTime,
      label: `Marker ${(timeline.markers?.length || 0) + 1}`,
      color: '#ffcc00',
      metadata: {},
    };
    
    const updatedTimeline = {
      ...timeline,
      markers: [...(timeline.markers || []), newMarker],
    };
    
    onUpdateTimeline(updatedTimeline);
  };

  const deleteMarker = (index: number) => {
    if (!timeline || !onUpdateTimeline) return;
    
    const updatedTimeline = {
      ...timeline,
      markers: timeline.markers.filter((_, i) => i !== index),
    };
    
    onUpdateTimeline(updatedTimeline);
  };

  return (
    <div className="timeline bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg shadow-xl">
      {/* Playback Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleSkipToStart}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Skip to start"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={onPlayPause}
          className="play-pause-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Play
            </>
          )}
        </button>
        
        <button
          onClick={handleSkipToEnd}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Skip to end"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        
        <div className="time-display text-lg font-mono ml-auto">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>

        {/* Timeline Controls */}
        {timeline && (
          <div className="flex items-center gap-2 ml-4 border-l border-gray-700 pl-4">
            <button
              onClick={() => setShowKeyframes(!showKeyframes)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                showKeyframes ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Keyframes
            </button>
            <button
              onClick={() => setShowMarkers(!showMarkers)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                showMarkers ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Markers
            </button>
            <button
              onClick={addMarker}
              className="p-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
              title="Add marker at current time"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Timeline Track */}
      <div className="timeline-track-container">
        {/* Progress bar with markers */}
        <div 
          className="progress-bar h-12 bg-gray-800 rounded-lg cursor-pointer mb-2 relative overflow-visible border border-gray-700"
          onClick={handleSeek}
        >
          {/* Playhead */}
          <div 
            className="playhead absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
          </div>

          {/* Progress fill */}
          <div 
            className="progress-fill h-full bg-blue-600 bg-opacity-30 transition-all duration-100"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
          
          {/* Scene markers */}
          {scenes.map((scene, index) => {
            const sceneStart = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
            const sceneWidth = (scene.duration / totalDuration) * 100;
            const position = (sceneStart / totalDuration) * 100;
            return (
              <div
                key={scene.id}
                className="absolute top-0 bottom-0 border-l-2 border-gray-500"
                style={{ left: `${position}%` }}
                title={`${scene.title} (${scene.duration}s)`}
              >
                <div 
                  className="absolute top-1 text-xs text-gray-300 px-1 truncate"
                  style={{ width: `${sceneWidth * (100 / sceneWidth)}%` }}
                >
                  {scene.title}
                </div>
              </div>
            );
          })}

          {/* Timeline markers */}
          {timeline && showMarkers && timeline.markers?.map((marker, index) => {
            const position = (marker.time / totalDuration) * 100;
            return (
              <div
                key={index}
                className="absolute top-0 bottom-0 w-1 cursor-pointer z-10 group"
                style={{ 
                  left: `${position}%`,
                  backgroundColor: marker.color || '#ffcc00',
                }}
                title={marker.label}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {marker.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMarker(index);
                    }}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3 inline" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Keyframes */}
          {timeline && showKeyframes && timeline.propertyTracks && (
            Object.entries(timeline.propertyTracks).map(([trackName, track], trackIndex) => (
              track.keyframes?.map((keyframe, kfIndex) => {
                const position = (keyframe.time / totalDuration) * 100;
                return (
                  <div
                    key={`${trackName}-${kfIndex}`}
                    className="absolute w-2 h-2 bg-purple-500 rounded-full cursor-pointer z-10"
                    style={{ 
                      left: `${position}%`,
                      top: `${20 + (trackIndex * 8) % 30}%`,
                    }}
                    title={`${trackName}: ${JSON.stringify(keyframe.value)}`}
                  />
                );
              })
            ))
          )}
        </div>

        {/* Time scale */}
        <div className="flex justify-between text-xs text-gray-500 px-1">
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const time = totalDuration * fraction;
            return (
              <div key={fraction}>{formatTime(time)}</div>
            );
          })}
        </div>
      </div>

      {/* Scene labels */}
      <div className="scenes-list flex flex-wrap gap-2 mt-4">
        {scenes.map((scene, index) => {
          const sceneStart = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
          const sceneEnd = sceneStart + scene.duration;
          const isActive = currentTime >= sceneStart && currentTime < sceneEnd;
          
          return (
            <button
              key={scene.id}
              onClick={() => onSeek(sceneStart)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {index + 1}. {scene.title}
            </button>
          );
        })}
      </div>

      {/* Property Tracks Panel (if timeline exists) */}
      {timeline && timeline.propertyTracks && Object.keys(timeline.propertyTracks).length > 0 && (
        <div className="property-tracks mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-400">Property Tracks</h3>
          <div className="space-y-1">
            {Object.entries(timeline.propertyTracks).map(([trackName, track]) => (
              <div
                key={trackName}
                className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                  selectedTrack === trackName 
                    ? 'bg-purple-600 bg-opacity-30 border border-purple-500' 
                    : 'bg-gray-800 hover:bg-gray-750'
                }`}
                onClick={() => setSelectedTrack(trackName)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">{trackName}</span>
                  <span className="text-xs text-gray-400">
                    {track.keyframes?.length || 0} keyframes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
