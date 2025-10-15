import React, { useState } from 'react';
import { 
  X, Square, Circle, Triangle, Minus, ArrowRight, Hexagon, FileText,
  ArrowLeftRight, MoveUpRight, CornerDownRight, Star, Cloud, 
  MessageCircle, MessageSquare, Highlighter, Ribbon, 
  Target, Clock, Box, Lightbulb, Frame, Underline, Heart,
  Sparkles, Zap, Hash, Type, PenTool
} from 'lucide-react';
import { ShapeType, createShapeLayer, getShapeDisplayName } from '../../utils/shapeUtils';

interface ShapeToolbarProps {
  onAddShape: (shape: any) => void;
  onClose: () => void;
}

/**
 * ShapeToolbar Component
 * Floating toolbar for selecting and adding shapes to the scene
 */
const ShapeToolbar: React.FC<ShapeToolbarProps> = ({ onAddShape, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('basic');

  const shapeCategories = {
    basic: {
      label: 'Basic Shapes',
      shapes: [
        { type: ShapeType.RECTANGLE, icon: Square },
        { type: ShapeType.SQUARE, icon: Square },
        { type: ShapeType.CIRCLE, icon: Circle },
        { type: ShapeType.ELLIPSE, icon: Circle },
        { type: ShapeType.TRIANGLE, icon: Triangle },
        { type: ShapeType.HEXAGON, icon: Hexagon },
        { type: ShapeType.POLYGON, icon: Hexagon },
      ],
    },
    lines: {
      label: 'Lines & Arrows',
      shapes: [
        { type: ShapeType.LINE, icon: Minus },
        { type: ShapeType.ARROW, icon: ArrowRight },
        { type: ShapeType.ARROW_DOUBLE, icon: ArrowLeftRight },
        { type: ShapeType.ARROW_CURVE, icon: MoveUpRight },
        { type: ShapeType.CONNECTOR, icon: CornerDownRight },
      ],
    },
    advanced: {
      label: 'Advanced',
      shapes: [
        { type: ShapeType.STAR, icon: Star },
        { type: ShapeType.CLOUD, icon: Cloud },
        { type: ShapeType.BUBBLE, icon: MessageCircle },
        { type: ShapeType.THOUGHT_BUBBLE, icon: MessageSquare },
        { type: ShapeType.BANNER, icon: Ribbon },
        { type: ShapeType.CIRCLE_CONCENTRIC, icon: Target },
        { type: ShapeType.TIMELINE, icon: Clock },
        { type: ShapeType.ORG_NODE, icon: Box },
      ],
    },
    doodle: {
      label: 'Doodle',
      shapes: [
        { type: ShapeType.FRAME_DOODLE, icon: Frame },
        { type: ShapeType.FRAME_RECT_DOODLE, icon: Square },
        { type: ShapeType.FRAME_CIRCLE_DOODLE, icon: Circle },
        { type: ShapeType.FRAME_CLOUD_DOODLE, icon: Cloud },
        { type: ShapeType.ARROW_DOODLE, icon: ArrowRight },
        { type: ShapeType.LINE_WAVE_DOODLE, icon: Minus },
        { type: ShapeType.STAR_SHOOTING, icon: Sparkles },
        { type: ShapeType.EXPLOSION_SHAPE, icon: Zap },
        { type: ShapeType.CIRCLE_SKETCH, icon: Circle },
        { type: ShapeType.TRIANGLE_DOODLE, icon: Triangle },
        { type: ShapeType.RECTANGLE_DOODLE, icon: Square },
        { type: ShapeType.ARROW_CURVE_DOODLE, icon: MoveUpRight },
        { type: ShapeType.HIGHLIGHT_DOODLE, icon: Highlighter },
        { type: ShapeType.BUBBLE_DOODLE, icon: MessageCircle },
        { type: ShapeType.CLOUD_DOODLE, icon: Cloud },
      ],
    },
    decorative: {
      label: 'Decorative',
      shapes: [
        { type: ShapeType.HIGHLIGHT, icon: Highlighter },
        { type: ShapeType.ICON, icon: Lightbulb },
        { type: ShapeType.UNDERLINE_ANIMATED, icon: Underline },
        { type: ShapeType.DECORATIVE_SHAPE, icon: Heart },
      ],
    },
    numbers: {
      label: 'Numbers',
      shapes: [
        { type: ShapeType.NUMBER_0, icon: Hash },
        { type: ShapeType.NUMBER_1, icon: Hash },
        { type: ShapeType.NUMBER_2, icon: Hash },
        { type: ShapeType.NUMBER_3, icon: Hash },
        { type: ShapeType.NUMBER_4, icon: Hash },
        { type: ShapeType.NUMBER_5, icon: Hash },
        { type: ShapeType.NUMBER_6, icon: Hash },
        { type: ShapeType.NUMBER_7, icon: Hash },
        { type: ShapeType.NUMBER_8, icon: Hash },
        { type: ShapeType.NUMBER_9, icon: Hash },
        { type: ShapeType.NUMBER_10, icon: Hash },
      ],
    },
    letters: {
      label: 'Letters',
      shapes: [
        { type: ShapeType.LETTER_A, icon: Type },
        { type: ShapeType.LETTER_B, icon: Type },
        { type: ShapeType.LETTER_C, icon: Type },
        { type: ShapeType.LETTER_D, icon: Type },
        { type: ShapeType.LETTER_E, icon: Type },
        { type: ShapeType.LETTER_F, icon: Type },
        { type: ShapeType.LETTER_G, icon: Type },
        { type: ShapeType.LETTER_H, icon: Type },
        { type: ShapeType.LETTER_I, icon: Type },
        { type: ShapeType.LETTER_J, icon: Type },
        { type: ShapeType.LETTER_K, icon: Type },
        { type: ShapeType.LETTER_L, icon: Type },
        { type: ShapeType.LETTER_M, icon: Type },
        { type: ShapeType.LETTER_N, icon: Type },
        { type: ShapeType.LETTER_O, icon: Type },
        { type: ShapeType.LETTER_P, icon: Type },
        { type: ShapeType.LETTER_Q, icon: Type },
        { type: ShapeType.LETTER_R, icon: Type },
        { type: ShapeType.LETTER_S, icon: Type },
        { type: ShapeType.LETTER_T, icon: Type },
        { type: ShapeType.LETTER_U, icon: Type },
        { type: ShapeType.LETTER_V, icon: Type },
        { type: ShapeType.LETTER_W, icon: Type },
        { type: ShapeType.LETTER_X, icon: Type },
        { type: ShapeType.LETTER_Y, icon: Type },
        { type: ShapeType.LETTER_Z, icon: Type },
      ],
    },
    text: {
      label: 'Text',
      shapes: [
        { type: ShapeType.TEXT_BOX, icon: FileText },
      ],
    },
  };

  const handleShapeClick = (shapeType) => {
    const newLayer = createShapeLayer(shapeType);
    onAddShape(newLayer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary/30 rounded-lg shadow-2xl border border-border w-[600px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Shape</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-white px-6 border-b border-border flex gap-2 overflow-x-auto">
          {Object.entries(shapeCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                selectedCategory === key
                  ? 'text-primary border-blue-400'
                  : 'text-muted-foreground border-transparent hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Shape Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className={`grid gap-4 ${
            selectedCategory === 'numbers' || selectedCategory === 'letters' 
              ? 'grid-cols-6' 
              : 'grid-cols-4'
          }`}>
            {shapeCategories[selectedCategory].shapes.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleShapeClick(type)}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border-2 border-transparent hover:border-primary group"
                title={`Add ${getShapeDisplayName(type)}`}
              >
                <Icon className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-foreground group-hover:text-white font-medium">
                  {getShapeDisplayName(type)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Click on a shape to add it to the scene
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShapeToolbar;
