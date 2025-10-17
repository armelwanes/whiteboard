import React from 'react';
import { ImageIcon as Image, Clock, TrendingUp } from 'lucide-react';

interface AssetViewModeSelectorProps {
  viewMode: 'all' | 'cached' | 'recent';
  onViewModeChange: (mode: 'all' | 'cached' | 'recent') => void;
}

export const AssetViewModeSelector: React.FC<AssetViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
        <Image className="w-4 h-4" />
        Affichage
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => onViewModeChange('all')}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            viewMode === 'all'
              ? 'bg-primary text-white'
              : 'bg-secondary/30 text-foreground hover:bg-secondary/80'
          }`}
        >
          Tous les assets
        </button>
        <button
          onClick={() => onViewModeChange('cached')}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
            viewMode === 'cached'
              ? 'bg-primary text-white'
              : 'bg-secondary/30 text-foreground hover:bg-secondary/80'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Plus utilisés
        </button>
        <button
          onClick={() => onViewModeChange('recent')}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
            viewMode === 'recent'
              ? 'bg-primary text-white'
              : 'bg-secondary/30 text-foreground hover:bg-secondary/80'
          }`}
        >
          <Clock className="w-4 h-4" />
          Récents
        </button>
      </div>
    </div>
  );
};
