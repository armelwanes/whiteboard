import React from 'react';
import { Group, Rect, Circle, Ellipse, Line, Text, Shape } from 'react-konva';
import { ShapeCommonProps, getFillStrokeProps } from '../../atoms/shapes/shape-utils';

interface ComplexShapeProps {
  shapeConfig: any;
  commonProps: ShapeCommonProps;
}

export const TextBoxShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Rect
      width={shapeConfig.width}
      height={shapeConfig.height}
      fill={shapeConfig.backgroundColor || '#F3F4F6'}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
    <Text
      x={shapeConfig.padding || 10}
      y={shapeConfig.padding || 10}
      width={shapeConfig.width - (shapeConfig.padding || 10) * 2}
      height={shapeConfig.height - (shapeConfig.padding || 10) * 2}
      text={shapeConfig.text || 'Text Box'}
      fontSize={shapeConfig.fontSize || 24}
      fontFamily={shapeConfig.fontFamily || 'Arial'}
      fill={shapeConfig.fill}
      align={shapeConfig.align || 'center'}
      verticalAlign={shapeConfig.verticalAlign || 'middle'}
    />
  </Group>
);

export const CloudShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 200;
      const height = shapeConfig.height || 120;
      
      context.beginPath();
      context.arc(x - width * 0.25, y, height * 0.3, 0, Math.PI * 2);
      context.arc(x, y - height * 0.15, height * 0.35, 0, Math.PI * 2);
      context.arc(x + width * 0.25, y, height * 0.3, 0, Math.PI * 2);
      context.arc(x, y + height * 0.1, height * 0.25, 0, Math.PI * 2);
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const BubbleShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
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
      {...getFillStrokeProps(shapeConfig)}
      cornerRadius={shapeConfig.cornerRadius || 10}
    />
    <Line
      points={[
        -shapeConfig.width / 4,
        shapeConfig.height / 2,
        -shapeConfig.width / 2 - 20,
        shapeConfig.height / 2 + 30,
      ]}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
      lineCap="round"
    />
  </Group>
);

export const ThoughtBubbleShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Ellipse
      radiusX={shapeConfig.width / 2}
      radiusY={shapeConfig.height / 2}
      {...getFillStrokeProps(shapeConfig)}
    />
    <Circle
      x={-shapeConfig.width / 3}
      y={shapeConfig.height / 2 + 15}
      radius={8}
      {...getFillStrokeProps(shapeConfig)}
    />
    <Circle
      x={-shapeConfig.width / 2 - 10}
      y={shapeConfig.height / 2 + 30}
      radius={5}
      {...getFillStrokeProps(shapeConfig)}
    />
  </Group>
);

export const HighlightShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Rect
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    width={shapeConfig.width}
    height={shapeConfig.height}
    fill={shapeConfig.fill}
    opacity={shapeConfig.opacity || 0.5}
    rotation={shapeConfig.rotation || 0}
  />
);

export const BannerShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Shape
      sceneFunc={(context, shape) => {
        const width = shapeConfig.width || 300;
        const height = shapeConfig.height || 60;
        const notchSize = 15;
        
        context.beginPath();
        context.moveTo(-width / 2, -height / 2);
        context.lineTo(width / 2, -height / 2);
        context.lineTo(width / 2 - notchSize, 0);
        context.lineTo(width / 2, height / 2);
        context.lineTo(-width / 2, height / 2);
        context.lineTo(-width / 2 + notchSize, 0);
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill={shapeConfig.fill}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
    {shapeConfig.text && (
      <Text
        text={shapeConfig.text}
        fontSize={shapeConfig.fontSize || 20}
        fontFamily={shapeConfig.fontFamily || 'Arial'}
        fill={shapeConfig.textFill || '#FFFFFF'}
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

export const CircleConcentricShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
  >
    {(shapeConfig.radiuses || [40, 70, 100]).map((radius: number, index: number) => (
      <Circle
        key={index}
        radius={radius}
        fill={(shapeConfig.fills || [])[index] || '#3B82F6'}
        stroke={(shapeConfig.strokes || [])[index] || '#1E40AF'}
        strokeWidth={shapeConfig.strokeWidth}
      />
    ))}
  </Group>
);

export const TimelineShape: React.FC<ComplexShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Line
      points={[
        -shapeConfig.width / 2,
        0,
        shapeConfig.width / 2,
        0,
      ]}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
    />
    {Array.from({ length: shapeConfig.markers || 4 }).map((_, index) => {
      const x = -shapeConfig.width / 2 + (index * shapeConfig.width) / ((shapeConfig.markers || 4) - 1);
      return (
        <Group key={index}>
          <Circle
            x={x}
            y={0}
            radius={6}
            fill={shapeConfig.markerFill || shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={2}
          />
        </Group>
      );
    })}
  </Group>
);
