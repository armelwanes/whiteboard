import React from 'react';
import { Rect, Circle, Ellipse, RegularPolygon, Star as KonvaStar } from 'react-konva';
import { ShapeCommonProps, getFillStrokeProps } from './shape-utils';

interface GeometricShapeProps {
  shapeConfig: any;
  commonProps: ShapeCommonProps;
}

export const RectangleShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <Rect
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    width={shapeConfig.width}
    height={shapeConfig.height}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
    cornerRadius={shapeConfig.cornerRadius || 0}
  />
);

export const SquareShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <Rect
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    width={shapeConfig.width}
    height={shapeConfig.height}
    fill={shapeConfig.fill}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    rotation={shapeConfig.rotation || 0}
    cornerRadius={shapeConfig.cornerRadius || 0}
  />
);

export const CircleShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <Circle
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    radius={shapeConfig.radius}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const EllipseShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <Ellipse
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    radiusX={shapeConfig.radiusX}
    radiusY={shapeConfig.radiusY}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const TriangleShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <RegularPolygon
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    sides={3}
    radius={shapeConfig.radius}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const PolygonShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <RegularPolygon
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    sides={shapeConfig.sides || 6}
    radius={shapeConfig.radius}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const HexagonShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <RegularPolygon
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    sides={6}
    radius={shapeConfig.radius}
    fill={shapeConfig.fill}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
    rotation={shapeConfig.rotation || 0}
  />
);

export const StarShape: React.FC<GeometricShapeProps> = ({ shapeConfig, commonProps }) => (
  <KonvaStar
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    numPoints={shapeConfig.numPoints || 5}
    innerRadius={shapeConfig.innerRadius || 40}
    outerRadius={shapeConfig.outerRadius || 100}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);
