import React from 'react';
import { Group, Circle, Text, Rect, Shape } from 'react-konva';
import { ShapeCommonProps, getFillStrokeProps } from './shape-utils';

interface CharacterShapeProps {
  shapeConfig: any;
  commonProps: ShapeCommonProps;
}

export const CharacterShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Circle
      radius={shapeConfig.size * 0.6}
      {...getFillStrokeProps(shapeConfig)}
    />
    <Text
      text={shapeConfig.character || '?'}
      fontSize={shapeConfig.size * 0.7}
      fontFamily="Arial"
      fontStyle="bold"
      fill={shapeConfig.fillMode === 'stroke' ? shapeConfig.stroke : '#FFFFFF'}
      align="center"
      verticalAlign="middle"
      width={shapeConfig.size * 1.2}
      height={shapeConfig.size * 1.2}
      offsetX={shapeConfig.size * 0.6}
      offsetY={shapeConfig.size * 0.6}
    />
  </Group>
);

export const OrgNodeShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Rect
      x={-shapeConfig.width / 2}
      y={-shapeConfig.height / 2}
      width={shapeConfig.width}
      height={shapeConfig.height}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
      cornerRadius={shapeConfig.cornerRadius || 8}
    />
    {shapeConfig.text && (
      <Text
        text={shapeConfig.text}
        fontSize={shapeConfig.fontSize || 16}
        fontFamily={shapeConfig.fontFamily || 'Arial'}
        fill={shapeConfig.textFill || '#1F2937'}
        align="center"
        verticalAlign="middle"
        width={shapeConfig.width}
        height={shapeConfig.height}
        offsetX={shapeConfig.width / 2}
        offsetY={shapeConfig.height / 2}
      />
    )}
  </Group>
);

export const IconShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Circle
      y={-shapeConfig.size / 4}
      radius={shapeConfig.size / 3}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
    <Rect
      x={-shapeConfig.size / 6}
      y={shapeConfig.size / 6}
      width={shapeConfig.size / 3}
      height={shapeConfig.size / 4}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
  </Group>
);

export const DecorativeShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const size = shapeConfig.size || 100;
      
      context.beginPath();
      context.moveTo(x, y + size / 4);
      context.bezierCurveTo(
        x, y,
        x - size / 2, y,
        x - size / 2, y + size / 4
      );
      context.bezierCurveTo(
        x - size / 2, y + size / 2,
        x, y + size * 0.75,
        x, y + size
      );
      context.bezierCurveTo(
        x, y + size * 0.75,
        x + size / 2, y + size / 2,
        x + size / 2, y + size / 4
      );
      context.bezierCurveTo(
        x + size / 2, y,
        x, y,
        x, y + size / 4
      );
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    fill={shapeConfig.fill}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    rotation={shapeConfig.rotation || 0}
  />
);

export const UnderlineAnimatedShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const points = shapeConfig.points || [0, 0, 100, 0];
      
      context.beginPath();
      context.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i += 2) {
        context.lineTo(points[i], points[i + 1]);
      }
      context.strokeShape(shape);
    }}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    rotation={shapeConfig.rotation || 0}
  />
);

export const StarShootingShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Shape
      sceneFunc={(context, shape) => {
        const size = shapeConfig.size || 80;
        
        context.beginPath();
        context.moveTo(0, -size / 2);
        for (let i = 1; i < 10; i++) {
          const angle = (i * Math.PI * 2) / 10 - Math.PI / 2;
          const radius = i % 2 === 0 ? size / 2 : size / 4;
          context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        context.closePath();
        
        context.moveTo(size / 2, 0);
        context.lineTo(size, size / 3);
        
        context.fillStrokeShape(shape);
      }}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
  </Group>
);

export const ExplosionShape: React.FC<CharacterShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Shape
      sceneFunc={(context, shape) => {
        const size = shapeConfig.size || 100;
        const spikes = 12;
        
        context.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes;
          const radius = i % 2 === 0 ? size / 2 : size / 4;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
  </Group>
);
