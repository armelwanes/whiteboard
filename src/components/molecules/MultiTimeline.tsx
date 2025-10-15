import React, { useState, useRef, useCallback } from 'react';
import { Music, Eye, Camera, Sparkles, Lock, Unlock, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  TrackType, 
  createTimelineElement, 
  addElementToTrack, 
  updateElementInTrack, 
  deleteElementFromTrack, 
  snapToGrid,
  addTrackToTimeline,
  removeTrackFromTimeline,
  updateTrackInTimeline,
  reorderTrack
} from '../../utils/multiTimelineSystem';

interface MultiTimelineProps {
  timeline: any;
  onUpdateTimeline: (timeline: any) => void;
  currentTime?: number;
  totalDuration?: number;
  [key: string]: any;
}

const TRACK_ICONS: Record<string, any> = {
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
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const timelineRef = useRef(null);
  const [showAddMenu, setShowAddMenu] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const pixelsToTime = useCallback((pixels, width) => {
    return (pixels / width) * multiTimeline.duration;
  }, [multiTimeline.duration]);

  const handleTrackClick = useCallback((e, trackId) => {
    if (isPlaying || dragState || resizeState) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = snapToGrid(pixelsToTime(x, rect.width));

    setShowAddMenu({ trackId, time, x: e.clientX, y: e.clientY });
  }, [isPlaying, dragState, resizeState, pixelsToTime]);

  const handleAddElement = useCallback((trackId, time, elementType) => {
    const track = multiTimeline.tracks.find(t => t.id === trackId);
    if (!track) return;

    const newElement = createTimelineElement(
      time,
      1.0, // Default 1 second duration
      elementType,
      {},
      `${elementType} ${time.toFixed(1)}s`
    );

    const updatedTrack = addElementToTrack(track, newElement);
    const updatedMultiTimeline = {
      ...multiTimeline,
      tracks: multiTimeline.tracks.map(t => t.id === trackId ? updatedTrack : t),
    };

    onUpdateMultiTimeline(updatedMultiTimeline);

    setShowAddMenu(null);
    setSelectedElement({ trackId, elementId: newElement.id });
  }, [multiTimeline, onUpdateMultiTimeline]);

  const handleElementMouseDown = useCallback((e, trackId, element) => {
    if (isPlaying) return;
    
    e.stopPropagation();
    setSelectedElement({ trackId, elementId: element.id });

    const rect = e.currentTarget.getBoundingClientRect();
    const isResizeRight = e.clientX > rect.right - 10;
    const isResizeLeft = e.clientX < rect.left + 10;

    if (isResizeRight || isResizeLeft) {
      setResizeState({
        trackId,
        element,
        side: isResizeRight ? 'right' : 'left',
        startX: e.clientX,
        originalStartTime: element.startTime,
        originalDuration: element.duration,
      });
    } else {
      setDragState({
        trackId,
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

      const track = multiTimeline.tracks.find(t => t.id === dragState.trackId);
      if (!track) return;

      const updatedTrack = updateElementInTrack(track, dragState.element.id, {
        startTime: newStartTime,
      });

      onUpdateMultiTimeline({
        ...multiTimeline,
        tracks: multiTimeline.tracks.map(t => t.id === dragState.trackId ? updatedTrack : t),
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

      const track = multiTimeline.tracks.find(t => t.id === resizeState.trackId);
      if (!track) return;

      const updatedTrack = updateElementInTrack(track, element.id, {
        startTime: newStartTime,
        duration: newDuration,
      });

      onUpdateMultiTimeline({
        ...multiTimeline,
        tracks: multiTimeline.tracks.map(t => t.id === resizeState.trackId ? updatedTrack : t),
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

    const track = multiTimeline.tracks.find(t => t.id === selectedElement.trackId);
    if (!track) return;

    const updatedTrack = deleteElementFromTrack(track, selectedElement.elementId);

    onUpdateMultiTimeline({
      ...multiTimeline,
      tracks: multiTimeline.tracks.map(t => t.id === selectedElement.trackId ? updatedTrack : t),
    });

    setSelectedElement(null);
  }, [selectedElement, multiTimeline, onUpdateMultiTimeline]);

  const toggleTrackEnabled = useCallback((trackId) => {
    const track = multiTimeline.tracks.find(t => t.id === trackId);
    if (!track) return;

    onUpdateMultiTimeline(updateTrackInTimeline(multiTimeline, trackId, {
      enabled: !track.enabled,
    }));
  }, [multiTimeline, onUpdateMultiTimeline]);

  const toggleTrackLocked = useCallback((trackId) => {
    const track = multiTimeline.tracks.find(t => t.id === trackId);
    if (!track) return;

    onUpdateMultiTimeline(updateTrackInTimeline(multiTimeline, trackId, {
      locked: !track.locked,
    }));
  }, [multiTimeline, onUpdateMultiTimeline]);

  const handleAddTrack = useCallback((trackType) => {
    onUpdateMultiTimeline(addTrackToTimeline(multiTimeline, trackType));
  }, [multiTimeline, onUpdateMultiTimeline]);

  const handleDeleteTrack = useCallback((trackId) => {
    if (selectedTrack === trackId) setSelectedTrack(null);
    if (selectedElement?.trackId === trackId) setSelectedElement(null);
    onUpdateMultiTimeline(removeTrackFromTimeline(multiTimeline, trackId));
  }, [multiTimeline, onUpdateMultiTimeline, selectedTrack, selectedElement]);

  const handleMoveTrack = useCallback((trackId, direction) => {
    onUpdateMultiTimeline(reorderTrack(multiTimeline, trackId, direction));
  }, [multiTimeline, onUpdateMultiTimeline]);

  const toggleGroupCollapse = useCallback((trackType) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [trackType]: !prev[trackType],
    }));
  }, []);

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

  const renderTrack = (track, trackIndex) => {
    const Icon = TRACK_ICONS[track.type];
    const color = TRACK_COLORS[track.type];
    const isFirst = trackIndex === 0;
    const isLast = trackIndex === multiTimeline.tracks.length - 1;

    return (
      <div key={track.id} className="track-container border-b border-gray-800">
        <div className="flex">
          {/* Track Header */}
          <div className="track-header w-48 bg-gray-900 p-3 flex items-center gap-2 border-r border-gray-800">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-200 flex-1 truncate" title={track.name}>
              {track.name}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMoveTrack(track.id, -1)}
                disabled={isFirst}
                className={`p-1 rounded ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                title="Déplacer vers le haut"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleMoveTrack(track.id, 1)}
                disabled={isLast}
                className={`p-1 rounded ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                title="Déplacer vers le bas"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleTrackEnabled(track.id)}
                className={`p-1 rounded ${track.enabled ? 'text-blue-400' : 'text-gray-600'}`}
                title={track.enabled ? 'Désactiver' : 'Activer'}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleTrackLocked(track.id)}
                className={`p-1 rounded ${track.locked ? 'text-red-400' : 'text-gray-600'}`}
                title={track.locked ? 'Déverrouiller' : 'Verrouiller'}
              >
                {track.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setSelectedTrack(track.id);
                  handleDeleteTrack(track.id);
                }}
                className="p-1 rounded hover:bg-red-600 text-gray-400 hover:text-white"
                title="Supprimer la piste"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Track Timeline */}
          <div 
            className={`track-timeline flex-1 relative cursor-pointer ${
              track.enabled ? 'bg-gray-800' : 'bg-gray-850'
            }`}
            style={{ minHeight: `${track.height}px` }}
            onClick={(e) => !track.locked && handleTrackClick(e, track.id)}
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
              const isSelected = selectedElement?.trackId === track.id && 
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
                  onMouseDown={(e) => !track.locked && handleElementMouseDown(e, track.id, element)}
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

  const renderTrackGroup = (trackType) => {
    const Icon = TRACK_ICONS[trackType];
    const tracksOfType = multiTimeline.tracks.filter(t => t.type === trackType);
    const isCollapsed = collapsedGroups[trackType];
    const typeName = trackType.charAt(0).toUpperCase() + trackType.slice(1);

    return (
      <div key={trackType} className="track-group">
        {/* Group Header */}
        <div className="flex items-center bg-gray-800 border-b border-gray-700 px-3 py-2">
          <button
            onClick={() => toggleGroupCollapse(trackType)}
            className="flex items-center gap-2 flex-1 text-left hover:bg-gray-700 rounded px-2 py-1"
          >
            <Icon className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-semibold text-gray-200">
              {typeName} ({tracksOfType.length})
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
          </button>
          <button
            onClick={() => handleAddTrack(trackType)}
            className="p-1 rounded hover:bg-gray-700 text-gray-300"
            title={`Ajouter une piste ${typeName}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tracks */}
        {!isCollapsed && tracksOfType.map((track) => {
          const trackIndex = multiTimeline.tracks.indexOf(track);
          return renderTrack(track, trackIndex);
        })}
      </div>
    );
  };

  return (
    <div className="multi-timeline bg-gray-900 text-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Multi-Level Timeline</h3>
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
        
        {Object.values(TrackType).map(trackType => renderTrackGroup(trackType))}
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
              {(() => {
                const track = multiTimeline.tracks.find(t => t.id === showAddMenu.trackId);
                if (!track) return null;
                
                if (track.type === TrackType.VISUAL) {
                  return (
                    <>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'image')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Image
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'text')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Texte
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'svg')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        SVG
                      </button>
                    </>
                  );
                } else if (track.type === TrackType.AUDIO) {
                  return (
                    <>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'music')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Musique
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'narration')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Narration
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'sfx')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Effet sonore
                      </button>
                    </>
                  );
                } else if (track.type === TrackType.CAMERA) {
                  return (
                    <>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'pan')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Pan
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'zoom')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Zoom
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'rotate')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Rotation
                      </button>
                    </>
                  );
                } else if (track.type === TrackType.FX) {
                  return (
                    <>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'fade')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Fade
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'blur')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Blur
                      </button>
                      <button
                        onClick={() => handleAddElement(showAddMenu.trackId, showAddMenu.time, 'transition')}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Transition
                      </button>
                    </>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiTimeline;
