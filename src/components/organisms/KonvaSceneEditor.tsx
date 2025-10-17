
import React, { useState, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { Button } from '../atoms';
import { Upload, Save, RotateCw, FlipHorizontal2, FlipVertical2, Trash2, Type, X } from 'lucide-react';
import SceneImage from '../molecules/konva/SceneImage';
import SceneText from '../molecules/konva/SceneText';
import { STAGE_WIDTH, STAGE_HEIGHT, SceneObject, SceneType } from '../molecules/konva/types';



interface KonvaSceneEditorProps {
  scene: SceneType;
  onClose?: () => void;
  onSave: (scene: SceneType) => void;
}

const KonvaSceneEditor: React.FC<KonvaSceneEditorProps> = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState<SceneType>({
    ...scene,
    objects: scene.objects || []
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef(null);

  const handleSave = () => {
    onSave(editedScene);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const newObject: SceneObject = {
            id: `obj-${Date.now()}`,
            type: 'image',
            src: event.target && (event.target as FileReader).result ? (event.target as FileReader).result as string : '',
            name: file.name,
            x: 100,
            y: 100,
            width: Math.min(img.width, 300),
            height: Math.min(img.height, 300) * (img.height / img.width),
            rotation: 0,
            flipX: false,
            flipY: false,
          };
          setEditedScene(prev => ({
            ...prev,
            objects: [...prev.objects, newObject]
          }));
          setSelectedId(newObject.id);
        };
        if (event.target && (event.target as FileReader).result) {
          img.src = (event.target as FileReader).result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    const newObject: SceneObject = {
      id: `obj-${Date.now()}`,
      type: 'text',
      content: 'Nouveau texte',
      x: 100,
      y: 100,
      width: 200,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      rotation: 0,
    };
    setEditedScene(prev => ({
      ...prev,
      objects: [...prev.objects, newObject]
    }));
    setSelectedId(newObject.id);
  };

  const handleUpdateObject = (updatedObject: SceneObject) => {
    setEditedScene(prev => ({
      ...prev,
      objects: prev.objects.map((obj: SceneObject) =>
        obj.id === updatedObject.id ? updatedObject : obj
      )
    }));
  };

  const handleDeleteObject = (objectId: string | null) => {
    setEditedScene(prev => ({
      ...prev,
      objects: prev.objects.filter((obj: SceneObject) => obj.id !== objectId)
    }));
    setSelectedId(null);
  };

  const handleRotate = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find((o: SceneObject) => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, rotation: (obj.rotation + 90) % 360 });
    }
  };

  const handleFlipHorizontal = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find((o: SceneObject) => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, flipX: !obj.flipX });
    }
  };

  const handleFlipVertical = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find((o: SceneObject) => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, flipY: !obj.flipY });
    }
  };

  const selectedObject = editedScene.objects.find((obj: SceneObject) => obj.id === selectedId);

  return (
    <div className="bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full  overflow-hidden flex border border-border">
        {/* Left Side - Canvas Editor */}
        <div className="flex-1 bg-secondary/30/30 relative flex flex-col">
          {/* Canvas Header */}
          <div className="flex items-center justify-between gap-2 p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddText}
              >
                <Type className="w-4 h-4 mr-2" />
                Ajouter Texte
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Fermer l'éditeur"
                  onClick={onClose}
                  className="ml-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden flex items-start justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-border"
             >
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                ref={stageRef}
                onMouseDown={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    setSelectedId(null);
                  }
                }}
                style={{
                  backgroundImage: editedScene.backgroundImage 
                    ? `url(${editedScene.backgroundImage})` 
                    : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Layer>
                  {editedScene.objects.map((obj) => {
                    if (obj.type === 'image') {
                      return (
                        <SceneImage
                          key={obj.id}
                          image={obj}
                          isSelected={obj.id === selectedId}
                          onSelect={() => setSelectedId(obj.id)}
                          onChange={handleUpdateObject}
                        />
                      );
                    } else if (obj.type === 'text') {
                      return (
                        <SceneText
                          key={obj.id}
                          text={obj}
                          isSelected={obj.id === selectedId}
                          onSelect={() => setSelectedId(obj.id)}
                          onChange={handleUpdateObject}
                        />
                      );
                    }
                    return null;
                  })}
                  
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Object Controls */}
          {selectedObject && (
            <div className="bg-secondary/30 border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium mr-4">
                  {selectedObject.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipHorizontal}
                >
                  <FlipHorizontal2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipVertical}
                >
                  <FlipVertical2 className="w-4 h-4" />
                </Button>
                <div className="flex-1" />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteObject(selectedId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KonvaSceneEditor;
