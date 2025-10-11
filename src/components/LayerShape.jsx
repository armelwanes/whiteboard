import React, { useRef, useEffect } from 'react';
import { 
  Rect, 
  Circle, 
  Ellipse, 
  Line, 
  Arrow, 
  RegularPolygon,
  Text,
  Group,
  Transformer 
} from 'react-konva';
import { ShapeType, calculatePolygonPoints } from '../utils/shapeUtils';

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

      if (shapeType === ShapeType.RECTANGLE || shapeType === ShapeType.TEXT_BOX) {
        newConfig.width = Math.max(5, shapeConfig.width * scaleX);
        newConfig.height = Math.max(5, shapeConfig.height * scaleY);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.CIRCLE) {
        newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
        newConfig.x = node.x();
        newConfig.y = node.y();
      } else if (shapeType === ShapeType.ELLIPSE) {
        newConfig.radiusX = Math.max(5, shapeConfig.radiusX * scaleX);
        newConfig.radiusY = Math.max(5, shapeConfig.radiusY * scaleY);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.TRIANGLE || shapeType === ShapeType.POLYGON) {
        newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
        newConfig.x = node.x();
        newConfig.y = node.y();
        newConfig.rotation = rotation;
      } else if (shapeType === ShapeType.LINE || shapeType === ShapeType.ARROW) {
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
