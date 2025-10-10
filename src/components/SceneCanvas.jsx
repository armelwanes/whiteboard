import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer as KonvaLayer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import CameraViewport from './CameraViewport';
import CameraToolbar from './CameraToolbar';

// Konva Layer Image Component
const LayerImage = ({ layer, isSelected, onSelect, onChange }) => {
  const [img] = useImage(layer.image_path);
  const imageRef = useRef();
  const transformerRef = useRef();

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!img) return null;

  return (
    <>
      <KonvaImage
        image={img}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        scaleX={layer.scale || 1.0}
        scaleY={layer.scale || 1.0}
        opacity={layer.opacity || 1.0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={imageRef}
        onDragEnd={(e) => {
          onChange({
            ...layer,
            position: {
              x: e.target.x(),
              y: e.target.y(),
            }
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          const scaleX = node.scaleX();

          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            scale: scaleX,
          });
          
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

/**
 * SceneCanvas Component
 * Main canvas for scene editing with camera viewport management
 */
const SceneCanvas = ({ 
  scene,
  onUpdateScene,
  onUpdateLayer,
  selectedLayerId,
  onSelectLayer,
}) => {
  const [sceneCameras, setSceneCameras] = useState(scene.sceneCameras || []);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [sceneZoom, setSceneZoom] = useState(1.0);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  // Create a new camera
  const handleAddCamera = useCallback(() => {
    const newCamera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${sceneCameras.length + 1}`,
      position: { x: 0.3 + (sceneCameras.length * 0.1), y: 0.3 },
      width: 800,
      height: 450,
      zoom: 1.0,
    };
    const updatedCameras = [...sceneCameras, newCamera];
    setSceneCameras(updatedCameras);
    setSelectedCameraId(newCamera.id);
    
    // Persist to scene
    onUpdateScene({ ...scene, sceneCameras: updatedCameras });
  }, [sceneCameras, scene, onUpdateScene]);

  // Update camera properties
  const handleUpdateCamera = useCallback((cameraId, updates) => {
    const updatedCameras = sceneCameras.map(cam =>
      cam.id === cameraId ? { ...cam, ...updates } : cam
    );
    setSceneCameras(updatedCameras);
    
    // Persist to scene
    onUpdateScene({ ...scene, sceneCameras: updatedCameras });
  }, [sceneCameras, scene, onUpdateScene]);

  // Delete camera
  const handleDeleteCamera = useCallback((cameraId) => {
    const updatedCameras = sceneCameras.filter(cam => cam.id !== cameraId);
    setSceneCameras(updatedCameras);
    if (selectedCameraId === cameraId) {
      setSelectedCameraId(null);
    }
    
    // Persist to scene
    onUpdateScene({ ...scene, sceneCameras: updatedCameras });
  }, [sceneCameras, selectedCameraId, scene, onUpdateScene]);

  // Zoom specific camera
  const handleZoomCamera = useCallback((cameraId, newZoom) => {
    handleUpdateCamera(cameraId, { zoom: newZoom });
  }, [handleUpdateCamera]);

  // Sync cameras from scene prop when scene changes
  React.useEffect(() => {
    if (scene.sceneCameras) {
      setSceneCameras(scene.sceneCameras);
    }
  }, [scene.sceneCameras]);

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a, b) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Camera Toolbar */}
      <CameraToolbar
        cameras={sceneCameras}
        selectedCameraId={selectedCameraId}
        onAddCamera={handleAddCamera}
        onSelectCamera={setSelectedCameraId}
        onZoomCamera={handleZoomCamera}
        sceneZoom={sceneZoom}
        onSceneZoom={setSceneZoom}
      />

      {/* Canvas Area - Scrollable */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
        <div
          ref={canvasRef}
          className="relative bg-white rounded-lg shadow-2xl"
          style={{
            width: `${sceneWidth * sceneZoom}px`,
            height: `${sceneHeight * sceneZoom}px`,
            minWidth: `${sceneWidth * sceneZoom}px`,
            minHeight: `${sceneHeight * sceneZoom}px`,
          }}
        >
          {/* Konva Stage for layers */}
          <Stage
            width={sceneWidth}
            height={sceneHeight}
            ref={stageRef}
            onMouseDown={(e) => {
              const clickedOnEmpty = e.target === e.target.getStage();
              if (clickedOnEmpty) {
                onSelectLayer(null);
                setSelectedCameraId(null);
              }
            }}
            style={{
              backgroundImage: scene.backgroundImage 
                ? `url(${scene.backgroundImage})` 
                : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${sceneZoom})`,
              transformOrigin: 'top left',
            }}
          >
            <KonvaLayer>
              {sortedLayers.map((layer) => (
                <LayerImage
                  key={layer.id}
                  layer={layer}
                  isSelected={layer.id === selectedLayerId}
                  onSelect={() => {
                    onSelectLayer(layer.id);
                    setSelectedCameraId(null);
                  }}
                  onChange={onUpdateLayer}
                />
              ))}
            </KonvaLayer>
          </Stage>

          {/* Camera Viewports Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {sceneCameras.map((camera) => (
              <CameraViewport
                key={camera.id}
                camera={camera}
                isSelected={selectedCameraId === camera.id}
                onSelect={setSelectedCameraId}
                onUpdate={handleUpdateCamera}
                onDelete={handleDeleteCamera}
                sceneWidth={sceneWidth}
                sceneHeight={sceneHeight}
                canvasZoom={sceneZoom}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            💡 <span className="font-semibold">Astuce:</span> Cliquez sur "Nouvelle Caméra" pour ajouter une caméra • 
            Glissez pour repositionner la caméra • 
            Utilisez les poignées sur les bords pour redimensionner la caméra • 
            Utilisez les ratios prédéfinis (0.7x, 0.8x, etc.) pour ajuster le zoom rapidement • 
            La scène est scrollable pour naviguer dans l'espace de travail
          </p>
        </div>
      </div>
    </div>
  );
};

export default SceneCanvas;
