import React, { useState, useRef } from 'react';
import { 
  Upload, X, Save, Trash2, Eye, EyeOff, 
  MoveUp, MoveDown, Copy, Image as ImageIcon,
  Layers as LayersIcon
} from 'lucide-react';
import CameraControls from './CameraControls';
import LayerAnimationControls from './LayerAnimationControls';
import SceneCanvas from './SceneCanvas';

const LayerEditor = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState({ 
    ...scene,
    layers: scene.layers || [],
    sceneCameras: scene.sceneCameras || []
  });
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const fileInputRef = useRef(null);

  const sceneWidth = 1920 * 5;
  const sceneHeight = 1080 * 5;

  // Update editedScene when scene prop changes (switching between scenes)
  React.useEffect(() => {
    setEditedScene({
      ...scene,
      layers: scene.layers || [],
      sceneCameras: scene.sceneCameras || []
    });
    setSelectedLayerId(null); // Reset selection when scene changes
    setSelectedCamera(null); // Reset camera selection when scene changes
  }, [scene]);

  const handleChange = (field, value) => {
    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleSave = () => {
    onSave(editedScene);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Calculate initial position based on selected camera
        // Default to center of scene if no camera is selected
        let initialX = sceneWidth / 2;
        let initialY = sceneHeight / 2;
        
        if (selectedCamera && selectedCamera.position) {
          // Position the new layer at the center of the selected camera viewport
          initialX = selectedCamera.position.x * sceneWidth;
          initialY = selectedCamera.position.y * sceneHeight;
        }
        
        const newLayer = {
          id: `layer-${Date.now()}`,
          image_path: event.target.result,
          name: file.name,
          position: { x: initialX, y: initialY },
          z_index: editedScene.layers.length + 1,
          skip_rate: 10,
          scale: 1.0,
          opacity: 1.0,
          mode: 'draw',
          type: 'image',
        };
        setEditedScene({
          ...editedScene,
          layers: [...editedScene.layers, newLayer]
        });
        setSelectedLayerId(newLayer.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLayer = (updatedLayer) => {
    setEditedScene({
      ...editedScene,
      layers: editedScene.layers.map(layer =>
        layer.id === updatedLayer.id ? updatedLayer : layer
      )
    });
  };

  const handleDeleteLayer = (layerId) => {
    setEditedScene({
      ...editedScene,
      layers: editedScene.layers.filter(layer => layer.id !== layerId)
    });
    setSelectedLayerId(null);
  };

  const handleDuplicateLayer = (layerId) => {
    const layerToDuplicate = editedScene.layers.find(l => l.id === layerId);
    if (layerToDuplicate) {
      const duplicatedLayer = {
        ...layerToDuplicate,
        id: `layer-${Date.now()}`,
        name: `${layerToDuplicate.name} (Copie)`,
        position: {
          x: (layerToDuplicate.position?.x || 0) + 20,
          y: (layerToDuplicate.position?.y || 0) + 20,
        }
      };
      setEditedScene({
        ...editedScene,
        layers: [...editedScene.layers, duplicatedLayer]
      });
    }
  };

  const handleMoveLayer = (layerId, direction) => {
    const currentIndex = editedScene.layers.findIndex(l => l.id === layerId);
    if (currentIndex === -1) return;

    const newLayers = [...editedScene.layers];
    if (direction === 'up' && currentIndex > 0) {
      [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
        [newLayers[currentIndex - 1], newLayers[currentIndex]];
    } else if (direction === 'down' && currentIndex < newLayers.length - 1) {
      [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
        [newLayers[currentIndex + 1], newLayers[currentIndex]];
    }

    // Update z_index based on new order
    newLayers.forEach((layer, index) => {
      layer.z_index = index + 1;
    });

    setEditedScene({
      ...editedScene,
      layers: newLayers
    });
  };

  const handleLayerPropertyChange = (layerId, property, value) => {
    setEditedScene({
      ...editedScene,
      layers: editedScene.layers.map(layer =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      )
    });
  };

  const selectedLayer = editedScene.layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 shadow-2xl w-full h-[95vh] flex overflow-hidden border border-gray-700">
        {/* Left Side - Canvas Preview with Camera Viewports */}
        <div className="bg-gray-950 flex flex-col flex-1 min-w-0">
          <SceneCanvas
            scene={editedScene}
            onUpdateScene={(updates) => setEditedScene({ ...editedScene, ...updates })}
            onUpdateLayer={handleUpdateLayer}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onSelectCamera={setSelectedCamera}
          />
        </div>

        {/* Right Side - Properties Panel */}
        <div className="w-80 bg-gray-900 flex flex-col border-l border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-5 py-3 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-white">Propriétés</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm"
                title="Ajouter une couche"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
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
                    value={editedScene.title}
                    onChange={(e) => handleChange('title', e.target.value)}
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
                    value={editedScene.content}
                    onChange={(e) => handleChange('content', e.target.value)}
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
                    value={editedScene.duration}
                    onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-gray-300 text-xs mb-1.5">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    value={editedScene.backgroundImage || ''}
                    onChange={(e) => handleChange('backgroundImage', e.target.value || null)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Animation Type */}
                <div className="mt-3">
                  <label className="block text-gray-300 text-xs mb-1.5">
                    Type d'animation
                  </label>
                  <select
                    value={editedScene.animation}
                    onChange={(e) => handleChange('animation', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>
              </div>

              {/* Scene Camera Sequence */}
              <CameraControls
                cameras={editedScene.cameras || []}
                onChange={(cameras) => handleChange('cameras', cameras)}
                type="scene"
              />

              {/* Layers List */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                  <LayersIcon className="w-4 h-4" />
                  Couches ({editedScene.layers.length})
                </h3>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editedScene.layers.length === 0 ? (
                    <p className="text-gray-400 text-xs italic text-center py-4">
                      Aucune couche pour le moment.<br />
                      Cliquez sur "Ajouter une couche" pour commencer.
                    </p>
                  ) : (
                    editedScene.layers.map((layer, index) => (
                      <div
                        key={layer.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          selectedLayerId === layer.id
                            ? 'bg-blue-600 bg-opacity-20 border-blue-500'
                            : 'bg-gray-700 hover:bg-gray-650 border-gray-600'
                        }`}
                        onClick={() => setSelectedLayerId(layer.id)}
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
                                handleMoveLayer(layer.id, 'up');
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
                                handleMoveLayer(layer.id, 'down');
                              }}
                              disabled={index === editedScene.layers.length - 1}
                              className="p-1 hover:bg-gray-600 rounded disabled:opacity-30"
                              title="Déplacer vers le bas"
                            >
                              <MoveDown className="w-3 h-3 text-gray-300" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateLayer(layer.id);
                              }}
                              className="p-1 hover:bg-gray-600 rounded"
                              title="Dupliquer"
                            >
                              <Copy className="w-3 h-3 text-gray-300" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLayer(layer.id);
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

                  {/* Z-Index */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Z-Index (Ordre)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedLayer.z_index || 0}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'z_index', parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

                  {/* Type */}
                  <div>
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Type
                    </label>
                    <select
                      value={selectedLayer.type || 'image'}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'type', e.target.value)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="text">Texte</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Layer Camera Controls */}
              {selectedLayer && (
                <CameraControls
                  cameras={selectedLayer.camera ? [selectedLayer.camera] : []}
                  onChange={(cameras) => {
                    const camera = cameras.length > 0 ? cameras[0] : null;
                    handleLayerPropertyChange(selectedLayer.id, 'camera', camera);
                  }}
                  type="layer"
                />
              )}

              {/* Layer Animation Controls */}
              {selectedLayer && (
                <LayerAnimationControls
                  animation={selectedLayer.animation || null}
                  onChange={(animation) => 
                    handleLayerPropertyChange(selectedLayer.id, 'animation', animation)
                  }
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-5 py-3 border-t border-gray-700 flex justify-end gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-lg flex items-center gap-2 text-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerEditor;
