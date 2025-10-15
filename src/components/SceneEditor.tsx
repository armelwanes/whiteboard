import React, { useState, useRef } from 'react';
import Scene from './Scene';
import EnhancedAudioManager from './EnhancedAudioManager';
import ThumbnailMaker from './ThumbnailMaker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex">
        {/* Left Side - Scene Preview */}
        <div className="flex-1 bg-gray-950 relative">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl">🖼️</span>
              <span>Importer une image</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg px-4 py-3 text-sm text-gray-300 max-w-md">
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
        <div className="w-96 bg-gray-900 flex flex-col border-l border-gray-700">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
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
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Titre de la scène
                </label>
                <input
                  type="text"
                  value={editedScene.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Entrez le titre..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Contenu
                </label>
                <textarea
                  value={editedScene.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none transition-all"
                  placeholder="Entrez le contenu..."
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Durée (secondes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={editedScene.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Image de fond (URL)
                </label>
                <input
                  type="text"
                  value={editedScene.backgroundImage || ''}
                  onChange={(e) => handleChange('backgroundImage', e.target.value || null)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {editedScene.backgroundImage && (
                  <div className="mt-3">
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
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Type d'animation
                </label>
                <Select
                  value={editedScene.animation}
                  onValueChange={(value) => handleChange('animation', value)}
                >
                  <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <SelectValue placeholder="Sélectionner une animation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Objects List */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Objets dans la scène ({editedScene.objects.length})
                </label>
                <div className="space-y-2">
                  {editedScene.objects.length === 0 ? (
                    <p className="text-gray-400 text-xs italic">Aucun objet pour le moment</p>
                  ) : (
                    editedScene.objects.map((obj) => (
                      <div
                        key={obj.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                          selectedObjectId === obj.id
                            ? 'bg-blue-600 bg-opacity-20 border border-blue-500'
                            : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                        }`}
                        onClick={() => setSelectedObjectId(obj.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🖼️</span>
                          <div>
                            <p className="text-white text-sm font-medium truncate max-w-[150px]">
                              {obj.name || 'Image'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {Math.round(obj.width)} × {Math.round(obj.height)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteObject(obj.id);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

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
          <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg"
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
