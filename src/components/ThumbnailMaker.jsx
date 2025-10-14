import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, Type, Download, Eye, Upload, 
  Palette, AlignLeft, AlignCenter, AlignRight, Bold, 
  RefreshCw, Maximize2, X
} from 'lucide-react';

/**
 * Thumbnail Maker Component
 * Create and preview YouTube-style thumbnails (1280x720)
 */
const ThumbnailMaker = ({ scene, onClose, onSave }) => {
  const [thumbnail, setThumbnail] = useState({
    backgroundImage: scene?.backgroundImage || null,
    backgroundColor: '#1a1a2e',
    title: scene?.title || 'Titre de la vidéo',
    titleColor: '#ffffff',
    titleSize: 72,
    titleFont: 'Arial Black',
    titleAlign: 'center',
    titleStroke: true,
    titleShadow: true,
    titlePosition: { x: 50, y: 50 }, // percentage
    subtitle: '',
    subtitleColor: '#ffcc00',
    subtitleSize: 48,
    overlayOpacity: 0.3,
    showGrid: false,
  });

  const [previewMode, setPreviewMode] = useState('youtube'); // youtube, large
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);

  // Render thumbnail on canvas
  useEffect(() => {
    renderThumbnail();
  }, [thumbnail]);

  const renderThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 1280;
    const height = 720;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    if (thumbnail.backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawOverlay(ctx, width, height);
        drawText(ctx, width, height);
      };
      img.src = thumbnail.backgroundImage;
    } else {
      // Solid color background
      ctx.fillStyle = thumbnail.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      drawOverlay(ctx, width, height);
      drawText(ctx, width, height);
    }
  };

  const drawOverlay = (ctx, width, height) => {
    if (thumbnail.overlayOpacity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${thumbnail.overlayOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }
  };

  const drawText = (ctx, width, height) => {
    // Title
    const titleX = (thumbnail.titlePosition.x / 100) * width;
    const titleY = (thumbnail.titlePosition.y / 100) * height;

    ctx.font = `bold ${thumbnail.titleSize}px ${thumbnail.titleFont}, Arial, sans-serif`;
    ctx.textAlign = thumbnail.titleAlign;
    ctx.textBaseline = 'middle';

    // Text shadow
    if (thumbnail.titleShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    }

    // Text stroke
    if (thumbnail.titleStroke) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.strokeText(thumbnail.title, titleX, titleY);
    }

    // Text fill
    ctx.fillStyle = thumbnail.titleColor;
    ctx.fillText(thumbnail.title, titleX, titleY);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtitle
    if (thumbnail.subtitle) {
      const subtitleY = titleY + thumbnail.titleSize + 20;
      ctx.font = `bold ${thumbnail.subtitleSize}px ${thumbnail.titleFont}, Arial, sans-serif`;
      ctx.fillStyle = thumbnail.subtitleColor;
      
      if (thumbnail.titleStroke) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeText(thumbnail.subtitle, titleX, subtitleY);
      }
      
      ctx.fillText(thumbnail.subtitle, titleX, subtitleY);
    }

    // Grid overlay
    if (thumbnail.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let i = 1; i < 4; i++) {
        const x = (width / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 1; i < 3; i++) {
        const y = (height / 3) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setThumbnail({ ...thumbnail, backgroundImage: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${scene?.id || 'scene'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave?.({
      ...scene,
      thumbnail: {
        ...thumbnail,
        dataUrl
      }
    });
  };

  const presets = [
    { name: 'Rouge Énergique', bg: '#dc2626', title: '#ffffff', subtitle: '#fbbf24' },
    { name: 'Bleu Professionnel', bg: '#1e40af', title: '#ffffff', subtitle: '#60a5fa' },
    { name: 'Vert Frais', bg: '#059669', title: '#ffffff', subtitle: '#fde047' },
    { name: 'Violet Créatif', bg: '#7c3aed', title: '#ffffff', subtitle: '#a78bfa' },
    { name: 'Orange Chaleureux', bg: '#ea580c', title: '#ffffff', subtitle: '#fef08a' },
    { name: 'Noir Élégant', bg: '#0f172a', title: '#ffffff', subtitle: '#fb923c' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Créateur de Miniature</h2>
              <p className="text-sm text-white/80">Style YouTube 1280x720</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Preview */}
          <div className="flex-1 p-6 overflow-auto bg-gray-800">
            <div className="space-y-4">
              {/* Preview Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPreviewMode('youtube')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    previewMode === 'youtube'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Vue YouTube
                </button>
                <button
                  onClick={() => setPreviewMode('large')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    previewMode === 'large'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Maximize2 className="w-4 h-4 inline mr-2" />
                  Plein Écran
                </button>
              </div>

              {/* YouTube Preview */}
              {previewMode === 'youtube' && (
                <div className="bg-gray-950 rounded-xl p-4">
                  <div className="max-w-md mx-auto">
                    {/* Thumbnail */}
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <canvas
                        ref={canvasRef}
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        12:34
                      </div>
                    </div>
                    
                    {/* Video Info (YouTube style) */}
                    <div className="mt-3 flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white line-clamp-2">
                          {thumbnail.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">Nom de la Chaîne</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-xs text-gray-400">1,2 M de vues</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-xs text-gray-400">il y a 1 jour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Large Preview */}
              {previewMode === 'large' && (
                <div className="bg-gray-950 rounded-xl p-6">
                  <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Télécharger PNG
                </button>
                {onSave && (
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-96 bg-gray-850 border-l border-gray-700 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Background Section */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Arrière-plan
                </h3>
                
                <button
                  onClick={() => bgImageRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors mb-3"
                >
                  <Upload className="w-4 h-4" />
                  Importer Image
                </button>
                <input
                  ref={bgImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-2">Couleur de fond</label>
                  <input
                    type="color"
                    value={thumbnail.backgroundColor}
                    onChange={(e) => setThumbnail({ ...thumbnail, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Opacité superposition: {Math.round(thumbnail.overlayOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={thumbnail.overlayOpacity}
                    onChange={(e) => setThumbnail({ ...thumbnail, overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Text Section */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Texte
                </h3>
                
                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-2">Titre principal</label>
                  <input
                    type="text"
                    value={thumbnail.title}
                    onChange={(e) => setThumbnail({ ...thumbnail, title: e.target.value })}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                    placeholder="Votre titre ici..."
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-2">Sous-titre (optionnel)</label>
                  <input
                    type="text"
                    value={thumbnail.subtitle}
                    onChange={(e) => setThumbnail({ ...thumbnail, subtitle: e.target.value })}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                    placeholder="Sous-titre..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Couleur titre</label>
                    <input
                      type="color"
                      value={thumbnail.titleColor}
                      onChange={(e) => setThumbnail({ ...thumbnail, titleColor: e.target.value })}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Couleur sous-titre</label>
                    <input
                      type="color"
                      value={thumbnail.subtitleColor}
                      onChange={(e) => setThumbnail({ ...thumbnail, subtitleColor: e.target.value })}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-2">
                    Taille titre: {thumbnail.titleSize}px
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    value={thumbnail.titleSize}
                    onChange={(e) => setThumbnail({ ...thumbnail, titleSize: parseInt(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-300 text-sm mb-2">Alignement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => setThumbnail({ ...thumbnail, titleAlign: align })}
                        className={`p-2 rounded-lg transition-colors ${
                          thumbnail.titleAlign === align
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                        {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                        {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={thumbnail.titleStroke}
                      onChange={(e) => setThumbnail({ ...thumbnail, titleStroke: e.target.checked })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    Contour texte
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={thumbnail.titleShadow}
                      onChange={(e) => setThumbnail({ ...thumbnail, titleShadow: e.target.checked })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    Ombre texte
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Position X: {thumbnail.titlePosition.x}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={thumbnail.titlePosition.x}
                      onChange={(e) => setThumbnail({ 
                        ...thumbnail, 
                        titlePosition: { ...thumbnail.titlePosition, x: parseInt(e.target.value) }
                      })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Position Y: {thumbnail.titlePosition.y}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={thumbnail.titlePosition.y}
                      onChange={(e) => setThumbnail({ 
                        ...thumbnail, 
                        titlePosition: { ...thumbnail.titlePosition, y: parseInt(e.target.value) }
                      })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Modèles de couleurs
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setThumbnail({
                        ...thumbnail,
                        backgroundColor: preset.bg,
                        titleColor: preset.title,
                        subtitleColor: preset.subtitle,
                      })}
                      className="p-3 rounded-lg hover:ring-2 ring-blue-500 transition-all group"
                      style={{ background: preset.bg }}
                    >
                      <span className="text-xs font-semibold text-white group-hover:scale-105 transition-transform inline-block">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Utilities */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thumbnail.showGrid}
                    onChange={(e) => setThumbnail({ ...thumbnail, showGrid: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  Afficher la grille de composition
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailMaker;
