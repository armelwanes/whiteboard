import ScenePropertiesPanel from '../atoms/ScenePropertiesPanel';
import { ImageCropModal } from '../molecules';
interface PropertiesPanelHeaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  openAssetLibrary: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddText: () => void;
}

const PropertiesPanelHeader: React.FC<PropertiesPanelHeaderProps> = ({
  fileInputRef,
  openAssetLibrary,
  handleImageUpload,
  onAddText
}) => (
  <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
    <h2 className="text-xl font-bold text-foreground">Propriétés</h2>
    <ToolbarActions
      fileInputRef={fileInputRef}
      onOpenAssetLibrary={openAssetLibrary}
      onImageUpload={handleImageUpload}
      onAddText={onAddText}
    />
  </div>
);
import AudioManager from '../audio/AudioManager';
import { LayersListPanel, LayerPropertiesForm, ToolbarActions } from '../molecules';
import { useCurrentScene, useSceneStore, useScenesActions } from '@/app/scenes';
import React, { useRef, useState } from 'react';
import { useLayerCreation } from '../molecules/layer-management';
import { addAsset } from '@/utils/assetManager';

const PropertiesPanel: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  
  // Use actions from useScenesActions hook instead of store
  const { updateScene, updateLayer, deleteLayer, moveLayer, duplicateLayer, addLayer } = useScenesActions();
  
  // Layer creation for text and images
  const { createTextLayer, createImageLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: null
  });

  // State for image crop modal
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<{
    imageUrl: string;
    fileName: string;
    fileType: string;
    originalUrl: string;
  } | null>(null);
  
  // Asset library actions
  const openAssetLibrary = () => setShowAssetLibrary(true);
  
  // Image upload - now with crop functionality
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setPendingImageData({
          imageUrl: result,
          fileName: file.name,
          fileType: file.type,
          originalUrl: result
        });
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions?: { width: number; height: number }) => {
    if (!pendingImageData || !scene?.id) return;

    try {
      // Save asset to library
      await addAsset({
        name: pendingImageData.fileName,
        dataUrl: pendingImageData.originalUrl,
        type: pendingImageData.fileType,
        tags: []
      });

      // Create image layer
      const newLayer = createImageLayer(
        croppedImageUrl,
        pendingImageData.fileName,
        imageDimensions || null,
        scene.layers?.length || 0
      );

      // Add layer to scene
      await addLayer({ sceneId: scene.id, layer: newLayer });
    } catch (error) {
      console.error('Error adding image layer:', error);
      alert('Erreur lors de l\'ajout de l\'image');
    } finally {
      setShowCropModal(false);
      setPendingImageData(null);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  // Text addition
  const handleAddText = async () => {
    if (!scene?.id) return;
    
    try {
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      await addLayer({ sceneId: scene.id, layer: newTextLayer });
      // Select the newly created text layer
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
      alert('Erreur lors de l\'ajout du texte');
    }
  };

  if (!scene) {
    return (
      <div className="bg-white flex flex-col border-l border-border">
        <div className="bg-secondary/30 px-6 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-muted-foreground text-sm text-center">
            Sélectionnez une scène pour voir ses propriétés
          </p>
        </div>
      </div>
    );
  }

  const selectedLayer = scene.layers?.find((layer: any) => layer.id === selectedLayerId);

  const handleSceneChange = (field: string, value: any) => {
    if (!scene.id) return;
    updateScene({ id: scene.id, data: { [field]: value } });
  };

  const handleLayerPropertyChange = (layerId: string, property: string, value: any) => {
    if (!scene.id) return;
    updateLayer({ sceneId: scene.id, layerId, data: { [property]: value } });
  };

  return (
    <div className="bg-white flex flex-col border-l border-border overflow-hidden">
      {/* Crop Modal */}
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <PropertiesPanelHeader
        fileInputRef={fileInputRef}
        openAssetLibrary={openAssetLibrary}
        handleImageUpload={handleImageUpload}
        onAddText={handleAddText}
      />

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-5">
          {/* Scene Properties */}
          <ScenePropertiesPanel scene={scene} handleSceneChange={handleSceneChange} />

          {/* Layers List */}
          <LayersListPanel
            layers={scene.layers || []}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onMoveLayer={(layerId, direction) => {
              if (!scene.id) return;
              moveLayer({ sceneId: scene.id, layerId, direction });
            }}
            onDuplicateLayer={(layerId) => {
              if (!scene.id) return;
              duplicateLayer({ sceneId: scene.id, layerId });
            }}
            onDeleteLayer={(layerId: string) => {
              if (!scene.id) return;
              deleteLayer({ sceneId: scene.id, layerId });
            }}
          />

          {/* Selected Layer Properties */}
          {selectedLayer && (
            <LayerPropertiesForm
              layer={selectedLayer}
              onPropertyChange={handleLayerPropertyChange}
            />
          )}

          {/* Audio Manager */}
          <AudioManager
            scene={scene}
            onSceneUpdate={(updates: any) => {
              if (!scene.id) return;
              updateScene({ id: scene.id, data: updates });
            }}
            currentTime={0}
            isPlaying={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
