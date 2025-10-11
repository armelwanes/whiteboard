# Audio Support Documentation

## Overview

The whiteboard-anim application now includes comprehensive audio support for creating professional multimedia presentations. This system allows you to add background music, narration, sound effects, and synchronized audio to your scenes.

## Features

### Supported Audio Features

1. **Background Music**
   - Loop playback
   - Volume control (0-100%)
   - Fade in/out effects
   - Single track per scene

2. **Voice-Over / Narration**
   - Multiple narration tracks per scene
   - Precise timing control (start time)
   - Volume adjustment
   - Sequential or overlapping narration

3. **Sound Effects**
   - Multiple sound effects per scene
   - Synchronized with animations
   - Precise timing (start time and duration)
   - Volume control

4. **Multi-Track Audio Mixing**
   - Master volume control
   - Individual track volume adjustment
   - Automatic mixing of all audio tracks

## Using the Audio Manager

### Adding Audio to a Scene

1. Open a scene in the Scene Editor
2. Scroll down to the "Audio Manager" section
3. Click the expand button to open the audio panel
4. Choose the type of audio to add:
   - **Background Music** - For ambient music that loops throughout the scene
   - **Narration** - For voice-over or spoken content
   - **Sound Effect** - For short audio clips synchronized with events

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

## Scene Audio Configuration

### Data Structure

Each scene can have an `audio` configuration object:

```javascript
{
  id: 'scene-1',
  title: 'My Scene',
  duration: 10,
  audio: {
    backgroundMusic: {
      id: 'audio-12345',
      type: 'background_music',
      path: 'data:audio/mp3;base64,...', // or URL
      volume: 0.5,
      loop: true,
      startTime: 0.0,
      fadeIn: 2.0,
      fadeOut: 2.0,
    },
    narration: [
      {
        id: 'audio-12346',
        type: 'narration',
        path: 'data:audio/mp3;base64,...',
        volume: 1.0,
        startTime: 0.0,
      },
      {
        id: 'audio-12347',
        type: 'narration',
        path: 'data:audio/mp3;base64,...',
        volume: 1.0,
        startTime: 5.0,
      }
    ],
    soundEffects: [
      {
        id: 'audio-12348',
        type: 'sound_effect',
        path: 'data:audio/wav;base64,...',
        volume: 0.8,
        startTime: 2.5,
        duration: 0.5,
      }
    ]
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

The audio system is designed to work seamlessly with the MultiTimeline system:

- Audio tracks can be added to the Audio track in the MultiTimeline
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
