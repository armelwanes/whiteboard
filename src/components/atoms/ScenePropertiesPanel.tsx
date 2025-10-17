import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageIcon } from 'lucide-react';

interface ScenePropertiesPanelProps {
  scene: any;
  handleSceneChange: (field: string, value: any) => void;
}

const ScenePropertiesPanel: React.FC<ScenePropertiesPanelProps> = ({ scene, handleSceneChange }) => (
  <div className="bg-secondary/30 rounded-lg p-4 border border-border">
    <h3 className="text-foreground font-semibold mb-3 text-sm flex items-center gap-2">
      <ImageIcon className="w-4 h-4" />
      Propriétés de la Scène
    </h3>
    {/* Title */}
    <div className="mb-3">
      <label className="block text-foreground text-xs mb-1.5">
        Titre de la scène
      </label>
      <input
        type="text"
        value={scene.title || ''}
        onChange={(e) => handleSceneChange('title', e.target.value)}
        className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Entrez le titre..."
      />
    </div>
    {/* Content */}
    <div className="mb-3">
      <label className="block text-foreground text-xs mb-1.5">
        Contenu
      </label>
      <textarea
        value={scene.content || ''}
        onChange={(e) => handleSceneChange('content', e.target.value)}
        className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Entrez le contenu..."
      />
    </div>
    {/* Duration */}
    <div className="mb-3">
      <label className="block text-foreground text-xs mb-1.5">
        Durée (secondes)
      </label>
      <input
        type="number"
        min="1"
        max="60"
        value={scene.duration || 5}
        onChange={(e) => handleSceneChange('duration', parseInt(e.target.value) || 5)}
        className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    {/* Background Image */}
    <div className="mb-3">
      <label className="block text-foreground text-xs mb-1.5">
        Image de fond (URL)
      </label>
      <input
        type="text"
        value={scene.backgroundImage || ''}
        onChange={(e) => handleSceneChange('backgroundImage', e.target.value || null)}
        className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="https://example.com/image.jpg"
      />
    </div>
    {/* Animation Type */}
    <div>
      <label className="block text-foreground text-xs mb-1.5">
        Type d'animation
      </label>
      <Select
        value={scene.animation || 'fade'}
        onValueChange={(value) => handleSceneChange('animation', value)}
      >
        <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Sélectionner une animation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fade">Fade</SelectItem>
          <SelectItem value="slide">Slide</SelectItem>
          <SelectItem value="scale">Scale</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default ScenePropertiesPanel;
