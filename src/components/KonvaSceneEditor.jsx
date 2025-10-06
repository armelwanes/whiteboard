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
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex border border-gray-700">
        {/* Left Side - Canvas Editor */}
        <div className="flex-1 bg-gray-800/30 relative flex flex-col">
          {/* Canvas Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Éditeur de Scène</h3>
              <p className="text-sm text-gray-400">
                Glissez-déposez et redimensionnez les objets
              </p>
            </div>
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
          <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-700"
              style={{ width: 960, height: 540 }}
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
                  
                  {/* Text overlay for title */}
                  <Rect
                    x={0}
                    y={0}
                    width={960}
                    height={540}
                    fill="rgba(0, 0, 0, 0.4)"
                    listening={false}
                  />
                  
                  {/* Title Text */}
                  {editedScene.title && (
                    <Text
                      x={0}
                      y={220}
                      width={960}
                      text={editedScene.title}
                      fontSize={48}
                      fontStyle="bold"
                      fill="white"
                      align="center"
                      shadowColor="black"
                      shadowBlur={10}
                      shadowOffset={{ x: 2, y: 2 }}
                      shadowOpacity={0.8}
                      listening={false}
                    />
                  )}
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

        {/* Right Side - Properties Panel */}
        <div className="w-96 bg-gray-800 flex flex-col border-l border-gray-700">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold">Propriétés</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la scène</Label>
                <Input
                  id="title"
                  value={editedScene.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Entrez le titre..."
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={editedScene.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Entrez le contenu..."
                  rows={4}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (secondes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="60"
                  value={editedScene.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                />
              </div>

              {/* Background Image */}
              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Image de fond (URL)</Label>
                <Input
                  id="backgroundImage"
                  value={editedScene.backgroundImage || ''}
                  onChange={(e) => handleChange('backgroundImage', e.target.value || null)}
                  placeholder="https://example.com/image.jpg"
                />
                {editedScene.backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={editedScene.backgroundImage}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Animation Type */}
              <div className="space-y-2">
                <Label htmlFor="animation">Type d'animation</Label>
                <select
                  id="animation"
                  value={editedScene.animation}
                  onChange={(e) => handleChange('animation', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="scale">Scale</option>
                </select>
              </div>

              {/* Objects List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Objets ({editedScene.objects.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {editedScene.objects.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        Aucun objet pour le moment
                      </p>
                    ) : (
                      editedScene.objects.map((obj) => (
                        <div
                          key={obj.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                            selectedId === obj.id
                              ? 'bg-blue-600/10 border-primary'
                              : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                          }`}
                          onClick={() => setSelectedId(obj.id)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl">🖼️</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {obj.name || 'Image'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {Math.round(obj.width)} × {Math.round(obj.height)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteObject(obj.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KonvaSceneEditor;
