import React from 'react';
import { Button } from '../../atoms';
import { Upload, Play, Download, FileJson } from 'lucide-react';

interface ControlPanelProps {
  mode: string;
  sourceImage: any;
  animationData: any;
  sourceImageForJson: any;
  isGenerating: boolean;
  videoUrl: string | null;
  onSourceUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onJsonUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSourceImageForJsonUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStart: () => void;
  onDownload: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  sourceImage,
  animationData,
  sourceImageForJson,
  isGenerating,
  videoUrl,
  onSourceUpload,
  onJsonUpload,
  onSourceImageForJsonUpload,
  onStart,
  onDownload,
}) => {
  if (mode === "image") {
    return (
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          onClick={() => document.getElementById("src-upload")?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </Button>
        <input id="src-upload" onChange={onSourceUpload} className="hidden" type="file" accept="image/*" />
        <Button onClick={onStart} disabled={!sourceImage || isGenerating} className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          {isGenerating ? "Génération..." : "Générer"}
        </Button>
        <Button variant="outline" onClick={onDownload} disabled={!videoUrl} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          onClick={() => document.getElementById("json-upload")?.click()}
          className="flex items-center gap-2"
        >
          <FileJson className="w-4 h-4" />
          Upload JSON
        </Button>
        <input id="json-upload" onChange={onJsonUpload} className="hidden" type="file" accept="application/json,.json" />
        
        <Button
          variant="outline"
          onClick={() => document.getElementById("json-img-upload")?.click()}
          className="flex items-center gap-2"
          disabled={!animationData}
        >
          <Upload className="w-4 h-4" />
          Upload Source Image
        </Button>
        <input id="json-img-upload" onChange={onSourceImageForJsonUpload} className="hidden" type="file" accept="image/*" />
        
        <Button onClick={onStart} disabled={!animationData || !sourceImageForJson || isGenerating} className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          {isGenerating ? "Lecture..." : "Rejouer"}
        </Button>
        <Button variant="outline" onClick={onDownload} disabled={!videoUrl} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      
      {animationData && (
        <div className="bg-gray-700 p-3 rounded text-sm text-gray-300">
          <p><strong>Animation chargée:</strong></p>
          <p>• Résolution: {animationData.metadata.width}x{animationData.metadata.height}</p>
          <p>• FPS: {animationData.metadata.frame_rate}</p>
          <p>• Frames: {animationData.metadata.total_frames}</p>
          <p>• Grille: {animationData.metadata.split_len}px</p>
        </div>
      )}
    </div>
  );
};
