import React, { useState, useRef } from 'react';
import Scene from './Scene';
import EnhancedAudioManager from './EnhancedAudioManager';
import ThumbnailMaker from './ThumbnailMaker';
import { ScenePropertiesForm } from './molecules/scene/ScenePropertiesForm';
import { ObjectsList } from './molecules/scene/ObjectsList';

interface SceneEditorProps {
  scene: any;
  onClose: () => void;
  onSave: (scene: any) => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState({ 
    ...scene,
    objects: scene.objects || []
  });
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [showThumbnailMaker, setShowThumbnailMaker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleSave = () => {
    onSave(editedScene);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            zIndex: editedScene.objects.length + 1,
          };
          setEditedScene({
            ...editedScene,
            objects: [...editedScene.objects, newObject]
          });
          setSelectedObjectId(newObject.id);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateObject = (objectId, updates) => {
    setEditedScene({
      ...editedScene,
      objects: editedScene.objects.map(obj =>
        obj.id === objectId ? { ...obj, ...updates } : obj
      )
    });
  };

  const handleDeleteObject = (objectId) => {
    setEditedScene({
      ...editedScene,
      objects: editedScene.objects.filter(obj => obj.id !== objectId)
    });
    setSelectedObjectId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Thumbnail Maker Modal */}
      {showThumbnailMaker && (
        <ThumbnailMaker
          scene={editedScene}
          onClose={() => setShowThumbnailMaker(false)}
          onSave={(thumbnail) => {
            setEditedScene({ ...editedScene, thumbnail });
            setShowThumbnailMaker(false);
          }}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex">
        {/* Left Side - Scene Preview */}
        <div className="flex-1 bg-secondary relative">
          <div className="absolute inset-0 overflow-hidden">
            <Scene
              {...editedScene}
              isActive={true}
              objects={editedScene.objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
              onUpdateObject={handleUpdateObject}
              onDeleteObject={handleDeleteObject}
              isEditing={true}
            />
          </div>
          
          {/* Image Upload Button - Floating */}
          <div className="absolute top-4 right-4 z-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl">🖼️</span>
              <span>Importer une image</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-secondary/30 bg-opacity-90 rounded-lg px-4 py-3 text-sm text-foreground max-w-md">
            <p className="font-semibold mb-2">💡 Aide:</p>
            <ul className="space-y-1 text-xs">
              <li>• Cliquez sur "Importer une image" pour ajouter une image</li>
              <li>• Cliquez et glissez pour déplacer l'image</li>
              <li>• Utilisez les poignées bleues pour redimensionner</li>
              <li>• Utilisez les boutons pour retourner ou faire pivoter</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Properties Panel */}
        <div className="w-96 bg-white flex flex-col border-l border-border">
          {/* Header */}
          <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Propriétés</h2>
              <button
                onClick={() => setShowThumbnailMaker(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                title="Créer Miniature"
              >
                <span className="text-base">📹</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              <ScenePropertiesForm 
                scene={editedScene}
                onChange={handleChange}
              />

              <ObjectsList
                objects={editedScene.objects}
                selectedObjectId={selectedObjectId}
                onSelectObject={setSelectedObjectId}
                onDeleteObject={handleDeleteObject}
              />

              {/* Enhanced Audio Manager */}
              <div>
                <EnhancedAudioManager 
                  scene={editedScene}
                  onSceneUpdate={setEditedScene}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-secondary/30 px-6 py-4 border-t border-border flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-secondary hover:bg-secondary/80 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneEditor;
