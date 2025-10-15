import { useRef, useEffect } from 'react';
import Konva from 'konva';
import { ShapeType, ShapeLayer } from '../../../utils/shapeUtils';

export const useShapeTransform = (
  isSelected: boolean,
  layer: ShapeLayer,
  onChange: (layer: ShapeLayer) => void
) => {
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    const shapeConfig = layer.shape_config;
    const newConfig = {
      ...shapeConfig,
      x: e.target.x(),
      y: e.target.y(),
    };
    onChange({
      ...layer,
      shape_config: newConfig,
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const shapeConfig = layer.shape_config;
    const shapeType = shapeConfig.shape;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

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
        newConfig.radiuses = shapeConfig.radiuses.map((r: number) => Math.max(5, r * scaleX));
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
      const points = shapeConfig.points || [0, 0, 100, 100];
      newConfig.points = points.map((val: number, idx: number) => 
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

    node.scaleX(1);
    node.scaleY(1);
  };

  return {
    shapeRef,
    transformerRef,
    handleDragEnd,
    handleTransformEnd,
  };
};
