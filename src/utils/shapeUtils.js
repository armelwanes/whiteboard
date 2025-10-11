/**
 * Shape Utilities for Whiteboard Animation
 * Defines shape types, configurations, and helper functions
 */

// Shape Types - Phase 1: Basic Shapes
export const ShapeType = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  LINE: 'line',
  ARROW: 'arrow',
  TRIANGLE: 'triangle',
  POLYGON: 'polygon',
  TEXT_BOX: 'text_box',
};

// Default shape configurations
export const DEFAULT_SHAPE_CONFIGS = {
  [ShapeType.RECTANGLE]: {
    shape: ShapeType.RECTANGLE,
    x: 400,
    y: 300,
    width: 200,
    height: 150,
    fill: '#3B82F6',
    stroke: '#1E40AF',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
    cornerRadius: 0,
  },
  [ShapeType.CIRCLE]: {
    shape: ShapeType.CIRCLE,
    x: 400,
    y: 300,
    radius: 100,
    fill: '#10B981',
    stroke: '#047857',
    strokeWidth: 2,
    opacity: 1,
  },
  [ShapeType.ELLIPSE]: {
    shape: ShapeType.ELLIPSE,
    x: 400,
    y: 300,
    radiusX: 150,
    radiusY: 100,
    fill: '#8B5CF6',
    stroke: '#6D28D9',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
  },
  [ShapeType.LINE]: {
    shape: ShapeType.LINE,
    points: [100, 100, 400, 100],
    stroke: '#374151',
    strokeWidth: 3,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
  },
  [ShapeType.ARROW]: {
    shape: ShapeType.ARROW,
    points: [100, 100, 400, 100],
    stroke: '#EF4444',
    strokeWidth: 3,
    fill: '#EF4444',
    opacity: 1,
    pointerLength: 20,
    pointerWidth: 20,
    lineCap: 'round',
    lineJoin: 'round',
  },
  [ShapeType.TRIANGLE]: {
    shape: ShapeType.TRIANGLE,
    x: 400,
    y: 300,
    sides: 3,
    radius: 100,
    fill: '#F59E0B',
    stroke: '#D97706',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
  },
  [ShapeType.POLYGON]: {
    shape: ShapeType.POLYGON,
    x: 400,
    y: 300,
    sides: 6,
    radius: 100,
    fill: '#EC4899',
    stroke: '#DB2777',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
  },
  [ShapeType.TEXT_BOX]: {
    shape: ShapeType.TEXT_BOX,
    x: 400,
    y: 300,
    width: 300,
    height: 100,
    text: 'Text Box',
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#1F2937',
    stroke: '#6B7280',
    strokeWidth: 2,
    backgroundColor: '#F3F4F6',
    opacity: 1,
    padding: 10,
    align: 'center',
    verticalAlign: 'middle',
  },
};

/**
 * Create a new shape layer
 * @param {string} shapeType - Type of shape from ShapeType
 * @param {object} customConfig - Custom configuration to override defaults
 * @returns {object} Shape layer object
 */
export function createShapeLayer(shapeType, customConfig = {}) {
  const defaultConfig = DEFAULT_SHAPE_CONFIGS[shapeType];
  
  if (!defaultConfig) {
    throw new Error(`Unknown shape type: ${shapeType}`);
  }

  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'shape',
    name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Shape`,
    zIndex: 100,
    position: { x: 0, y: 0 },
    scale: 1.0,
    opacity: 1.0,
    shape_config: {
      ...defaultConfig,
      ...customConfig,
    },
  };
}

/**
 * Get shape display name
 * @param {string} shapeType - Type of shape
 * @returns {string} Display name
 */
export function getShapeDisplayName(shapeType) {
  const names = {
    [ShapeType.RECTANGLE]: 'Rectangle',
    [ShapeType.CIRCLE]: 'Circle',
    [ShapeType.ELLIPSE]: 'Ellipse',
    [ShapeType.LINE]: 'Line',
    [ShapeType.ARROW]: 'Arrow',
    [ShapeType.TRIANGLE]: 'Triangle',
    [ShapeType.POLYGON]: 'Polygon',
    [ShapeType.TEXT_BOX]: 'Text Box',
  };
  return names[shapeType] || shapeType;
}

/**
 * Get shape icon (emoji or symbol)
 * @param {string} shapeType - Type of shape
 * @returns {string} Icon
 */
export function getShapeIcon(shapeType) {
  const icons = {
    [ShapeType.RECTANGLE]: '▭',
    [ShapeType.CIRCLE]: '●',
    [ShapeType.ELLIPSE]: '⬭',
    [ShapeType.LINE]: '─',
    [ShapeType.ARROW]: '→',
    [ShapeType.TRIANGLE]: '▲',
    [ShapeType.POLYGON]: '⬡',
    [ShapeType.TEXT_BOX]: '📝',
  };
  return icons[shapeType] || '◇';
}

/**
 * Calculate polygon points
 * @param {number} sides - Number of sides
 * @param {number} radius - Radius
 * @returns {array} Array of points [x1, y1, x2, y2, ...]
 */
export function calculatePolygonPoints(sides, radius) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push(x, y);
  }
  return points;
}

/**
 * Validate and sanitize shape configuration
 * @param {object} config - Shape configuration
 * @returns {object} Sanitized configuration
 */
export function sanitizeShapeConfig(config) {
  const sanitized = { ...config };
  
  // Ensure numeric values are valid
  if (sanitized.strokeWidth !== undefined) {
    sanitized.strokeWidth = Math.max(0, Number(sanitized.strokeWidth) || 0);
  }
  
  if (sanitized.opacity !== undefined) {
    sanitized.opacity = Math.max(0, Math.min(1, Number(sanitized.opacity) || 1));
  }
  
  if (sanitized.rotation !== undefined) {
    sanitized.rotation = Number(sanitized.rotation) || 0;
  }
  
  // Ensure colors are valid
  if (sanitized.fill && typeof sanitized.fill === 'string' && !sanitized.fill.startsWith('#')) {
    sanitized.fill = '#' + sanitized.fill;
  }
  
  if (sanitized.stroke && typeof sanitized.stroke === 'string' && !sanitized.stroke.startsWith('#')) {
    sanitized.stroke = '#' + sanitized.stroke;
  }
  
  return sanitized;
}

/**
 * Get shape categories for UI organization
 * @returns {object} Categorized shapes
 */
export function getShapeCategories() {
  return {
    basic: {
      label: 'Basic Shapes',
      shapes: [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.ELLIPSE,
        ShapeType.TRIANGLE,
      ],
    },
    lines: {
      label: 'Lines & Arrows',
      shapes: [
        ShapeType.LINE,
        ShapeType.ARROW,
      ],
    },
    advanced: {
      label: 'Advanced',
      shapes: [
        ShapeType.POLYGON,
        ShapeType.TEXT_BOX,
      ],
    },
  };
}

export default {
  ShapeType,
  DEFAULT_SHAPE_CONFIGS,
  createShapeLayer,
  getShapeDisplayName,
  getShapeIcon,
  calculatePolygonPoints,
  sanitizeShapeConfig,
  getShapeCategories,
};
