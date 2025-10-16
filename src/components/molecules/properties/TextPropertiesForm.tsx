import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TextPropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const TextPropertiesForm: React.FC<TextPropertiesFormProps> = ({
  layer,
  onPropertyChange
}) => {
  if (!layer || !layer.text_config) return null;

  const textConfig = layer.text_config;

  const handleTextConfigChange = (field: string, value: any) => {
    onPropertyChange(layer.id, 'text_config', {
      ...textConfig,
      [field]: value
    });
  };

  // Convert color array to hex
  const getColorHex = () => {
    if (Array.isArray(textConfig.color)) {
      return `#${textConfig.color.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
    }
    return textConfig.color || '#000000';
  };

  // Convert hex to color array
  const setColorFromHex = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    handleTextConfigChange('color', [r, g, b]);
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm">
        Propriétés du Texte
      </h3>

      {/* Text Content */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Texte
        </label>
        <textarea
          value={textConfig.text || ''}
          onChange={(e) => handleTextConfigChange('text', e.target.value)}
          className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Entrez votre texte ici..."
        />
      </div>

      {/* Font Family */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Police
        </label>
        <Select
          value={textConfig.font || 'Arial'}
          onValueChange={(value) => handleTextConfigChange('font', value)}
        >
          <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Sélectionner une police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Arial Black">Arial Black</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
            <SelectItem value="Impact">Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Taille: {textConfig.size || 48}px
        </label>
        <input
          type="range"
          min="12"
          max="120"
          step="1"
          value={textConfig.size || 48}
          onChange={(e) => handleTextConfigChange('size', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Font Style */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Style
        </label>
        <Select
          value={textConfig.style || 'normal'}
          onValueChange={(value) => handleTextConfigChange('style', value)}
        >
          <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Sélectionner un style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Gras</SelectItem>
            <SelectItem value="italic">Italique</SelectItem>
            <SelectItem value="bold_italic">Gras Italique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Color */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Couleur du texte
        </label>
        <input
          type="color"
          value={getColorHex()}
          onChange={(e) => setColorFromHex(e.target.value)}
          className="w-full h-10 rounded cursor-pointer border border-border"
        />
      </div>

      {/* Text Alignment */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Alignement
        </label>
        <Select
          value={textConfig.align || 'left'}
          onValueChange={(value) => handleTextConfigChange('align', value)}
        >
          <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Sélectionner l'alignement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Gauche</SelectItem>
            <SelectItem value="center">Centre</SelectItem>
            <SelectItem value="right">Droite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Line Height */}
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Hauteur de ligne: {(textConfig.line_height || 1.2).toFixed(1)}
        </label>
        <input
          type="range"
          min="0.8"
          max="2.5"
          step="0.1"
          value={textConfig.line_height || 1.2}
          onChange={(e) => handleTextConfigChange('line_height', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};
