import React, { useRef } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowUp, ArrowDown, Copy, Trash2, Download, Upload } from 'lucide-react';

interface ScenePanelProps {
  scenes: any[];
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onDuplicateScene: (index: number) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onExportConfig: () => void;
  onImportConfig: (config: any) => void;
}

const ScenePanel: React.FC<ScenePanelProps> = ({
  scenes,
  selectedSceneIndex,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onDuplicateScene,
  onMoveScene,
  onExportConfig,
  onImportConfig,
}) => {
  const importInputRef = useRef<HTMLInputElement>(null);
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
          onClick={onAddScene}
          className="w-full gap-2 mb-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={onExportConfig}
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
            onChange={onImportConfig}
            className="hidden"
          />
        </div>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto p-3">
        {scenes.map((scene, index) => (
          <Card
            key={scene.id}
            className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
              selectedSceneIndex === index
                ? 'border-primary shadow-md bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelectScene(index)}
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
                      onMoveScene(index, 'up');
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
                      onMoveScene(index, 'down');
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
                      onDuplicateScene(index);
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
                      onDeleteScene(index);
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
