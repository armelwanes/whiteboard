import React from 'react';

const Toolbar = ({ onOpenEditor }) => {
  return (
    <div className="toolbar bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
      {/* Main Actions */}
      <button
        onClick={onOpenEditor}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        title="Éditer la scène"
      >
        ✏️ Éditer
      </button>

      <div className="h-6 w-px bg-gray-700 mx-2"></div>

      {/* Tools */}
      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition-colors"
        title="Ajouter du texte"
      >
        🔤 Texte
      </button>
      
      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition-colors"
        title="Ajouter une forme"
      >
        ⬜ Formes
      </button>
      
      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition-colors"
        title="Ajouter une image"
      >
        🖼️ Image
      </button>

      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition-colors"
        title="Caméra"
      >
        📹 Caméra
      </button>

      <div className="flex-1"></div>

      {/* Info */}
      <div className="text-gray-400 text-sm">
        Whiteboard Animation
      </div>
    </div>
  );
};

export default Toolbar;
