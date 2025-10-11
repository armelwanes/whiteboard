import React from 'react';
import { 
  Upload, Save, Trash2, 
  MoveUp, MoveDown, Copy,
  Image as ImageIcon,
  Layers as LayersIcon
} from 'lucide-react';
import AudioManager from './audio/AudioManager';

const PropertiesPanel = ({ 
  scene, 
  selectedLayerId,
  onSelectLayer,
  onUpdateScene, 
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer,
  onImageUpload,
  fileInputRef
}) => {
  if (!scene) {
    return (
      <div className="w-96 bg-gray-900 flex flex-col border-l border-gray-700">
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-400 text-sm text-center">
            Sélectionnez une scène pour voir ses propriétés
          </p>
        </div>
      </div>
    );
  }

  const selectedLayer = scene.layers?.find(layer => layer.id === selectedLayerId);

  const handleSceneChange = (field, value) => {
    onUpdateScene({ ...scene, [field]: value });
  };

  const handleLayerPropertyChange = (layerId, property, value) => {
    const layer = scene.layers.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer({ ...layer, [property]: value });
    }
  };

  return (
    <div className="w-96 bg-gray-900 flex flex-col border-l border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-white">Propriétés</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded flex items-center gap-2 transition-colors text-sm"
          title="Ajouter une image"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-5">
          {/* Scene Properties */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Propriétés de la Scène
            </h3>
            
            {/* Title */}
            <div className="mb-3">
              <label className="block text-gray-300 text-xs mb-1.5">
                Titre de la scène
              </label>
              <input
                type="text"
                value={scene.title || ''}
                onChange={(e) => handleSceneChange('title', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le titre..."
              />
            </div>

            {/* Content */}
            <div className="mb-3">
              <label className="block text-gray-300 text-xs mb-1.5">
                Contenu
              </label>
              <textarea
                value={scene.content || ''}
                onChange={(e) => handleSceneChange('content', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le contenu..."
              />
            </div>

            {/* Duration */}
            <div className="mb-3">
              <label className="block text-gray-300 text-xs mb-1.5">
                Durée (secondes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={scene.duration || 5}
                onChange={(e) => handleSceneChange('duration', parseInt(e.target.value) || 5)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Background Image */}
            <div className="mb-3">
              <label className="block text-gray-300 text-xs mb-1.5">
                Image de fond (URL)
              </label>
              <input
                type="text"
                value={scene.backgroundImage || ''}
                onChange={(e) => handleSceneChange('backgroundImage', e.target.value || null)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Animation Type */}
            <div>
              <label className="block text-gray-300 text-xs mb-1.5">
                Type d'animation
              </label>
              <select
                value={scene.animation || 'fade'}
                onChange={(e) => handleSceneChange('animation', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
              </select>
            </div>
          </div>

          {/* Layers List */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <LayersIcon className="w-4 h-4" />
              Couches ({scene.layers?.length || 0})
            </h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(!scene.layers || scene.layers.length === 0) ? (
                <p className="text-gray-400 text-xs italic text-center py-4">
                  Aucune couche pour le moment.<br />
                  Cliquez sur "+" pour ajouter une image.
                </p>
              ) : (
                scene.layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedLayerId === layer.id
                        ? 'bg-blue-600 bg-opacity-20 border-blue-500'
                        : 'bg-gray-700 hover:bg-gray-650 border-gray-600'
                    }`}
                    onClick={() => onSelectLayer(layer.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">🖼️</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">
                            {layer.name || `Couche ${index + 1}`}
                          </p>
                          <p className="text-gray-400 text-xs">
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
                          className="p-1 hover:bg-gray-600 rounded disabled:opacity-30"
                          title="Déplacer vers le haut"
                        >
                          <MoveUp className="w-3 h-3 text-gray-300" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLayer(layer.id, 'down');
                          }}
                          disabled={index === scene.layers.length - 1}
                          className="p-1 hover:bg-gray-600 rounded disabled:opacity-30"
                          title="Déplacer vers le bas"
                        >
                          <MoveDown className="w-3 h-3 text-gray-300" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateLayer(layer.id);
                          }}
                          className="p-1 hover:bg-gray-600 rounded"
                          title="Dupliquer"
                        >
                          <Copy className="w-3 h-3 text-gray-300" />
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

          {/* Selected Layer Properties */}
          {selectedLayer && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Propriétés de la Couche Sélectionnée
              </h3>

              {/* Layer Name */}
              <div className="mb-3">
                <label className="block text-gray-300 text-xs mb-1.5">
                  Nom
                </label>
                <input
                  type="text"
                  value={selectedLayer.name || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'name', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de la couche"
                />
              </div>

              {/* Position */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 text-xs mb-1.5">
                    Position X
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.position?.x || 0)}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'position', {
                      ...selectedLayer.position,
                      x: parseInt(e.target.value) || 0
                    })}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1.5">
                    Position Y
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.position?.y || 0)}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'position', {
                      ...selectedLayer.position,
                      y: parseInt(e.target.value) || 0
                    })}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Scale */}
              <div className="mb-3">
                <label className="block text-gray-300 text-xs mb-1.5">
                  Échelle: {(selectedLayer.scale || 1.0).toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={selectedLayer.scale || 1.0}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div className="mb-3">
                <label className="block text-gray-300 text-xs mb-1.5">
                  Opacité: {Math.round((selectedLayer.opacity || 1.0) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={selectedLayer.opacity || 1.0}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'opacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Skip Rate */}
              <div className="mb-3">
                <label className="block text-gray-300 text-xs mb-1.5">
                  Skip Rate (Vitesse de dessin)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={selectedLayer.skip_rate || 10}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'skip_rate', parseInt(e.target.value) || 10)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Plus élevé = dessin plus rapide
                </p>
              </div>

              {/* Mode */}
              <div className="mb-3">
                <label className="block text-gray-300 text-xs mb-1.5">
                  Mode de dessin
                </label>
                <select
                  value={selectedLayer.mode || 'draw'}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'mode', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draw">Draw (Dessin progressif)</option>
                  <option value="eraser">Eraser (Gomme)</option>
                  <option value="static">Static (Statique)</option>
                </select>
              </div>
            </div>
          )}

          {/* Audio Manager */}
          <AudioManager 
            scene={scene}
            onSceneUpdate={onUpdateScene}
            currentTime={0}
            isPlaying={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
