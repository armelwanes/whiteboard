# Scene Canvas Scrollable Area Increase

## Issue Summary
The user requested: "en faite il faut que le schene view witdth et height soit un peu plus grand comme ca on peu scroller un peu plus beacoup pour plus de place pour la place de beaucoup de camera en faite"

Translation: "Actually, the scene view width and height need to be a bit larger so that we can scroll much more for more space for many cameras"

## Solution Implemented

### Changes Made
Increased the scrollable area around the scene canvas by implementing a padding container with **2000px padding on all sides** (4x increase from the documented 500px).

### Technical Details

#### File Modified: `src/components/SceneCanvas.jsx`

1. **Added Padding Container**
   ```jsx
   <div style={{
     minWidth: `${scaledSceneWidth + 4000}px`,
     minHeight: `${scaledSceneHeight + 4000}px`,
     padding: '2000px',
     position: 'relative'
   }}>
     {/* Scene Canvas content here */}
   </div>
   ```

2. **Updated Auto-Scroll Calculation**
   ```jsx
   const paddingOffset = 2000; // Match the padding value
   const scrollX = cameraX + paddingOffset - (container.clientWidth / 2);
   const scrollY = cameraY + paddingOffset - (container.clientHeight / 2);
   ```

### Results

#### Scrollable Area Dimensions
- **Total Width**: 5920px (1920px canvas + 4000px padding)
- **Total Height**: 5080px (1080px canvas + 4000px padding)
- **Maximum Scroll X**: 4640px
- **Maximum Scroll Y**: 4413px

#### Visual Impact
- Users can now scroll **much further** in all directions around the scene canvas
- Cameras can be placed anywhere within the expanded scrollable area
- The infinite canvas effect is preserved with the dot pattern background
- Auto-scroll functionality correctly centers cameras within the larger scrollable area

### Testing
✅ Build successful (npm run build)
✅ No new lint errors
✅ Auto-scroll functionality works correctly
✅ Multiple cameras can be placed and navigated in the expanded area
✅ Visual appearance maintained (white stage with shadow on gray infinite canvas)

### Screenshots
1. **Initial view with infinite canvas**: Shows the dot pattern background
2. **After scrolling**: Demonstrates the expanded scrollable space
3. **Multiple cameras**: Shows 2 cameras with plenty of space
4. **Final view**: Shows 3 cameras distributed across the canvas

## Benefits
- Users can now place many more cameras on the canvas
- Cameras can be positioned far apart for complex animations
- Better workspace for large projects with multiple camera angles
- Maintains professional "infinite canvas" UX similar to Figma/Adobe XD

## Backwards Compatibility
- All existing functionality preserved
- No breaking changes to the camera system
- Existing scenes will load normally with the expanded scrollable area
