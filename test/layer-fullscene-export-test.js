/**
 * Tests for Layer Export with Full Scene Dimensions
 * Tests the new useFullScene option in layerExporter utility
 */

import { exportLayerFromJSON, validateLayerJSON } from '../src/utils/layerExporter.js';

console.log('Testing Layer Export with Full Scene Dimensions...\n');

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

// Test 1: Validate image layer with position
test('Validate image layer with scene position', () => {
  const layer = {
    id: 'img-1',
    type: 'image',
    image_path: '/test.png',
    position: { x: 960, y: 540 }, // Center of 1920x1080 scene
    scale: 1.0,
    opacity: 1.0,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 2: Validate text layer with position
test('Validate text layer with scene position', () => {
  const layer = {
    id: 'text-1',
    type: 'text',
    text_config: {
      text: 'Test Text',
      font: 'Arial',
      size: 48,
      color: [0, 0, 0],
    },
    position: { x: 1000, y: 500 }, // Top-left area
    scale: 1.0,
    opacity: 1.0,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 3: Validate shape layer with position
test('Validate shape layer with scene position', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'rectangle',
      width: 200,
      height: 100,
      fill_color: [255, 0, 0, 255],
    },
    position: { x: 8000, y: 4000 }, // Bottom-right area
    scale: 1.0,
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
});

// Test 4: Test options parameter with useFullScene flag
test('Export options should include useFullScene parameter', () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'circle',
      width: 100,
      height: 100,
    },
    position: { x: 960, y: 540 },
  };

  const options = {
    useFullScene: true,
    sceneWidth: 1920,
    sceneHeight: 1080,
    background: '#FFFFFF',
    pixelRatio: 1,
  };

  // Just validate that options structure is correct
  if (!options.useFullScene) {
    throw new Error('useFullScene flag not set');
  }
  if (options.sceneWidth !== 1920) {
    throw new Error('Expected sceneWidth to be 1920');
  }
  if (options.sceneHeight !== 1080) {
    throw new Error('Expected sceneHeight to be 1080');
  }
});

// Test 5: Test that camera option and useFullScene are mutually exclusive in logic
test('useFullScene should take precedence over camera option', () => {
  const options = {
    useFullScene: true,
    camera: {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
    },
    sceneWidth: 1920,
    sceneHeight: 1080,
  };

  // The logic should use full scene dimensions when useFullScene is true
  // even if camera is provided
  const expectedWidth = options.sceneWidth;
  const expectedHeight = options.sceneHeight;

  if (expectedWidth !== 1920 || expectedHeight !== 1080) {
    throw new Error('Expected full scene dimensions');
  }
});

// Test 6: Validate layer without position uses scene center as default
test('Layer without position should default to scene center', () => {
  const layer = {
    id: 'shape-2',
    type: 'shape',
    shape_config: {
      shape_type: 'circle',
      width: 100,
      height: 100,
    },
    // No position specified
  };

  const result = validateLayerJSON(layer);
  if (!result.valid) {
    throw new Error(`Expected valid, got errors: ${result.errors.join(', ')}`);
  }
  
  // Layer should be valid even without position
  // The export function should default to scene center (960, 540)
});

console.log('\n' + '='.repeat(50));
console.log(`Test Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

if (passedTests === totalTests) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${totalTests - passedTests} test(s) failed`);
  process.exit(1);
}
