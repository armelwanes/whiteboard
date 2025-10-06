import React, { useState } from 'react';

const SceneEditor = ({ scene, onClose, onSave }) => {
  const [editedScene, setEditedScene] = useState({ ...scene });

  const handleChange = (field, value) => {
    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleSave = () => {
    onSave(editedScene);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Éditer la scène</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Titre de la scène
              </label>
              <input
                type="text"
                value={editedScene.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Entrez le titre..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Contenu
              </label>
              <textarea
                value={editedScene.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                placeholder="Entrez le contenu..."
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Durée (secondes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={editedScene.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Image de fond (URL)
              </label>
              <input
                type="text"
                value={editedScene.backgroundImage || ''}
                onChange={(e) => handleChange('backgroundImage', e.target.value || null)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {editedScene.backgroundImage && (
                <div className="mt-3">
                  <img
                    src={editedScene.backgroundImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Animation Type */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Type d'animation
              </label>
              <select
                value={editedScene.animation}
                onChange={(e) => handleChange('animation', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneEditor;
