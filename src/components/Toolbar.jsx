import React from 'react';
import { Button } from './ui/button';
import { Edit, Type, Square, Image, Camera, Circle } from 'lucide-react';

const Toolbar = ({ onOpenEditor }) => {
  return (
    <div className="toolbar bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700 px-6 py-3 flex items-center gap-3 shadow-lg">
      {/* Main Actions */}
      <Button
        onClick={onOpenEditor}
        className="gap-2 shadow-lg"
        size="lg"
      >
        <Edit className="w-4 h-4" />
        <span>Éditer</span>
      </Button>

      <div className="h-8 w-px bg-border mx-1"></div>

      {/* Tools */}
      <Button
        variant="secondary"
        size="default"
        className="gap-2"
        title="Ajouter du texte"
      >
        <Type className="w-4 h-4" />
        <span className="text-sm">Texte</span>
      </Button>
      
      <Button
        variant="secondary"
        size="default"
        className="gap-2"
        title="Ajouter une forme"
      >
        <Square className="w-4 h-4" />
        <span className="text-sm">Formes</span>
      </Button>
      
      <Button
        onClick={onOpenEditor}
        variant="secondary"
        size="default"
        className="gap-2"
        title="Ajouter une image"
      >
        <Image className="w-4 h-4" />
        <span className="text-sm">Image</span>
      </Button>

      <Button
        variant="secondary"
        size="default"
        className="gap-2"
        title="Caméra"
      >
        <Camera className="w-4 h-4" />
        <span className="text-sm">Caméra</span>
      </Button>

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
