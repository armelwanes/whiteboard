import React, { useRef } from 'react';
import { 
  Upload, Save, X, 
  Library, Type as TextIcon, Square as ShapeIcon, Video as VideoIcon,
  Image as ImageIcon
} from 'lucide-react';
import { 
  CameraControls, 
  LayerAnimationControls, 
  EnhancedAudioManager,
  ParticleEditor,
  TextAnimationEditor 
} from '../molecules';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LayerPropertiesPanelProps {
  scene: any;
  selectedLayerId: string | null;
  onUpdateScene: (updates: any) => void;
  onUpdateLayer: (layer: any) => void;
  onSave?: () => void;
  onClose?: () => void;
  onImageUpload?: (e: any) => void;
  onAddTextLayer?: () => void;
  onShowShapeToolbar?: () => void;
  onShowAssetLibrary?: () => void;
  onShowThumbnailMaker?: () => void;
}

const LayerPropertiesPanel: React.FC<LayerPropertiesPanelProps> = ({
  scene,
  selectedLayerId,
  onUpdateScene,
  onUpdateLayer,
  onSave,
  onClose,
  onImageUpload,
  onAddTextLayer,
  onShowShapeToolbar,
  onShowAssetLibrary,
  onShowThumbnailMaker
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = scene.layers?.find(layer => layer.id === selectedLayerId);

  const handleChange = (field: string, value: any) => {
    onUpdateScene({ [field]: value });
  };

  const handleLayerPropertyChange = (layerId: string, property: string, value: any) => {
    const layer = scene.layers?.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer({ ...layer, [property]: value });
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('backgroundImage', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="w-80 bg-white dark:bg-white flex flex-col border-l border-gray-200 dark:border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-secondary/30 px-5 py-3 border-b border-gray-200 dark:border-border flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
        <div className="flex items-center gap-2">
          {onShowThumbnailMaker && (
            <button
              onClick={onShowThumbnailMaker}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
              title="Créer Miniature"
            >
              <VideoIcon className="w-3.5 h-3.5" />
            </button>
          )}
          {onShowAssetLibrary && (
            <button
              onClick={onShowAssetLibrary}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
              title="Asset Library"
            >
              <Library className="w-3.5 h-3.5" />
            </button>
          )}
          {onImageUpload && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
              title="Add Image"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          )}
          {onAddTextLayer && (
            <button
              onClick={onAddTextLayer}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
              title="Add Text"
            >
              <TextIcon className="w-3.5 h-3.5" />
            </button>
          )}
          {onShowShapeToolbar && (
            <button
              onClick={onShowShapeToolbar}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-1.5 px-2.5 rounded flex items-center gap-1.5 transition-colors text-sm shadow-sm"
              title="Add Shape"
            >
              <ShapeIcon className="w-3.5 h-3.5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>
        {onImageUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        )}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Scene Properties */}
          <div className="bg-gray-50 dark:bg-secondary/30 rounded-lg p-4 border border-gray-200 dark:border-border">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Scene Properties
            </h3>
            
            {/* Title */}
            <div className="mb-3">
              <label className="block text-gray-700 dark:text-foreground text-xs mb-1.5 font-medium">
                Scene Title
              </label>
              <input
                type="text"
                value={scene.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border border-gray-300 dark:border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter title..."
              />
            </div>

            {/* Content */}
            <div className="mb-3">
              <label className="block text-gray-700 dark:text-foreground text-xs mb-1.5 font-medium">
                Content
              </label>
              <textarea
                value={scene.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border border-gray-300 dark:border-border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary whiteboard-text"
                placeholder="Enter content..."
              />
            </div>

            {/* Duration */}
            <div className="mb-3">
              <label className="block text-gray-700 dark:text-foreground text-xs mb-1.5 font-medium">
                Duration (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={scene.duration || 5}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 5)}
                className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border border-gray-300 dark:border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-gray-700 dark:text-foreground text-xs mb-1.5 font-medium">
                Background Image
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => backgroundImageInputRef.current?.click()}
                  className="flex-1 bg-white dark:bg-secondary hover:bg-gray-50 dark:hover:bg-secondary/80 text-gray-900 dark:text-white border border-gray-300 dark:border-border rounded px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-left"
                >
                  {scene.backgroundImage ? 'Change Background' : 'Upload Background'}
                </button>
                {scene.backgroundImage && (
                  <button
                    onClick={() => handleChange('backgroundImage', null)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 text-sm transition-colors"
                    title="Remove background"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={backgroundImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
              />
            </div>

            {/* Animation Type */}
            <div className="mt-3">
              <label className="block text-gray-700 dark:text-foreground text-xs mb-1.5 font-medium">
                Animation Type
              </label>
              <Select
                value={scene.animation || 'fade'}
                onValueChange={(value) => handleChange('animation', value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border border-gray-300 dark:border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
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

          {/* Enhanced Audio Manager */}
          <EnhancedAudioManager
            scene={scene}
            onSceneUpdate={(updatedScene) => onUpdateScene(updatedScene)}
          />

          {/* Scene Camera Sequence */}
          <CameraControls
            cameras={scene.cameras || []}
            onChange={(cameras) => handleChange('cameras', cameras)}
            type="scene"
          />

          {/* Selected Layer Properties */}
          {selectedLayer && (
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Propriétés de la Couche Sélectionnée
              </h3>

              {/* Layer Name */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Nom
                </label>
                <input
                  type="text"
                  value={selectedLayer.name || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'name', e.target.value)}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nom de la couche"
                />
              </div>

              {/* Position */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Position X
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.position?.x || 0)}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'position', {
                      ...selectedLayer.position,
                      x: parseInt(e.target.value) || 0
                    })}
                    className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Position Y
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.position?.y || 0)}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'position', {
                      ...selectedLayer.position,
                      y: parseInt(e.target.value) || 0
                    })}
                    className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Z-Index */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Z-Index (Ordre)
                </label>
                <input
                  type="number"
                  min="0"
                  value={selectedLayer.z_index || 0}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'z_index', parseInt(e.target.value) || 0)}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Scale */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Échelle: {(selectedLayer.scale || 1.0).toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={selectedLayer.scale || 1.0}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Opacité: {Math.round((selectedLayer.opacity || 1.0) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={selectedLayer.opacity || 1.0}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'opacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Skip Rate */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Skip Rate (Vitesse de dessin)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={selectedLayer.skip_rate || 10}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'skip_rate', parseInt(e.target.value) || 10)}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Plus élevé = dessin plus rapide
                </p>
              </div>

              {/* Mode */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Mode de dessin
                </label>
                <Select
                  value={selectedLayer.mode || 'draw'}
                  onValueChange={(value) => handleLayerPropertyChange(selectedLayer.id, 'mode', value)}
                >
                  <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Sélectionner un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draw">Draw (Dessin progressif)</SelectItem>
                    <SelectItem value="eraser">Eraser (Gomme)</SelectItem>
                    <SelectItem value="static">Static (Statique)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-foreground text-xs mb-1.5">
                  Type
                </label>
                <Select
                  value={selectedLayer.type || 'image'}
                  onValueChange={(newType) => {
                    const updates: any = { type: newType };
                    
                    if (newType === 'text' && !selectedLayer.text_config) {
                      updates.text_config = {
                        text: 'Votre texte ici',
                        font: 'Arial',
                        size: 48,
                        color: [0, 0, 0],
                        style: 'normal',
                        line_height: 1.2,
                        align: 'left'
                      };
                    }
                    
                    onUpdateLayer({ ...selectedLayer, ...updates });
                  }}
                >
                  <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="shape">Forme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Text Configuration (only for text layers) */}
          {selectedLayer && selectedLayer.type === 'text' && selectedLayer.text_config && (
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Configuration du Texte
              </h3>

              {/* Text Content */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Contenu du texte
                </label>
                <textarea
                  value={selectedLayer.text_config?.text || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                    ...(selectedLayer.text_config || {}),
                    text: e.target.value
                  })}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Votre texte ici&#10;Utilisez Entrée pour les sauts de ligne"
                  rows={4}
                />
                <p className="text-gray-500 text-xs mt-1">
                  Utilisez Entrée pour créer plusieurs lignes
                </p>
              </div>

              {/* Font and Size */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Police
                  </label>
                  <Select
                    value={selectedLayer.text_config?.font || 'Arial'}
                    onValueChange={(value) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                      ...(selectedLayer.text_config || {}),
                      font: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Sélectionner une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="DejaVuSans">DejaVu Sans</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Taille
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="200"
                    value={selectedLayer.text_config?.size || 48}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                      ...(selectedLayer.text_config || {}),
                      size: parseInt(e.target.value) || 48
                    })}
                    className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Color */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Couleur
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={
                      Array.isArray(selectedLayer.text_config?.color)
                        ? `#${selectedLayer.text_config.color.map(c => c.toString(16).padStart(2, '0')).join('')}`
                        : (selectedLayer.text_config?.color || '#000000')
                    }
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                        ...(selectedLayer.text_config || {}),
                        color: [r, g, b]
                      });
                    }}
                    className="h-10 w-16 bg-secondary border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      Array.isArray(selectedLayer.text_config?.color)
                        ? `#${selectedLayer.text_config.color.map(c => c.toString(16).padStart(2, '0')).join('')}`
                        : (selectedLayer.text_config?.color || '#000000')
                    }
                    onChange={(e) => {
                      const hex = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(hex)) {
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                          ...(selectedLayer.text_config || {}),
                          color: [r, g, b]
                        });
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1 bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Style */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Style
                </label>
                <Select
                  value={selectedLayer.text_config?.style || 'normal'}
                  onValueChange={(value) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                    ...(selectedLayer.text_config || {}),
                    style: value
                  })}
                >
                  <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
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

              {/* Line Height and Alignment */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Hauteur ligne
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={selectedLayer.text_config?.line_height || 1.2}
                    onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                      ...(selectedLayer.text_config || {}),
                      line_height: parseFloat(e.target.value) || 1.2
                    })}
                    className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Alignement
                  </label>
                  <Select
                    value={selectedLayer.text_config?.align || 'left'}
                    onValueChange={(value) => handleLayerPropertyChange(selectedLayer.id, 'text_config', {
                      ...(selectedLayer.text_config || {}),
                      align: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Sélectionner un alignement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Gauche</SelectItem>
                      <SelectItem value="center">Centre</SelectItem>
                      <SelectItem value="right">Droite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Layer Camera Controls */}
          {selectedLayer && (
            <CameraControls
              cameras={selectedLayer.camera ? [selectedLayer.camera] : []}
              onChange={(cameras) => {
                const camera = cameras.length > 0 ? cameras[0] : null;
                handleLayerPropertyChange(selectedLayer.id, 'camera', camera);
              }}
              type="layer"
            />
          )}

          {/* Layer Animation Controls */}
          {selectedLayer && (
            <LayerAnimationControls
              animation={selectedLayer.animation || null}
              onChange={(animation) => 
                handleLayerPropertyChange(selectedLayer.id, 'animation', animation)
              }
            />
          )}

          {/* Layer Audio Configuration */}
          {selectedLayer && (
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Audio de la Couche
              </h3>
              
              <p className="text-muted-foreground text-xs mb-3">
                L'audio pour voix-off, effets sonores, etc. est configuré par couche
              </p>

              {/* Narration */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Narration / Voix-off (URL)
                </label>
                <input
                  type="text"
                  value={selectedLayer.audio?.narration || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                    ...(selectedLayer.audio || {}),
                    narration: e.target.value || null
                  })}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/narration.mp3"
                />
              </div>

              {/* Typewriter Sound */}
              <div className="mb-3">
                <label className="block text-foreground text-xs mb-1.5">
                  Son de machine à écrire (URL)
                </label>
                <input
                  type="text"
                  value={selectedLayer.audio?.typewriter || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                    ...(selectedLayer.audio || {}),
                    typewriter: e.target.value || null
                  })}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/typewriter.mp3"
                />
              </div>

              {/* Drawing Sound */}
              <div>
                <label className="block text-foreground text-xs mb-1.5">
                  Son de dessin (URL)
                </label>
                <input
                  type="text"
                  value={selectedLayer.audio?.drawing || ''}
                  onChange={(e) => handleLayerPropertyChange(selectedLayer.id, 'audio', {
                    ...(selectedLayer.audio || {}),
                    drawing: e.target.value || null
                  })}
                  className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/drawing.mp3"
                />
              </div>
            </div>
          )}

          {/* Particle Effects Editor */}
          {selectedLayer && (
            <ParticleEditor
              layer={selectedLayer}
              onLayerUpdate={(updatedLayer) => onUpdateLayer(updatedLayer)}
              canvasWidth={1920}
              canvasHeight={1080}
            />
          )}

          {/* Text Animation Editor */}
          {selectedLayer && selectedLayer.type === 'text' && (
            <TextAnimationEditor
              layer={selectedLayer}
              onLayerUpdate={(updatedLayer) => onUpdateLayer(updatedLayer)}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      {(onClose || onSave) && (
        <div className="bg-secondary/30 px-5 py-3 border-t border-border flex justify-end gap-2 flex-shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="bg-secondary hover:bg-secondary/80 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
            >
              Annuler
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-lg flex items-center gap-2 text-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Enregistrer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LayerPropertiesPanel;
