import React from 'react';
import { Line, Arrow, Group } from 'react-konva';
import { ShapeCommonProps, getFillStrokeProps } from './shape-utils';

interface LineShapeProps {
  shapeConfig: any;
  commonProps: ShapeCommonProps;
}

export const LineShape: React.FC<LineShapeProps> = ({ shapeConfig, commonProps }) => (
  <Line
    {...commonProps}
    x={shapeConfig.x || 0}
    y={shapeConfig.y || 0}
    points={shapeConfig.points}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    lineCap={shapeConfig.lineCap || 'round'}
    lineJoin={shapeConfig.lineJoin || 'round'}
    rotation={shapeConfig.rotation || 0}
  />
);

export const ArrowShape: React.FC<LineShapeProps> = ({ shapeConfig, commonProps }) => (
  <Arrow
    {...commonProps}
    x={shapeConfig.x || 0}
    y={shapeConfig.y || 0}
    points={shapeConfig.points}
    {...getFillStrokeProps(shapeConfig)}
    pointerLength={shapeConfig.pointerLength || 20}
    pointerWidth={shapeConfig.pointerWidth || 20}
    lineCap={shapeConfig.lineCap || 'round'}
    lineJoin={shapeConfig.lineJoin || 'round'}
    rotation={shapeConfig.rotation || 0}
  />
);

export const ArrowDoubleShape: React.FC<LineShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x || 0}
    y={shapeConfig.y || 0}
    rotation={shapeConfig.rotation || 0}
  >
    <Line
      points={shapeConfig.points}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
      lineCap={shapeConfig.lineCap || 'round'}
      lineJoin={shapeConfig.lineJoin || 'round'}
    />
    <Arrow
      points={[
        shapeConfig.points[0],
        shapeConfig.points[1],
        shapeConfig.points[0] - (shapeConfig.pointerLength || 20),
        shapeConfig.points[1],
      ]}
      stroke={shapeConfig.stroke}
      fill={shapeConfig.fill}
      strokeWidth={shapeConfig.strokeWidth}
      pointerLength={shapeConfig.pointerLength || 20}
      pointerWidth={shapeConfig.pointerWidth || 20}
      lineCap="round"
    />
    <Arrow
      points={[
        shapeConfig.points[shapeConfig.points.length - 2],
        shapeConfig.points[shapeConfig.points.length - 1],
        shapeConfig.points[shapeConfig.points.length - 2] + (shapeConfig.pointerLength || 20),
        shapeConfig.points[shapeConfig.points.length - 1],
      ]}
      stroke={shapeConfig.stroke}
      fill={shapeConfig.fill}
      strokeWidth={shapeConfig.strokeWidth}
      pointerLength={shapeConfig.pointerLength || 20}
      pointerWidth={shapeConfig.pointerWidth || 20}
      lineCap="round"
    />
  </Group>
);

export const ArrowCurveShape: React.FC<LineShapeProps> = ({ shapeConfig, commonProps }) => (
  <Line
    {...commonProps}
    x={shapeConfig.x || 0}
    y={shapeConfig.y || 0}
    points={shapeConfig.points}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    tension={shapeConfig.tension || 0.5}
    bezier={true}
    lineCap="round"
    lineJoin="round"
    rotation={shapeConfig.rotation || 0}
  />
);

export const ConnectorShape: React.FC<LineShapeProps> = ({ shapeConfig, commonProps }) => (
  <Line
    {...commonProps}
    x={shapeConfig.x || 0}
    y={shapeConfig.y || 0}
    points={shapeConfig.points}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    lineCap={shapeConfig.lineCap || 'round'}
    lineJoin={shapeConfig.lineJoin || 'round'}
    rotation={shapeConfig.rotation || 0}
  />
);
