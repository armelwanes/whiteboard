import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer as KonvaLayer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import CameraViewport from './CameraViewport';
import CameraToolbar from './CameraToolbar';
import CameraSettingsPanel from './CameraSettingsPanel';
import { createDefaultCamera } from '../utils/cameraAnimator';

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
  const [sceneCameras, setSceneCameras] = useState(() => {
    // Initialize with default camera if scene has no cameras
    if (!scene.sceneCameras || scene.sceneCameras.length === 0) {
      return [createDefaultCamera('16:9')];
    }
    // Check if default camera exists, add it if not
    const hasDefaultCamera = scene.sceneCameras.some(cam => cam.isDefault);
    if (!hasDefaultCamera) {
      return [createDefaultCamera('16:9'), ...scene.sceneCameras];
    }
    return scene.sceneCameras;
  });
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [sceneZoom, setSceneZoom] = useState(1.0);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  // Create a new camera
  const handleAddCamera = useCallback(() => {
    const newCamera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${sceneCameras.length}`,
      position: { x: 0.3 + (sceneCameras.length * 0.1), y: 0.3 },
      width: 800,
      height: 450,
      zoom: 1.0,
      duration: 2.0,
      transition_duration: 1.0,
      easing: 'ease_out',
      locked: false,
      isDefault: false,
      pauseDuration: 0,
      movementType: 'ease_out',
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
    // Prevent deleting the default camera
    const cameraToDelete = sceneCameras.find(cam => cam.id === cameraId);
    if (cameraToDelete && cameraToDelete.isDefault) {
      alert('La caméra par défaut ne peut pas être supprimée');
      return;
    }
    
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

  // Toggle lock/unlock camera
  const handleToggleLock = useCallback((cameraId) => {
    const camera = sceneCameras.find(cam => cam.id === cameraId);
    if (camera && !camera.isDefault) {
      handleUpdateCamera(cameraId, { locked: !camera.locked });
    }
  }, [sceneCameras, handleUpdateCamera]);

  // Sync cameras from scene prop when scene changes
  React.useEffect(() => {
    if (scene.sceneCameras) {
      // Always ensure default camera exists
      const hasDefaultCamera = scene.sceneCameras.some(cam => cam.isDefault);
      if (!hasDefaultCamera && scene.sceneCameras.length > 0) {
        setSceneCameras([createDefaultCamera('16:9'), ...scene.sceneCameras]);
      } else if (!hasDefaultCamera && scene.sceneCameras.length === 0) {
        setSceneCameras([createDefaultCamera('16:9')]);
      } else {
        setSceneCameras(scene.sceneCameras);
      }
    } else {
      setSceneCameras([createDefaultCamera('16:9')]);
    }
  }, [scene.sceneCameras]);

  // Auto-scroll to selected camera
  React.useEffect(() => {
    if (selectedCameraId && scrollContainerRef.current && canvasRef.current) {
      const selectedCamera = sceneCameras.find(cam => cam.id === selectedCameraId);
      if (selectedCamera) {
        const container = scrollContainerRef.current;
        const paddingOffset = 2000; // Match the padding value
        
        // Calculate camera position in pixels (relative to the stage)
        const cameraX = selectedCamera.position.x * sceneWidth * sceneZoom;
        const cameraY = selectedCamera.position.y * sceneHeight * sceneZoom;

        // Calculate scroll position to center the camera (add padding offset)
        const scrollX = cameraX + paddingOffset - (container.clientWidth / 2);
        const scrollY = cameraY + paddingOffset - (container.clientHeight / 2);
        
        // Smooth scroll to camera position
        container.scrollTo({
          left: scrollX,
          top: scrollY,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCameraId, sceneCameras, sceneWidth, sceneHeight, sceneZoom]);

  // No longer needed - canvas fills viewport

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a, b) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * sceneZoom;
  const scaledSceneHeight = sceneHeight * sceneZoom;

  return (
    <div className="flex flex-col h-full bg-gray-950" style={{ width: '100vw', height: '100vh' }}>
      {/* Camera Toolbar */}
      <CameraToolbar
        cameras={sceneCameras}
        selectedCameraId={selectedCameraId}
        onAddCamera={handleAddCamera}
        onSelectCamera={setSelectedCameraId}
        onZoomCamera={handleZoomCamera}
        onToggleLock={handleToggleLock}
        sceneZoom={sceneZoom}
        onSceneZoom={setSceneZoom}
      />
      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 bg-white" style={{ height: '100%' }}>
        {/* Canvas Area - Scrollable viewport */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 bg-white relative overflow-auto"
          style={{ 
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        >
          {/* Padding container for infinite scrollable space */}
          <div style={{
            minWidth: `${scaledSceneWidth + 4000}px`,
            minHeight: `${scaledSceneHeight + 4000}px`,
            padding: '2000px',
            position: 'relative'
          }}>
            {/* Scene Canvas - The actual stage */}
            <div
              ref={canvasRef}
              className="bg-white shadow-2xl"
              style={{
                width: `${scaledSceneWidth}px`,
                height: `${scaledSceneHeight}px`,
                position: 'relative'
              }}
            >
            {/* Konva Stage for layers */}
            <Stage
              width={sceneWidth}
              height={sceneHeight}
              scaleX={sceneZoom}
              scaleY={sceneZoom}
              style={{
                width: `${scaledSceneWidth}px`,
                height: `${scaledSceneHeight}px`,
                backgroundImage: scene.backgroundImage 
                  ? `url(${scene.backgroundImage})` 
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              ref={stageRef}
              onMouseDown={(e) => {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                  onSelectLayer(null);
                  setSelectedCameraId(null);
                }
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
          {/* End of padding container */}
          </div>
        </div>
        {/* Right Panel - Camera Settings */}
        {/**<div className="w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto p-4">
          <CameraSettingsPanel
            camera={sceneCameras.find(cam => cam.id === selectedCameraId)}
            onUpdate={handleUpdateCamera}
          />
        </div>**/}
      </div>
    </div>
  );
};

export default SceneCanvas;
