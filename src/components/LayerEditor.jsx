import React, { useState, useRef } from 'react';
import { 
  Upload, X, Save, Trash2, Eye, EyeOff, 
  MoveUp, MoveDown, Copy, Image as ImageIcon,
  Layers as LayersIcon, Type as TextIcon, Square as ShapeIcon, Download
} from 'lucide-react';
import CameraControls from './CameraControls';
import LayerAnimationControls from './LayerAnimationControls';
import SceneCanvas from './SceneCanvas';
import ShapeToolbar from './ShapeToolbar';
import ImageCropModal from './ImageCropModal';
import { createShapeLayer } from '../utils/shapeUtils';
import { exportDefaultCameraView, exportAllCameras, downloadImage } from '../utils/cameraExporter';
import { exportLayerFromJSON, downloadDataUrl, validateLayerJSON } from '../utils/layerExporter';

const LayerEditor = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState({ 
    ...scene,
    layers: scene.layers || [],
    sceneCameras: scene.sceneCameras || []
  });
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showShapeToolbar, setShowShapeToolbar] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingImageData, setPendingImageData] = useState(null);
  const fileInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const backgroundMusicInputRef = useRef(null);

  const sceneWidth = 9600;
  const sceneHeight = 5400;

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
        // Store pending image data with file name
        setPendingImageData({
          imageUrl: event.target.result,
          fileName: file.name
        });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleCropComplete = (croppedImageUrl, imageDimensions) => {
    if (!pendingImageData) return;

    // Calculate initial position based on selected camera
    let initialX = sceneWidth / 2;
    let initialY = sceneHeight / 2;
    let cameraWidth = 800; // Default camera width
    let cameraHeight = 450; // Default camera height
    
    if (selectedCamera && selectedCamera.position) {
      initialX = selectedCamera.position.x * sceneWidth;
      initialY = selectedCamera.position.y * sceneHeight;
      cameraWidth = selectedCamera.width || 800;
      cameraHeight = selectedCamera.height || 450;
    }
    
    // Calculate scale to fit image within camera viewport
    // The image should fit within 80% of the camera dimensions to leave some margin
    let calculatedScale = 1.0;
    if (imageDimensions) {
      const maxWidth = cameraWidth * 0.8;
      const maxHeight = cameraHeight * 0.8;
      
      const scaleX = maxWidth / imageDimensions.width;
      const scaleY = maxHeight / imageDimensions.height;
      
      // Use the smaller scale to ensure the image fits within both dimensions
      calculatedScale = Math.min(scaleX, scaleY, 1.0); // Don't scale up, only down
    }
    
    const newLayer = {
      id: `layer-${Date.now()}`,
      image_path: croppedImageUrl,
      name: pendingImageData.fileName,
      position: { x: initialX, y: initialY },
      z_index: editedScene.layers.length + 1,
      skip_rate: 10,
      scale: calculatedScale,
      opacity: 1.0,
      mode: 'draw',
      type: 'image',
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };
    
    setEditedScene({
      ...editedScene,
      layers: [...editedScene.layers, newLayer]
    });
    setSelectedLayerId(newLayer.id);
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('backgroundImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleBackgroundMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('backgroundMusic', event.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAddTextLayer = () => {
    // Calculate initial position based on selected camera
    let initialX = sceneWidth / 2;
    let initialY = sceneHeight / 2;
    
    if (selectedCamera && selectedCamera.position) {
      initialX = selectedCamera.position.x * sceneWidth;
      initialY = selectedCamera.position.y * sceneHeight;
    }
    
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: 'Texte',
      position: { x: initialX, y: initialY },
      z_index: editedScene.layers.length + 1,
      skip_rate: 12,
      scale: 1.0,
      opacity: 1.0,
      mode: 'draw',
      type: 'text',
      text_config: {
        text: 'Votre texte ici',
        font: 'Arial',
        size: 48,
        color: [0, 0, 0],
        style: 'normal',
        line_height: 1.2,
        align: 'left'
      },
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };
    
    setEditedScene({
      ...editedScene,
      layers: [...editedScene.layers, newLayer]
    });
    setSelectedLayerId(newLayer.id);
  };

  const handleAddShape = (shapeLayer) => {
    // Calculate initial position based on selected camera
    let initialX = sceneWidth / 2;
    let initialY = sceneHeight / 2;
    
    if (selectedCamera && selectedCamera.position) {
      initialX = selectedCamera.position.x * sceneWidth;
      initialY = selectedCamera.position.y * sceneHeight;
    }
    
    // Update shape position to camera center
    const updatedShapeLayer = {
      ...shapeLayer,
      z_index: editedScene.layers.length + 1,
      shape_config: {
        ...shapeLayer.shape_config,
        x: initialX,
        y: initialY,
      }
    };
    
    setEditedScene({
      ...editedScene,
      layers: [...editedScene.layers, updatedShapeLayer]
    });
    setSelectedLayerId(updatedShapeLayer.id);
    setShowShapeToolbar(false);
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

  // Export default camera view
  const handleExportDefaultCamera = async () => {
    try {
      const result = await exportDefaultCameraView(editedScene, sceneWidth, sceneHeight);
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (result.configOnly) {
        // Camera is at default position - save config as JSON
        const configJson = JSON.stringify(result.config, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scene-${editedScene.id}-default-camera-config-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Configuration de la caméra par défaut exportée (JSON uniquement - caméra en position par défaut)');
      } else {
        // Export actual image
        downloadImage(result.imageDataUrl, `scene-${editedScene.id}-default-camera-${timestamp}.png`);
        alert('Vue caméra par défaut exportée avec succès!');
      }
    } catch (error) {
      console.error('Error exporting default camera:', error);
      alert('Erreur lors de l\'export de la caméra par défaut: ' + error.message);
    }
  };

  // Export all cameras
  const handleExportAllCameras = async () => {
    try {
      const exports = await exportAllCameras(editedScene, sceneWidth, sceneHeight);
      const timestamp = new Date().toISOString().split('T')[0];
      let imageCount = 0;
      let configCount = 0;
      
      exports.forEach((exp, index) => {
        const cameraName = exp.camera.name || `camera-${index}`;
        
        if (exp.configOnly) {
          // Save config as JSON for default camera
          const configJson = JSON.stringify(exp.config, null, 2);
          const blob = new Blob([configJson], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scene-${editedScene.id}-${cameraName}-config-${timestamp}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          configCount++;
        } else {
          // Download actual image
          const filename = `scene-${editedScene.id}-${cameraName}-${timestamp}.png`;
          downloadImage(exp.imageDataUrl, filename);
          imageCount++;
        }
      });
      
      alert(`${exports.length} caméra(s) exportée(s): ${imageCount} image(s), ${configCount} config(s) JSON (caméras par défaut)`);
    } catch (error) {
      console.error('Error exporting cameras:', error);
      alert('Erreur lors de l\'export des caméras: ' + error.message);
    }
  };

  // Export a single layer from JSON
  const handleExportLayer = async (layerId) => {
    const layer = editedScene.layers.find(l => l.id === layerId);
    if (!layer) {
      alert('Couche non trouvée');
      return;
    }

    // Validate layer first
    const validation = validateLayerJSON(layer);
    if (!validation.valid) {
      alert(`Couche invalide: ${validation.errors.join(', ')}`);
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const dataUrl = await exportLayerFromJSON(layer, {
        width: 1920,
        height: 1080,
        background: '#FFFFFF',
        pixelRatio: 1,
        sceneBackgroundImage: editedScene.backgroundImage, // Include scene background
      });
      
      const filename = `scene-${editedScene.id}-layer-${layer.name || layer.id}-${timestamp}.png`;
      downloadDataUrl(dataUrl, filename);
      alert(`Couche "${layer.name || layer.id}" exportée avec succès!`);
    } catch (error) {
      console.error('Error exporting layer:', error);
      alert(`Erreur lors de l'export de la couche: ${error.message}`);
    }
  };

  // Export all layers from the scene
  const handleExportAllLayers = async () => {
    if (editedScene.layers.length === 0) {
      alert('Aucune couche à exporter');
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      let successCount = 0;
      let errorCount = 0;

      for (const layer of editedScene.layers) {
        try {
          const validation = validateLayerJSON(layer);
          if (!validation.valid) {
            console.warn(`Skipping invalid layer ${layer.id}:`, validation.errors);
            errorCount++;
            continue;
          }

          const dataUrl = await exportLayerFromJSON(layer, {
            width: 1920,
            height: 1080,
            background: '#FFFFFF',
            pixelRatio: 1,
            sceneBackgroundImage: editedScene.backgroundImage, // Include scene background
          });
          
          const filename = `scene-${editedScene.id}-layer-${layer.name || layer.id}-${timestamp}.png`;
          downloadDataUrl(dataUrl, filename);
          successCount++;
        } catch (error) {
          console.error(`Error exporting layer ${layer.id}:`, error);
          errorCount++;
        }
      }

      alert(`Export terminé: ${successCount} couche(s) exportée(s), ${errorCount} erreur(s)`);
    } catch (error) {
      console.error('Error during batch export:', error);
      alert(`Erreur lors de l'export: ${error.message}`);
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
    <div className="flex items-center justify-center w-full">
      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}
      
      {/* Image Crop Modal */}
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      <div className="bg-white dark:bg-gray-900 shadow-2xl w-full max-w-full max-h-[70vh] flex overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Left Side - Canvas Preview with Camera Viewports */}
        <div className="bg-gray-100 dark:bg-gray-950 flex flex-col flex-1 min-w-0">
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
        <div className="w-80 bg-white dark:bg-gray-900 flex flex-col border-l border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                title="Add Image"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleAddTextLayer}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                title="Add Text"
              >
                <TextIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowShapeToolbar(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                title="Add Shape"
              >
                <ShapeIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl leading-none"
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Scene Properties
                </h3>
                
                {/* Title */}
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Scene Title
                  </label>
                  <input
                    type="text"
                    value={editedScene.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title..."
                  />
                </div>

                {/* Content */}
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Content
                  </label>
                  <textarea
                    value={editedScene.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 whiteboard-text"
                    placeholder="Enter content..."
                  />
                </div>

                {/* Duration */}
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={editedScene.duration}
                    onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Background Image
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => backgroundImageInputRef.current?.click()}
                      className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                    >
                      {editedScene.backgroundImage ? 'Change Background' : 'Upload Background'}
                    </button>
                    {editedScene.backgroundImage && (
                      <button
                        onClick={() => handleChange('backgroundImage', null)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 text-sm transition-colors"
                        title="Remove background"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={backgroundImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Animation Type */}
                <div className="mt-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Animation Type
                  </label>
                  <select
                    value={editedScene.animation}
                    onChange={(e) => handleChange('animation', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>

                {/* Background Music */}
                <div className="mt-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1.5 font-medium">
                    Background Music
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => backgroundMusicInputRef.current?.click()}
                      className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                    >
                      {editedScene.backgroundMusic ? 'Change Music' : 'Upload Music'}
                    </button>
                    {editedScene.backgroundMusic && (
                      <button
                        onClick={() => handleChange('backgroundMusic', null)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 text-sm transition-colors"
                        title="Remove music"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={backgroundMusicInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleBackgroundMusicUpload}
                    className="hidden"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Background music plays for the entire scene
                  </p>
                </div>
              </div>

              {/* Scene Camera Sequence */}
              <CameraControls
                cameras={editedScene.cameras || []}
                onChange={(cameras) => handleChange('cameras', cameras)}
                type="scene"
              />

              {/* Camera Export Options */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Caméras
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={handleExportDefaultCamera}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export Caméra Par Défaut
                  </button>
                  
                  <button
                    onClick={handleExportAllCameras}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export Toutes Les Caméras
                  </button>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Export des vues caméra avec fond blanc, couche par couche
                </p>
              </div>

              {/* Layer Export Section */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm flex items-center gap-2">
                  <LayersIcon className="w-4 h-4" />
                  Export Couches (JSON)
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={handleExportAllLayers}
                    disabled={editedScene.layers.length === 0}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Export Toutes Les Couches
                  </button>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Export depuis JSON (pas de screenshot). Fond blanc, haute qualité. Supporte: images, texte, formes, whiteboard.
                </p>
              </div>

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
                                handleExportLayer(layer.id);
                              }}
                              className="p-1 hover:bg-purple-600 rounded"
                              title="Exporter couche (JSON)"
                            >
                              <Download className="w-3 h-3 text-purple-400" />
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
                      onChange={(e) => {
                        const newType = e.target.value;
                        const updates = { type: newType };
                        
                        // Initialize text_config when changing to text type
                        if (newType === 'text' && !selectedLayer.text_config) {
                          updates.text_config = {
                            text: 'Votre texte ici',
                            font: 'Arial',
                            size: 48,
                            color: [0, 0, 0],
                            style: 'normal',
                            line_height: 1.2,
                            align: 'left'
                          };
                        }
                        
                        setEditedScene({
                          ...editedScene,
                          layers: editedScene.layers.map(layer =>
                            layer.id === selectedLayer.id ? { ...layer, ...updates } : layer
                          )
                        });
                      }}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="text">Texte</option>
                      <option value="shape">Forme</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Text Configuration (only for text layers) */}
              {selectedLayer && selectedLayer.type === 'text' && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3 text-sm">
                    Configuration du Texte
                  </h3>

                  {/* Text Content */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Contenu du texte
                    </label>
                    <textarea
                      value={selectedLayer.text_config?.text || ''}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                        ...(selectedLayer.text_config || {}),
                        text: e.target.value
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Votre texte ici&#10;Utilisez Entrée pour les sauts de ligne"
                      rows="4"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Utilisez Entrée pour créer plusieurs lignes
                    </p>
                  </div>

                  {/* Font and Size */}
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Police
                      </label>
                      <select
                        value={selectedLayer.text_config?.font || 'Arial'}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                          ...(selectedLayer.text_config || {}),
                          font: e.target.value
                        })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Arial">Arial</option>
                        <option value="DejaVuSans">DejaVu Sans</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Taille
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="200"
                        value={selectedLayer.text_config?.size || 48}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                          ...(selectedLayer.text_config || {}),
                          size: parseInt(e.target.value) || 48
                        })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Couleur
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={
                          Array.isArray(selectedLayer.text_config?.color)
                            ? `#${selectedLayer.text_config.color.map(c => c.toString(16).padStart(2, '0')).join('')}`
                            : (selectedLayer.text_config?.color || '#000000')
                        }
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                            ...(selectedLayer.text_config || {}),
                            color: [r, g, b]
                          });
                        }}
                        className="h-10 w-16 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={
                          Array.isArray(selectedLayer.text_config?.color)
                            ? `#${selectedLayer.text_config.color.map(c => c.toString(16).padStart(2, '0')).join('')}`
                            : (selectedLayer.text_config?.color || '#000000')
                        }
                        onChange={(e) => {
                          const hex = e.target.value;
                          if (/^#[0-9A-F]{6}$/i.test(hex)) {
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                              ...(selectedLayer.text_config || {}),
                              color: [r, g, b]
                            });
                          }
                        }}
                        placeholder="#000000"
                        className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Style */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Style
                    </label>
                    <select
                      value={selectedLayer.text_config?.style || 'normal'}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                        ...(selectedLayer.text_config || {}),
                        style: e.target.value
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Gras</option>
                      <option value="italic">Italique</option>
                      <option value="bold_italic">Gras Italique</option>
                    </select>
                  </div>

                  {/* Line Height and Alignment */}
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Hauteur ligne
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={selectedLayer.text_config?.line_height || 1.2}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                          ...(selectedLayer.text_config || {}),
                          line_height: parseFloat(e.target.value) || 1.2
                        })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Alignement
                      </label>
                      <select
                        value={selectedLayer.text_config?.align || 'left'}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                          ...(selectedLayer.text_config || {}),
                          align: e.target.value
                        })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Shape Configuration (only for shape layers) */}
              {selectedLayer && selectedLayer.type === 'shape' && selectedLayer.shape_config && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3 text-sm">
                    Configuration de la Forme
                  </h3>

                  {/* Shape Type Display */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Type de forme
                    </label>
                    <div className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm">
                      {selectedLayer.shape_config.shape}
                    </div>
                  </div>

                  {/* Fill Color */}
                  {selectedLayer.shape_config.fill !== undefined && (
                    <div className="mb-3">
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Couleur de remplissage
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={selectedLayer.shape_config.fill || '#3B82F6'}
                          onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                            ...(selectedLayer.shape_config || {}),
                            fill: e.target.value
                          })}
                          className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedLayer.shape_config.fill || '#3B82F6'}
                          onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                            ...(selectedLayer.shape_config || {}),
                            fill: e.target.value
                          })}
                          placeholder="#3B82F6"
                          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Stroke Color */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Couleur de contour
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={selectedLayer.shape_config.stroke || '#1E40AF'}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                          ...(selectedLayer.shape_config || {}),
                          stroke: e.target.value
                        })}
                        className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedLayer.shape_config.stroke || '#1E40AF'}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                          ...(selectedLayer.shape_config || {}),
                          stroke: e.target.value
                        })}
                        placeholder="#1E40AF"
                        className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Stroke Width */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Épaisseur du contour: {selectedLayer.shape_config.strokeWidth || 2}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={selectedLayer.shape_config.strokeWidth || 2}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                        ...(selectedLayer.shape_config || {}),
                        strokeWidth: parseInt(e.target.value) || 2
                      })}
                      className="w-full"
                    />
                  </div>

                  {/* Fill Mode */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Mode de remplissage
                    </label>
                    <select
                      value={selectedLayer.shape_config.fillMode || 'both'}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                        ...(selectedLayer.shape_config || {}),
                        fillMode: e.target.value
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="both">Rempli et Contour</option>
                      <option value="fill">Rempli uniquement</option>
                      <option value="stroke">Contour uniquement</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Contrôle si la forme est remplie, contournée, ou les deux
                    </p>
                  </div>

                  {/* Corner Radius (for rectangles) */}
                  {selectedLayer.shape_config.shape === 'rectangle' && (
                    <div className="mb-3">
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Rayon des coins: {selectedLayer.shape_config.cornerRadius || 0}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={selectedLayer.shape_config.cornerRadius || 0}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                          ...(selectedLayer.shape_config || {}),
                          cornerRadius: parseInt(e.target.value) || 0
                        })}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Sides (for polygons) */}
                  {selectedLayer.shape_config.shape === 'polygon' && (
                    <div className="mb-3">
                      <label className="block text-gray-300 text-xs mb-1.5">
                        Nombre de côtés
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="12"
                        value={selectedLayer.shape_config.sides || 6}
                        onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                          ...(selectedLayer.shape_config || {}),
                          sides: parseInt(e.target.value) || 6
                        })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Text for text_box */}
                  {selectedLayer.shape_config.shape === 'text_box' && (
                    <>
                      <div className="mb-3">
                        <label className="block text-gray-300 text-xs mb-1.5">
                          Texte
                        </label>
                        <textarea
                          value={selectedLayer.shape_config.text || 'Text Box'}
                          onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                            ...(selectedLayer.shape_config || {}),
                            text: e.target.value
                          })}
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-gray-300 text-xs mb-1.5">
                          Taille de police
                        </label>
                        <input
                          type="number"
                          min="8"
                          max="72"
                          value={selectedLayer.shape_config.fontSize || 24}
                          onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                            ...(selectedLayer.shape_config || {}),
                            fontSize: parseInt(e.target.value) || 24
                          })}
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-gray-300 text-xs mb-1.5">
                          Couleur de fond
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={selectedLayer.shape_config.backgroundColor || '#F3F4F6'}
                            onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                              ...(selectedLayer.shape_config || {}),
                              backgroundColor: e.target.value
                            })}
                            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedLayer.shape_config.backgroundColor || '#F3F4F6'}
                            onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'shape_config', {
                              ...(selectedLayer.shape_config || {}),
                              backgroundColor: e.target.value
                            })}
                            placeholder="#F3F4F6"
                            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
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

              {/* Layer Audio Configuration */}
              {selectedLayer && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3 text-sm">
                    Audio de la Couche
                  </h3>
                  
                  <p className="text-gray-400 text-xs mb-3">
                    L'audio pour voix-off, effets sonores, etc. est configuré par couche
                  </p>

                  {/* Narration */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Narration / Voix-off (URL)
                    </label>
                    <input
                      type="text"
                      value={selectedLayer.audio?.narration || ''}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                        ...(selectedLayer.audio || {}),
                        narration: e.target.value || null
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/narration.mp3"
                    />
                  </div>

                  {/* Typewriter Sound */}
                  <div className="mb-3">
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Son de machine à écrire (URL)
                    </label>
                    <input
                      type="text"
                      value={selectedLayer.audio?.typewriter || ''}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                        ...(selectedLayer.audio || {}),
                        typewriter: e.target.value || null
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/typewriter.mp3"
                    />
                  </div>

                  {/* Drawing Sound */}
                  <div>
                    <label className="block text-gray-300 text-xs mb-1.5">
                      Son de dessin (URL)
                    </label>
                    <input
                      type="text"
                      value={selectedLayer.audio?.drawing || ''}
                      onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                        ...(selectedLayer.audio || {}),
                        drawing: e.target.value || null
                      })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/drawing.mp3"
                    />
                  </div>
                </div>
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
