import React, { useRef } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowUp, ArrowDown, Copy, Trash2, Download, Upload, MoreVertical } from 'lucide-react';
import { useScenes, useSceneStore, useScenesActions } from '@/app/scenes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THUMBNAIL_CONFIG } from '@/utils/sceneThumbnail';

const ScenePanel: React.FC = () => {
  // Pour ouvrir asset library et shape toolbar
  // const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary); // No longer used for direct image upload
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const { scenes } = useScenes();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
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

  // Handle image file selection for direct upload/crop
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImageData({
        imageUrl: event.target?.result,
        fileName: file.name,
        originalUrl: event.target?.result,
        fileType: file.type
      });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="bg-white flex h-full shadow-sm">
      {/* Header - Now on the left side */}
      <div className="w-64 p-3 border-r border-border bg-secondary/30 flex flex-col flex-shrink-0">
       
        <Button
          onClick={handleAddScene}
          className="w-full gap-2 mb-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
        <Button
          onClick={() => imageInputRef.current?.click()}
          className="w-full gap-2 mb-2"
          size="sm"
          variant="outline"
        >
          <Upload className="w-4 h-4" />
          Ajouter une image
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />
        <Button
          onClick={() => setShowShapeToolbar(true)}
          className="w-full gap-2 mb-2"
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Ajouter une forme
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
            className={`flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-md relative group ${selectedSceneIndex === index
                ? 'border-primary shadow-md ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
              }`}
            onClick={() => setSelectedSceneIndex(index)}
          >
            <div className="p-0 relative">
              {/* Thumbnail - Full card */}
              <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-xs overflow-hidden border border-border">
                {scene.sceneImage ? (
                  <img
                    src={scene.sceneImage}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: THUMBNAIL_CONFIG.BACKGROUND_COLOR }}
                  />
                ) : scene.backgroundImage ? (
                  <img
                    src={scene.backgroundImage}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: THUMBNAIL_CONFIG.BACKGROUND_COLOR }}
                  />
                ) : (
                  <span className="text-4xl">📄</span>
                )}
              </div>

              {/* Scene number badge - top left */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Actions dropdown - top right, visible on hover or when selected */}
              <div className={`absolute top-2 right-2 ${selectedSceneIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveScene(index, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Déplacer à gauche
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveScene(index, 'down');
                      }}
                      disabled={index === scenes.length - 1}
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Déplacer à droite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateScene(index);
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScene(index);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ScenePanel;
