import React from 'react';
import { 
  MoveUp, MoveDown, Copy, Trash2,
  Layers as LayersIcon
} from 'lucide-react';

export interface LayersListPanelProps {
  layers: any[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  onDuplicateLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const LayersListPanel: React.FC<LayersListPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onMoveLayer,
  onDuplicateLayer,
  onDeleteLayer
}) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm flex items-center gap-2">
        <LayersIcon className="w-4 h-4" />
        Couches ({layers?.length || 0})
      </h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {(!layers || layers.length === 0) ? (
          <p className="text-muted-foreground text-xs italic text-center py-4">
            Aucune couche pour le moment.<br />
            Cliquez sur "+" pour ajouter une image.
          </p>
        ) : (
          layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedLayerId === layer.id
                  ? 'bg-primary bg-opacity-20 border-primary'
                  : 'bg-secondary hover:bg-gray-650 border-border'
              }`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">🖼️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs font-medium truncate">
                      {layer.name || `Couche ${index + 1}`}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      z: {layer.z_index || index + 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-secondary/80 rounded disabled:opacity-30"
                    title="Déplacer vers le haut"
                  >
                    <MoveUp className="w-3 h-3 text-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'down');
                    }}
                    disabled={index === layers.length - 1}
                    className="p-1 hover:bg-secondary/80 rounded disabled:opacity-30"
                    title="Déplacer vers le bas"
                  >
                    <MoveDown className="w-3 h-3 text-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    className="p-1 hover:bg-secondary/80 rounded"
                    title="Dupliquer"
                  >
                    <Copy className="w-3 h-3 text-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
