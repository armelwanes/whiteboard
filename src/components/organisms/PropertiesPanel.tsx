import React from 'react';
import AudioManager from '../audio/AudioManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayersListPanel, LayerPropertiesForm, ToolbarActions } from '../molecules';
import { ImageIcon } from 'lucide-react';

interface PropertiesPanelProps {
  scene: any;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onUpdateScene: (updates: any) => void;
  onUpdateLayer: (layerId: string, updates: any) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onAddText?: () => void;
  onAddShape?: () => void;
  [key: string]: any;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  scene, 
  selectedLayerId,
  onSelectLayer,
  onUpdateScene, 
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer,
  onImageUpload,
  onOpenAssetLibrary,
  onAddText,
  onAddShape,
  fileInputRef
}) => {
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
    <div className="bg-white flex flex-col border-l border-border overflow-hidden">
      {/* Header */}
      <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground">Propriétés</h2>
        <ToolbarActions
          fileInputRef={fileInputRef}
          onOpenAssetLibrary={onOpenAssetLibrary}
          onImageUpload={onImageUpload}
          onAddText={onAddText}
          onAddShape={onAddShape}
        />
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-5">
          {/* Scene Properties */}
          <div className="bg-secondary/30 rounded-lg p-4 border border-border">
            <h3 className="text-foreground font-semibold mb-3 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Propriétés de la Scène
            </h3>
            
            {/* Title */}
            <div className="mb-3">
              <label className="block text-foreground text-xs mb-1.5">
                Titre de la scène
              </label>
              <input
                type="text"
                value={scene.title || ''}
                onChange={(e) => handleSceneChange('title', e.target.value)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Entrez le titre..."
              />
            </div>

            {/* Content */}
            <div className="mb-3">
              <label className="block text-foreground text-xs mb-1.5">
                Contenu
              </label>
              <textarea
                value={scene.content || ''}
                onChange={(e) => handleSceneChange('content', e.target.value)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Entrez le contenu..."
              />
            </div>

            {/* Duration */}
            <div className="mb-3">
              <label className="block text-foreground text-xs mb-1.5">
                Durée (secondes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={scene.duration || 5}
                onChange={(e) => handleSceneChange('duration', parseInt(e.target.value) || 5)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Background Image */}
            <div className="mb-3">
              <label className="block text-foreground text-xs mb-1.5">
                Image de fond (URL)
              </label>
              <input
                type="text"
                value={scene.backgroundImage || ''}
                onChange={(e) => handleSceneChange('backgroundImage', e.target.value || null)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Animation Type */}
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Type d'animation
              </label>
              <Select
                value={scene.animation || 'fade'}
                onValueChange={(value) => handleSceneChange('animation', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Sélectionner une animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Layers List */}
          <LayersListPanel
            layers={scene.layers || []}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            onMoveLayer={onMoveLayer}
            onDuplicateLayer={onDuplicateLayer}
            onDeleteLayer={onDeleteLayer}
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
