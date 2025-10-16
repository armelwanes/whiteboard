import React, { useRef, useEffect } from 'react';
import { Text as KonvaText, Transformer } from 'react-konva';
import Konva from 'konva';

export interface ThumbnailTextLayerProps {
  layer: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
}

export const ThumbnailTextLayer: React.FC<ThumbnailTextLayerProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onChange 
}) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        text={layer.text}
        x={layer.x}
        y={layer.y}
        fontSize={layer.fontSize}
        fontFamily={layer.fontFamily}
        fontStyle={layer.fontStyle}
        fill={layer.fill}
        stroke={layer.stroke}
        strokeWidth={layer.strokeWidth}
        shadowColor={layer.shadowEnabled ? 'rgba(0, 0, 0, 0.8)' : 'transparent'}
        shadowBlur={layer.shadowEnabled ? 15 : 0}
        shadowOffsetX={layer.shadowEnabled ? 4 : 0}
        shadowOffsetY={layer.shadowEnabled ? 4 : 0}
        align={layer.align}
        offsetX={layer.align === 'center' ? 0 : 0}
        offsetY={layer.fontSize / 2}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        onDragEnd={(e) => {
          onChange({
            ...layer,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          if (!node) return;
          
          const scaleX = node.scaleX();
          
          onChange({
            ...layer,
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(5, layer.fontSize * scaleX),
          });
          
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={['middle-left', 'middle-right']}
        />
      )}
    </>
  );
};
