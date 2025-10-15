import React from 'react';
import { Transformer } from 'react-konva';
import { ShapeType, ShapeLayer } from '../utils/shapeUtils';
import { useShapeTransform } from './atoms/shapes';
import {
  RectangleShape,
  SquareShape,
  CircleShape,
  EllipseShape,
  TriangleShape,
  PolygonShape,
  HexagonShape,
  StarShape,
  LineShape,
  ArrowShape,
  ArrowDoubleShape,
  ArrowCurveShape,
  ConnectorShape,
  CharacterShape,
  OrgNodeShape,
  IconShape,
  DecorativeShape,
  UnderlineAnimatedShape,
  StarShootingShape,
  ExplosionShape,
} from './atoms/shapes';
import {
  TextBoxShape,
  CloudShape,
  BubbleShape,
  ThoughtBubbleShape,
  HighlightShape,
  BannerShape,
  CircleConcentricShape,
  TimelineShape,
  FrameDoodleShape,
  FrameRectDoodleShape,
  FrameCircleDoodleShape,
  FrameCloudDoodleShape,
  ArrowDoodleShape,
  ArrowCurveDoodleShape,
  HighlightDoodleShape,
  BubbleDoodleShape,
  CloudDoodleShape,
  RectangleDoodleShape,
  TriangleDoodleShape,
  CircleSketchShape,
  LineWaveDoodleShape,
} from './molecules/shapes';

interface LayerShapeProps {
  layer: ShapeLayer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (layer: ShapeLayer) => void;
}

const LayerShape: React.FC<LayerShapeProps> = ({ layer, isSelected, onSelect, onChange }) => {
  const { shapeRef, transformerRef, handleDragEnd, handleTransformEnd } = useShapeTransform(
    isSelected,
    layer,
    onChange
  );

  if (!layer.shape_config) {
    return null;
  }

  const shapeConfig = layer.shape_config;
  const shapeType = shapeConfig.shape;

  const commonProps = {
    ref: shapeRef,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    opacity: layer.opacity || 1.0,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  const renderShape = () => {
    const shapeProps = { shapeConfig, commonProps };

    switch (shapeType) {
      case ShapeType.RECTANGLE:
        return <RectangleShape {...shapeProps} />;
      case ShapeType.SQUARE:
        return <SquareShape {...shapeProps} />;
      case ShapeType.CIRCLE:
        return <CircleShape {...shapeProps} />;
      case ShapeType.ELLIPSE:
        return <EllipseShape {...shapeProps} />;
      case ShapeType.TRIANGLE:
        return <TriangleShape {...shapeProps} />;
      case ShapeType.POLYGON:
        return <PolygonShape {...shapeProps} />;
      case ShapeType.HEXAGON:
        return <HexagonShape {...shapeProps} />;
      case ShapeType.STAR:
        return <StarShape {...shapeProps} />;
      
      case ShapeType.LINE:
        return <LineShape {...shapeProps} />;
      case ShapeType.ARROW:
        return <ArrowShape {...shapeProps} />;
      case ShapeType.ARROW_DOUBLE:
        return <ArrowDoubleShape {...shapeProps} />;
      case ShapeType.ARROW_CURVE:
        return <ArrowCurveShape {...shapeProps} />;
      case ShapeType.CONNECTOR:
        return <ConnectorShape {...shapeProps} />;
      
      case ShapeType.TEXT_BOX:
        return <TextBoxShape {...shapeProps} />;
      case ShapeType.CLOUD:
        return <CloudShape {...shapeProps} />;
      case ShapeType.BUBBLE:
        return <BubbleShape {...shapeProps} />;
      case ShapeType.THOUGHT_BUBBLE:
        return <ThoughtBubbleShape {...shapeProps} />;
      case ShapeType.HIGHLIGHT:
        return <HighlightShape {...shapeProps} />;
      case ShapeType.BANNER:
        return <BannerShape {...shapeProps} />;
      case ShapeType.CIRCLE_CONCENTRIC:
        return <CircleConcentricShape {...shapeProps} />;
      case ShapeType.TIMELINE:
        return <TimelineShape {...shapeProps} />;
      
      case ShapeType.ORG_NODE:
        return <OrgNodeShape {...shapeProps} />;
      case ShapeType.ICON:
        return <IconShape {...shapeProps} />;
      case ShapeType.DECORATIVE_SHAPE:
        return <DecorativeShape {...shapeProps} />;
      case ShapeType.UNDERLINE_ANIMATED:
        return <UnderlineAnimatedShape {...shapeProps} />;
      case ShapeType.STAR_SHOOTING:
        return <StarShootingShape {...shapeProps} />;
      case ShapeType.EXPLOSION_SHAPE:
        return <ExplosionShape {...shapeProps} />;
      
      case ShapeType.FRAME_DOODLE:
        return <FrameDoodleShape {...shapeProps} />;
      case ShapeType.FRAME_RECT_DOODLE:
        return <FrameRectDoodleShape {...shapeProps} />;
      case ShapeType.FRAME_CIRCLE_DOODLE:
        return <FrameCircleDoodleShape {...shapeProps} />;
      case ShapeType.FRAME_CLOUD_DOODLE:
        return <FrameCloudDoodleShape {...shapeProps} />;
      case ShapeType.ARROW_DOODLE:
        return <ArrowDoodleShape {...shapeProps} />;
      case ShapeType.ARROW_CURVE_DOODLE:
        return <ArrowCurveDoodleShape {...shapeProps} />;
      case ShapeType.HIGHLIGHT_DOODLE:
        return <HighlightDoodleShape {...shapeProps} />;
      case ShapeType.BUBBLE_DOODLE:
        return <BubbleDoodleShape {...shapeProps} />;
      case ShapeType.CLOUD_DOODLE:
        return <CloudDoodleShape {...shapeProps} />;
      case ShapeType.RECTANGLE_DOODLE:
        return <RectangleDoodleShape {...shapeProps} />;
      case ShapeType.TRIANGLE_DOODLE:
        return <TriangleDoodleShape {...shapeProps} />;
      case ShapeType.CIRCLE_SKETCH:
        return <CircleSketchShape {...shapeProps} />;
      case ShapeType.LINE_WAVE_DOODLE:
        return <LineWaveDoodleShape {...shapeProps} />;
      
      case ShapeType.NUMBER_0:
      case ShapeType.NUMBER_1:
      case ShapeType.NUMBER_2:
      case ShapeType.NUMBER_3:
      case ShapeType.NUMBER_4:
      case ShapeType.NUMBER_5:
      case ShapeType.NUMBER_6:
      case ShapeType.NUMBER_7:
      case ShapeType.NUMBER_8:
      case ShapeType.NUMBER_9:
      case ShapeType.NUMBER_10:
      case ShapeType.LETTER_A:
      case ShapeType.LETTER_B:
      case ShapeType.LETTER_C:
      case ShapeType.LETTER_D:
      case ShapeType.LETTER_E:
      case ShapeType.LETTER_F:
      case ShapeType.LETTER_G:
      case ShapeType.LETTER_H:
      case ShapeType.LETTER_I:
      case ShapeType.LETTER_J:
      case ShapeType.LETTER_K:
      case ShapeType.LETTER_L:
      case ShapeType.LETTER_M:
      case ShapeType.LETTER_N:
      case ShapeType.LETTER_O:
      case ShapeType.LETTER_P:
      case ShapeType.LETTER_Q:
      case ShapeType.LETTER_R:
      case ShapeType.LETTER_S:
      case ShapeType.LETTER_T:
      case ShapeType.LETTER_U:
      case ShapeType.LETTER_V:
      case ShapeType.LETTER_W:
      case ShapeType.LETTER_X:
      case ShapeType.LETTER_Y:
      case ShapeType.LETTER_Z:
        return <CharacterShape {...shapeProps} />;

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
