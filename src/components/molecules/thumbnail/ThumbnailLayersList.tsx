import React from 'react';
import { Layers, ImageIcon, Type, Trash2 } from 'lucide-react';

interface Layer {
  id: string;
  type: 'image' | 'text';
  text?: string;
  [key: string]: any;
}

interface ThumbnailLayersListProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  onDeleteLayer: (layerId: string) => void;
}

export const ThumbnailLayersList: React.FC<ThumbnailLayersListProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onMoveLayer,
  onDeleteLayer
}) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Calques ({layers.length})
      </h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {layers.slice().reverse().map((layer, index) => (
          <div
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              layer.id === selectedLayerId
                ? 'bg-primary text-white'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {layer.type === 'image' ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <Type className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {layer.type === 'image' ? 'Image' : layer.text?.substring(0, 20) || 'Texte'}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'up');
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                  disabled={index === 0}
                >
                  <span className="text-xs">▲</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'down');
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                  disabled={index === layers.length - 1}
                >
                  <span className="text-xs">▼</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="p-1 hover:bg-red-600 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {layers.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Aucun calque. Ajoutez une image ou du texte.
        </p>
      )}
    </div>
  );
};
