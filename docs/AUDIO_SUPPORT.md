# Audio Support Documentation

## Overview

The whiteboard-anim application now includes comprehensive audio support for creating professional multimedia presentations. This system allows you to add:
- **Background music** at the scene level (for ambient music throughout the entire scene)
- **Layer-specific audio** including narration, sound effects, and drawing sounds (synchronized with specific layers)

## Features

### Supported Audio Features

1. **Background Music (Scene Level)**
   - Loop playback
   - Volume control (0-100%)
   - Fade in/out effects
   - Single track per scene
   - Configured in scene properties

2. **Layer-Specific Audio**
   - **Voice-Over / Narration** - Per-layer narration track
   - **Typewriter Sound** - Audio for text animations
   - **Drawing Sound** - Audio for drawing animations
   - **Sound Effects** - Per-layer sound effects
   - Synchronized with layer animations

3. **Audio Mixing**
   - Master volume control
   - Individual track volume adjustment
   - Automatic mixing of all audio tracks

## Using the Audio Manager

### Adding Audio to a Scene

**Scene-Level Audio (Background Music):**
1. Open a scene in the Scene Editor
2. In the "Propriétés de la Scène" section, find "Musique de fond (URL)"
3. Enter the URL or path to your background music file
4. The music will play throughout the entire scene duration

**Layer-Level Audio:**
1. Select a layer from the "Couches" list
2. Scroll down to the "Audio de la Couche" section
3. Add audio URLs for:
   - **Narration / Voix-off** - Voice-over for this specific layer
   - **Son de machine à écrire** - Typewriter sound for text animations
   - **Son de dessin** - Drawing sound for sketch animations

### Audio Track Controls

Each audio track includes:
- **Preview Button** - Play/pause the audio track
- **Track Type Badge** - Visual indicator of track type
- **Start Time** - When the audio begins (in seconds)
- **Volume Slider** - Adjust track volume (0-100%)
- **Remove Button** - Delete the audio track

### Master Volume Control

The master volume slider at the top of the Audio Manager controls the overall volume of all audio tracks combined. This is useful for:
- Quick volume adjustments during playback
- Muting all audio temporarily
- Balancing overall audio levels

## Audio File Format Support

The audio system uses Howler.js and supports the following formats:
- **MP3** - Most common, good compression
- **WAV** - Uncompressed, highest quality
- **OGG** - Good compression and quality
- **M4A/AAC** - Good for voice recordings
- **WEBM** - Modern format with good compression

## Audio Configuration

### Data Structure

**Scene Level (Background Music Only):**

```javascript
{
  id: 'scene-1',
  title: 'My Scene',
  duration: 10,
  backgroundMusic: 'audio/background.mp3', // URL or path to background music
  layers: [
    // layers with their own audio...
  ]
}
```

**Layer Level (Narration, Sound Effects, etc.):**

```javascript
{
  id: 'layer-1',
  name: 'My Layer',
  type: 'image',
  image_path: 'images/layer.png',
  audio: {
    narration: 'audio/narration.mp3',        // Voice-over for this layer
    soundEffects: [],                         // Sound effects for this layer
    typewriter: 'audio/typewriter.mp3',       // Typewriter sound for text
    drawing: 'audio/drawing.mp3',             // Drawing sound for animations
  }
}
```

## JSON Configuration Format (from Issue Spec)

The audio system supports importing audio configurations in the format specified in the issue:

### Global Audio Configuration

```json
{
  "audio": {
    "background_music": {
      "path": "audio/background.mp3",
      "volume": 0.5,
      "loop": true,
      "fade_in": 1.0,
      "fade_out": 2.0
    },
    "voice_overs": [
      {
        "path": "audio/narration.mp3",
        "start_time": 0.0,
        "volume": 1.0
      }
    ],
    "sound_effects": [
      {
        "path": "audio/whoosh.wav",
        "start_time": 2.5,
        "volume": 0.8,
        "duration": 0.5
      }
    ]
  }
}
```

### Per-Slide Audio Configuration

```json
{
  "slides": [
    {
      "index": 0,
      "duration": 5,
      "audio": {
        "sound_effects": [
          {
            "path": "audio/pop.wav",
            "start_time": 4.0,
            "volume": 0.7
          }
        ]
      }
    }
  ]
}
```

## API Reference

### Audio Utility Functions

#### `createAudioTrack(type, path, options)`
Creates an audio track configuration.

**Parameters:**
- `type` - Track type (background_music, narration, sound_effect)
- `path` - Audio file path or data URL
- `options` - Track options (volume, loop, startTime, duration, fadeIn, fadeOut)

**Returns:** Audio track object

#### `AudioManager` Class

Main class for managing audio playback and synchronization.

**Methods:**
- `addTrack(trackConfig)` - Add an audio track
- `removeTrack(trackId)` - Remove an audio track
- `updateTrack(trackId, updates)` - Update track configuration
- `setMasterVolume(volume)` - Set master volume (0.0-1.0)
- `play(time)` - Start playback at specified time
- `pause()` - Pause all audio
- `stop()` - Stop all audio
- `seek(time)` - Seek to specific time
- `dispose()` - Cleanup and unload all audio

#### `parseAudioConfig(audioConfig)`
Parse audio configuration from JSON format (issue spec).

**Parameters:**
- `audioConfig` - Audio configuration object

**Returns:** Array of audio tracks

## Best Practices

### Volume Levels

- **Background Music**: 0.3 - 0.5 (subtle, doesn't overpower)
- **Voice-Over**: 0.9 - 1.0 (clear and prominent)
- **Sound Effects**: 0.5 - 0.8 (noticeable but not jarring)

### Timing

1. Set scene duration appropriately for audio length
2. Allow 0.5-1 second buffer before/after audio for natural flow
3. Test timing with preview button before finalizing

### Performance

1. Keep audio files reasonably sized (< 10 MB recommended)
2. Use compressed formats (MP3, OGG) for longer tracks
3. Use WAV only for short sound effects requiring high quality

## Integration with Timeline

The audio system is designed to work seamlessly with the timeline:

- Background music plays for the entire scene duration
- Layer audio is synchronized with layer animations
- Timeline synchronization keeps audio in sync with visual elements
- Playback controls affect both visual and audio elements

## Troubleshooting

### Audio not playing
- Check that browser supports the audio format
- Verify audio file is properly loaded (check browser console)
- Ensure master volume is not at 0

### Audio out of sync
- Verify start times are set correctly
- Check that scene duration matches audio requirements
- Use timeline synchronization features

### Poor audio quality
- Use higher quality source files
- Avoid multiple re-encoding steps
- Use appropriate format (WAV for effects, MP3/OGG for music)

## Future Enhancements

Planned features for future releases:
- Auto-generated typewriter sounds for text animations
- Auto-generated drawing sounds for sketch animations
- Visual waveform display in timeline
- Audio trimming and editing
- Audio effects (reverb, echo, etc.)
- Export with audio (video rendering)

## Examples

See `/test/audio-test.js` for code examples demonstrating:
- Creating audio tracks
- Setting up scene audio configuration
- Using the AudioManager class
- Parsing JSON audio configurations
