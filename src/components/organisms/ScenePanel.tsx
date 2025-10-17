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
    await createScene({});
    setSelectedSceneIndex(scenes.length);
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
    await duplicateScene(scene.id);
    setSelectedSceneIndex(scenes.length);
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
    <div className="bg-white border-r border-border flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-foreground font-bold text-lg">Scènes</h2>
            <p className="text-muted-foreground text-xs mt-0.5">{scenes.length} scène{scenes.length > 1 ? 's' : ''}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-base">{scenes.length}</span>
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
            Export
          </Button>
          <Button
            onClick={() => importInputRef.current?.click()}
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            title="Importer une configuration"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
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

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto p-3">
        {scenes.map((scene: any, index: number) => (
          <Card
            key={scene.id}
            className={`mb-2 cursor-pointer transition-all hover:shadow-md ${selectedSceneIndex === index
                ? 'border-primary shadow-md bg-primary/5'
                : 'border-border hover:border-primary/50'
              }`}
            onClick={() => setSelectedSceneIndex(index)}
          >
            <div className="p-2.5">
              {/* Thumbnail and Info */}
              <div className="flex gap-2 mb-2">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-12 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-xs overflow-hidden shadow-sm border border-border">
                  {scene.backgroundImage ? (
                    <img
                      src={scene.backgroundImage}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">📄</span>
                  )}
                </div>

                {/* Scene Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-foreground font-semibold text-xs truncate">
                      {index + 1}. {scene.title}
                    </h3>
                  </div>
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
              </div>

              {/* Scene Actions */}
              {selectedSceneIndex === index && (
                <div className="flex gap-1 pt-2 border-t border-border">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'up');
                    }}
                    disabled={index === 0}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    title="Déplacer vers le haut"
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
                    className="flex-1"
                    title="Déplacer vers le bas"
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
                    className="flex-1"
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
                    className="flex-1"
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
  );
};

export default ScenePanel;
