import React, { useRef, useEffect } from 'react';
import { 
  Rect, 
  Circle, 
  Ellipse, 
  Line, 
  Arrow, 
  RegularPolygon,
  Star as KonvaStar,
  Text,
  Group,
  Transformer,
  Shape,
  Path,
} from 'react-konva';
import { ShapeType } from '../utils/shapeUtils';

/**
 * LayerShape Component
 * Renders different types of shapes using React-Konva
 */
const LayerShape = ({ layer, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!layer.shape_config) {
    return null;
  }

  const shapeConfig = layer.shape_config;
  const shapeType = shapeConfig.shape;

  // Common properties
  const commonProps = {
    ref: shapeRef,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    opacity: layer.opacity || 1.0,
    onDragEnd: (e) => {
      // For shapes, we update the shape_config position
      const newConfig = {
        ...shapeConfig,
        x: e.target.x(),
        y: e.target.y(),
      };
      onChange({
        ...layer,
        shape_config: newConfig,
      });
    },
    onTransformEnd: () => {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();

      // Update shape configuration based on shape type
      let newConfig = { ...shapeConfig };

      if (shapeType === ShapeType.RECTANGLE || shapeType === ShapeType.SQUARE || 
          shapeType === ShapeType.TEXT_BOX || shapeType === ShapeType.HIGHLIGHT ||
          shapeType === ShapeType.CLOUD || shapeType === ShapeType.BUBBLE ||
          shapeType === ShapeType.THOUGHT_BUBBLE || shapeType === ShapeType.ORG_NODE ||
          shapeType === ShapeType.FRAME_DOODLE) {
        newConfig.width = Math.max(5, (shapeConfig.width || 100) * scaleX);
        newConfig.height = Math.max(5, (shapeConfig.height || 100) * scaleY);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.CIRCLE || shapeType === ShapeType.CIRCLE_CONCENTRIC) {
        newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
        if (shapeType === ShapeType.CIRCLE_CONCENTRIC && shapeConfig.radiuses) {
          newConfig.radiuses = shapeConfig.radiuses.map(r => Math.max(5, r * scaleX));
        }
        newConfig.x = node.x();
        newConfig.y = node.y();
      } else if (shapeType === ShapeType.ELLIPSE) {
        newConfig.radiusX = Math.max(5, shapeConfig.radiusX * scaleX);
        newConfig.radiusY = Math.max(5, shapeConfig.radiusY * scaleY);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.TRIANGLE || shapeType === ShapeType.POLYGON || 
                 shapeType === ShapeType.HEXAGON) {
        newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.STAR) {
        newConfig.innerRadius = Math.max(5, shapeConfig.innerRadius * scaleX);
        newConfig.outerRadius = Math.max(5, shapeConfig.outerRadius * scaleX);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.BANNER || shapeType === ShapeType.TIMELINE) {
        newConfig.width = Math.max(5, (shapeConfig.width || 100) * scaleX);
        newConfig.height = Math.max(5, (shapeConfig.height || 60) * scaleY);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.ICON || shapeType === ShapeType.DECORATIVE_SHAPE) {
        newConfig.size = Math.max(5, (shapeConfig.size || 80) * scaleX);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.LINE || shapeType === ShapeType.ARROW || 
                 shapeType === ShapeType.ARROW_DOUBLE || shapeType === ShapeType.ARROW_CURVE ||
                 shapeType === ShapeType.CONNECTOR || shapeType === ShapeType.UNDERLINE_ANIMATED) {
        // For lines and arrows, scale the points
        const points = shapeConfig.points || [0, 0, 100, 100];
        newConfig.points = points.map((val, idx) => 
          idx % 2 === 0 ? val * scaleX : val * scaleY
        );
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      }

      onChange({
        ...layer,
        shape_config: newConfig,
      });

      // Reset scale and rotation on node
      node.scaleX(1);
      node.scaleY(1);
    },
  };

  // Render the appropriate shape
  const renderShape = () => {
    switch (shapeType) {
      case ShapeType.RECTANGLE:
        return (
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

      case ShapeType.CIRCLE:
        return (
          <Circle
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            radius={shapeConfig.radius}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
          />
        );

      case ShapeType.ELLIPSE:
        return (
          <Ellipse
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            radiusX={shapeConfig.radiusX}
            radiusY={shapeConfig.radiusY}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.LINE:
        return (
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

      case ShapeType.ARROW:
        return (
          <Arrow
            {...commonProps}
            x={shapeConfig.x || 0}
            y={shapeConfig.y || 0}
            points={shapeConfig.points}
            stroke={shapeConfig.stroke}
            fill={shapeConfig.fill}
            strokeWidth={shapeConfig.strokeWidth}
            pointerLength={shapeConfig.pointerLength || 20}
            pointerWidth={shapeConfig.pointerWidth || 20}
            lineCap={shapeConfig.lineCap || 'round'}
            lineJoin={shapeConfig.lineJoin || 'round'}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.TRIANGLE:
        return (
          <RegularPolygon
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            sides={3}
            radius={shapeConfig.radius}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.POLYGON:
        return (
          <RegularPolygon
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            sides={shapeConfig.sides || 6}
            radius={shapeConfig.radius}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.TEXT_BOX:
        return (
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

      case ShapeType.SQUARE:
        return (
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

      case ShapeType.ARROW_DOUBLE:
        return (
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
            {/* Left arrow head */}
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
            {/* Right arrow head */}
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

      case ShapeType.ARROW_CURVE:
        return (
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

      case ShapeType.CONNECTOR:
        return (
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

      case ShapeType.STAR:
        return (
          <KonvaStar
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            numPoints={shapeConfig.numPoints || 5}
            innerRadius={shapeConfig.innerRadius || 40}
            outerRadius={shapeConfig.outerRadius || 100}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.CLOUD:
        return (
          <Shape
            {...commonProps}
            sceneFunc={(context, shape) => {
              const x = shapeConfig.x || 0;
              const y = shapeConfig.y || 0;
              const width = shapeConfig.width || 200;
              const height = shapeConfig.height || 120;
              
              context.beginPath();
              // Draw cloud using circles
              context.arc(x - width * 0.25, y, height * 0.3, 0, Math.PI * 2);
              context.arc(x, y - height * 0.15, height * 0.35, 0, Math.PI * 2);
              context.arc(x + width * 0.25, y, height * 0.3, 0, Math.PI * 2);
              context.arc(x, y + height * 0.1, height * 0.25, 0, Math.PI * 2);
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill={shapeConfig.fill}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
          />
        );

      case ShapeType.BUBBLE:
        return (
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
              cornerRadius={shapeConfig.cornerRadius || 10}
            />
            {/* Tail */}
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

      case ShapeType.THOUGHT_BUBBLE:
        return (
          <Group
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            rotation={shapeConfig.rotation || 0}
          >
            <Ellipse
              radiusX={shapeConfig.width / 2}
              radiusY={shapeConfig.height / 2}
              fill={shapeConfig.fill}
              stroke={shapeConfig.stroke}
              strokeWidth={shapeConfig.strokeWidth}
            />
            {/* Small thought circles */}
            <Circle
              x={-shapeConfig.width / 3}
              y={shapeConfig.height / 2 + 15}
              radius={8}
              fill={shapeConfig.fill}
              stroke={shapeConfig.stroke}
              strokeWidth={shapeConfig.strokeWidth}
            />
            <Circle
              x={-shapeConfig.width / 2 - 10}
              y={shapeConfig.height / 2 + 30}
              radius={5}
              fill={shapeConfig.fill}
              stroke={shapeConfig.stroke}
              strokeWidth={shapeConfig.strokeWidth}
            />
          </Group>
        );

      case ShapeType.HIGHLIGHT:
        return (
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

      case ShapeType.BANNER:
        return (
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

      case ShapeType.HEXAGON:
        return (
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

      case ShapeType.CIRCLE_CONCENTRIC:
        return (
          <Group
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
          >
            {(shapeConfig.radiuses || [40, 70, 100]).map((radius, index) => (
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

      case ShapeType.TIMELINE:
        return (
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
              const x = -shapeConfig.width / 2 + (index * shapeConfig.width) / (shapeConfig.markers - 1);
              return (
                <Group key={index}>
                  <Circle
                    x={x}
                    y={0}
                    radius={8}
                    fill={shapeConfig.fill}
                    stroke={shapeConfig.stroke}
                    strokeWidth={shapeConfig.strokeWidth}
                  />
                  <Line
                    points={[x, 0, x, 20]}
                    stroke={shapeConfig.stroke}
                    strokeWidth={2}
                  />
                </Group>
              );
            })}
          </Group>
        );

      case ShapeType.ORG_NODE:
        return (
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

      case ShapeType.ICON:
        return (
          <Group
            {...commonProps}
            x={shapeConfig.x}
            y={shapeConfig.y}
            rotation={shapeConfig.rotation || 0}
          >
            {/* Simple lightbulb icon */}
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

      case ShapeType.FRAME_DOODLE:
        return (
          <Shape
            {...commonProps}
            sceneFunc={(context, shape) => {
              const x = shapeConfig.x || 0;
              const y = shapeConfig.y || 0;
              const width = shapeConfig.width || 250;
              const height = shapeConfig.height || 180;
              
              context.beginPath();
              // Draw hand-drawn style rectangle with slight variations
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

      case ShapeType.UNDERLINE_ANIMATED:
        return (
          <Line
            {...commonProps}
            x={shapeConfig.x || 0}
            y={shapeConfig.y || 0}
            points={shapeConfig.points}
            stroke={shapeConfig.stroke}
            strokeWidth={shapeConfig.strokeWidth}
            lineCap={shapeConfig.lineCap || 'round'}
            rotation={shapeConfig.rotation || 0}
          />
        );

      case ShapeType.DECORATIVE_SHAPE:
        return (
          <Shape
            {...commonProps}
            sceneFunc={(context, shape) => {
              const x = shapeConfig.x || 0;
              const y = shapeConfig.y || 0;
              const size = shapeConfig.size || 100;
              
              // Draw a heart shape
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

      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size limit
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true}
          enabledAnchors={
            shapeType === ShapeType.CIRCLE
              ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
              : ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
          }
        />
      )}
    </>
  );
};

export default LayerShape;
