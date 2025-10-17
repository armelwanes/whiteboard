import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer as KonvaLayer } from 'react-konva';
import { CameraToolbar, KonvaCamera, LayerImage, LayerText } from '../molecules';
import { createDefaultCamera } from '../../utils/cameraAnimator';
import LayerShape from '../LayerShape';

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
  onSelectCamera,
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
  const [selectedCameraId, setSelectedCameraId] = useState('default-camera');
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  
  // Notify parent when camera selection changes
  React.useEffect(() => {
    if (onSelectCamera) {
      const selectedCamera = sceneCameras.find(cam => cam.id === selectedCameraId);
      onSelectCamera(selectedCamera);
    }
  }, [selectedCameraId, sceneCameras, onSelectCamera]);
  const [sceneZoom, setSceneZoom] = useState(1.0);
  const [hasCalculatedInitialZoom, setHasCalculatedInitialZoom] = useState(false);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  // Calculate initial zoom to fit scene in viewport
  React.useEffect(() => {
    if (!hasCalculatedInitialZoom && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Calculate zoom to fit with some padding (90% of container)
      const zoomX = (containerWidth * 0.9) / sceneWidth;
      const zoomY = (containerHeight * 0.9) / sceneHeight;
      const fitZoom = Math.max(0.5, Math.min(zoomX, zoomY, 1.0)); // Min 50%, max 100%
      
      if (fitZoom < 1.0) {
        setSceneZoom(fitZoom);
      }
      setHasCalculatedInitialZoom(true);
    }
  }, [hasCalculatedInitialZoom, sceneWidth, sceneHeight]);

  // Create a new camera
  const handleAddCamera = useCallback(() => {
    // Find default camera position to use as starting point for new cameras
    const defaultCamera = sceneCameras.find(cam => cam.isDefault);
    const defaultPosition = defaultCamera ? defaultCamera.position : { x: 0.5, y: 0.5 };
    
    // Use same dimensions as default camera to maintain visual consistency
    // These dimensions are not affected by scene zoom - the Stage handles the scaling
    const cameraWidth = defaultCamera?.width || 800;
    const cameraHeight = defaultCamera?.height || 450;
    
    const newCamera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${sceneCameras.length}`,
      position: { x: defaultPosition.x, y: defaultPosition.y }, // Start at default camera position
      width: cameraWidth,
      height: cameraHeight,
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
    onUpdateScene({ sceneCameras: updatedCameras });
  }, [sceneCameras, onUpdateScene]);

  // Update camera properties
  const handleUpdateCamera = useCallback((cameraId, updates) => {
    const updatedCameras = sceneCameras.map(cam =>
      cam.id === cameraId ? { ...cam, ...updates } : cam
    );
    setSceneCameras(updatedCameras);
    
    // Persist to scene
    onUpdateScene({ sceneCameras: updatedCameras });
  }, [sceneCameras, onUpdateScene]);

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
    onUpdateScene({ sceneCameras: updatedCameras });
  }, [sceneCameras, selectedCameraId, onUpdateScene]);

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

  // Reset centering flag when scene ID changes
  React.useEffect(() => {
    setHasInitialCentered(false);
  }, [scene.id]);

  // Auto-scroll to selected camera - disabled since canvas is now centered with flexbox
  // The canvas is always centered in the viewport, so scrolling is not needed
  React.useEffect(() => {
    // Mark as centered immediately since we don't need to scroll
    if (!hasInitialCentered) {
      setHasInitialCentered(true);
    }
  }, [selectedCameraId, hasInitialCentered]);

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a, b) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * sceneZoom;
  const scaledSceneHeight = sceneHeight * sceneZoom;
  
  return (
    <div className="flex flex-col h-full bg-secondary">
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
        {/* Canvas Area - Centered viewport */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 bg-white relative flex items-center justify-center overflow-hidden"
          style={{ 
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        >
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
            {/* Konva Stage for layers and cameras */}
            <div style={{ position: 'relative', zIndex: 2 }}>
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
                {/* Cameras Layer - En dessous */}
                <KonvaLayer>
                  {sceneCameras.map((camera) => (
                    <KonvaCamera
                      key={camera.id}
                      camera={camera}
                      isSelected={selectedCameraId === camera.id}
                      onSelect={() => setSelectedCameraId(camera.id)}
                      onUpdate={handleUpdateCamera}
                      sceneWidth={sceneWidth}
                      sceneHeight={sceneHeight}
                    />
                  ))}
                </KonvaLayer>
                
                {/* Layers - Au dessus */}
                <KonvaLayer>
                  {sortedLayers.map((layer) => {
                    // Render text, image, or shape layer based on type
                    if (layer.type === 'text') {
                      return (
                        <LayerText
                          key={layer.id}
                          layer={layer}
                          isSelected={layer.id === selectedLayerId}
                          onSelect={() => {
                            onSelectLayer(layer.id);
                            setSelectedCameraId(null);
                          }}
                          onChange={onUpdateLayer}
                        />
                      );
                    } else if (layer.type === 'shape') {
                      return (
                        <LayerShape
                          key={layer.id}
                          layer={layer}
                          isSelected={layer.id === selectedLayerId}
                          onSelect={() => {
                            onSelectLayer(layer.id);
                            setSelectedCameraId(null);
                          }}
                          onChange={onUpdateLayer}
                        />
                      );
                    } else {
                      return (
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
                      );
                    }
                  })}
                </KonvaLayer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCanvas;