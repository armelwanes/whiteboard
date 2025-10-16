import React, { useState } from 'react';
import { Download, Image, Film, FileImage, Check, AlertCircle } from 'lucide-react';
import { 
  SOCIAL_MEDIA_PRESETS, 
  exportAsPNG, 
  exportAsJPEG, 
  exportAsWebP,
  exportWithPreset,
  estimateFileSize,
  validateExportOptions
} from '../../utils/exportFormats';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExportPanelProps {
  canvas: HTMLCanvasElement | null;
  onExport?: (result: any) => void;
}

/**
 * Export Panel Component
 * UI for exporting scenes in various formats
 */
const ExportPanel: React.FC<ExportPanelProps> = ({ 
  canvas,
  onExport 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedPreset, setSelectedPreset] = useState('youtube');
  const [quality, setQuality] = useState(0.95);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<any>(null);

  const formats = [
    { 
      id: 'png', 
      name: 'PNG', 
      icon: <Image className="w-5 h-5" />,
      description: 'Haute qualité, transparence',
      extension: '.png'
    },
    { 
      id: 'jpeg', 
      name: 'JPEG', 
      icon: <Image className="w-5 h-5" />,
      description: 'Taille réduite, pas de transparence',
      extension: '.jpg'
    },
    { 
      id: 'webp', 
      name: 'WebP', 
      icon: <Image className="w-5 h-5" />,
      description: 'Moderne, petite taille',
      extension: '.webp'
    },
    { 
      id: 'webm', 
      name: 'WebM', 
      icon: <Film className="w-5 h-5" />,
      description: 'Vidéo avec alpha',
      extension: '.webm'
    },
    { 
      id: 'gif', 
      name: 'GIF', 
      icon: <FileImage className="w-5 h-5" />,
      description: 'Animation compatible',
      extension: '.gif'
    }
  ];

  const handleExport = async () => {
    if (!canvas) {
      setExportStatus({ type: 'error', message: 'Aucun canvas disponible pour l\'export' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      switch (selectedFormat) {
        case 'png':
          await exportAsPNG(canvas, `export_${timestamp}.png`);
          break;
        case 'jpeg':
          await exportAsJPEG(canvas, `export_${timestamp}.jpg`, quality);
          break;
        case 'webp':
          await exportAsWebP(canvas, `export_${timestamp}.webp`, quality);
          break;
        case 'webm':
          setExportStatus({ 
            type: 'warning', 
            message: 'Export WebM nécessite l\'enregistrement de l\'animation en cours' 
          });
          break;
        case 'gif':
          setExportStatus({ 
            type: 'warning', 
            message: 'Export GIF nécessite l\'installation de gif.js' 
          });
          break;
        default:
          throw new Error('Format non supporté');
      }

      if (['png', 'jpeg', 'webp'].includes(selectedFormat)) {
        setExportStatus({ type: 'success', message: 'Export réussi!' });
      }

      if (onExport) {
        onExport({ format: selectedFormat, success: true });
      }
    } catch (error:any) {
      console.error('Export error:', error);
      setExportStatus({ type: 'error', message: `Erreur: ${error.message}` });
      
      if (onExport) {
        onExport({ format: selectedFormat, success: false, error });
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePresetExport = async () => {
    if (!canvas) {
      setExportStatus({ type: 'error', message: 'Aucun canvas disponible pour l\'export' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${selectedPreset}_${timestamp}.png`;
      
      await exportWithPreset(canvas, selectedPreset, filename);
      
      setExportStatus({ type: 'success', message: `Export ${SOCIAL_MEDIA_PRESETS[selectedPreset].name} réussi!` });

      if (onExport) {
        onExport({ preset: selectedPreset, success: true });
      }
    } catch (error:any) {
      console.error('Preset export error:', error);
      setExportStatus({ type: 'error', message: `Erreur: ${error.message}` });
      
      if (onExport) {
        onExport({ preset: selectedPreset, success: false, error });
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Get file size estimate
  const sizeEstimate = estimateFileSize(
    canvas?.width || 1920,
    canvas?.height || 1080,
    selectedFormat,
    1
  );

  // Validate options
  const validation = validateExportOptions({
    width: canvas?.width || 1920,
    height: canvas?.height || 1080,
    format: selectedFormat,
    quality
  });

  return (
    <div className="export-panel space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-green-400">
        <Download className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Exporter</h3>
      </div>

      {/* Status Messages */}
      {exportStatus && (
        <div className={`p-3 rounded-lg flex items-start gap-2 ${
          exportStatus.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
          exportStatus.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
          'bg-red-500/20 text-red-300 border border-red-500/50'
        }`}>
          {exportStatus.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm">{exportStatus.message}</span>
        </div>
      )}

      {/* Format Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Format d'export
        </label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map(format => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              disabled={isExporting}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedFormat === format.id
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-border bg-secondary/30 hover:border-green-400'
              } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {format.icon}
                <span className="text-sm font-medium text-white">{format.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">{format.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Settings */}
      {['jpeg', 'webp'].includes(selectedFormat) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Qualité
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            disabled={isExporting}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Basse</span>
            <span>{Math.round(quality * 100)}%</span>
            <span>Haute</span>
          </div>
        </div>
      )}

      {/* Canvas Info */}
      {canvas && (
        <div className="p-3 bg-secondary/30 rounded-lg space-y-1">
          <div className="text-sm text-muted-foreground">Dimensions du canvas</div>
          <div className="text-white font-medium">{canvas.width} × {canvas.height} px</div>
          <div className="text-xs text-gray-500">
            Taille estimée: {sizeEstimate.formatted}
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-xs text-yellow-300">{warning}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || !validation.valid}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
          isExporting || !validation.valid
            ? 'bg-secondary text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        <Download className="w-5 h-5" />
        {isExporting ? 'Export en cours...' : 'Exporter'}
      </button>

      {/* Social Media Presets */}
      <div className="pt-4 border-t border-border">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Préréglages réseaux sociaux
          </label>
          <Select
            value={selectedPreset}
            onValueChange={(value) => setSelectedPreset(value)}
            disabled={isExporting}
          >
            <SelectTrigger className="w-full px-3 py-2 bg-secondary/30 border border-border rounded text-white text-sm">
              <SelectValue placeholder="Sélectionner un préréglage" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SOCIAL_MEDIA_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name} - {preset.width}×{preset.height} ({preset.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handlePresetExport}
            disabled={isExporting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isExporting
                ? 'bg-secondary text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Export en cours...' : `Exporter pour ${SOCIAL_MEDIA_PRESETS[selectedPreset].name}`}
          </button>
        </div>
      </div>

      {/* Format Info */}
      <div className="p-3 bg-secondary/30/50 rounded-lg text-xs text-muted-foreground space-y-1">
        <div><strong>PNG:</strong> Meilleure qualité, supporte la transparence</div>
        <div><strong>JPEG:</strong> Taille réduite, pas de transparence</div>
        <div><strong>WebP:</strong> Moderne, excellente compression</div>
        <div><strong>WebM:</strong> Vidéo avec support alpha channel</div>
        <div><strong>GIF:</strong> Animation compatible avec tous les navigateurs</div>
      </div>
    </div>
  );
};

export default ExportPanel;
