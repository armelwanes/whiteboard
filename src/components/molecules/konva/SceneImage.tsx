import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { STAGE_WIDTH, STAGE_HEIGHT, SceneImageProps } from './types';

const SceneImage: React.FC<SceneImageProps> = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, img]);

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = imageRef.current;
    if (!node) return pos;
    const width = node.width();
    const height = node.height();
    let newX = pos.x;
    let newY = pos.y;
    if (newX < 0) newX = 0;
    if (newX + width > STAGE_WIDTH) newX = STAGE_WIDTH - width;
    if (newY < 0) newY = 0;
    if (newY + height > STAGE_HEIGHT) newY = STAGE_HEIGHT - height;
    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        scaleX={image.flipX ? -1 : 1}
        scaleY={image.flipY ? -1 : 1}
        draggable
        dragBoundFunc={dragBoundFunc}
        onClick={onSelect}
        onTap={onSelect}
        ref={imageRef}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            if (
              newBox.x < 0 || newBox.y < 0 ||
              newBox.x + newBox.width > STAGE_WIDTH ||
              newBox.y + newBox.height > STAGE_HEIGHT
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default SceneImage;