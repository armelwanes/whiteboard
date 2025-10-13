/**
 * Tests for Layer Export from JSON functionality
 * Tests the new layerExporter utility
 */

import { validateLayerJSON, exportLayerFromJSON } from '../src/utils/layerExporter.js';

console.log('Testing Layer Export from JSON functionality...\n');

let passedTests = 0;
let totalTests = 0;

const test = (name, fn) => {
  totalTests++;
  try {
    fn();
    console.log(`✓ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
};

// Test 1: Validate image layer
test('Validate valid image layer', () => {
  const layer = {
    id: 'img-1',
    type: 'image',
    image_path: '/test.png',
    position: { x: 100, y: 100 },
    scale: 1.0,
    opacity: 1.0,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 2: Validate text layer
test('Validate valid text layer', () => {
  const layer = {
    id: 'text-1',
    type: 'text',
    text_config: {
      text: 'Hello World',
      font: 'Arial',
      size: 48,
      color: [0, 0, 0],
    },
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 3: Validate shape layer
test('Validate valid shape layer', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'rectangle',
      width: 100,
      height: 50,
      fill_color: [255, 0, 0],
    },
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 4: Validate whiteboard layer
test('Validate valid whiteboard layer', () => {
  const layer = {
    id: 'whiteboard-1',
    type: 'whiteboard',
    strokes: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 0 },
        ],
        strokeWidth: 2,
        strokeColor: '#000000',
      },
    ],
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 5: Validate invalid layer - missing id
test('Reject layer missing id', () => {
  const layer = {
    type: 'image',
    image_path: '/test.png',
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('id'))) {
    throw new Error('Expected error about missing id');
  }
});

// Test 6: Validate invalid layer - missing type
test('Reject layer missing type', () => {
  const layer = {
    id: 'test-1',
    image_path: '/test.png',
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('type'))) {
    throw new Error('Expected error about missing type');
  }
});

// Test 7: Validate invalid layer - unsupported type
test('Reject layer with unsupported type', () => {
  const layer = {
    id: 'test-1',
    type: 'unsupported',
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('Invalid layer type'))) {
    throw new Error('Expected error about invalid type');
  }
});

// Test 8: Validate invalid image layer - missing image_path
test('Reject image layer missing image_path', () => {
  const layer = {
    id: 'img-1',
    type: 'image',
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('image_path'))) {
    throw new Error('Expected error about missing image_path');
  }
});

// Test 9: Validate invalid text layer - missing text_config
test('Reject text layer missing text_config', () => {
  const layer = {
    id: 'text-1',
    type: 'text',
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('text_config'))) {
    throw new Error('Expected error about missing text_config');
  }
});

// Test 10: Validate invalid shape layer - missing shape_config
test('Reject shape layer missing shape_config', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('shape_config'))) {
    throw new Error('Expected error about missing shape_config');
  }
});

// Test 11: Validate invalid whiteboard layer - missing strokes
test('Reject whiteboard layer missing strokes', () => {
  const layer = {
    id: 'whiteboard-1',
    type: 'whiteboard',
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (result.valid) {
    throw new Error('Expected invalid, but validation passed');
  }
  if (!result.errors.some(e => e.includes('strokes'))) {
    throw new Error('Expected error about missing strokes');
  }
});

// Test 12: Test layer with rotation
test('Validate layer with rotation', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'rectangle',
      width: 100,
      height: 50,
    },
    position: { x: 100, y: 100 },
    rotation: 45,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 13: Test layer with scale
test('Validate layer with scale', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'circle',
      width: 100,
      height: 100,
    },
    position: { x: 100, y: 100 },
    scale: 2.5,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 14: Test complex whiteboard with multiple strokes
test('Validate complex whiteboard with multiple strokes', () => {
  const layer = {
    id: 'whiteboard-1',
    type: 'whiteboard',
    strokes: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ],
        strokeWidth: 2,
        strokeColor: '#FF0000',
        lineJoin: 'round',
        lineCap: 'round',
      },
      {
        points: [
          { x: 20, y: 0 },
          { x: 30, y: 10 },
          { x: 40, y: 0 },
        ],
        strokeWidth: 3,
        strokeColor: '#00FF00',
      },
    ],
    position: { x: 100, y: 100 },
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 15: Test null layer
test('Reject null layer', () => {
  const result = validateLayerJSON(null);
  if (result.valid) {
    throw new Error('Expected invalid for null layer');
  }
  if (!result.errors.some(e => e.includes('null or undefined'))) {
    throw new Error('Expected error about null layer');
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Test Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

if (passedTests !== totalTests) {
  console.log('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
}
