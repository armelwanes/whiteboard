import React, { useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { STAGE_WIDTH, STAGE_HEIGHT, SceneTextProps } from './types';

const SceneText: React.FC<SceneTextProps> = ({ text, isSelected, onSelect, onChange }) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = textRef.current;
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
      <Text
        text={text.content}
        x={text.x}
        y={text.y}
        fontSize={text.fontSize || 24}
        fontFamily={text.fontFamily || 'Arial'}
        fill={text.color || '#000000'}
        width={text.width}
        rotation={text.rotation || 0}
        draggable
        dragBoundFunc={dragBoundFunc}
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        onDragEnd={(e) => {
          onChange({
            ...text,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...text,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            fontSize: Math.max(10, (text.fontSize || 24) * scaleY),
            rotation: node.rotation(),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20) return oldBox;
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

export default SceneText;