import React from 'react';
import { Shape, Group, Line } from 'react-konva';
import { ShapeCommonProps, getFillStrokeProps } from '../../atoms/shapes/shape-utils';

interface DoodleShapeProps {
  shapeConfig: any;
  commonProps: ShapeCommonProps;
}

export const FrameDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 250;
      const height = shapeConfig.height || 180;
      
      context.beginPath();
      const jitter = 3;
      context.moveTo(x - width / 2 + Math.random() * jitter, y - height / 2);
      context.lineTo(x + width / 2 + Math.random() * jitter, y - height / 2 + Math.random() * jitter);
      context.lineTo(x + width / 2, y + height / 2 + Math.random() * jitter);
      context.lineTo(x - width / 2 + Math.random() * jitter, y + height / 2);
      context.closePath();
      context.strokeShape(shape);
    }}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
  />
);

export const FrameRectDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 250;
      const height = shapeConfig.height || 180;
      
      context.beginPath();
      const segments = 20;
      const jitter = 4;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x - width / 2 + width * t + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + (Math.random() - 0.5) * jitter;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x + width / 2 + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + height * t + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const px = x - width / 2 + width * t + (Math.random() - 0.5) * jitter;
        const py = y + height / 2 + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const px = x - width / 2 + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + height * t + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const FrameCircleDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const radius = shapeConfig.radius || 100;
      
      context.beginPath();
      const segments = 36;
      const jitter = 5;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * jitter;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const FrameCloudDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 200;
      const height = shapeConfig.height || 120;
      
      context.beginPath();
      const segments = 24;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;
        const bumpiness = Math.sin(angle * 4) * 0.2 + 1;
        const px = x + Math.cos(angle) * width * 0.5 * bumpiness;
        const py = y + Math.sin(angle) * height * 0.5 * bumpiness;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const ArrowDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const points = shapeConfig.points || [100, 100, 400, 100];
      const x1 = points[0];
      const y1 = points[1];
      const x2 = points[points.length - 2];
      const y2 = points[points.length - 1];
      
      context.beginPath();
      const segments = 20;
      const jitter = 3;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter;
        const py = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 20;
      context.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6),
        y2 - headLength * Math.sin(angle - Math.PI / 6)
      );
      context.moveTo(x2, y2);
      context.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6),
        y2 - headLength * Math.sin(angle + Math.PI / 6)
      );
      
      context.strokeShape(shape);
    }}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
  />
);

export const ArrowCurveDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const points = shapeConfig.points || [100, 100, 200, 50, 300, 100, 400, 100];
      
      context.beginPath();
      const segments = 30;
      const jitter = 2;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const index = Math.floor(t * (points.length / 2 - 1)) * 2;
        const localT = (t * (points.length / 2 - 1)) % 1;
        
        let px, py;
        if (index + 2 < points.length) {
          px = points[index] + (points[index + 2] - points[index]) * localT + (Math.random() - 0.5) * jitter;
          py = points[index + 1] + (points[index + 3] - points[index + 1]) * localT + (Math.random() - 0.5) * jitter;
        } else {
          px = points[points.length - 2];
          py = points[points.length - 1];
        }
        
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      
      const x2 = points[points.length - 2];
      const y2 = points[points.length - 1];
      const x1 = points[points.length - 4];
      const y1 = points[points.length - 3];
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 20;
      
      context.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6),
        y2 - headLength * Math.sin(angle - Math.PI / 6)
      );
      context.moveTo(x2, y2);
      context.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6),
        y2 - headLength * Math.sin(angle + Math.PI / 6)
      );
      
      context.strokeShape(shape);
    }}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
  />
);

export const HighlightDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 200;
      const height = shapeConfig.height || 40;
      
      context.beginPath();
      const segments = 20;
      const jitter = 3;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x + width * t + (Math.random() - 0.5) * jitter;
        const py = y + (Math.random() - 0.5) * jitter;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.lineTo(x + width + (Math.random() - 0.5) * jitter, y + height);
      for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const px = x + width * t + (Math.random() - 0.5) * jitter;
        const py = y + height + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const BubbleDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Group
    {...commonProps}
    x={shapeConfig.x}
    y={shapeConfig.y}
    rotation={shapeConfig.rotation || 0}
  >
    <Shape
      sceneFunc={(context, shape) => {
        const width = shapeConfig.width || 200;
        const height = shapeConfig.height || 120;
        
        context.beginPath();
        const segments = 30;
        const jitter = 4;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const angle = t * Math.PI * 2;
          const rx = width / 2 - 10;
          const ry = height / 2 - 10;
          const px = Math.cos(angle) * rx + (Math.random() - 0.5) * jitter;
          const py = Math.sin(angle) * ry + (Math.random() - 0.5) * jitter;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      {...getFillStrokeProps(shapeConfig)}
    />
    <Line
      points={[
        -shapeConfig.width / 4,
        shapeConfig.height / 2,
        -shapeConfig.width / 3,
        shapeConfig.height / 2 + 15,
        -shapeConfig.width / 2 - 20,
        shapeConfig.height / 2 + 30,
      ]}
      stroke={shapeConfig.stroke}
      strokeWidth={shapeConfig.strokeWidth}
      lineCap="round"
      tension={0.3}
    />
  </Group>
);

export const CloudDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 200;
      const height = shapeConfig.height || 120;
      
      context.beginPath();
      const segments = 40;
      const jitter = 4;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;
        
        const bumpiness = Math.sin(angle * 6) * 0.15 + 1;
        const rx = (width / 2) * bumpiness + (Math.random() - 0.5) * jitter;
        const ry = (height / 2) * bumpiness + (Math.random() - 0.5) * jitter;
        
        const px = x + Math.cos(angle) * rx;
        const py = y + Math.sin(angle) * ry;
        
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const RectangleDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const width = shapeConfig.width || 250;
      const height = shapeConfig.height || 180;
      
      context.beginPath();
      const segments = 20;
      const jitter = 3;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x - width / 2 + width * t + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + (Math.random() - 0.5) * jitter;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x + width / 2 + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + height * t + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const px = x - width / 2 + width * t + (Math.random() - 0.5) * jitter;
        const py = y + height / 2 + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const px = x - width / 2 + (Math.random() - 0.5) * jitter;
        const py = y - height / 2 + height * t + (Math.random() - 0.5) * jitter;
        context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const TriangleDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const radius = shapeConfig.radius || 100;
      
      context.beginPath();
      const segments = 12;
      const jitter = 4;
      
      for (let i = 0; i <= 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const segmentsPerSide = segments / 3;
        
        if (i < 3) {
          const nextAngle = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
          for (let j = 0; j <= segmentsPerSide; j++) {
            const t = j / segmentsPerSide;
            const currentAngle = angle + (nextAngle - angle) * t;
            const r = radius + (Math.random() - 0.5) * jitter;
            const px = x + Math.cos(currentAngle) * r;
            const py = y + Math.sin(currentAngle) * r;
            if (i === 0 && j === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
          }
        }
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
    rotation={shapeConfig.rotation || 0}
  />
);

export const CircleSketchShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const x = shapeConfig.x || 0;
      const y = shapeConfig.y || 0;
      const radius = shapeConfig.radius || 100;
      
      context.beginPath();
      const segments = 36;
      const jitter = 3;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * jitter;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    }}
    {...getFillStrokeProps(shapeConfig)}
  />
);

export const LineWaveDoodleShape: React.FC<DoodleShapeProps> = ({ shapeConfig, commonProps }) => (
  <Shape
    {...commonProps}
    sceneFunc={(context, shape) => {
      const points = shapeConfig.points || [0, 0, 100, 0];
      const x1 = points[0];
      const y1 = points[1];
      const x2 = points[points.length - 2];
      const y2 = points[points.length - 1];
      
      context.beginPath();
      const segments = 30;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t + Math.sin(t * Math.PI * 4) * 10;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.strokeShape(shape);
    }}
    stroke={shapeConfig.stroke}
    strokeWidth={shapeConfig.strokeWidth}
  />
);
