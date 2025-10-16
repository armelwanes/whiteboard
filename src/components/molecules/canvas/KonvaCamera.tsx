import React, { useRef } from 'react';
import { Group, Rect, Line, Text, Transformer } from 'react-konva';
import Konva from 'konva';

export interface KonvaCameraProps {
  camera: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cameraId: string, updates: any) => void;
  sceneWidth: number;
  sceneHeight: number;
}

export const KonvaCamera: React.FC<KonvaCameraProps> = ({ 
  camera, 
  isSelected, 
  onSelect, 
  onUpdate, 
  sceneWidth, 
  sceneHeight 
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const pixelDims = {
    width: camera.width || 1920,
    height: camera.height || 1080,
  };
  
  const pixelPos = {
    x: (camera.position.x * sceneWidth) - (pixelDims.width / 2),
    y: (camera.position.y * sceneHeight) - (pixelDims.height / 2),
  };

  const handleDragEnd = () => {
    if (camera.locked) return;
    
    const node = groupRef.current;
    if (!node) return;
    
    const newX = node.x();
    const newY = node.y();
    
    const centerX = newX + (pixelDims.width / 2);
    const centerY = newY + (pixelDims.height / 2);
    
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
    if (!node) return;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newWidth = Math.max(100, pixelDims.width * scaleX);
    const newHeight = Math.max(100, pixelDims.height * scaleY);
    const newZoom = Math.max(0.1, Math.min(1.0, pixelDims.width / newWidth * (camera.zoom || 0.8)));
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
        onClick={() => onSelect()}
        onTap={() => onSelect()}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={pixelDims.width}
          height={pixelDims.height}
          stroke={isSelected ? '#ec4899' : '#f9a8d4'}
          strokeWidth={3}
          dash={camera.locked ? [] : [10, 5]}
          fill={isSelected ? 'rgba(236, 72, 153, 0.1)' : 'rgba(249, 168, 212, 0.05)'}
        />
        
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
