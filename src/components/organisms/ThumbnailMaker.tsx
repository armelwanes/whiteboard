import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer as KonvaLayer, Rect } from 'react-konva';
import { 
  Image as ImageIcon, Type, Download, Eye, Upload, 
  Palette, Trash2, Layers, X, Plus
} from 'lucide-react';
import { ThumbnailImageLayer, ThumbnailTextLayer } from '../molecules';

/**
 * Thumbnail Maker Component
 * Create and preview YouTube-style thumbnails (1280x720) using React Konva
 */
const ThumbnailMaker = ({ scene, onClose, onSave }) => {
  const WIDTH = 1280;
  const HEIGHT = 720;
  
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  
  const stageRef = useRef(null);
  const imageUploadRef = useRef(null);

  // Initialize with default text layer
  useEffect(() => {
    if (layers.length === 0) {
      setLayers([{
        id: 'text-1',
        type: 'text',
        text: scene?.title || 'Titre de la vidéo',
        x: WIDTH / 2,
        y: HEIGHT / 2,
        fontSize: 72,
        fontFamily: 'Arial Black',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 8,
        shadowEnabled: true,
        align: 'center',
      }]);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newLayer = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: event.target.result,
        x: WIDTH / 2 - 200,
        y: HEIGHT / 2 - 150,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };
  
  const handleAddText = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'Nouveau texte',
      x: WIDTH / 2,
      y: HEIGHT / 2,
      fontSize: 48,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 4,
      shadowEnabled: true,
      align: 'center',
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };
  
  const handleDeleteLayer = (layerId) => {
    setLayers(layers.filter(l => l.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  };
  
  const handleLayerChange = (updatedLayer) => {
    setLayers(layers.map(l => l.id === updatedLayer.id ? updatedLayer : l));
  };
  
  const handleMoveLayer = (layerId, direction) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;
    
    const newLayers = [...layers];
    if (direction === 'up' && index < layers.length - 1) {
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    } else if (direction === 'down' && index > 0) {
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
    }
    setLayers(newLayers);
  };

  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `thumbnail-${scene?.id || 'scene'}.png`;
    link.href = uri;
    link.click();
  };

  const handleSave = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    onSave?.({
      ...scene,
      thumbnail: {
        backgroundColor,
        layers,
        dataUrl
      }
    });
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  
  const handleTextChange = (property, value) => {
    if (!selectedLayer || selectedLayer.type !== 'text') return;
    
    handleLayerChange({
      ...selectedLayer,
      [property]: value
    });
  };

  const colorPresets = [
    { name: 'Rouge', color: '#dc2626' },
    { name: 'Bleu', color: '#1e40af' },
    { name: 'Vert', color: '#059669' },
    { name: 'Violet', color: '#7c3aed' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Jaune', color: '#fbbf24' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Éditeur de Miniature</h2>
              <p className="text-sm text-white/80">Éditeur interactif - Drag & Drop - 1280x720</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Canvas */}
          <div className="flex-1 p-6 overflow-auto bg-secondary/30">
            <div className="space-y-4">
              {/* Konva Stage */}
              <div className="bg-secondary rounded-xl p-4">
                <div className="relative" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <Stage
                    width={WIDTH}
                    height={HEIGHT}
                    ref={stageRef}
                    className="border-2 border-border rounded-lg shadow-2xl"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      display: 'block'
                    }}
                    onMouseDown={(e) => {
                      // Deselect when clicking on empty area
                      const clickedOnEmpty = e.target === e.target.getStage();
                      if (clickedOnEmpty) {
                        setSelectedLayerId(null);
                      }
                    }}
                  >
                    <KonvaLayer>
                      {/* Background */}
                      <Rect
                        x={0}
                        y={0}
                        width={WIDTH}
                        height={HEIGHT}
                        fill={backgroundColor}
                      />
                      
                      {/* Grid */}
                      {showGrid && (
                        <>
                          {/* Vertical lines */}
                          {[1, 2, 3].map(i => (
                            <Rect
                              key={`v-${i}`}
                              x={(WIDTH / 4) * i}
                              y={0}
                              width={1}
                              height={HEIGHT}
                              fill="rgba(255, 255, 255, 0.2)"
                            />
                          ))}
                          {/* Horizontal lines */}
                          {[1, 2].map(i => (
                            <Rect
                              key={`h-${i}`}
                              x={0}
                              y={(HEIGHT / 3) * i}
                              width={WIDTH}
                              height={1}
                              fill="rgba(255, 255, 255, 0.2)"
                            />
                          ))}
                        </>
                      )}
                      
                      {/* Render all layers */}
                      {layers.map(layer => {
                        if (layer.type === 'image') {
                          return (
                            <ThumbnailImageLayer
                              key={layer.id}
                              layer={layer}
                              isSelected={layer.id === selectedLayerId}
                              onSelect={() => setSelectedLayerId(layer.id)}
                              onChange={handleLayerChange}
                            />
                          );
                        } else if (layer.type === 'text') {
                          return (
                            <ThumbnailTextLayer
                              key={layer.id}
                              layer={layer}
                              isSelected={layer.id === selectedLayerId}
                              onSelect={() => setSelectedLayerId(layer.id)}
                              onChange={handleLayerChange}
                            />
                          );
                        }
                        return null;
                      })}
                    </KonvaLayer>
                  </Stage>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Télécharger PNG
                </button>
                {onSave && (
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-96 bg-gray-850 border-l border-border overflow-auto">
            <div className="p-6 space-y-6">
              {/* Add Elements */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter des éléments
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => imageUploadRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Importer Image
                  </button>
                  <input
                    ref={imageUploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={handleAddText}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <Type className="w-4 h-4" />
                    Ajouter Texte
                  </button>
                </div>
              </div>

              {/* Background */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Arrière-plan
                </h3>
                
                <div className="mb-3">
                  <label className="block text-foreground text-sm mb-2">Couleur de fond</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setBackgroundColor(preset.color)}
                      className="h-10 rounded-lg hover:ring-2 ring-white transition-all"
                      style={{ background: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Layers List */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Calques ({layers.length})
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {layers.slice().reverse().map((layer, index) => (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
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
                              handleMoveLayer(layer.id, 'up');
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                            disabled={index === 0}
                          >
                            <span className="text-xs">▲</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLayer(layer.id, 'down');
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                            disabled={index === layers.length - 1}
                          >
                            <span className="text-xs">▼</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLayer(layer.id);
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

              {/* Selected Layer Properties */}
              {selectedLayer && selectedLayer.type === 'text' && (
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Propriétés du texte
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-foreground text-sm mb-2">Texte</label>
                      <input
                        type="text"
                        value={selectedLayer.text}
                        onChange={(e) => handleTextChange('text', e.target.value)}
                        className="w-full bg-secondary text-white border border-border rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-foreground text-sm mb-2">
                        Taille: {Math.round(selectedLayer.fontSize)}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={selectedLayer.fontSize}
                        onChange={(e) => handleTextChange('fontSize', parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-foreground text-sm mb-2">Couleur</label>
                        <input
                          type="color"
                          value={selectedLayer.fill}
                          onChange={(e) => handleTextChange('fill', e.target.value)}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground text-sm mb-2">Contour</label>
                        <input
                          type="color"
                          value={selectedLayer.stroke}
                          onChange={(e) => handleTextChange('stroke', e.target.value)}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-foreground text-sm mb-2">
                        Épaisseur contour: {selectedLayer.strokeWidth}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={selectedLayer.strokeWidth}
                        onChange={(e) => handleTextChange('strokeWidth', parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-foreground text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLayer.shadowEnabled}
                          onChange={(e) => handleTextChange('shadowEnabled', e.target.checked)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        Ombre portée
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Utilities */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <label className="flex items-center gap-2 text-foreground text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  Afficher la grille de composition
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailMaker;
