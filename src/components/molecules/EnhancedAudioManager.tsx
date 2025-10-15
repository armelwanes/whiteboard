import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Volume2, VolumeX, Upload, Trash2, Play, Pause, 
  Plus, ChevronDown, ChevronUp, Mic, Disc, Headphones
} from 'lucide-react';

interface EnhancedAudioManagerProps {
  scene: any;
  onSceneUpdate: (updates: any) => void;
}

/**
 * Enhanced Audio Manager Component
 * Modern, elegant UI for managing background music, voice-overs, and sound effects
 */
const EnhancedAudioManager: React.FC<EnhancedAudioManagerProps> = ({ scene, onSceneUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  const backgroundMusicRef = useRef<HTMLInputElement>(null);
  const narrationRef = useRef<HTMLInputElement>(null);
  const soundEffectRef = useRef<HTMLInputElement>(null);

  // Initialize audio refs
  useEffect(() => {
    const refs = audioRefs.current;
    return () => {
      // Cleanup all audio on unmount
      Object.values(refs).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Veuillez sélectionner un fichier audio valide');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const audioData = event.target.result;
      const newAudio = {
        type,
        name: file.name,
        data: audioData,
        volume: type === 'backgroundMusic' ? 0.3 : 1.0,
        loop: type === 'backgroundMusic',
        id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedAudio = { ...(scene.audio || {}) };
      
      if (type === 'backgroundMusic') {
        updatedAudio.backgroundMusic = newAudio;
      } else if (type === 'narration') {
        updatedAudio.narration = [...(updatedAudio.narration || []), newAudio];
      } else if (type === 'soundEffect') {
        updatedAudio.soundEffects = [...(updatedAudio.soundEffects || []), newAudio];
      }

      onSceneUpdate({ ...scene, audio: updatedAudio });
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleRemoveTrack = (type, trackId) => {
    const updatedAudio = { ...(scene.audio || {}) };
    
    if (type === 'backgroundMusic') {
      updatedAudio.backgroundMusic = null;
    } else if (type === 'narration') {
      updatedAudio.narration = updatedAudio.narration?.filter(t => t.id !== trackId) || [];
    } else if (type === 'soundEffect') {
      updatedAudio.soundEffects = updatedAudio.soundEffects?.filter(t => t.id !== trackId) || [];
    }

    onSceneUpdate({ ...scene, audio: updatedAudio });
    
    // Stop and cleanup audio
    if (audioRefs.current[trackId]) {
      audioRefs.current[trackId].pause();
      audioRefs.current[trackId].src = '';
      delete audioRefs.current[trackId];
    }
  };

  const handleVolumeChange = (type, trackId, volume) => {
    const updatedAudio = { ...(scene.audio || {}) };
    const newVolume = parseFloat(volume);
    
    if (type === 'backgroundMusic') {
      updatedAudio.backgroundMusic = { ...updatedAudio.backgroundMusic, volume: newVolume };
    } else if (type === 'narration') {
      updatedAudio.narration = updatedAudio.narration?.map(t => 
        t.id === trackId ? { ...t, volume: newVolume } : t
      );
    } else if (type === 'soundEffect') {
      updatedAudio.soundEffects = updatedAudio.soundEffects?.map(t => 
        t.id === trackId ? { ...t, volume: newVolume } : t
      );
    }

    onSceneUpdate({ ...scene, audio: updatedAudio });
    
    // Update audio element volume
    if (audioRefs.current[trackId]) {
      audioRefs.current[trackId].volume = newVolume * masterVolume;
    }
  };

  const togglePlayPause = (trackId, audioData) => {
    if (!audioRefs.current[trackId]) {
      audioRefs.current[trackId] = new Audio(audioData);
      audioRefs.current[trackId].volume = masterVolume;
    }

    const audio = audioRefs.current[trackId];
    
    if (playingTrackId === trackId) {
      audio.pause();
      setPlayingTrackId(null);
    } else {
      // Pause all other tracks
      Object.entries(audioRefs.current).forEach(([id, aud]) => {
        if (id !== trackId && aud) {
          aud.pause();
        }
      });
      
      audio.currentTime = 0;
      audio.play();
      setPlayingTrackId(trackId);
      
      audio.onended = () => setPlayingTrackId(null);
    }
  };

  const getAllTracks = () => {
    const tracks = [];
    
    if (scene.audio?.backgroundMusic) {
      tracks.push({ ...scene.audio.backgroundMusic, type: 'backgroundMusic' });
    }
    
    if (scene.audio?.narration) {
      tracks.push(...scene.audio.narration.map(t => ({ ...t, type: 'narration' })));
    }
    
    if (scene.audio?.soundEffects) {
      tracks.push(...scene.audio.soundEffects.map(t => ({ ...t, type: 'soundEffect' })));
    }
    
    return tracks;
  };

  const getTrackIcon = (type) => {
    switch (type) {
      case 'backgroundMusic':
        return <Music className="w-4 h-4" />;
      case 'narration':
        return <Mic className="w-4 h-4" />;
      case 'soundEffect':
        return <Headphones className="w-4 h-4" />;
      default:
        return <Disc className="w-4 h-4" />;
    }
  };

  const getTrackLabel = (type) => {
    switch (type) {
      case 'backgroundMusic':
        return 'Musique de fond';
      case 'narration':
        return 'Voix-off';
      case 'soundEffect':
        return 'Effet sonore';
      default:
        return 'Audio';
    }
  };

  const getTrackColor = (type) => {
    switch (type) {
      case 'backgroundMusic':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
      case 'narration':
        return 'bg-green-500/10 border-green-500/20 text-green-600';
      case 'soundEffect':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-600';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600';
    }
  };

  const allTracks = getAllTracks();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Music className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Gestionnaire Audio</h3>
            <p className="text-xs text-gray-400">{allTracks.length} piste{allTracks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors p-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 border-t border-gray-700 space-y-4">
          {/* Master Volume Control */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              {masterVolume > 0 ? (
                <Volume2 className="w-5 h-5 text-blue-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-300 flex-1">Volume Principal</span>
              <span className="text-sm font-semibold text-white min-w-[45px] text-right">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setMasterVolume(vol);
                // Update all playing audio volumes
                Object.values(audioRefs.current).forEach(audio => {
                  if (audio) audio.volume = vol;
                });
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Add Track Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => backgroundMusicRef.current?.click()}
              className="flex flex-col items-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors group"
            >
              <Music className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-blue-400">Musique</span>
            </button>
            
            <button
              onClick={() => narrationRef.current?.click()}
              className="flex flex-col items-center gap-2 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors group"
            >
              <Mic className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-green-400">Voix-off</span>
            </button>
            
            <button
              onClick={() => soundEffectRef.current?.click()}
              className="flex flex-col items-center gap-2 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors group"
            >
              <Headphones className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-purple-400">Effet</span>
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={backgroundMusicRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload('backgroundMusic', e)}
            className="hidden"
          />
          <input
            ref={narrationRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload('narration', e)}
            className="hidden"
          />
          <input
            ref={soundEffectRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload('soundEffect', e)}
            className="hidden"
          />

          {/* Track List */}
          {allTracks.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Pistes Audio:</h4>
              {allTracks.map((track) => (
                <div
                  key={track.id}
                  className={`rounded-lg p-3 border transition-all ${getTrackColor(track.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => togglePlayPause(track.id, track.data)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                      title="Aperçu"
                    >
                      {playingTrackId === track.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getTrackIcon(track.type)}
                        <span className="text-xs font-medium truncate">{getTrackLabel(track.type)}</span>
                        {track.loop && (
                          <span className="text-xs opacity-70">(Boucle)</span>
                        )}
                      </div>
                      
                      <div className="text-xs opacity-80 mb-2 truncate" title={track.name}>
                        {track.name}
                      </div>
                      
                      {/* Volume Control */}
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3 h-3 opacity-60" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={track.volume}
                          onChange={(e) => handleVolumeChange(track.type, track.id, e.target.value)}
                          className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-medium min-w-[35px] text-right">
                          {Math.round(track.volume * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveTrack(track.type, track.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune piste audio</p>
              <p className="text-xs opacity-70 mt-1">Ajoutez des fichiers audio pour commencer</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedAudioManager;
