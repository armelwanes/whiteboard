import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

export interface LayerImageProps {
  layer: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (layer: any) => void;
}

export const LayerImage: React.FC<LayerImageProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onChange 
}) => {
  const [img] = useImage(layer.image_path);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

  if (!img) return null;

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = imageRef.current;
    if (!node) return pos;

    const scale = layer.scale || 1.0;
    const width = img.width * scale;
    const height = img.height * scale;
    
    let newX = pos.x;
    let newY = pos.y;

    if (newX < 0) newX = 0;
    if (newX + width > 1920) newX = 1920 - width;

    if (newY < 0) newY = 0;
    if (newY + height > 1080) newY = 1080 - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        scaleX={layer.scale || 1.0}
        scaleY={layer.scale || 1.0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable
        dragBoundFunc={dragBoundFunc}
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
          if (!node) return;
          
          const scaleX = node.scaleX();

          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            scale: scaleX,
            rotation: node.rotation(),
          });
          
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            if (newBox.x < 0 || newBox.y < 0 || 
                newBox.x + newBox.width > 1920 || 
                newBox.y + newBox.height > 1080) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};
