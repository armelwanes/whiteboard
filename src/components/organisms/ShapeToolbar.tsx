import React, { useState } from 'react';
import { 
  X, Square, Circle, Triangle, Minus, ArrowRight, Hexagon, FileText,
  ArrowLeftRight, MoveUpRight, CornerDownRight, Star, Cloud, 
  MessageCircle, MessageSquare, Highlighter, Ribbon, 
  Target, Clock, Box, Lightbulb, Frame, Underline, Heart,
  Sparkles, Zap, Hash, Type
} from 'lucide-react';
import { ShapeType, createShapeLayer, getShapeDisplayName } from '../../utils/shapeUtils';
import { LayerType, LayerMode } from '@/app/scenes/types';
import { useSceneStore } from '@/app/scenes';
import { useCurrentScene } from '@/app/scenes';




/**
 * ShapeToolbar Component
 * Floating toolbar for selecting and adding shapes to the scene
 */


interface ShapeToolbarProps {
  onAddShape?: (layer: any) => void;
  onClose?: () => void;
}

const ShapeToolbar: React.FC<ShapeToolbarProps> = ({ onAddShape, onClose }) => {
  const currentScene = useCurrentScene();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof shapeCategories>('basic');
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);

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
        { type: ShapeType.STAR, icon: Star },
      ],
    },
    lines: {
      label: 'Lines & Arrows',
      shapes: [
        { type: ShapeType.LINE, icon: Minus },
        { type: ShapeType.ARROW, icon: ArrowRight },
        { type: ShapeType.ARROW_DOUBLE, icon: ArrowLeftRight },
        { type: ShapeType.ARROW_CURVE, icon: MoveUpRight },
      ],
    },
  };

  const handleShapeClick = async (shapeType: string) => {
    if (!currentScene) return;
    const baseLayer = createShapeLayer(shapeType);
    const newLayer = {
      ...baseLayer,
      mode: LayerMode.STATIC,
      z_index: 0,
      type: LayerType.SHAPE,
    };
    if (onAddShape) {
      onAddShape(newLayer);
    } else {
      // Fallback: try to use scenes actions via store if available
      console.warn('onAddShape not provided to ShapeToolbar; shape not added');
    }
    // close toolbar after adding
    if (onClose) {
      onClose();
    } else {
      setShowShapeToolbar(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary/30 rounded-lg shadow-2xl border border-border w-[600px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Shape</h2>
          <button
            onClick={() => setShowShapeToolbar(false)}
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
              onClick={() => setSelectedCategory(key as keyof typeof shapeCategories)}
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
            {shapeCategories[selectedCategory].shapes.map((shape: { type: string; icon: React.ComponentType<any> }) => {
              const { type, icon: Icon } = shape;
              return (
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
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Click on a shape to add it to the scene
          </p>
          <button
            onClick={() => setShowShapeToolbar(false)}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShapeToolbar;
