import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '../atoms';
import { Upload, X, Save, RotateCw, FlipHorizontal2, FlipVertical2, Trash2, Type } from 'lucide-react';

// Canvas dimensions
const STAGE_WIDTH = 960;
const STAGE_HEIGHT = 540;

interface SceneImageProps {
  image: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
}

interface SceneTextProps {
  text: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
}

// Konva Image Component
const SceneImage: React.FC<SceneImageProps> = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

  // Boundary constraint function for dragging
  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = imageRef.current;
    if (!node) return pos;

    const width = node.width();
    const height = node.height();
    
    let newX = pos.x;
    let newY = pos.y;

    // Constrain X position
    if (newX < 0) newX = 0;
    if (newX + width > STAGE_WIDTH) newX = STAGE_WIDTH - width;

    // Constrain Y position
    if (newY < 0) newY = 0;
    if (newY + height > STAGE_HEIGHT) newY = STAGE_HEIGHT - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        scaleX={image.flipX ? -1 : 1}
        scaleY={image.flipY ? -1 : 1}
        draggable
        dragBoundFunc={dragBoundFunc}
        onClick={onSelect}
        onTap={onSelect}
        ref={imageRef}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
          
          // Reset scale
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraint
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            // Boundary constraint - keep object within stage
            if (newBox.x < 0 || newBox.y < 0 || 
                newBox.x + newBox.width > STAGE_WIDTH || 
                newBox.y + newBox.height > STAGE_HEIGHT) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};

// Konva Text Component
const SceneText: React.FC<SceneTextProps> = ({ text, isSelected, onSelect, onChange }) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Boundary constraint function for dragging
  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = textRef.current;
    if (!node) return pos;

    const width = node.width();
    const height = node.height();
    
    let newX = pos.x;
    let newY = pos.y;

    // Constrain X position
    if (newX < 0) newX = 0;
    if (newX + width > STAGE_WIDTH) newX = STAGE_WIDTH - width;

    // Constrain Y position
    if (newY < 0) newY = 0;
    if (newY + height > STAGE_HEIGHT) newY = STAGE_HEIGHT - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <Text
        text={text.content}
        x={text.x}
        y={text.y}
        fontSize={text.fontSize || 24}
        fontFamily={text.fontFamily || 'Arial'}
        fill={text.color || '#000000'}
        width={text.width}
        rotation={text.rotation || 0}
        draggable
        dragBoundFunc={dragBoundFunc}
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        onDragEnd={(e) => {
          onChange({
            ...text,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...text,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            fontSize: Math.max(10, (text.fontSize || 24) * scaleY),
            rotation: node.rotation(),
          });
          
          // Reset scale
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraint
            if (newBox.width < 20) {
              return oldBox;
            }

            // Boundary constraint - keep text within stage
            if (newBox.x < 0 || newBox.y < 0 || 
                newBox.x + newBox.width > STAGE_WIDTH || 
                newBox.y + newBox.height > STAGE_HEIGHT) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};

const KonvaSceneEditor = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState({ 
    ...scene,
    objects: scene.objects || []
  });
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality with debouncing
  useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a new timeout to auto-save after 500ms of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      if (onSave && editedScene) {
        onSave(editedScene);
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editedScene, onSave]);

  const handleChange = (field, value) => {
    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleSave = () => {
    onSave(editedScene);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newObject = {
            id: `obj-${Date.now()}`,
            type: 'image',
            src: event.target.result,
            name: file.name,
            x: 100,
            y: 100,
            width: Math.min(img.width, 300),
            height: Math.min(img.height, 300) * (img.height / img.width),
            rotation: 0,
            flipX: false,
            flipY: false,
          };
          setEditedScene({
            ...editedScene,
            objects: [...editedScene.objects, newObject]
          });
          setSelectedId(newObject.id);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    const newObject = {
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
    setEditedScene({
      ...editedScene,
      objects: [...editedScene.objects, newObject]
    });
    setSelectedId(newObject.id);
  };

  const handleUpdateObject = (updatedObject) => {
    setEditedScene({
      ...editedScene,
      objects: editedScene.objects.map(obj =>
        obj.id === updatedObject.id ? updatedObject : obj
      )
    });
  };

  const handleDeleteObject = (objectId) => {
    setEditedScene({
      ...editedScene,
      objects: editedScene.objects.filter(obj => obj.id !== objectId)
    });
    setSelectedId(null);
  };

  const handleRotate = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find(o => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, rotation: (obj.rotation + 90) % 360 });
    }
  };

  const handleFlipHorizontal = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find(o => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, flipX: !obj.flipX });
    }
  };

  const handleFlipVertical = () => {
    if (!selectedId) return;
    const obj = editedScene.objects.find(o => o.id === selectedId);
    if (obj) {
      handleUpdateObject({ ...obj, flipY: !obj.flipY });
    }
  };

  const selectedObject = editedScene.objects.find(obj => obj.id === selectedId);

  return (
    <div className="bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full  overflow-hidden flex border border-border">
        {/* Left Side - Canvas Editor */}
        <div className="flex-1 bg-secondary/30/30 relative flex flex-col">
          {/* Canvas Header */}
          <div className="flex items-center justify-between gap-2">
            
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
