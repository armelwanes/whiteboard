import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer as KonvaLayer, Image as KonvaImage, Transformer, Rect, Group, Line, Text } from 'react-konva';
import useImage from 'use-image';
import CameraToolbar from './CameraToolbar';
import { createDefaultCamera } from '../utils/cameraAnimator';

// Konva Camera Component
const KonvaCamera = ({ camera, isSelected, onSelect, onUpdate, sceneWidth, sceneHeight }) => {
  const groupRef = useRef();
  const transformerRef = useRef();

  React.useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Calculate pixel position and dimensions
  const pixelDims = {
    width: camera.width || 800,
    height: camera.height || 450,
  };
  
  const pixelPos = {
    x: (camera.position.x * sceneWidth) - (pixelDims.width / 2),
    y: (camera.position.y * sceneHeight) - (pixelDims.height / 2),
  };

  const handleDragEnd = (e) => {
    if (camera.locked) return;
    
    const node = groupRef.current;
    const newX = node.x();
    const newY = node.y();
    
    // Convert top-left corner to center position
    const centerX = newX + (pixelDims.width / 2);
    const centerY = newY + (pixelDims.height / 2);
    
    // Convert to normalized coordinates
    onUpdate(camera.id, {
      position: {
        x: Math.max(0, Math.min(1, centerX / sceneWidth)),
        y: Math.max(0, Math.min(1, centerY / sceneHeight)),
      },
    });
  };

  const handleTransformEnd = () => {
    if (camera.locked) return;
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Calculate new dimensions
    const newWidth = Math.max(100, pixelDims.width * scaleX);
    const newHeight = Math.max(100, pixelDims.height * scaleY);
    // Calculate zoom based on width ratio (inverse)
    const newZoom = Math.max(0.1, Math.min(5.0, pixelDims.width / newWidth * (camera.zoom || 1.0)));
    // Get new position
    const newX = node.x();
    const newY = node.y();
    const centerX = newX + (newWidth / 2);
    const centerY = newY + (newHeight / 2);
    onUpdate(camera.id, {
      position: {
        x: Math.max(0, Math.min(1, centerX / sceneWidth)),
        y: Math.max(0, Math.min(1, centerY / sceneHeight)),
      },
      width: newWidth,
      height: newHeight,
      zoom: newZoom,
    });
    // Always reset scale after transform
    node.scaleX(1);
    node.scaleY(1);
  };

  const handleTransform = () => {
    if (camera.locked) return;
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Calculate new dimensions in real-time
    const newWidth = Math.max(100, pixelDims.width * scaleX);
    const newHeight = Math.max(100, pixelDims.height * scaleY);
    // Calculate zoom based on width ratio (inverse)
    const newZoom = Math.max(0.1, Math.min(5.0, pixelDims.width / newWidth * (camera.zoom || 1.0)));
    // Get new position
    const newX = node.x();
    const newY = node.y();
    const centerX = newX + (newWidth / 2);
    const centerY = newY + (newHeight / 2);
    onUpdate(camera.id, {
      position: {
        x: Math.max(0, Math.min(1, centerX / sceneWidth)),
        y: Math.max(0, Math.min(1, centerY / sceneHeight)),
      },
      width: newWidth,
      height: newHeight,
      zoom: newZoom,
    });
    // Always reset scale for smooth updates
    node.scaleX(1);
    node.scaleY(1);
  };

  return (
    <>
      <Group
        x={pixelPos.x}
        y={pixelPos.y}
        ref={groupRef}
        draggable={!camera.locked}
        onClick={() => onSelect(camera.id)}
        onTap={() => onSelect(camera.id)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {/* Camera Frame Border */}
        <Rect
          width={pixelDims.width}
          height={pixelDims.height}
          stroke={isSelected ? '#ec4899' : '#f9a8d4'}
          strokeWidth={3}
          dash={camera.locked ? [] : [10, 5]}
          fill={isSelected ? 'rgba(236, 72, 153, 0.1)' : 'rgba(249, 168, 212, 0.05)'}
        />
        
        {/* Diagonal Lines */}
        <Line
          points={[0, 0, pixelDims.width, pixelDims.height]}
          stroke={isSelected ? '#ec4899' : '#f9a8d4'}
          strokeWidth={2}
          dash={[5, 5]}
          opacity={isSelected ? 0.6 : 0.3}
        />
        <Line
          points={[pixelDims.width, 0, 0, pixelDims.height]}
          stroke={isSelected ? '#ec4899' : '#f9a8d4'}
          strokeWidth={2}
          dash={[5, 5]}
          opacity={isSelected ? 0.6 : 0.3}
        />
      </Group>
      
      {/* Camera Label - Séparé du groupe principal */}
      <Group
        x={pixelPos.x}
        y={pixelPos.y - 30}
        listening={false}
      >
        <Rect
          width={150}
          height={25}
          fill={camera.locked ? '#3b82f6' : '#ec4899'}
          cornerRadius={[5, 5, 0, 0]}
        />
        <Text
          text={`${camera.name || camera.id} (${camera.zoom.toFixed(1)}x)`}
          fill="white"
          fontSize={12}
          fontStyle="bold"
          padding={5}
          width={150}
          align="center"
        />
      </Group>
      
      {/* Transformer for resize handles */}
      {isSelected && !camera.locked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100 || newBox.height < 100) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
          keepRatio={true}
          rotateEnabled={false}
        />
      )}
    </>
  );
};

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
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  // Create a new camera
  const handleAddCamera = useCallback(() => {
    // Find default camera position to use as starting point for new cameras
    const defaultCamera = sceneCameras.find(cam => cam.isDefault);
    const defaultPosition = defaultCamera ? defaultCamera.position : { x: 0.5, y: 0.5 };
    
    const newCamera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${sceneCameras.length}`,
      position: { x: defaultPosition.x, y: defaultPosition.y }, // Start at default camera position
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

  // Auto-scroll to selected camera - only on initial load
  React.useEffect(() => {
    if (!hasInitialCentered && selectedCameraId && scrollContainerRef.current && canvasRef.current) {
      const selectedCamera = sceneCameras.find(cam => cam.id === selectedCameraId);
      if (selectedCamera) {
        const container = scrollContainerRef.current;
        
        // Calculate camera position in pixels (accounting for 500px padding)
        const padding = 500;
        const cameraX = (selectedCamera.position.x * sceneWidth * sceneZoom) + padding;
        const cameraY = (selectedCamera.position.y * sceneHeight * sceneZoom) + padding;

        // Calculate scroll position to center the camera
        const scrollX = cameraX - (container.clientWidth / 2);
        const scrollY = cameraY - (container.clientHeight / 2);
        
        // Smooth scroll to camera position
        container.scrollTo({
          left: scrollX,
          top: scrollY,
          behavior: 'smooth'
        });
        
        // Mark as centered so it doesn't happen again
        setHasInitialCentered(true);
      }
    }
  }, [selectedCameraId, sceneCameras, sceneWidth, sceneHeight, sceneZoom, hasInitialCentered]);

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a, b) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * sceneZoom;
  const scaledSceneHeight = sceneHeight * sceneZoom;
  
  return (
    <div className="flex flex-col h-full bg-gray-950">
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
          {/* Padding wrapper for infinite canvas effect */}
          <div style={{ padding: '500px' }}>
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
                      onSelect={setSelectedCameraId}
                      onUpdate={handleUpdateCamera}
                      sceneWidth={sceneWidth}
                      sceneHeight={sceneHeight}
                    />
                  ))}
                </KonvaLayer>
                
                {/* Layers - Au dessus */}
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
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCanvas;