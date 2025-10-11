/**
 * Audio System Tests
 * Demonstrates the usage of audio utilities
 */

import {
  AudioTrackType,
  createAudioTrack,
  AudioManager,
  createSceneAudioConfig,
  parseAudioConfig,
} from '../src/utils/audioManager.js';

console.log('🎵 Testing Audio System\n');

// Test 1: Create Audio Tracks
console.log('1. Testing Audio Track Creation:');
const backgroundMusic = createAudioTrack(
  AudioTrackType.BACKGROUND_MUSIC,
  'audio/background.mp3',
  { volume: 0.5, loop: true, fadeIn: 2.0, fadeOut: 2.0 }
);
console.log('   Background Music:', JSON.stringify(backgroundMusic, null, 2));

const narration = createAudioTrack(
  AudioTrackType.NARRATION,
  'audio/voice.mp3',
  { volume: 1.0, startTime: 5.0 }
);
console.log('   Narration:', JSON.stringify(narration, null, 2));

const soundEffect = createAudioTrack(
  AudioTrackType.SOUND_EFFECT,
  'audio/whoosh.wav',
  { volume: 0.8, startTime: 2.5, duration: 0.5 }
);
console.log('   Sound Effect:', JSON.stringify(soundEffect, null, 2));

// Test 2: Scene Audio Configuration
console.log('\n2. Testing Scene Audio Configuration:');
const sceneAudio = createSceneAudioConfig({
  backgroundMusic,
  narration: [narration],
  soundEffects: [soundEffect],
});
console.log('   Scene Audio:', JSON.stringify(sceneAudio, null, 2));

// Test 3: Parse Audio Config from JSON (Issue spec format)
console.log('\n3. Testing Audio Config Parsing (Issue Format):');
const jsonConfig = {
  audio: {
    background_music: {
      path: 'audio/background.mp3',
      volume: 0.5,
      loop: true,
      fade_in: 1.0,
      fade_out: 2.0,
    },
    voice_overs: [
      {
        path: 'audio/narration.mp3',
        start_time: 0.0,
        volume: 1.0,
      },
    ],
    sound_effects: [
      {
        path: 'audio/whoosh.wav',
        start_time: 2.5,
        volume: 0.8,
        duration: 0.5,
      },
    ],
  },
};

const parsedTracks = parseAudioConfig(jsonConfig.audio);
console.log('   Parsed Tracks:', JSON.stringify(parsedTracks, null, 2));

// Test 4: Audio Manager
console.log('\n4. Testing Audio Manager:');
const audioManager = new AudioManager();
console.log('   Created AudioManager');

// Add tracks
audioManager.addTrack(backgroundMusic);
audioManager.addTrack(narration);
audioManager.addTrack(soundEffect);
console.log('   Added 3 tracks to AudioManager');

// Get tracks
const allTracks = audioManager.getTracks();
console.log('   All tracks count:', allTracks.length);

// Get tracks by type
const bgTracks = audioManager.getTracksByType(AudioTrackType.BACKGROUND_MUSIC);
console.log('   Background music tracks:', bgTracks.length);

const narrationTracks = audioManager.getTracksByType(AudioTrackType.NARRATION);
console.log('   Narration tracks:', narrationTracks.length);

// Update track
audioManager.updateTrack(backgroundMusic.id, { volume: 0.7 });
console.log('   Updated background music volume to 0.7');

// Set master volume
audioManager.setMasterVolume(0.8);
console.log('   Set master volume to 0.8');

// Cleanup
audioManager.dispose();
console.log('   Disposed AudioManager');

// Test 5: Audio Track Types
console.log('\n5. Testing Audio Track Types:');
console.log('   Available types:', Object.values(AudioTrackType));

// Test 6: Complete Scene Example
console.log('\n6. Testing Complete Scene Example:');
const completeScene = {
  id: 'scene-1',
  title: 'Demo Scene',
  duration: 10,
  audio: {
    backgroundMusic: createAudioTrack(
      AudioTrackType.BACKGROUND_MUSIC,
      'audio/ambient.mp3',
      { volume: 0.4, loop: true }
    ),
    narration: [
      createAudioTrack(
        AudioTrackType.NARRATION,
        'audio/intro.mp3',
        { volume: 1.0, startTime: 0.0 }
      ),
      createAudioTrack(
        AudioTrackType.NARRATION,
        'audio/step1.mp3',
        { volume: 1.0, startTime: 5.0 }
      ),
    ],
    soundEffects: [
      createAudioTrack(
        AudioTrackType.SOUND_EFFECT,
        'audio/pop.wav',
        { volume: 0.7, startTime: 4.0, duration: 0.3 }
      ),
    ],
  },
};
console.log('   Complete scene with audio:', JSON.stringify(completeScene, null, 2));

console.log('\n✅ All audio tests completed successfully!');
