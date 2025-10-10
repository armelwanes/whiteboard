/**
 * Camera System Tests
 * Demonstrates the usage of camera utilities
 */

import { easingFunctions, interpolate, interpolatePosition } from '../src/utils/easingFunctions.js';
import { 
  createCamera, 
  getCameraAtTime, 
  getTotalCameraDuration,
  validateCamera,
  normalizePosition
} from '../src/utils/cameraAnimator.js';

console.log('🎥 Testing Camera System\n');

// Test 1: Easing Functions
console.log('1. Testing Easing Functions:');
console.log('   Linear(0.5):', easingFunctions.linear(0.5));
console.log('   Ease Out(0.5):', easingFunctions.ease_out(0.5));
console.log('   Ease In(0.5):', easingFunctions.ease_in(0.5));

// Test 2: Interpolation
console.log('\n2. Testing Interpolation:');
console.log('   Interpolate 0 to 10 at 50%:', interpolate(0, 10, 0.5, 'linear'));
console.log('   Interpolate 1.0x to 2.0x at 75%:', interpolate(1.0, 2.0, 0.75, 'ease_out'));

// Test 3: Position Interpolation
console.log('\n3. Testing Position Interpolation:');
const startPos = { x: 0.0, y: 0.0 };
const endPos = { x: 1.0, y: 1.0 };
console.log('   Position at 50%:', interpolatePosition(startPos, endPos, 0.5, 'linear'));

// Test 4: Create Camera
console.log('\n4. Testing Camera Creation:');
const camera1 = createCamera({ zoom: 2.0, position: { x: 0.3, y: 0.7 } });
console.log('   Created camera:', JSON.stringify(camera1, null, 2));

// Test 5: Camera Sequence
console.log('\n5. Testing Camera Sequence:');
const cameras = [
  createCamera({ zoom: 1.0, duration: 2.0, transition_duration: 0 }),
  createCamera({ zoom: 2.0, duration: 3.0, transition_duration: 1.5, position: { x: 0.7, y: 0.3 } }),
  createCamera({ zoom: 1.5, duration: 2.0, transition_duration: 1.0, position: { x: 0.5, y: 0.5 } })
];

console.log('   Total duration:', getTotalCameraDuration(cameras), 'seconds');

// Test camera at different times
const times = [0, 1.5, 3.0, 5.0, 7.0];
times.forEach(time => {
  const cameraState = getCameraAtTime(cameras, time);
  console.log(`   At ${time}s:`, {
    zoom: cameraState.zoom.toFixed(2),
    position: { 
      x: cameraState.position.x.toFixed(2), 
      y: cameraState.position.y.toFixed(2) 
    },
    camera: cameraState.cameraIndex + 1,
    transitioning: cameraState.isTransitioning
  });
});

// Test 6: Camera Validation
console.log('\n6. Testing Camera Validation:');
const validCamera = { zoom: 2.0, position: { x: 0.5, y: 0.5 }, duration: 2.0 };
const invalidCamera = { zoom: 15.0, position: { x: 2.0, y: -1.0 }, duration: -5 };

console.log('   Valid camera:', validateCamera(validCamera));
console.log('   Invalid camera:', validateCamera(invalidCamera));

// Test 7: Position Normalization
console.log('\n7. Testing Position Normalization:');
console.log('   Normalize {x:1.5, y:-0.3}:', normalizePosition({ x: 1.5, y: -0.3 }));
console.log('   Normalize {x:0.7, y:0.2}:', normalizePosition({ x: 0.7, y: 0.2 }));

console.log('\n✅ All tests completed successfully!');
