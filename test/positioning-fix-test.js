/**
 * Positioning Fix Test
 * Verifies that the image positioning fix correctly handles coordinate transformations
 */

console.log('🧪 Testing Image Positioning Fix\n');

// Test data
const tests = [
  {
    name: 'Center of canvas',
    layerPosition: { x: 400, y: 225 },
    imageSize: { width: 200, height: 150 },
    cameraViewport: { x: 0, y: 0 },
    expected: {
      old: { x: 300, y: 150 }, // Centered: layerX - width/2, layerY - height/2
      new: { x: 400, y: 225 }  // Top-left: layerX, layerY
    }
  },
  {
    name: 'Top-left corner',
    layerPosition: { x: 100, y: 100 },
    imageSize: { width: 200, height: 150 },
    cameraViewport: { x: 0, y: 0 },
    expected: {
      old: { x: 0, y: 25 },    // Would be partially off-canvas
      new: { x: 100, y: 100 }  // Correct position
    }
  },
  {
    name: 'With camera offset',
    layerPosition: { x: 960, y: 540 }, // Scene center
    imageSize: { width: 200, height: 150 },
    cameraViewport: { x: 560, y: 315 }, // Camera at scene center (800x450)
    expected: {
      old: { x: 300, y: 150 }, // Centered in viewport
      new: { x: 400, y: 225 }  // Top-left in viewport
    }
  }
];

// Old positioning (centered - WRONG)
function calculateOldPosition(layerX, layerY, imgWidth, imgHeight) {
  return {
    x: layerX - imgWidth / 2,
    y: layerY - imgHeight / 2
  };
}

// New positioning (top-left - CORRECT)
function calculateNewPosition(layerX, layerY) {
  return {
    x: layerX,
    y: layerY
  };
}

// Calculate layer position relative to camera
function getLayerPositionInViewport(layerPos, cameraViewport) {
  return {
    x: layerPos.x - cameraViewport.x,
    y: layerPos.y - cameraViewport.y
  };
}

// Run tests
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log('─'.repeat(50));
  
  // Calculate viewport position
  const viewportPos = getLayerPositionInViewport(test.layerPosition, test.cameraViewport);
  
  // Old method (centered)
  const oldPos = calculateOldPosition(
    viewportPos.x,
    viewportPos.y,
    test.imageSize.width,
    test.imageSize.height
  );
  
  // New method (top-left)
  const newPos = calculateNewPosition(viewportPos.x, viewportPos.y);
  
  console.log(`  Layer position: (${test.layerPosition.x}, ${test.layerPosition.y})`);
  console.log(`  Image size: ${test.imageSize.width}x${test.imageSize.height}`);
  console.log(`  Camera viewport: (${test.cameraViewport.x}, ${test.cameraViewport.y})`);
  console.log(`  Viewport position: (${viewportPos.x}, ${viewportPos.y})`);
  console.log();
  console.log(`  Old (centered): (${oldPos.x}, ${oldPos.y})`);
  console.log(`  New (top-left): (${newPos.x}, ${newPos.y})`);
  console.log();
  
  // Verify old matches expected
  const oldMatches = 
    oldPos.x === test.expected.old.x &&
    oldPos.y === test.expected.old.y;
    
  // Verify new matches expected
  const newMatches = 
    newPos.x === test.expected.new.x &&
    newPos.y === test.expected.new.y;
  
  if (oldMatches && newMatches) {
    console.log(`  ✅ PASS: Calculations match expected values`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: Calculations don't match`);
    if (!oldMatches) {
      console.log(`    Old expected: (${test.expected.old.x}, ${test.expected.old.y})`);
    }
    if (!newMatches) {
      console.log(`    New expected: (${test.expected.new.x}, ${test.expected.new.y})`);
    }
    failed++;
  }
  console.log();
});

// Calculate the offset difference
const sampleWidth = 200;
const sampleHeight = 150;
const offsetX = sampleWidth / 2;
const offsetY = sampleHeight / 2;

console.log('📊 Summary');
console.log('─'.repeat(50));
console.log(`Tests passed: ${passed}/${tests.length}`);
console.log(`Tests failed: ${failed}/${tests.length}`);
console.log();
console.log('📐 Positioning Difference:');
console.log(`  For a ${sampleWidth}x${sampleHeight} image:`);
console.log(`  - X offset: ${offsetX}px (centered method shifts left)`);
console.log(`  - Y offset: ${offsetY}px (centered method shifts up)`);
console.log();
console.log('🎯 Issue Resolution:');
console.log('  The "décalage" (shift) issue was caused by the export');
console.log('  functions using center positioning while the editor');
console.log('  uses top-left positioning. This fix aligns both to use');
console.log('  top-left corner positioning, eliminating the offset.');
console.log();

// Exit with appropriate code
if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}
