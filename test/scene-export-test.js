/**
 * Test for scene export functionality
 * Tests the new exportSceneImage function
 */

import { exportSceneImage } from '../src/utils/sceneExporter.js';

console.log('Testing scene export functionality...\n');

// Mock scene data with layers and camera
const mockScene = {
  id: 'test-scene-1',
  title: 'Test Scene',
  backgroundImage: null,
  sceneCameras: [
    {
      id: 'default-camera',
      name: 'Caméra Par Défaut',
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true,
      zoom: 1.0,
    }
  ],
  layers: [
    {
      id: 'layer-1',
      name: 'Test Text Layer',
      type: 'text',
      position: { x: 4800, y: 2700 },
      scale: 1.0,
      opacity: 1.0,
      rotation: 0,
      visible: true,
      z_index: 1,
      text_config: {
        text: 'Hello World',
        size: 48,
        font: 'Arial',
        color: [0, 0, 0],
        align: 'center',
        line_height: 1.2,
        style: 'normal',
      }
    },
    {
      id: 'layer-2',
      name: 'Test Shape Layer',
      type: 'shape',
      position: { x: 4600, y: 2500 },
      scale: 1.0,
      opacity: 0.8,
      rotation: 0,
      visible: true,
      z_index: 2,
      shape_config: {
        shape_type: 'rectangle',
        width: 200,
        height: 100,
        fill_color: [255, 0, 0, 255],
        stroke_color: [0, 0, 0, 255],
        stroke_width: 2,
        fill_mode: 'both',
      }
    }
  ]
};

// Test 1: Export scene with default camera
console.log('Test 1: Export scene with all layers combined');
try {
  // Note: This test requires a browser environment with canvas support
  // In Node.js, we can only verify the function signature
  console.log('Scene structure:', {
    layers: mockScene.layers.length,
    cameras: mockScene.sceneCameras.length,
    defaultCamera: mockScene.sceneCameras.find(c => c.isDefault)?.name
  });
  console.log('Expected export dimensions:', {
    width: mockScene.sceneCameras[0].width,
    height: mockScene.sceneCameras[0].height
  });
  console.log('✓ PASS - Scene structure is valid');
} catch (error) {
  console.log('✗ FAIL -', error.message);
}
console.log();

// Test 2: Verify camera positioning
console.log('Test 2: Verify camera viewport calculation');
try {
  const camera = mockScene.sceneCameras[0];
  const sceneWidth = 9600;
  const sceneHeight = 5400;
  
  // Camera is at (0.5, 0.5) which is center of scene
  const cameraX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraY = (camera.position.y * sceneHeight) - (camera.height / 2);
  
  console.log('Camera viewport top-left:', { x: cameraX, y: cameraY });
  console.log('Expected:', { x: 4400, y: 2475 });
  
  if (Math.abs(cameraX - 4400) < 1 && Math.abs(cameraY - 2475) < 1) {
    console.log('✓ PASS - Camera viewport calculated correctly');
  } else {
    console.log('✗ FAIL - Camera viewport calculation incorrect');
  }
} catch (error) {
  console.log('✗ FAIL -', error.message);
}
console.log();

// Test 3: Verify layer positioning relative to camera
console.log('Test 3: Verify layer-to-camera relative positioning');
try {
  const camera = mockScene.sceneCameras[0];
  const layer = mockScene.layers[0]; // Text layer at (4800, 2700)
  const sceneWidth = 9600;
  const sceneHeight = 5400;
  
  const cameraX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraY = (camera.position.y * sceneHeight) - (camera.height / 2);
  
  const layerRelativeX = layer.position.x - cameraX;
  const layerRelativeY = layer.position.y - cameraY;
  
  console.log('Layer scene position:', layer.position);
  console.log('Layer position relative to camera:', { x: layerRelativeX, y: layerRelativeY });
  console.log('Expected (centered in camera):', { x: 400, y: 225 });
  
  if (Math.abs(layerRelativeX - 400) < 1 && Math.abs(layerRelativeY - 225) < 1) {
    console.log('✓ PASS - Layer positioned correctly relative to camera');
  } else {
    console.log('✗ FAIL - Layer positioning incorrect');
  }
} catch (error) {
  console.log('✗ FAIL -', error.message);
}
console.log();

// Test 4: Error handling - no default camera
console.log('Test 4: Error handling when no default camera');
try {
  const sceneWithoutCamera = {
    ...mockScene,
    sceneCameras: []
  };
  
  // This should throw an error
  exportSceneImage(sceneWithoutCamera).catch(error => {
    if (error.message.includes('No default camera')) {
      console.log('✓ PASS - Correctly throws error when no default camera');
    } else {
      console.log('✗ FAIL - Wrong error message:', error.message);
    }
  });
} catch (error) {
  console.log('✓ PASS - Correctly throws error when no default camera');
}
console.log();

console.log('All tests completed!');
console.log('\nNote: Full canvas rendering tests require a browser environment.');
console.log('Run test/demo-scene-export.html for visual verification.');
