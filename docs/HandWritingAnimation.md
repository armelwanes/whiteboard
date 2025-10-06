# Hand Writing Animation Component

## Overview

This is a JavaScript implementation of the Python `sketchApi.py` that creates hand-writing animation effects on images. The component simulates a hand progressively drawing an image on a whiteboard.

## Files

- **`src/components/HandWritingAnimation.jsx`** - Main component with all animation logic
- **`src/pages/HandWritingTest.jsx`** - Standalone test page
- **Integration files:**
  - `src/App.jsx` - Added routing toggle
  - `src/components/Toolbar.jsx` - Added test button

## Features

### Core Functionality
- **Image Upload**: Upload any image to animate
- **Preprocessing**: Converts images to grayscale and applies thresholding
- **Grid-Based Drawing**: Divides image into grids and draws progressively
- **Hand Overlay**: Shows animated hand cursor during drawing
- **Frame Generation**: Creates animation frames for smooth playback

### Technical Details
- Uses HTML5 Canvas API (no external image processing libraries)
- Implements nearest-neighbor algorithm for smooth drawing paths
- Loads hand cursor and mask from `/public/data/images/`
- Configurable parameters:
  - `splitLen`: Grid size (default: 10)
  - `skipRate`: Frames to skip between saves (default: 5)
  - `frameRate`: Animation speed (default: 30 fps)
  - `canvasWidth/Height`: Output dimensions (default: 640x480)

## How to Use

### Access the Test Page
1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Click the **"Hand Writing Test"** button in the toolbar
4. You'll see the test interface

### Test the Animation
1. Click **"Upload Image"** to select an image file
2. The image will appear in the "Source Image" canvas
3. Click **"Start Animation"** to begin
4. Watch as a hand progressively "draws" your image
5. Use **"Download Frame"** to save the final frame

### Return to Main App
- Click **"Back to Main App"** to return to the main application

## Algorithm

The animation algorithm follows these steps:

1. **Preprocess Image**
   - Resize to target dimensions
   - Convert to grayscale
   - Apply binary threshold to detect edges

2. **Preprocess Hand Images**
   - Load hand cursor and mask images
   - Find bounding box to crop hand
   - Prepare for overlay compositing

3. **Grid Division**
   - Divide image into grid cells (e.g., 10x10 pixels each)
   - Identify cells containing content (black pixels)

4. **Progressive Drawing**
   - Start from (0,0) or first content cell
   - Use nearest-neighbor search to find next cell
   - Draw cells progressively to create path
   - Overlay hand at current drawing position
   - Save frame every N iterations (skipRate)

5. **Final Frames**
   - Add multiple frames of the complete image
   - Creates pause effect at the end

## Comparison with Python Version

### Similarities
- Same grid-based drawing algorithm
- Same nearest-neighbor path finding
- Same hand overlay technique
- Uses same hand images from `/data/images/`

### Differences
- **No OpenCV**: Uses Canvas API instead of cv2
- **No NumPy**: Uses JavaScript arrays and loops
- **Simplified Threshold**: Basic binary threshold instead of adaptive
- **Browser-Based**: Runs in browser, no video file output
- **Frame Playback**: Displays frames in real-time vs. saving to video

## Configuration

You can modify these constants in `HandWritingAnimation.jsx`:

```javascript
const config = {
  splitLen: 10,        // Grid cell size
  skipRate: 5,         // Frames between saves
  frameRate: 30,       // Animation speed
  canvasWidth: 640,    // Output width
  canvasHeight: 480,   // Output height
};
```

## Future Enhancements

Possible improvements:
- Add video export (using MediaRecorder API)
- Add more advanced image preprocessing
- Support for custom hand images
- Adjustable animation speed controls
- Multiple drawing styles (pen, marker, etc.)
- Color preservation option
- Progress indicator during generation

## Testing

To test the component:
1. Upload different types of images (simple drawings, text, photos)
2. Try different image sizes
3. Test with high-contrast and low-contrast images
4. Verify hand overlay positioning
5. Check animation smoothness

## Browser Compatibility

Requires modern browsers with:
- HTML5 Canvas API support
- ES6+ JavaScript features
- File API for image upload

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Part of the whiteboard-anim project.
