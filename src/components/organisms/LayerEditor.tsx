import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, X, Save, Trash2, Eye, EyeOff, 
  MoveUp, MoveDown, Copy, Image as ImageIcon,
  Layers as LayersIcon, Type as TextIcon, Square as ShapeIcon, Download, Library,
  Music as MusicIcon, Video as VideoIcon
} from 'lucide-react';
import { 
  CameraControls, 
  LayerAnimationControls, 
  ImageCropModal, 
  EnhancedAudioManager,
  ParticleEditor,
  TextAnimationEditor 
} from '../molecules';
import SceneCanvas from './SceneCanvas';
import ShapeToolbar from './ShapeToolbar';
import AssetLibrary from './AssetLibrary';
import ThumbnailMaker from './ThumbnailMaker';
import ExportPanel from './ExportPanel';
import { createShapeLayer } from '../../utils/shapeUtils';
import { exportDefaultCameraView, exportAllCameras, downloadImage } from '../../utils/cameraExporter';
import { exportLayerFromJSON, downloadDataUrl, validateLayerJSON } from '../../utils/layerExporter';
import { exportSceneImage, downloadSceneImage } from '../../utils/sceneExporter';
import { addAsset } from '../../utils/assetManager';
import { useSceneStore } from '../../app/scenes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LayerEditorProps {
  scene: any;
  onClose: () => void;
  onSave: (scene: any) => void;
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string | null) => void;
}

const LayerEditor: React.FC<LayerEditorProps> = ({ 
  scene, 
  onClose, 
  onSave,
  selectedLayerId: externalSelectedLayerId,
  onSelectLayer: externalOnSelectLayer
}) => {
  // Get UI state from Zustand store
  const showShapeToolbar = useSceneStore((state) => state.showShapeToolbar);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const showAssetLibrary = useSceneStore((state) => state.showAssetLibrary);
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);

  const [editedScene, setEditedScene] = useState({ 
    ...scene,
    layers: scene.layers || [],
    sceneCameras: scene.sceneCameras || []
  });
  const [internalSelectedLayerId, setInternalSelectedLayerId] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  
  const selectedLayerId = externalSelectedLayerId !== undefined ? externalSelectedLayerId : internalSelectedLayerId;
  const setSelectedLayerId = (layerId: string | null) => {
    if (externalOnSelectLayer) {
      externalOnSelectLayer(layerId);
    } else {
      setInternalSelectedLayerId(layerId);
    }
  };
  const [showThumbnailMaker, setShowThumbnailMaker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundMusicInputRef = useRef<HTMLInputElement>(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalImageUrl = event.target.result;
        
        // Store pending image data with file name and original URL
        setPendingImageData({
          imageUrl: originalImageUrl,
          fileName: file.name,
          originalUrl: originalImageUrl,
          fileType: file.type
        });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleCropComplete = async (croppedImageUrl, imageDimensions) => {
    if (!pendingImageData) return;

    // Save ORIGINAL (uncropped) image to asset library
    try {
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: pendingImageData.originalUrl, // Save original, not cropped
        type: pendingImageData.fileType,
        tags: []
      });
    } catch (error) {
      console.error('Error saving asset to library:', error);
    }

    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    let cameraWidth = 800;
    let cameraHeight = 450;
    let cameraZoom = 0.8;
    
    if (selectedCamera && selectedCamera.position) {
      cameraCenterX = selectedCamera.position.x * sceneWidth;
      cameraCenterY = selectedCamera.position.y * sceneHeight;
      cameraWidth = selectedCamera.width || 800;
      cameraHeight = selectedCamera.height || 450;
      cameraZoom = selectedCamera.zoom || 0.8;
    }
    
    let calculatedScale = 1.0;
    if (imageDimensions) {
      const maxWidth = cameraWidth * 0.8;
      const maxHeight = cameraHeight * 0.8;
      
      const scaleX = maxWidth / imageDimensions.width;
      const scaleY = maxHeight / imageDimensions.height;
      
      calculatedScale = Math.min(scaleX, scaleY, 1.0) * cameraZoom;
    }
    
    const scaledImageWidth = imageDimensions ? imageDimensions.width * calculatedScale : 0;
    const scaledImageHeight = imageDimensions ? imageDimensions.height * calculatedScale : 0;
    
    const initialX = cameraCenterX - (scaledImageWidth / 2);
    const initialY = cameraCenterY - (scaledImageHeight / 2);
    
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

  const handleSelectAssetFromLibrary = (asset) => {
    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    let cameraWidth = 800;
    let cameraHeight = 450;
    let cameraZoom = 0.8;
    
    if (selectedCamera && selectedCamera.position) {
      cameraCenterX = selectedCamera.position.x * sceneWidth;
      cameraCenterY = selectedCamera.position.y * sceneHeight;
      cameraWidth = selectedCamera.width || 800;
      cameraHeight = selectedCamera.height || 450;
      cameraZoom = selectedCamera.zoom || 0.8;
    }
    
    let calculatedScale = 1.0;
    if (asset.width && asset.height) {
      const maxWidth = cameraWidth * 0.8;
      const maxHeight = cameraHeight * 0.8;
      
      const scaleX = maxWidth / asset.width;
      const scaleY = maxHeight / asset.height;
      calculatedScale = Math.min(scaleX, scaleY, 1.0) * cameraZoom;
    }
    
    const scaledImageWidth = asset.width ? asset.width * calculatedScale : 0;
    const scaledImageHeight = asset.height ? asset.height * calculatedScale : 0;
    
    const initialX = cameraCenterX - (scaledImageWidth / 2);
    const initialY = cameraCenterY - (scaledImageHeight / 2);
    
    const newLayer = {
      id: `layer-${Date.now()}`,
      image_path: asset.dataUrl,
      name: asset.name,
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
    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    let cameraZoom = 0.8;
    
    if (selectedCamera && selectedCamera.position) {
      cameraCenterX = selectedCamera.position.x * sceneWidth;
      cameraCenterY = selectedCamera.position.y * sceneHeight;
      cameraZoom = selectedCamera.zoom || 0.8;
    }
    
    const text = 'Votre texte ici';
    const fontSize = 48;
    const estimatedHeight = fontSize * 1.2;
    
    const scaledHeight = estimatedHeight * cameraZoom;
    
    const initialX = cameraCenterX;
    const initialY = cameraCenterY - (scaledHeight / 2);
    
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: 'Texte',
      position: { x: initialX, y: initialY },
      z_index: editedScene.layers.length + 1,
      skip_rate: 12,
      scale: cameraZoom,
      opacity: 1.0,
      mode: 'draw',
      type: 'text',
      text_config: {
        text: text,
        font: 'Arial',
        size: fontSize,
        color: [0, 0, 0],
        style: 'normal',
        line_height: 1.2,
        align: 'center'
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
    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    let cameraZoom = 0.8;
    
    if (selectedCamera && selectedCamera.position) {
      cameraCenterX = selectedCamera.position.x * sceneWidth;
      cameraCenterY = selectedCamera.position.y * sceneHeight;
      cameraZoom = selectedCamera.zoom || 0.8;
    }
    
    const shapeConfig = shapeLayer.shape_config;
    const scaledShapeConfig = { ...shapeConfig };
    
    if (shapeConfig.width !== undefined) {
      scaledShapeConfig.width = shapeConfig.width * cameraZoom;
    }
    if (shapeConfig.height !== undefined) {
      scaledShapeConfig.height = shapeConfig.height * cameraZoom;
    }
    if (shapeConfig.radius !== undefined) {
      scaledShapeConfig.radius = shapeConfig.radius * cameraZoom;
    }
    if (shapeConfig.radiusX !== undefined) {
      scaledShapeConfig.radiusX = shapeConfig.radiusX * cameraZoom;
    }
    if (shapeConfig.radiusY !== undefined) {
      scaledShapeConfig.radiusY = shapeConfig.radiusY * cameraZoom;
    }
    if (shapeConfig.innerRadius !== undefined) {
      scaledShapeConfig.innerRadius = shapeConfig.innerRadius * cameraZoom;
    }
    if (shapeConfig.outerRadius !== undefined) {
      scaledShapeConfig.outerRadius = shapeConfig.outerRadius * cameraZoom;
    }
    if (shapeConfig.size !== undefined) {
      scaledShapeConfig.size = shapeConfig.size * cameraZoom;
    }
    
    const shapeWidth = scaledShapeConfig.width || scaledShapeConfig.radius || scaledShapeConfig.size || 100;
    const shapeHeight = scaledShapeConfig.height || scaledShapeConfig.radius || scaledShapeConfig.size || 100;
    
    scaledShapeConfig.x = cameraCenterX - (shapeWidth / 2);
    scaledShapeConfig.y = cameraCenterY - (shapeHeight / 2);
    
    const updatedShapeLayer = {
      ...shapeLayer,
      z_index: editedScene.layers.length + 1,
      shape_config: scaledShapeConfig
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

  // Export complete scene as a single image
  const handleExportScene = async () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Export scene with all layers combined
      const dataUrl = await exportSceneImage(editedScene, {
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
      });
      
      const filename = `scene-${editedScene.id}-complete-${timestamp}.png`;
      downloadSceneImage(dataUrl, filename);
      alert('Scène exportée avec succès!');
    } catch (error) {
      console.error('Error exporting scene:', error);
      alert('Erreur lors de l\'export de la scène: ' + error.message);
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

    // Get the default camera for export
    const cameras = editedScene.sceneCameras || [];
    const defaultCamera = cameras.find(cam => cam.isDefault) || {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true
    };

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const dataUrl = await exportLayerFromJSON(layer, {
        camera: defaultCamera,
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
        sceneBackgroundImage: editedScene.backgroundImage, // Include scene background
      });
      

      const filename = `scene-${editedScene.id}-layer-${layer.name || layer.id}-${timestamp}.png`;
      downloadDataUrl(dataUrl, filename);
     // alert(`Couche "${layer.name || layer.id}" exportée avec succès!`);
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

    // Get the default camera for export
    const cameras = editedScene.sceneCameras || [];
    const defaultCamera = cameras.find(cam => cam.isDefault) || {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true
    };

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
            camera: defaultCamera,
            sceneWidth: sceneWidth,
            sceneHeight: sceneHeight,
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

  // Export a single layer with full scene dimensions
  const handleExportLayerFullScene = async (layerId) => {
    const layer = editedScene.layers.find(l => l.id === layerId);
    if (!layer) {
      alert('Couche non trouvée');
      return;
    }

    const validation = validateLayerJSON(layer);
    if (!validation.valid) {
      alert(`Couche invalide: ${validation.errors.join(', ')}`);
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const dataUrl = await exportLayerFromJSON(layer, {
        useFullScene: true,
        sceneWidth: sceneWidth,
        sceneHeight: sceneHeight,
        background: '#FFFFFF',
        pixelRatio: 1,
        sceneBackgroundImage: editedScene.backgroundImage, // Include scene background
      });
      
      const filename = `scene-${editedScene.id}-layer-${layer.name || layer.id}-fullscene-${timestamp}.png`;
      downloadDataUrl(dataUrl, filename);
      alert(`Couche "${layer.name || layer.id}" exportée avec dimensions complètes de la scène!`);
    } catch (error) {
      console.error('Error exporting layer with full scene:', error);
      alert(`Erreur lors de l'export de la couche: ${error.message}`);
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
    <div className="flex items-center justify-center w-full h-full">
      {/* Shape Toolbar Modal */}
      {showShapeToolbar && (
        <ShapeToolbar
          onAddShape={handleAddShape}
          onClose={() => setShowShapeToolbar(false)}
        />
      )}
      
      {/* Asset Library Modal */}
      {showAssetLibrary && (
        <AssetLibrary
          onClose={() => setShowAssetLibrary(false)}
          onSelectAsset={handleSelectAssetFromLibrary}
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
      
      {/* Thumbnail Maker Modal */}
      {showThumbnailMaker && (
        <ThumbnailMaker
          scene={editedScene}
          onClose={() => setShowThumbnailMaker(false)}
          onSave={(updatedScene) => {
            setEditedScene(updatedScene);
            setShowThumbnailMaker(false);
          }}
        />
      )}
      
      {/* Canvas Only - Properties Panel moved to AnimationContainer */}
      <div className="bg-secondary/20 dark:bg-secondary flex flex-col flex-1 w-full h-full min-w-0 relative">
        <SceneCanvas
          scene={editedScene}
          onUpdateScene={(updates) => setEditedScene({ ...editedScene, ...updates })}
          onUpdateLayer={handleUpdateLayer}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onSelectCamera={setSelectedCamera}
        />
        
        {/* Save Button - Floating Action Button */}
        <button
          onClick={handleSave}
          className="absolute bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:shadow-xl z-10"
          title="Sauvegarder les modifications"
        >
          <Save className="w-5 h-5" />
          <span>Sauvegarder</span>
        </button>
      </div>
    </div>
  );
};

export default LayerEditor;
