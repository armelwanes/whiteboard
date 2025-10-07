import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, Play, Download } from 'lucide-react';

/**
 * HandWritingAnimation Component
 * JavaScript implementation of the Python sketchApi for hand-writing animation
 * 
 * This component simulates a hand drawing an image on a whiteboard by:
 * 1. Converting an image to grayscale and applying thresholding
 * 2. Dividing the image into a grid
 * 3. Drawing grid cells progressively with a hand cursor overlay
 */
const HandWritingAnimation = () => {
  const canvasRef = useRef(null);
  const sourceCanvasRef = useRef(null);
  
  const [sourceImage, setSourceImage] = useState(null);
  const [handImage, setHandImage] = useState(null);
  const [handMask, setHandMask] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationFrames, setAnimationFrames] = useState([]);
  
  // Configuration parameters
  const config = {
    splitLen: 10, // Grid size for dividing the image
    skipRate: 5,  // Number of grids to skip between frames
    frameRate: 30, // Target frame rate
    canvasWidth: 640,
    canvasHeight: 480,
  };

  // Load hand images on mount
  useEffect(() => {
    loadHandImages();
  }, []);

  /**
   * Load the hand cursor and mask images from the public directory
   */
  const loadHandImages = () => {
    const hand = new Image();
    hand.src = '/data/images/drawing-hand.png';
    hand.onload = () => {
      setHandImage(hand);
      console.log('Hand image loaded');
    };

    const mask = new Image();
    mask.src = '/data/images/hand-mask.png';
    mask.onload = () => {
      setHandMask(mask);
      console.log('Hand mask loaded');
    };
  };

  /**
   * Calculate Euclidean distance between two points
   */
  const euclideanDistance = (point1, point2) => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Find the minimum distance point from a given point in an array
   */
  const findNearestPoint = (points, targetPoint) => {
    let minDist = Infinity;
    let minIndex = 0;
    
    points.forEach((point, index) => {
      const dist = euclideanDistance(point, targetPoint);
      if (dist < minDist) {
        minDist = dist;
        minIndex = index;
      }
    });
    
    return minIndex;
  };

  /**
   * Get extreme coordinates (bounding box) from a binary mask
   */
  const getExtremeCoordinates = (imageData) => {
    let minX = imageData.width;
    let minY = imageData.height;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        // Check if pixel is white (255) in the mask
        if (imageData.data[index] > 128) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    return { minX, minY, maxX, maxY };
  };

  /**
   * Preprocess the hand image and mask
   */
  const preprocessHandImage = (hand, mask) => {
    // Create temporary canvases for processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = mask.width;
    tempCanvas.height = mask.height;
    tempCtx.drawImage(mask, 0, 0);
    
    const maskData = tempCtx.getImageData(0, 0, mask.width, mask.height);
    const bounds = getExtremeCoordinates(maskData);
    
    // Crop hand and mask to bounding box
    const croppedWidth = bounds.maxX - bounds.minX;
    const croppedHeight = bounds.maxY - bounds.minY;
    
    const croppedHandCanvas = document.createElement('canvas');
    croppedHandCanvas.width = croppedWidth;
    croppedHandCanvas.height = croppedHeight;
    const croppedHandCtx = croppedHandCanvas.getContext('2d');
    
    croppedHandCtx.drawImage(
      hand,
      bounds.minX, bounds.minY, croppedWidth, croppedHeight,
      0, 0, croppedWidth, croppedHeight
    );
    
    return {
      hand: croppedHandCanvas,
      width: croppedWidth,
      height: croppedHeight,
      bounds
    };
  };

  /**
   * Convert image to grayscale and apply thresholding
   */
  const preprocessImage = (image, width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Draw and resize image
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Convert to grayscale and apply threshold
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Simple threshold - convert to black or white
      const threshold = gray < 128 ? 0 : 255;
      data[i] = threshold;
      data[i + 1] = threshold;
      data[i + 2] = threshold;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  /**
   * Draw hand overlay on the canvas
   */
  const drawHandOnCanvas = (ctx, handCanvas, x, y, canvasWidth, canvasHeight) => {
    const handWidth = handCanvas.width;
    const handHeight = handCanvas.height;
    
    // Calculate how much of the hand to draw (handle edges)
    const remainingWidth = canvasWidth - x;
    const remainingHeight = canvasHeight - y;
    
    const cropWidth = Math.min(handWidth, remainingWidth);
    const cropHeight = Math.min(handHeight, remainingHeight);
    
    if (cropWidth > 0 && cropHeight > 0) {
      ctx.drawImage(
        handCanvas,
        0, 0, cropWidth, cropHeight,
        x, y, cropWidth, cropHeight
      );
    }
  };

  /**
   * Check if a grid cell has any black pixels (content to draw)
   */
  const hasBlackPixels = (imageData, startX, startY, gridSize, threshold = 10) => {
    const width = imageData.width;
    const data = imageData.data;
    
    for (let dy = 0; dy < gridSize; dy++) {
      for (let dx = 0; dx < gridSize; dx++) {
        const x = startX + dx;
        const y = startY + dy;
        
        if (x >= width || y >= imageData.height) continue;
        
        const index = (y * width + x) * 4;
        if (data[index] < threshold) {
          return true;
        }
      }
    }
    
    return false;
  };

  /**
   * Generate animation frames
   */
  const generateAnimationFrames = (sourceImg, handData) => {
    const { canvasWidth: width, canvasHeight: height } = config;
    const splitLen = config.splitLen;
    
    // Preprocess the source image
    const thresholdCanvas = preprocessImage(sourceImg, width, height);
    const threshCtx = thresholdCanvas.getContext('2d');
    const threshData = threshCtx.getImageData(0, 0, width, height);
    
    // Create drawing canvas
    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    const drawCtx = drawingCanvas.getContext('2d');
    
    // Fill with white background
    drawCtx.fillStyle = 'white';
    drawCtx.fillRect(0, 0, width, height);
    
    // Calculate grid dimensions
    const nCutsVertical = Math.ceil(height / splitLen);
    const nCutsHorizontal = Math.ceil(width / splitLen);
    
    // Find all grid cells with black pixels
    const blackCells = [];
    for (let row = 0; row < nCutsVertical; row++) {
      for (let col = 0; col < nCutsHorizontal; col++) {
        const startX = col * splitLen;
        const startY = row * splitLen;
        
        if (hasBlackPixels(threshData, startX, startY, splitLen)) {
          blackCells.push({ x: col, y: row });
        }
      }
    }
    
    console.log(`Found ${blackCells.length} grid cells with content`);
    
    // Generate frames by drawing cells progressively
    const frames = [];
    let currentCell = { x: 0, y: 0 };
    let counter = 0;
    
    while (blackCells.length > 0) {
      // Find nearest undrawn cell
      const nearestIndex = findNearestPoint(blackCells, currentCell);
      const selectedCell = blackCells[nearestIndex];
      
      // Draw the selected grid cell
      const startX = selectedCell.x * splitLen;
      const startY = selectedCell.y * splitLen;
      const endX = Math.min(startX + splitLen, width);
      const endY = Math.min(startY + splitLen, height);
      
      // Copy grid from threshold canvas to drawing canvas
      const gridWidth = endX - startX;
      const gridHeight = endY - startY;
      const gridData = threshCtx.getImageData(startX, startY, gridWidth, gridHeight);
      drawCtx.putImageData(gridData, startX, startY);
      
      // Remove drawn cell
      blackCells.splice(nearestIndex, 1);
      currentCell = selectedCell;
      
      counter++;
      
      // Save frame every skipRate iterations
      if (counter % config.skipRate === 0) {
        // Create frame with hand overlay
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = width;
        frameCanvas.height = height;
        const frameCtx = frameCanvas.getContext('2d');
        
        // Copy current drawing
        frameCtx.drawImage(drawingCanvas, 0, 0);
        
        // Draw hand at current position
        const handX = startX + Math.floor(splitLen / 2);
        const handY = startY + Math.floor(splitLen / 2);
        
        if (handData && handData.hand) {
          drawHandOnCanvas(frameCtx, handData.hand, handX, handY, width, height);
        }
        
        frames.push(frameCanvas.toDataURL());
      }
    }
    
    // Add final frame showing complete image
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = height;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.drawImage(sourceImg, 0, 0, width, height);
    
    // Add several copies of final frame for pause effect
    for (let i = 0; i < 30; i++) {
      frames.push(finalCanvas.toDataURL());
    }
    
    return frames;
  };

  /**
   * Handle image upload
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        
        // Draw preview on source canvas
        if (sourceCanvasRef.current) {
          const ctx = sourceCanvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
          ctx.drawImage(img, 0, 0, config.canvasWidth, config.canvasHeight);
        }
        
        setProgress(0);
        setAnimationFrames([]);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  /**
   * Start the animation
   */
  const startAnimation = () => {
    if (!sourceImage || !handImage || !handMask) {
      alert('Please upload an image and ensure hand images are loaded');
      return;
    }
    
    setIsAnimating(true);
    setProgress(0);
    
    // Preprocess hand image
    const handData = preprocessHandImage(handImage, handMask);
    
    // Generate animation frames
    console.log('Generating animation frames...');
    const frames = generateAnimationFrames(sourceImage, handData);
    setAnimationFrames(frames);
    
    // Play animation
    playAnimation(frames);
  };

  /**
   * Play the animation frames
   */
  const playAnimation = (frames) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    
    const interval = setInterval(() => {
      if (currentFrame >= frames.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setProgress(100);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
        ctx.drawImage(img, 0, 0);
      };
      img.src = frames[currentFrame];
      
      currentFrame++;
      setProgress(Math.floor((currentFrame / frames.length) * 100));
    }, 1000 / config.frameRate);
  };

  /**
   * Download the animation as images
   */
  const downloadFrames = () => {
    if (animationFrames.length === 0) {
      alert('Please generate animation first');
      return;
    }
    
    // For simplicity, download just the last frame
    const link = document.createElement('a');
    link.download = 'hand-writing-frame.png';
    link.href = animationFrames[animationFrames.length - 1];
    link.click();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Hand Writing Animation</CardTitle>
          <p className="text-gray-400 text-sm">
            JavaScript implementation of whiteboard hand-writing animation
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload').click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              onClick={startAnimation}
              disabled={!sourceImage || isAnimating}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isAnimating ? 'Animating...' : 'Start Animation'}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadFrames}
              disabled={animationFrames.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Frame
            </Button>
          </div>

          {/* Progress */}
          {isAnimating && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Canvas Display */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-white text-sm mb-2">Source Image</h3>
              <canvas
                ref={sourceCanvasRef}
                width={config.canvasWidth}
                height={config.canvasHeight}
                className="border border-gray-600 bg-white w-full"
              />
            </div>
            <div>
              <h3 className="text-white text-sm mb-2">Animation Output</h3>
              <canvas
                ref={canvasRef}
                width={config.canvasWidth}
                height={config.canvasHeight}
                className="border border-gray-600 bg-white w-full"
              />
            </div>
          </div>

          {/* Status */}
          <div className="text-sm text-gray-400">
            <p>Hand Image: {handImage ? '✓ Loaded' : '⏳ Loading...'}</p>
            <p>Hand Mask: {handMask ? '✓ Loaded' : '⏳ Loading...'}</p>
            {animationFrames.length > 0 && (
              <p>Generated {animationFrames.length} frames</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandWritingAnimation;
