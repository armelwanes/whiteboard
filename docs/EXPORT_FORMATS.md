# Export Formats Documentation

## Overview

The Export Formats system provides comprehensive export capabilities for whiteboard animations in multiple formats including PNG, JPEG, WebP, GIF, and WebM. It also includes presets for popular social media platforms.

## Supported Export Formats

### Image Formats

#### 1. PNG (Portable Network Graphics)
- **Best for**: High quality images, transparency
- **Quality**: Lossless compression
- **Transparency**: Yes (alpha channel)
- **File size**: Larger than JPEG/WebP
- **Use cases**: 
  - Final renders requiring transparency
  - High-quality stills
  - Print materials

#### 2. JPEG (Joint Photographic Experts Group)
- **Best for**: Photographs, smaller file sizes
- **Quality**: Lossy compression (adjustable 0-100%)
- **Transparency**: No
- **File size**: Smaller than PNG
- **Use cases**:
  - Social media posts
  - Email attachments
  - Web graphics

#### 3. WebP
- **Best for**: Modern web, excellent compression
- **Quality**: Lossy or lossless (adjustable)
- **Transparency**: Yes
- **File size**: Smallest with good quality
- **Use cases**:
  - Modern websites
  - Progressive web apps
  - Optimized delivery

### Video Formats

#### 4. WebM
- **Best for**: Web video with transparency
- **Quality**: High (VP9 codec)
- **Transparency**: Yes (alpha channel)
- **File size**: Efficient compression
- **Use cases**:
  - Animated overlays
  - Transparent video backgrounds
  - HTML5 video

#### 5. GIF (Graphics Interchange Format)
- **Best for**: Simple animations, wide compatibility
- **Quality**: Limited (256 colors)
- **Transparency**: Yes (binary, not alpha)
- **File size**: Large for long animations
- **Use cases**:
  - Social media reactions
  - Email signatures
  - Universal compatibility needed

## Social Media Presets

### YouTube
- **Dimensions**: 1920×1080 (16:9)
- **FPS**: 30
- **Format**: MP4
- **Description**: Full HD 1080p
- **Best for**: Standard YouTube videos

### YouTube Shorts
- **Dimensions**: 1080×1920 (9:16)
- **FPS**: 30
- **Format**: MP4
- **Description**: Vertical format
- **Best for**: Short-form vertical videos

### Instagram Feed
- **Dimensions**: 1080×1080 (1:1)
- **FPS**: 30
- **Format**: MP4
- **Description**: Square format
- **Best for**: Instagram posts

### Instagram Story/Reel
- **Dimensions**: 1080×1920 (9:16)
- **FPS**: 30
- **Format**: MP4
- **Description**: Vertical format
- **Best for**: Stories and Reels

### TikTok
- **Dimensions**: 1080×1920 (9:16)
- **FPS**: 30
- **Format**: MP4
- **Description**: Vertical format
- **Best for**: TikTok videos

### Facebook/Twitter/LinkedIn
- **Dimensions**: 1280×720 (16:9)
- **FPS**: 30
- **Format**: MP4
- **Description**: HD 720p
- **Best for**: Standard social posts

## Using the Export Panel

### Basic Export

1. **Open the Export Panel** in your scene editor
2. **Select an export format** (PNG, JPEG, WebP, etc.)
3. **Adjust quality settings** (for JPEG/WebP)
4. **Click "Exporter"** to download
5. File will be saved with timestamp

### Social Media Export

1. **Select a social media preset** from dropdown
2. **Click "Exporter pour [Platform]"**
3. Canvas will be automatically scaled to preset dimensions
4. File will be downloaded with platform name

### Quality Settings

#### JPEG Quality
- **10-40%**: Very compressed, small file, visible artifacts
- **40-70%**: Balanced compression and quality
- **70-90%**: High quality, larger files
- **90-100%**: Maximum quality, largest files

#### WebP Quality
- **10-50%**: Aggressive compression
- **50-80%**: Balanced (recommended)
- **80-100%**: Near lossless

## Technical Implementation

### Export Utilities

**exportFormats.js** provides:

```javascript
import { 
  exportAsPNG,
  exportAsJPEG,
  exportAsWebP,
  exportWithPreset,
  SOCIAL_MEDIA_PRESETS 
} from '../utils/exportFormats';

// Export as PNG
await exportAsPNG(canvas, 'my-export.png');

// Export as JPEG with quality
await exportAsJPEG(canvas, 'my-export.jpg', 0.9);

// Export with preset
await exportWithPreset(canvas, 'instagram_story', 'my-story.png');
```

Available functions:
- `exportAsPNG(canvas, filename)` - Export PNG
- `exportAsJPEG(canvas, filename, quality)` - Export JPEG
- `exportAsWebP(canvas, filename, quality)` - Export WebP
- `exportAsPNGSequence(renderFn, frameCount, canvas, basename, onProgress)` - PNG sequence
- `exportAsGIF(renderFn, frameCount, canvas, options, onProgress)` - GIF animation
- `exportAsWebM(canvas, duration, options)` - WebM video
- `exportWithPreset(canvas, presetName, filename)` - Social media preset
- `estimateFileSize(width, height, format, duration)` - Estimate size
- `validateExportOptions(options)` - Validate options

### React Component

**ExportPanel Component:**

```jsx
<ExportPanel
  canvas={canvasElement}
  onExport={(result) => {
    console.log('Export completed:', result);
  }}
/>
```

## File Size Estimation

The system provides file size estimates before export:

### PNG
- Formula: `width × height × 4 bytes × 0.3 (compression)`
- Example: 1920×1080 = ~2.5 MB

### JPEG
- Formula: `width × height × 4 bytes × 0.1 (compression)`
- Example: 1920×1080 = ~800 KB

### WebP
- Formula: `width × height × 4 bytes × 0.08 (compression)`
- Example: 1920×1080 = ~640 KB

### Video (WebM/MP4)
- Formula: `bitrate × duration / 8`
- Example: 2.5 Mbps × 10s = ~3.1 MB

## Best Practices

### Format Selection

**Choose PNG when:**
- You need transparency
- Quality is critical
- File size is not a concern
- Output will be edited further

**Choose JPEG when:**
- No transparency needed
- File size matters
- Sharing via email/social media
- Photographic content

**Choose WebP when:**
- Modern platforms only
- Need both quality and small size
- Transparency with compression
- Web-first delivery

**Choose GIF when:**
- Universal compatibility required
- Simple animations
- Email signatures
- Legacy system support

**Choose WebM when:**
- Need transparent video
- HTML5 video player
- Modern web platforms
- High-quality animation

### Quality vs. Size

| Format | Quality Setting | Size | Use Case |
|--------|----------------|------|----------|
| PNG | N/A | ~2.5MB | Production |
| JPEG | 95% | ~1.2MB | High quality |
| JPEG | 85% | ~800KB | Standard |
| JPEG | 70% | ~500KB | Web |
| WebP | 90% | ~600KB | Modern web |
| WebP | 80% | ~400KB | Optimized |

### Social Media Guidelines

**Instagram:**
- Feed: Square 1:1 or 4:5
- Story: Vertical 9:16
- Reel: Vertical 9:16, max 60s

**TikTok:**
- Vertical 9:16
- 15-60 seconds recommended
- Max 3 minutes

**YouTube:**
- Standard: 16:9 (1080p)
- Shorts: 9:16 (max 60s)
- Minimum 720p recommended

**Twitter:**
- Landscape 16:9 preferred
- Max 512MB
- 2:20 max length

### Performance Tips

1. **Reduce Canvas Size**: Smaller canvases export faster
2. **Optimize Quality**: Don't use 100% if not needed
3. **Batch Export**: Export multiple formats sequentially
4. **Monitor Memory**: Large exports can use significant RAM
5. **Test First**: Preview before final export

## Advanced Features

### PNG Sequence Export

Export animation as individual PNG frames:

```javascript
await exportAsPNGSequence(
  (frameIndex) => renderFrame(frameIndex),
  60, // 60 frames
  canvas,
  'frame', // basename
  (current, total) => console.log(`${current}/${total}`)
);
```

### Custom Dimensions

Scale canvas to custom size:

```javascript
import { scaleCanvas } from '../utils/exportFormats';

const scaledCanvas = scaleCanvas(sourceCanvas, 1024, 768);
await exportAsPNG(scaledCanvas, 'custom-size.png');
```

### Validation

Validate export options before exporting:

```javascript
import { validateExportOptions } from '../utils/exportFormats';

const validation = validateExportOptions({
  width: 1920,
  height: 1080,
  format: 'png',
  quality: 0.9
});

if (!validation.valid) {
  console.error('Invalid options:', validation.errors);
}
```

## Troubleshooting

### Export fails
- Check browser console for errors
- Verify canvas is rendered and visible
- Ensure sufficient memory available
- Try smaller dimensions or lower quality

### File too large
- Reduce quality setting
- Choose more efficient format (WebP vs PNG)
- Scale down dimensions
- Use social media presets

### Poor quality
- Increase quality setting
- Use PNG for highest quality
- Check source canvas resolution
- Avoid multiple exports/compressions

### Browser compatibility
- PNG: Universal support
- JPEG: Universal support
- WebP: Modern browsers only (check caniuse.com)
- WebM: Modern browsers only
- GIF: Universal support

## API Reference

### SOCIAL_MEDIA_PRESETS

```javascript
const presets = {
  youtube: { width: 1920, height: 1080, fps: 30 },
  youtube_short: { width: 1080, height: 1920, fps: 30 },
  instagram_feed: { width: 1080, height: 1080, fps: 30 },
  instagram_story: { width: 1080, height: 1920, fps: 30 },
  instagram_reel: { width: 1080, height: 1920, fps: 30 },
  tiktok: { width: 1080, height: 1920, fps: 30 },
  facebook: { width: 1280, height: 720, fps: 30 },
  twitter: { width: 1280, height: 720, fps: 30 },
  linkedin: { width: 1280, height: 720, fps: 30 }
};
```

### Export Functions

```javascript
// Single image export
exportAsPNG(canvas, filename)
exportAsJPEG(canvas, filename, quality)
exportAsWebP(canvas, filename, quality)

// Sequence export
exportAsPNGSequence(renderFn, frameCount, canvas, basename, onProgress)

// Video export
exportAsGIF(renderFn, frameCount, canvas, options, onProgress)
exportAsWebM(canvas, duration, options)

// Preset export
exportWithPreset(canvas, presetName, filename)

// Utilities
estimateFileSize(width, height, format, duration)
formatBytes(bytes)
validateExportOptions(options)
scaleCanvas(sourceCanvas, targetWidth, targetHeight)
```

## Future Enhancements

Planned features for future releases:

- MP4 export with ffmpeg.wasm
- Batch export multiple scenes
- Cloud export with processing
- Custom watermarks
- Audio track embedding
- Chapter markers
- Subtitles/captions
- Export queue management
- Background export
- Export templates

---

**Created**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready
