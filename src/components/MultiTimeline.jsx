import React, { useState, useRef, useCallback } from 'react';
import { Music, Eye, Camera, Sparkles, Lock, Unlock, Plus, Trash2, GripVertical } from 'lucide-react';
import { TrackType, createTimelineElement, addElementToTrack, updateElementInTrack, deleteElementFromTrack, snapToGrid } from '../utils/multiTimelineSystem';

const TRACK_ICONS = {
  [TrackType.VISUAL]: Eye,
  [TrackType.AUDIO]: Music,
  [TrackType.CAMERA]: Camera,
  [TrackType.FX]: Sparkles,
};

const TRACK_COLORS = {
  [TrackType.VISUAL]: 'bg-blue-600',
  [TrackType.AUDIO]: 'bg-green-600',
  [TrackType.CAMERA]: 'bg-purple-600',
  [TrackType.FX]: 'bg-orange-600',
};

const MultiTimeline = ({ 
  multiTimeline, 
  currentTime, 
  onUpdateMultiTimeline,
  isPlaying = false,
}) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const timelineRef = useRef(null);
  const [showAddMenu, setShowAddMenu] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const pixelsToTime = useCallback((pixels, width) => {
    return (pixels / width) * multiTimeline.duration;
  }, [multiTimeline.duration]);

  const handleTrackClick = useCallback((e, trackType) => {
    if (isPlaying || dragState || resizeState) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = snapToGrid(pixelsToTime(x, rect.width));

    setShowAddMenu({ trackType, time, x: e.clientX, y: e.clientY });
  }, [isPlaying, dragState, resizeState, pixelsToTime]);

  const handleAddElement = useCallback((trackType, time, elementType) => {
    const newElement = createTimelineElement(
      time,
      1.0, // Default 1 second duration
      elementType,
      {},
      `${elementType} ${time.toFixed(1)}s`
    );

    const track = multiTimeline.tracks[trackType];
    const updatedTrack = addElementToTrack(track, newElement);

    onUpdateMultiTimeline({
      ...multiTimeline,
      tracks: {
        ...multiTimeline.tracks,
        [trackType]: updatedTrack,
      },
    });

    setShowAddMenu(null);
    setSelectedElement({ trackType, elementId: newElement.id });
  }, [multiTimeline, onUpdateMultiTimeline]);

  const handleElementMouseDown = useCallback((e, trackType, element) => {
    if (isPlaying) return;
    
    e.stopPropagation();
    setSelectedElement({ trackType, elementId: element.id });

    const rect = e.currentTarget.getBoundingClientRect();
    const isResizeRight = e.clientX > rect.right - 10;
    const isResizeLeft = e.clientX < rect.left + 10;

    if (isResizeRight || isResizeLeft) {
      setResizeState({
        trackType,
        element,
        side: isResizeRight ? 'right' : 'left',
        startX: e.clientX,
        originalStartTime: element.startTime,
        originalDuration: element.duration,
      });
    } else {
      setDragState({
        trackType,
        element,
        startX: e.clientX,
        originalStartTime: element.startTime,
      });
    }
  }, [isPlaying]);

  const handleMouseMove = useCallback((e) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - (dragState?.startX || resizeState?.startX || 0);
    const deltaTime = pixelsToTime(deltaX, rect.width);

    if (dragState) {
      const newStartTime = Math.max(0, Math.min(
        multiTimeline.duration - dragState.element.duration,
        snapToGrid(dragState.originalStartTime + deltaTime)
      ));

      const track = multiTimeline.tracks[dragState.trackType];
      const updatedTrack = updateElementInTrack(track, dragState.element.id, {
        startTime: newStartTime,
      });

      onUpdateMultiTimeline({
        ...multiTimeline,
        tracks: {
          ...multiTimeline.tracks,
          [dragState.trackType]: updatedTrack,
        },
      });
    } else if (resizeState) {
      const { side, element, originalStartTime, originalDuration } = resizeState;
      let newStartTime = originalStartTime;
      let newDuration = originalDuration;

      if (side === 'right') {
        newDuration = Math.max(0.1, snapToGrid(originalDuration + deltaTime));
        newDuration = Math.min(newDuration, multiTimeline.duration - originalStartTime);
      } else {
        const maxMove = originalDuration - 0.1;
        const move = Math.max(-originalStartTime, Math.min(maxMove, snapToGrid(deltaTime)));
        newStartTime = originalStartTime + move;
        newDuration = originalDuration - move;
      }

      const track = multiTimeline.tracks[resizeState.trackType];
      const updatedTrack = updateElementInTrack(track, element.id, {
        startTime: newStartTime,
        duration: newDuration,
      });

      onUpdateMultiTimeline({
        ...multiTimeline,
        tracks: {
          ...multiTimeline.tracks,
          [resizeState.trackType]: updatedTrack,
        },
      });
    }
  }, [dragState, resizeState, multiTimeline, onUpdateMultiTimeline, pixelsToTime]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  React.useEffect(() => {
    if (dragState || resizeState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, handleMouseMove, handleMouseUp]);

  const handleDeleteElement = useCallback(() => {
    if (!selectedElement) return;

    const track = multiTimeline.tracks[selectedElement.trackType];
    const updatedTrack = deleteElementFromTrack(track, selectedElement.elementId);

    onUpdateMultiTimeline({
      ...multiTimeline,
      tracks: {
        ...multiTimeline.tracks,
        [selectedElement.trackType]: updatedTrack,
      },
    });

    setSelectedElement(null);
  }, [selectedElement, multiTimeline, onUpdateMultiTimeline]);

  const toggleTrackEnabled = useCallback((trackType) => {
    const track = multiTimeline.tracks[trackType];
    onUpdateMultiTimeline({
      ...multiTimeline,
      tracks: {
        ...multiTimeline.tracks,
        [trackType]: {
          ...track,
          enabled: !track.enabled,
        },
      },
    });
  }, [multiTimeline, onUpdateMultiTimeline]);

  const toggleTrackLocked = useCallback((trackType) => {
    const track = multiTimeline.tracks[trackType];
    onUpdateMultiTimeline({
      ...multiTimeline,
      tracks: {
        ...multiTimeline.tracks,
        [trackType]: {
          ...track,
          locked: !track.locked,
        },
      },
    });
  }, [multiTimeline, onUpdateMultiTimeline]);

  const renderTimeScale = () => {
    const steps = 10;
    const timeSteps = [];
    for (let i = 0; i <= steps; i++) {
      const time = (multiTimeline.duration / steps) * i;
      timeSteps.push(
        <div key={i} className="text-xs text-gray-400">
          {formatTime(time)}
        </div>
      );
    }
    return (
      <div className="flex justify-between px-1 mb-2 border-b border-gray-700 pb-2">
        {timeSteps}
      </div>
    );
  };

  const renderPlayhead = () => {
    const position = (currentTime / multiTimeline.duration) * 100;
    return (
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-50 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
      </div>
    );
  };

  const renderTrack = (trackType, track) => {
    const Icon = TRACK_ICONS[trackType];
    const color = TRACK_COLORS[trackType];

    return (
      <div key={trackType} className="track-container border-b border-gray-800">
        <div className="flex">
          {/* Track Header */}
          <div className="track-header w-48 bg-gray-900 p-3 flex items-center gap-2 border-r border-gray-800">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-200 flex-1">{track.name}</span>
            <button
              onClick={() => toggleTrackEnabled(trackType)}
              className={`p-1 rounded ${track.enabled ? 'text-blue-400' : 'text-gray-600'}`}
              title={track.enabled ? 'Désactiver' : 'Activer'}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleTrackLocked(trackType)}
              className={`p-1 rounded ${track.locked ? 'text-red-400' : 'text-gray-600'}`}
              title={track.locked ? 'Déverrouiller' : 'Verrouiller'}
            >
              {track.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>

          {/* Track Timeline */}
          <div 
            className={`track-timeline flex-1 relative cursor-pointer ${
              track.enabled ? 'bg-gray-800' : 'bg-gray-850'
            }`}
            style={{ minHeight: `${track.height}px` }}
            onClick={(e) => !track.locked && handleTrackClick(e, trackType)}
          >
            {/* Grid lines */}
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-gray-700 opacity-30"
                style={{ left: `${(i / 10) * 100}%` }}
              />
            ))}

            {/* Track Elements */}
            {track.elements.map((element) => {
              const startPos = (element.startTime / multiTimeline.duration) * 100;
              const width = (element.duration / multiTimeline.duration) * 100;
              const isSelected = selectedElement?.trackType === trackType && 
                                selectedElement?.elementId === element.id;

              return (
                <div
                  key={element.id}
                  className={`absolute top-1 bottom-1 ${color} bg-opacity-60 rounded border-2 transition-all cursor-move ${
                    isSelected ? 'border-white shadow-lg z-10' : 'border-transparent'
                  } ${track.locked ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{
                    left: `${startPos}%`,
                    width: `${width}%`,
                  }}
                  onMouseDown={(e) => !track.locked && handleElementMouseDown(e, trackType, element)}
                  title={element.label}
                >
                  <div className="px-2 py-1 text-xs text-white truncate select-none">
                    {element.label}
                  </div>
                  
                  {/* Resize handles */}
                  {isSelected && !track.locked && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white bg-opacity-30" />
                      <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white bg-opacity-30" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="multi-timeline bg-gray-900 text-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Multi-Timelines</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(multiTimeline.duration)}
          </span>
          {selectedElement && (
            <button
              onClick={handleDeleteElement}
              className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              title="Supprimer l'élément"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {renderTimeScale()}

      <div className="tracks-container relative" ref={timelineRef}>
        {renderPlayhead()}
        
        {Object.entries(multiTimeline.tracks).map(([trackType, track]) => 
          renderTrack(trackType, track)
        )}
      </div>

      {/* Add Element Menu */}
      {showAddMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAddMenu(null)}
          />
          <div
            className="fixed bg-gray-800 rounded-lg shadow-xl p-3 z-50 border border-gray-700"
            style={{ left: showAddMenu.x, top: showAddMenu.y }}
          >
            <div className="text-xs text-gray-400 mb-2">
              Ajouter à {formatTime(showAddMenu.time)}
            </div>
            <div className="space-y-1">
              {showAddMenu.trackType === TrackType.VISUAL && (
                <>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'image')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Image
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'text')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Texte
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'svg')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    SVG
                  </button>
                </>
              )}
              {showAddMenu.trackType === TrackType.AUDIO && (
                <>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'music')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Musique
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'narration')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Narration
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'sfx')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Effet sonore
                  </button>
                </>
              )}
              {showAddMenu.trackType === TrackType.CAMERA && (
                <>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'pan')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Pan
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'zoom')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Zoom
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'rotate')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Rotation
                  </button>
                </>
              )}
              {showAddMenu.trackType === TrackType.FX && (
                <>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'fade')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Fade
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'blur')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Blur
                  </button>
                  <button
                    onClick={() => handleAddElement(showAddMenu.trackType, showAddMenu.time, 'transition')}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Transition
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiTimeline;
