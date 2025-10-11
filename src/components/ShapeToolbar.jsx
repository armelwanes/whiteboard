import React, { useState } from 'react';
import { 
  X, Square, Circle, Triangle, Minus, ArrowRight, Hexagon, FileText,
  ArrowLeftRight, MoveUpRight, CornerDownRight, Star, Cloud, 
  MessageCircle, MessageSquare, Highlighter, Ribbon, 
  Target, Clock, Box, Lightbulb, Frame, Underline, Heart
} from 'lucide-react';
import { ShapeType, createShapeLayer, getShapeDisplayName } from '../utils/shapeUtils';

/**
 * ShapeToolbar Component
 * Floating toolbar for selecting and adding shapes to the scene
 */
const ShapeToolbar = ({ onAddShape, onClose }) => {
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
    decorative: {
      label: 'Decorative',
      shapes: [
        { type: ShapeType.HIGHLIGHT, icon: Highlighter },
        { type: ShapeType.ICON, icon: Lightbulb },
        { type: ShapeType.FRAME_DOODLE, icon: Frame },
        { type: ShapeType.UNDERLINE_ANIMATED, icon: Underline },
        { type: ShapeType.DECORATIVE_SHAPE, icon: Heart },
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
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-[600px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Shape</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-gray-900 px-6 border-b border-gray-700 flex gap-2">
          {Object.entries(shapeCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                selectedCategory === key
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Shape Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-4 gap-4">
            {shapeCategories[selectedCategory].shapes.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleShapeClick(type)}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border-2 border-transparent hover:border-blue-500 group"
                title={`Add ${getShapeDisplayName(type)}`}
              >
                <Icon className="w-10 h-10 text-gray-300 group-hover:text-blue-400 transition-colors" />
                <span className="text-xs text-gray-300 group-hover:text-white font-medium">
                  {getShapeDisplayName(type)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Click on a shape to add it to the scene
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShapeToolbar;
