import ScenePropertiesPanel from '../atoms/ScenePropertiesPanel';
interface PropertiesPanelHeaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  openAssetLibrary: () => void;
  imageUpload: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertiesPanelHeader: React.FC<PropertiesPanelHeaderProps> = ({
  fileInputRef,
  openAssetLibrary,
  imageUpload,
  handleFileChange
}) => (
  <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
    <h2 className="text-xl font-bold text-foreground">Propriétés</h2>
    <ToolbarActions
      fileInputRef={fileInputRef}
      onOpenAssetLibrary={openAssetLibrary}
      onImageUpload={imageUpload}
    />
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
  </div>
);
import AudioManager from '../audio/AudioManager';
import { LayersListPanel, LayerPropertiesForm, ToolbarActions } from '../molecules';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import React, { useRef } from 'react';

const PropertiesPanel: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const updateScene = useSceneStore((state) => state.updateScene);
  const updateLayer = useSceneStore((state) => state.updateLayer);
  const deleteLayer = useSceneStore((state) => state.deleteLayer);
  const duplicateLayer = useSceneStore((state) => state.duplicateLayer);
  const moveLayer = useSceneStore((state) => state.moveLayer);
  // Asset library actions
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const openAssetLibrary = () => setShowAssetLibrary(true);
  // Image upload
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const imageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string' && scene?.id) {
        updateScene(scene.id, { backgroundImage: result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
    updateScene(scene.id, { [field]: value });
  };

  const handleLayerPropertyChange = (layerId: string, property: string, value: any) => {
    if (!scene.id) return;
    updateLayer(scene.id, layerId, { [property]: value });
  };

  return (
    <div className="bg-white flex flex-col border-l border-border overflow-hidden">
      <PropertiesPanelHeader
        fileInputRef={fileInputRef}
        openAssetLibrary={openAssetLibrary}
        imageUpload={imageUpload}
        handleFileChange={handleFileChange}
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
            onMoveLayer={moveLayer}
            onDuplicateLayer={duplicateLayer}
            onDeleteLayer={(layerId: string) => {
              if (!scene.id) return;
              deleteLayer(scene.id, layerId);
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
              updateScene(scene.id, updates);
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
