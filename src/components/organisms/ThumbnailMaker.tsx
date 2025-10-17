import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer as KonvaLayer, Rect } from 'react-konva';
import { Eye } from 'lucide-react';
import { 
  ThumbnailImageLayer, 
  ThumbnailTextLayer,
  ThumbnailHeader,
  ThumbnailActions,
  ThumbnailAddElements,
  ThumbnailBackground,
  ThumbnailLayersList,
  ThumbnailTextProperties
} from '../molecules';

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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <ThumbnailHeader onClose={onClose} />

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

              <ThumbnailActions 
                onDownload={handleDownload}
                onSave={onSave ? handleSave : undefined}
              />
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-96 bg-gray-850 border-l border-border overflow-auto">
            <div className="p-6 space-y-6">
              <ThumbnailAddElements
                onImageUpload={() => imageUploadRef.current?.click()}
                onAddText={handleAddText}
                imageUploadRef={imageUploadRef}
                onFileChange={handleImageUpload}
              />

              <ThumbnailBackground
                backgroundColor={backgroundColor}
                onColorChange={setBackgroundColor}
              />

              <ThumbnailLayersList
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onMoveLayer={handleMoveLayer}
                onDeleteLayer={handleDeleteLayer}
              />

              {selectedLayer && selectedLayer.type === 'text' && (
                <ThumbnailTextProperties
                  layer={selectedLayer}
                  onTextChange={handleTextChange}
                />
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
