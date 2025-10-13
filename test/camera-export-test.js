/**
 * Test for camera export functionality
 * Tests the new default camera position handling
 */

import { isDefaultCameraPosition } from '../src/utils/cameraExporter.js';

console.log('Testing camera export functionality...\n');

// Test 1: Default camera at position (0.5, 0.5)
const defaultCamera = {
  id: 'default-camera',
  name: 'Caméra Par Défaut',
  position: { x: 0.5, y: 0.5 },
  isDefault: true,
  width: 800,
  height: 450,
};

console.log('Test 1: Default camera at (0.5, 0.5)');
console.log('Camera:', JSON.stringify(defaultCamera.position));
const isDefault1 = isDefaultCameraPosition(defaultCamera);
console.log('Is default position?', isDefault1);
console.log('Expected: true');
console.log('Result:', isDefault1 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 2: Custom camera at different position
const customCamera = {
  id: 'custom-camera',
  name: 'Camera 1',
  position: { x: 0.3, y: 0.7 },
  isDefault: false,
  width: 800,
  height: 450,
};

console.log('Test 2: Custom camera at (0.3, 0.7)');
console.log('Camera:', JSON.stringify(customCamera.position));
const isDefault2 = isDefaultCameraPosition(customCamera);
console.log('Is default position?', isDefault2);
console.log('Expected: false');
console.log('Result:', isDefault2 ? '✗ FAIL' : '✓ PASS');
console.log();

// Test 3: Camera at default position but not marked as default
const unmarkedCamera = {
  id: 'unmarked-camera',
  name: 'Camera 2',
  position: { x: 0.5, y: 0.5 },
  isDefault: false,
  width: 800,
  height: 450,
};

console.log('Test 3: Camera at (0.5, 0.5) but isDefault=false');
console.log('Camera:', JSON.stringify(unmarkedCamera.position));
const isDefault3 = isDefaultCameraPosition(unmarkedCamera);
console.log('Is default position?', isDefault3);
console.log('Expected: false (isDefault flag is false)');
console.log('Result:', isDefault3 ? '✗ FAIL' : '✓ PASS');
console.log();

// Test 4: Camera very close to default position (within tolerance)
const closeCamera = {
  id: 'close-camera',
  name: 'Close Camera',
  position: { x: 0.5001, y: 0.4999 },
  isDefault: true,
  width: 800,
  height: 450,
};

console.log('Test 4: Camera at (0.5001, 0.4999) - within tolerance');
console.log('Camera:', JSON.stringify(closeCamera.position));
const isDefault4 = isDefaultCameraPosition(closeCamera);
console.log('Is default position?', isDefault4);
console.log('Expected: true (within tolerance of 0.001)');
console.log('Result:', isDefault4 ? '✓ PASS' : '✗ FAIL');
console.log();

// Summary
const allPassed = isDefault1 && !isDefault2 && !isDefault3 && isDefault4;
console.log('='.repeat(50));
console.log('Test Summary:', allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED');
console.log('='.repeat(50));

if (!allPassed) {
  process.exit(1);
}
