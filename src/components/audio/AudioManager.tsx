import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Upload, Plus, Trash2, Play, Pause } from 'lucide-react';
import { AudioManager as AudioManagerClass, AudioTrackType, createAudioTrack } from '../../utils/audioManager';

interface AudioManagerProps {
  scene: any;
  onSceneUpdate: (updates: any) => void;
  currentTime?: number;
  isPlaying?: boolean;
}

/**
 * AudioManager Component
 * Main component for managing audio tracks in scenes
 */
const AudioManager: React.FC<AudioManagerProps> = ({ scene, onSceneUpdate, currentTime = 0, isPlaying = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [previewingTrack, setPreviewingTrack] = useState<any>(null);
  const audioManagerRef = useRef<AudioManagerClass | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Initialize audio manager
  useEffect(() => {
    if (!audioManagerRef.current) {
      audioManagerRef.current = new AudioManagerClass();
    }

    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.dispose();
      }
    };
  }, []);

  // Load tracks from scene audio configuration
  useEffect(() => {
    if (scene.audio) {
      const loadedTracks = [];
      
      // Load background music
      if (scene.audio.backgroundMusic) {
        loadedTracks.push(scene.audio.backgroundMusic);
      }
      
      // Load narration tracks
      if (scene.audio.narration) {
        loadedTracks.push(...scene.audio.narration);
      }
      
      // Load sound effects
      if (scene.audio.soundEffects) {
        loadedTracks.push(...scene.audio.soundEffects);
      }

      setTracks(loadedTracks);
    }
  }, [scene.audio]);

  // Sync with external playback
  useEffect(() => {
    if (!audioManagerRef.current) return;

    if (isPlaying) {
      audioManagerRef.current.play(currentTime);
    } else {
      audioManagerRef.current.pause();
    }
  }, [isPlaying, currentTime]);

  // Update master volume
  useEffect(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setMasterVolume(masterVolume);
    }
  }, [masterVolume]);

  const handleAddTrack = (type: string) => {
    const inputRef = fileInputRefs.current[type];
    if (inputRef) {
      inputRef.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const audioData = event.target.result;
      
      // Create track configuration
      const newTrack = createAudioTrack(type, audioData, {
        volume: type === AudioTrackType.BACKGROUND_MUSIC ? 0.5 : 1.0,
        loop: type === AudioTrackType.BACKGROUND_MUSIC,
        startTime: currentTime,
      });

      // Add to audio manager
      if (audioManagerRef.current) {
        audioManagerRef.current.addTrack(newTrack);
      }

      // Update scene
      const updatedAudio = { ...(scene.audio || {}) };
      
      switch (type) {
        case AudioTrackType.BACKGROUND_MUSIC:
          updatedAudio.backgroundMusic = newTrack;
          break;
        case AudioTrackType.NARRATION:
          updatedAudio.narration = [...(updatedAudio.narration || []), newTrack];
          break;
        case AudioTrackType.SOUND_EFFECT:
          updatedAudio.soundEffects = [...(updatedAudio.soundEffects || []), newTrack];
          break;
        default:
          break;
      }

      onSceneUpdate({ ...scene, audio: updatedAudio });
      setTracks(prev => [...prev, newTrack]);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveTrack = (trackId) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.removeTrack(trackId);
    }

    // Update scene audio config
    const updatedAudio = { ...(scene.audio || {}) };
    
    if (updatedAudio.backgroundMusic?.id === trackId) {
      updatedAudio.backgroundMusic = null;
    }
    
    if (updatedAudio.narration) {
      updatedAudio.narration = updatedAudio.narration.filter(t => t.id !== trackId);
    }
    
    if (updatedAudio.soundEffects) {
      updatedAudio.soundEffects = updatedAudio.soundEffects.filter(t => t.id !== trackId);
    }

    onSceneUpdate({ ...scene, audio: updatedAudio });
    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const handleTrackVolumeChange = (trackId, volume) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.updateTrack(trackId, { volume: parseFloat(volume) });
    }

    // Update local state
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, volume: parseFloat(volume) } : t
    ));

    // Update scene
    const updatedAudio = { ...(scene.audio || {}) };
    const updateTrackInArray = (arr) => 
      arr?.map(t => t.id === trackId ? { ...t, volume: parseFloat(volume) } : t);
    
    if (updatedAudio.backgroundMusic?.id === trackId) {
      updatedAudio.backgroundMusic = { ...updatedAudio.backgroundMusic, volume: parseFloat(volume) };
    }
    if (updatedAudio.narration) {
      updatedAudio.narration = updateTrackInArray(updatedAudio.narration);
    }
    if (updatedAudio.soundEffects) {
      updatedAudio.soundEffects = updateTrackInArray(updatedAudio.soundEffects);
    }

    onSceneUpdate({ ...scene, audio: updatedAudio });
  };

  const handlePreviewTrack = (track) => {
    if (previewingTrack === track.id) {
      // Stop preview
      if (audioManagerRef.current) {
        audioManagerRef.current.stop();
      }
      setPreviewingTrack(null);
    } else {
      // Start preview
      if (audioManagerRef.current) {
        audioManagerRef.current.stop();
        const tempManager = new AudioManagerClass();
        tempManager.addTrack(track);
        tempManager.play(0);
        setPreviewingTrack(track.id);
      }
    }
  };

  const getTrackTypeLabel = (type) => {
    switch (type) {
      case AudioTrackType.BACKGROUND_MUSIC:
        return 'Background Music';
      case AudioTrackType.NARRATION:
        return 'Narration';
      case AudioTrackType.SOUND_EFFECT:
        return 'Sound Effect';
      default:
        return type;
    }
  };

  const getTrackTypeColor = (type) => {
    switch (type) {
      case AudioTrackType.BACKGROUND_MUSIC:
        return 'bg-blue-100 text-blue-800';
      case AudioTrackType.NARRATION:
        return 'bg-green-100 text-green-800';
      case AudioTrackType.SOUND_EFFECT:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Audio Manager</h3>
          <span className="text-sm text-gray-500">({tracks.length} tracks)</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Master Volume */}
          <div className="flex items-center gap-3">
            {masterVolume > 0 ? (
              <Volume2 className="w-5 h-5 text-gray-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <label className="text-sm font-medium text-gray-700 w-32">Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12 text-right">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>

          {/* Add Track Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAddTrack(AudioTrackType.BACKGROUND_MUSIC)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Background Music
            </button>
            <button
              onClick={() => handleAddTrack(AudioTrackType.NARRATION)}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Narration
            </button>
            <button
              onClick={() => handleAddTrack(AudioTrackType.SOUND_EFFECT)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Sound Effect
            </button>
          </div>

          {/* Hidden file inputs */}
          {Object.values(AudioTrackType).map(type => (
            <input
              key={type}
              ref={el => fileInputRefs.current[type] = el}
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileUpload(e, type)}
              className="hidden"
            />
          ))}

          {/* Track List */}
          {tracks.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Tracks:</h4>
              {tracks.map(track => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                >
                  <button
                    onClick={() => handlePreviewTrack(track)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Preview"
                  >
                    {previewingTrack === track.id ? (
                      <Pause className="w-4 h-4 text-gray-700" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-700" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getTrackTypeColor(track.type)}`}>
                        {getTrackTypeLabel(track.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Start: {track.startTime.toFixed(1)}s
                      </span>
                      {track.loop && (
                        <span className="text-xs text-gray-500">
                          (Loop)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3 h-3 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={track.volume}
                        onChange={(e) => handleTrackVolumeChange(track.id, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-600 w-10 text-right">
                        {Math.round(track.volume * 100)}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No audio tracks yet. Add tracks to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioManager;
