import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioControlsProps {
  volume?: number;
  onVolumeChange: (volume: number) => void;
  muted?: boolean;
  onMuteToggle: () => void;
  className?: string;
}

/**
 * AudioControls Component
 * Simple audio control panel for volume adjustment
 */
const AudioControls: React.FC<AudioControlsProps> = ({ 
  volume = 1.0, 
  onVolumeChange,
  muted = false,
  onMuteToggle,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={onMuteToggle}
        className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-gray-500" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-700" />
        )}
      </button>
      
      <div className="flex items-center gap-2 flex-1">
        <Music className="w-4 h-4 text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2"
          disabled={muted}
        />
        <span className="text-sm text-gray-600 w-12 text-right font-medium">
          {Math.round((muted ? 0 : volume) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default AudioControls;
