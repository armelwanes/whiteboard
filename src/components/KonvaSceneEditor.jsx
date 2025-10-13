import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, X, Save, RotateCw, FlipHorizontal2, FlipVertical2, Trash2 } from 'lucide-react';

// Konva Image Component
const SceneImage = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const imageRef = useRef();
  const transformerRef = useRef();

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

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
            if (newBox.width < 5 || newBox.height < 5) {
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
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full  overflow-hidden flex border border-gray-700">
        {/* Left Side - Canvas Editor */}
        <div className="flex-1 bg-gray-800/30 relative flex flex-col">
          {/* Canvas Header */}
          <div className="flex items-center justify-between">
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer Image
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
              className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-700"
             >
              <Stage
                width={960}
                height={540}
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
                  {editedScene.objects.map((obj) => (
                    <SceneImage
                      key={obj.id}
                      image={obj}
                      isSelected={obj.id === selectedId}
                      onSelect={() => setSelectedId(obj.id)}
                      onChange={handleUpdateObject}
                    />
                  ))}
                  
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Object Controls */}
          {selectedObject && (
            <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
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
