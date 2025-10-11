/**
 * Shape Utilities for Whiteboard Animation
 * Defines shape types, configurations, and helper functions
 */

// Shape Types - Comprehensive Shape Library
export const ShapeType = {
  // Basic Shapes
  RECTANGLE: 'rectangle',
  SQUARE: 'square',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  LINE: 'line',
  ARROW: 'arrow',
  ARROW_DOUBLE: 'arrow_double',
  ARROW_CURVE: 'arrow_curve',
  TRIANGLE: 'triangle',
  POLYGON: 'polygon',
  CONNECTOR: 'connector',
  TEXT_BOX: 'text_box',
  
  // Advanced Shapes
  STAR: 'star',
  CLOUD: 'cloud',
  BUBBLE: 'bubble',
  THOUGHT_BUBBLE: 'thought_bubble',
  HIGHLIGHT: 'highlight',
  BANNER: 'banner',
  HEXAGON: 'hexagon',
  CIRCLE_CONCENTRIC: 'circle_concentric',
  TIMELINE: 'timeline',
  ORG_NODE: 'org_node',
  
  // Decorative & Pedagogical Shapes
  ICON: 'icon',
  FRAME_DOODLE: 'frame_doodle',
  UNDERLINE_ANIMATED: 'underline_animated',
  DECORATIVE_SHAPE: 'decorative_shape',
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
  [ShapeType.SQUARE]: {
    shape: ShapeType.SQUARE,
    x: 400,
    y: 300,
    width: 150,
    height: 150,
    fill: '#3B82F6',
    stroke: '#1E40AF',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
    cornerRadius: 0,
  },
  [ShapeType.ARROW_DOUBLE]: {
    shape: ShapeType.ARROW_DOUBLE,
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
  [ShapeType.ARROW_CURVE]: {
    shape: ShapeType.ARROW_CURVE,
    points: [100, 100, 200, 50, 300, 100, 400, 100],
    stroke: '#EF4444',
    strokeWidth: 3,
    fill: '#EF4444',
    opacity: 1,
    pointerLength: 20,
    pointerWidth: 20,
    tension: 0.5,
  },
  [ShapeType.CONNECTOR]: {
    shape: ShapeType.CONNECTOR,
    points: [100, 100, 100, 200, 300, 200],
    stroke: '#6B7280',
    strokeWidth: 3,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
  },
  [ShapeType.STAR]: {
    shape: ShapeType.STAR,
    x: 400,
    y: 300,
    numPoints: 5,
    innerRadius: 40,
    outerRadius: 100,
    fill: '#FBBF24',
    stroke: '#F59E0B',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
  },
  [ShapeType.CLOUD]: {
    shape: ShapeType.CLOUD,
    x: 400,
    y: 300,
    width: 200,
    height: 120,
    fill: '#E0F2FE',
    stroke: '#38BDF8',
    strokeWidth: 2,
    opacity: 1,
  },
  [ShapeType.BUBBLE]: {
    shape: ShapeType.BUBBLE,
    x: 400,
    y: 300,
    width: 200,
    height: 120,
    fill: '#FFFFFF',
    stroke: '#374151',
    strokeWidth: 2,
    opacity: 1,
    cornerRadius: 10,
    tailDirection: 'bottom-left',
  },
  [ShapeType.THOUGHT_BUBBLE]: {
    shape: ShapeType.THOUGHT_BUBBLE,
    x: 400,
    y: 300,
    width: 200,
    height: 120,
    fill: '#FFFFFF',
    stroke: '#374151',
    strokeWidth: 2,
    opacity: 1,
  },
  [ShapeType.HIGHLIGHT]: {
    shape: ShapeType.HIGHLIGHT,
    x: 400,
    y: 300,
    width: 200,
    height: 40,
    fill: '#FEF08A',
    opacity: 0.5,
    rotation: 0,
  },
  [ShapeType.BANNER]: {
    shape: ShapeType.BANNER,
    x: 400,
    y: 300,
    width: 300,
    height: 60,
    fill: '#3B82F6',
    stroke: '#1E40AF',
    strokeWidth: 2,
    opacity: 1,
    text: 'Banner',
    fontSize: 20,
    fontFamily: 'Arial',
    textFill: '#FFFFFF',
  },
  [ShapeType.HEXAGON]: {
    shape: ShapeType.HEXAGON,
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
  [ShapeType.CIRCLE_CONCENTRIC]: {
    shape: ShapeType.CIRCLE_CONCENTRIC,
    x: 400,
    y: 300,
    radiuses: [40, 70, 100],
    fills: ['#3B82F6', '#60A5FA', '#93C5FD'],
    strokes: ['#1E40AF', '#2563EB', '#3B82F6'],
    strokeWidth: 2,
    opacity: 1,
  },
  [ShapeType.TIMELINE]: {
    shape: ShapeType.TIMELINE,
    x: 400,
    y: 300,
    width: 400,
    height: 100,
    stroke: '#6B7280',
    strokeWidth: 3,
    fill: '#3B82F6',
    opacity: 1,
    markers: 4,
  },
  [ShapeType.ORG_NODE]: {
    shape: ShapeType.ORG_NODE,
    x: 400,
    y: 300,
    width: 150,
    height: 80,
    fill: '#E0E7FF',
    stroke: '#6366F1',
    strokeWidth: 2,
    opacity: 1,
    cornerRadius: 8,
    text: 'Node',
    fontSize: 16,
    fontFamily: 'Arial',
    textFill: '#1F2937',
  },
  [ShapeType.ICON]: {
    shape: ShapeType.ICON,
    x: 400,
    y: 300,
    iconType: 'lightbulb',
    size: 80,
    fill: '#FBBF24',
    stroke: '#F59E0B',
    strokeWidth: 2,
    opacity: 1,
  },
  [ShapeType.FRAME_DOODLE]: {
    shape: ShapeType.FRAME_DOODLE,
    x: 400,
    y: 300,
    width: 250,
    height: 180,
    stroke: '#374151',
    strokeWidth: 3,
    opacity: 1,
  },
  [ShapeType.UNDERLINE_ANIMATED]: {
    shape: ShapeType.UNDERLINE_ANIMATED,
    points: [100, 100, 400, 100],
    stroke: '#EF4444',
    strokeWidth: 4,
    opacity: 1,
    lineCap: 'round',
  },
  [ShapeType.DECORATIVE_SHAPE]: {
    shape: ShapeType.DECORATIVE_SHAPE,
    x: 400,
    y: 300,
    decorativeType: 'heart',
    size: 100,
    fill: '#F87171',
    stroke: '#DC2626',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
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
    [ShapeType.SQUARE]: 'Square',
    [ShapeType.CIRCLE]: 'Circle',
    [ShapeType.ELLIPSE]: 'Ellipse',
    [ShapeType.LINE]: 'Line',
    [ShapeType.ARROW]: 'Arrow',
    [ShapeType.ARROW_DOUBLE]: 'Double Arrow',
    [ShapeType.ARROW_CURVE]: 'Curved Arrow',
    [ShapeType.TRIANGLE]: 'Triangle',
    [ShapeType.POLYGON]: 'Polygon',
    [ShapeType.CONNECTOR]: 'Connector',
    [ShapeType.TEXT_BOX]: 'Text Box',
    [ShapeType.STAR]: 'Star',
    [ShapeType.CLOUD]: 'Cloud',
    [ShapeType.BUBBLE]: 'Speech Bubble',
    [ShapeType.THOUGHT_BUBBLE]: 'Thought Bubble',
    [ShapeType.HIGHLIGHT]: 'Highlight',
    [ShapeType.BANNER]: 'Banner',
    [ShapeType.HEXAGON]: 'Hexagon',
    [ShapeType.CIRCLE_CONCENTRIC]: 'Concentric Circles',
    [ShapeType.TIMELINE]: 'Timeline',
    [ShapeType.ORG_NODE]: 'Org Node',
    [ShapeType.ICON]: 'Icon',
    [ShapeType.FRAME_DOODLE]: 'Doodle Frame',
    [ShapeType.UNDERLINE_ANIMATED]: 'Underline',
    [ShapeType.DECORATIVE_SHAPE]: 'Decorative',
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
    [ShapeType.SQUARE]: '◻',
    [ShapeType.CIRCLE]: '●',
    [ShapeType.ELLIPSE]: '⬭',
    [ShapeType.LINE]: '─',
    [ShapeType.ARROW]: '→',
    [ShapeType.ARROW_DOUBLE]: '↔',
    [ShapeType.ARROW_CURVE]: '↪',
    [ShapeType.TRIANGLE]: '▲',
    [ShapeType.POLYGON]: '⬡',
    [ShapeType.CONNECTOR]: '⌞',
    [ShapeType.TEXT_BOX]: '📝',
    [ShapeType.STAR]: '★',
    [ShapeType.CLOUD]: '☁',
    [ShapeType.BUBBLE]: '💬',
    [ShapeType.THOUGHT_BUBBLE]: '💭',
    [ShapeType.HIGHLIGHT]: '🖍',
    [ShapeType.BANNER]: '🎗',
    [ShapeType.HEXAGON]: '⬡',
    [ShapeType.CIRCLE_CONCENTRIC]: '◎',
    [ShapeType.TIMELINE]: '📅',
    [ShapeType.ORG_NODE]: '🔲',
    [ShapeType.ICON]: '💡',
    [ShapeType.FRAME_DOODLE]: '✏',
    [ShapeType.UNDERLINE_ANIMATED]: '＿',
    [ShapeType.DECORATIVE_SHAPE]: '♥',
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
        ShapeType.SQUARE,
        ShapeType.CIRCLE,
        ShapeType.ELLIPSE,
        ShapeType.TRIANGLE,
        ShapeType.HEXAGON,
        ShapeType.POLYGON,
      ],
    },
    lines: {
      label: 'Lines & Arrows',
      shapes: [
        ShapeType.LINE,
        ShapeType.ARROW,
        ShapeType.ARROW_DOUBLE,
        ShapeType.ARROW_CURVE,
        ShapeType.CONNECTOR,
      ],
    },
    advanced: {
      label: 'Advanced',
      shapes: [
        ShapeType.STAR,
        ShapeType.CLOUD,
        ShapeType.BUBBLE,
        ShapeType.THOUGHT_BUBBLE,
        ShapeType.BANNER,
        ShapeType.CIRCLE_CONCENTRIC,
        ShapeType.TIMELINE,
        ShapeType.ORG_NODE,
      ],
    },
    decorative: {
      label: 'Decorative',
      shapes: [
        ShapeType.HIGHLIGHT,
        ShapeType.ICON,
        ShapeType.FRAME_DOODLE,
        ShapeType.UNDERLINE_ANIMATED,
        ShapeType.DECORATIVE_SHAPE,
      ],
    },
    text: {
      label: 'Text',
      shapes: [
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
