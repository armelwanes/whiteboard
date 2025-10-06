import React from 'react';

const Toolbar = ({ onOpenEditor }) => {
  return (
    <div className="toolbar bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700 px-6 py-3 flex items-center gap-3 shadow-lg">
      {/* Main Actions */}
      <button
        onClick={onOpenEditor}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        title="Éditer la scène"
      >
        <span className="text-lg">✏️</span>
        <span>Éditer</span>
      </button>

      <div className="h-8 w-px bg-gray-700 mx-1"></div>

      {/* Tools */}
      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        title="Ajouter du texte"
      >
        <span className="text-base">🔤</span>
        <span className="text-sm">Texte</span>
      </button>
      
      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        title="Ajouter une forme"
      >
        <span className="text-base">⬜</span>
        <span className="text-sm">Formes</span>
      </button>
      
      <button
        onClick={onOpenEditor}
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        title="Ajouter une image"
      >
        <span className="text-base">🖼️</span>
        <span className="text-sm">Image</span>
      </button>

      <button
        className="toolbar-btn bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        title="Caméra"
      >
        <span className="text-base">📹</span>
        <span className="text-sm">Caméra</span>
      </button>

      <div className="flex-1"></div>

      {/* Info */}
      <div className="flex items-center gap-3">
        <div className="text-gray-400 text-sm font-medium">
          Whiteboard Animation
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Toolbar;
