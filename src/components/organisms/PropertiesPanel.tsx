import React from 'react';
import ScenePropertiesPanel from '../atoms/ScenePropertiesPanel';
import AudioManager from '../audio/AudioManager';
import { LayerPropertiesForm } from '../molecules';
import { useCurrentScene, useSceneStore, useScenesActions } from '@/app/scenes';

const PropertiesPanel: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  
  const { updateScene, updateLayer } = useScenesActions();

  if (!scene) {
    return (
      <div className="bg-white flex flex-col border-l border-border h-full">
        <div className="bg-secondary/30 px-4 py-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground text-xs text-center">
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
    <div className="bg-white flex flex-col border-l border-border overflow-hidden h-full">
      {/* Header */}
      <div className="bg-secondary/30 px-4 py-3 border-b border-border flex-shrink-0">
        <h2 className="text-base font-bold text-foreground">Propriétés</h2>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {/* Show Scene Properties when no layer is selected */}
          {!selectedLayer && (
            <ScenePropertiesPanel scene={scene} handleSceneChange={handleSceneChange} />
          )}

          {/* Show Selected Layer Properties */}
          {selectedLayer && (
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-1">Layer Properties</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedLayer.type === 'text' ? '📝 Text Layer' : 
                   selectedLayer.type === 'image' ? '🖼️ Image Layer' : 
                   selectedLayer.type === 'shape' ? '⬛ Shape Layer' : 'Layer'}
                </p>
              </div>
              <LayerPropertiesForm
                layer={selectedLayer}
                onPropertyChange={handleLayerPropertyChange}
              />
            </div>
          )}

          {/* Audio Manager - Always show */}
          <div className="border-t border-border pt-4">
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
    </div>
  );
};

export default PropertiesPanel;
