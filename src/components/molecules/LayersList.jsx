import React from 'react';
import { Eye, EyeOff, Trash2, Copy, MoveUp, MoveDown } from 'lucide-react';

/**
 * LayersList - Horizontal scrollable list of layers from the current scene
 * Shows preview images for each layer
 */
const LayersList = ({ 
  scene,
  selectedLayerId,
  onSelectLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer
}) => {
  if (!scene || !scene.layers || scene.layers.length === 0) {
    return (
      <div className="layers-list bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg shadow-xl">
        <div className="text-center text-gray-400 py-8">
          <p>Aucune couche dans cette scène</p>
          <p className="text-sm mt-2">Ajoutez des images pour commencer</p>
        </div>
      </div>
    );
  }

  // Sort layers by z_index
  const sortedLayers = [...scene.layers].sort((a, b) => (a.z_index || 0) - (b.z_index || 0));

  return (
    <div className="layers-list bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-xl">
      <div className="flex gap-3 overflow-x-auto">
        {sortedLayers.map((layer, index) => {
          const isSelected = selectedLayerId === layer.id;
          
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`
                flex-shrink-0 w-48 cursor-pointer rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-600 bg-opacity-20 shadow-lg' 
                  : 'border-gray-700 bg-gray-800 hover:bg-gray-750 hover:border-gray-600'
                }
              `}
            >
              {/* Layer Preview Image */}
              <div className="relative h-28 bg-gray-950 rounded-t-lg overflow-hidden">
                {layer.type === 'image' && layer.image_path ? (
                  <img
                    src={layer.image_path}
                    alt={layer.name || `Layer ${index + 1}`}
                    className="w-full h-full object-contain"
                    style={{ 
                      opacity: layer.opacity || 1,
                      transform: `scale(${layer.scale || 1})`
                    }}
                  />
                ) : layer.type === 'text' ? (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    <span style={{ 
                      fontFamily: layer.fontFamily || 'Arial',
                      fontSize: '24px',
                      color: layer.color || '#ffffff'
                    }}>
                      {layer.text?.substring(0, 20) || 'Text'}
                    </span>
                  </div>
                ) : layer.type === 'shape' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      style={{
                        width: '60%',
                        height: '60%',
                        backgroundColor: layer.fill || '#3b82f6',
                        borderRadius: layer.shapeType === 'circle' ? '50%' : '4px',
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-2xl">🖼️</span>
                  </div>
                )}
                
                {/* Visibility Badge */}
                <div className="absolute top-2 right-2">
                  {layer.visible === false ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
              
              {/* Layer Info */}
              <div className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white truncate flex-1">
                    {layer.name || `Couche ${index + 1}`}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    z: {layer.z_index || index + 1}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 mb-2">
                  {layer.type === 'image' ? '🖼️ Image' : 
                   layer.type === 'text' ? '📝 Texte' : 
                   layer.type === 'shape' ? '⬛ Forme' : '❓'}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) onMoveLayer(layer.id, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Monter"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < sortedLayers.length - 1) onMoveLayer(layer.id, 'down');
                    }}
                    disabled={index === sortedLayers.length - 1}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Descendre"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                    title="Dupliquer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Supprimer cette couche ?')) {
                        onDeleteLayer(layer.id);
                      }
                    }}
                    className="p-1 rounded bg-red-600 hover:bg-red-700"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayersList;
