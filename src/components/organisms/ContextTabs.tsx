import React, { useState, useRef } from 'react';
import { Button } from '../atoms';
import { Image, Type, Shapes, Layers as LayersIcon, Plus, Upload } from 'lucide-react';
import { useCurrentScene, useSceneStore, useScenesActions } from '@/app/scenes';
import { LayersListPanel } from '../molecules/properties';
import { useLayerCreation } from '../molecules/layer-management';
import { addAsset } from '@/utils/assetManager';
import AssetCategoryGrid from '../molecules/AssetCategoryGrid';

type TabType = 'characters' | 'props' | 'layers' | 'text';

const ContextTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('layers');
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updateLayer, deleteLayer, moveLayer, duplicateLayer, addLayer } = useScenesActions();
  const { createTextLayer, createImageLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: null
  });

  const tabs = [
    { id: 'characters' as TabType, label: 'Characters', icon: Image },
    { id: 'props' as TabType, label: 'Props', icon: Shapes },
    { id: 'layers' as TabType, label: 'Layers', icon: LayersIcon },
    { id: 'text' as TabType, label: 'Text', icon: Type },
  ];

  const handleAddText = async () => {
    if (!scene?.id) return;
    try {
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      await addLayer({ sceneId: scene.id, layer: newTextLayer });
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scene?.id) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        try {
          await addAsset({
            name: file.name,
            dataUrl: result,
            type: file.type,
            tags: []
          });

          const newLayer = createImageLayer(result, file.name, null, scene.layers?.length || 0);
          await addLayer({ sceneId: scene.id, layer: newLayer });
        } catch (error) {
          console.error('Error adding image:', error);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white border-r border-border flex flex-col h-full shadow-sm">
      {/* Tabs Header */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-3 flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'characters' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Characters</h3>
              <Button
                onClick={() => setShowAssetLibrary(true)}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Browse
              </Button>
            </div>
            <AssetCategoryGrid
              categoryTag="character"
              onBrowseAssets={() => setShowAssetLibrary(true)}
            />
          </div>
        )}

        {activeTab === 'props' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Props</h3>
              <Button
                onClick={() => setShowAssetLibrary(true)}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Browse
              </Button>
            </div>
            <AssetCategoryGrid
              categoryTag="props"
              onBrowseAssets={() => setShowAssetLibrary(true)}
            />
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Layers</h3>
              <div className="flex gap-1">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  title="Add Image"
                >
                  <Upload className="w-3 h-3" />
                </Button>
                <Button
                  onClick={handleAddText}
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Text
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {scene && scene.layers && scene.layers.length > 0 ? (
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
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No layers in this scene. Add images or text to get started.
              </p>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Text Tools</h3>
              <Button
                onClick={handleAddText}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Add and format text layers for your scene
              </p>
              <Button
                onClick={handleAddText}
                variant="outline"
                className="w-full gap-2"
                size="sm"
              >
                <Type className="w-4 h-4" />
                Add Text Layer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextTabs;
