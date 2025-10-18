import React, { useRef } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowUp, ArrowDown, Copy, Trash2, Download, Upload } from 'lucide-react';
import { useScenes, useSceneStore, useScenesActions } from '@/app/scenes';

const ScenePanel: React.FC = () => {
  const { scenes } = useScenes();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  // Use actions from useScenesActions hook
  const { createScene, deleteScene, duplicateScene, reorderScenes } = useScenesActions();

  const handleAddScene = async () => {
    const currentLength = scenes.length;
    await createScene({});
    // After creation, the new scene will be at the end of the array
    // React Query will refetch and scenes array will have +1 length
    // So we set to currentLength which will be the new scene's index
    setSelectedSceneIndex(currentLength);
  };

  const handleMoveScene = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scenes.length) return;

    const reorderedScenes = [...scenes];
    const [movedScene] = reorderedScenes.splice(index, 1);
    reorderedScenes.splice(newIndex, 0, movedScene);

    await reorderScenes(reorderedScenes.map(s => s.id));
    setSelectedSceneIndex(newIndex);
  };

  const handleDuplicateScene = async (index: number) => {
    const scene = scenes[index];
    const currentLength = scenes.length;
    await duplicateScene(scene.id);
    // After duplication, the new scene will be at the end of the array
    setSelectedSceneIndex(currentLength);
  };

  const handleDeleteScene = async (index: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette scène ?')) return;
    
    const scene = scenes[index];
    await deleteScene(scene.id);
    
    // Adjust selected index after deletion
    if (selectedSceneIndex >= scenes.length - 1) {
      setSelectedSceneIndex(Math.max(0, scenes.length - 2));
    }
  };

  return (
    <div className="bg-white flex h-full shadow-sm">
      {/* Header - Now on the left side */}
      <div className="w-64 p-3 border-r border-border bg-secondary/30 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-foreground font-bold text-base">Scènes</h2>
            <p className="text-muted-foreground text-xs mt-0.5">{scenes.length} scène{scenes.length > 1 ? 's' : ''}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{scenes.length}</span>
          </div>
        </div>
        <Button
          onClick={handleAddScene}
          className="w-full gap-2 mb-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => { }}
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            title="Exporter la configuration"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={() => importInputRef.current?.click()}
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            title="Importer une configuration"
          >
            <Upload className="w-3.5 h-3.5" />
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={() => { }}
            className="hidden"
          />
        </div>
      </div>

      {/* Scenes List - Now horizontal */}
      <div className="flex-1 overflow-x-auto p-3">
        <div className="flex gap-3 h-full">
        {scenes.map((scene: any, index: number) => (
          <Card
            key={scene.id}
            className={`flex-shrink-0 w-56 cursor-pointer transition-all hover:shadow-md ${selectedSceneIndex === index
                ? 'border-primary shadow-md bg-primary/5'
                : 'border-border hover:border-primary/50'
              }`}
            onClick={() => setSelectedSceneIndex(index)}
          >
            <div className="p-2.5">
              {/* Thumbnail */}
              <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-xs overflow-hidden shadow-sm border border-border mb-2">
                {scene.sceneImage ? (
                  <img
                    src={scene.sceneImage}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                ) : scene.backgroundImage ? (
                  <img
                    src={scene.backgroundImage}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">📄</span>
                )}
              </div>

              {/* Scene Info */}
              <div className="mb-2">
                <h3 className="text-foreground font-semibold text-xs truncate mb-1">
                  {index + 1}. {scene.title}
                </h3>
                <p className="text-muted-foreground text-xs truncate mb-1.5 leading-relaxed">
                  {scene.content}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    ⏱ {scene.duration}s
                  </span>
                  {scene.layers && scene.layers.length > 0 && (
                    <span className="flex items-center gap-1">
                      🖼️ {scene.layers.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Scene Actions */}
              {selectedSceneIndex === index && (
                <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'up');
                    }}
                    disabled={index === 0}
                    variant="outline"
                    size="sm"
                    className="p-1"
                    title="Déplacer vers la gauche"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'down');
                    }}
                    disabled={index === scenes.length - 1}
                    variant="outline"
                    size="sm"
                    className="p-1"
                    title="Déplacer vers la droite"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateScene(index);
                    }}
                    variant="outline"
                    size="sm"
                    className="p-1"
                    title="Dupliquer"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScene(index);
                    }}
                    variant="destructive"
                    size="sm"
                    className="p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ScenePanel;
