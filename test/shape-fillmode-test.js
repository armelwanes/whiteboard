/**
 * Test to verify fillMode parameter functionality
 * This tests that shapes respect the fillMode parameter
 */

import { ShapeType, DEFAULT_SHAPE_CONFIGS } from '../src/utils/shapeUtils.js';

console.log('Testing fillMode parameter...\n');

// Test 1: Verify new shape types exist
console.log('Test 1: Verify new shape types exist');
const newShapeTypes = [
  'FRAME_RECT_DOODLE',
  'FRAME_CIRCLE_DOODLE',
  'ARROW_DOODLE',
  'NUMBER_0',
  'LETTER_A',
];

let passed = 0;
let failed = 0;

newShapeTypes.forEach(type => {
  if (ShapeType[type]) {
    console.log(`  ✓ ${type} exists`);
    passed++;
  } else {
    console.log(`  ✗ ${type} does NOT exist`);
    failed++;
  }
});

// Test 2: Verify fillMode parameter in default configs
console.log('\nTest 2: Verify fillMode parameter in default configs');
const shapesWithFillMode = [
  ShapeType.RECTANGLE,
  ShapeType.CIRCLE,
  ShapeType.FRAME_DOODLE,
  ShapeType.FRAME_RECT_DOODLE,
  ShapeType.CIRCLE_SKETCH,
];

shapesWithFillMode.forEach(type => {
  const config = DEFAULT_SHAPE_CONFIGS[type];
  if (config && config.fillMode) {
    console.log(`  ✓ ${type} has fillMode: ${config.fillMode}`);
    passed++;
  } else {
    console.log(`  ✗ ${type} does NOT have fillMode`);
    failed++;
  }
});

// Test 3: Verify fillMode values are valid
console.log('\nTest 3: Verify fillMode values are valid');
const validFillModes = ['fill', 'stroke', 'both'];

Object.entries(DEFAULT_SHAPE_CONFIGS).forEach(([type, config]) => {
  if (config.fillMode) {
    if (validFillModes.includes(config.fillMode)) {
      console.log(`  ✓ ${type} has valid fillMode: ${config.fillMode}`);
      passed++;
    } else {
      console.log(`  ✗ ${type} has invalid fillMode: ${config.fillMode}`);
      failed++;
    }
  }
});

// Test 4: Verify number shapes have character property
console.log('\nTest 4: Verify number shapes have character property');
const numberShapes = [
  ShapeType.NUMBER_0,
  ShapeType.NUMBER_5,
  ShapeType.NUMBER_10,
];

numberShapes.forEach(type => {
  const config = DEFAULT_SHAPE_CONFIGS[type];
  if (config && config.character) {
    console.log(`  ✓ ${type} has character: ${config.character}`);
    passed++;
  } else {
    console.log(`  ✗ ${type} does NOT have character property`);
    failed++;
  }
});

// Test 5: Verify letter shapes have character property
console.log('\nTest 5: Verify letter shapes have character property');
const letterShapes = [
  ShapeType.LETTER_A,
  ShapeType.LETTER_M,
  ShapeType.LETTER_Z,
];

letterShapes.forEach(type => {
  const config = DEFAULT_SHAPE_CONFIGS[type];
  if (config && config.character) {
    console.log(`  ✓ ${type} has character: ${config.character}`);
    passed++;
  } else {
    console.log(`  ✗ ${type} does NOT have character property`);
    failed++;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.log('✗ Some tests failed!');
  process.exit(1);
}
