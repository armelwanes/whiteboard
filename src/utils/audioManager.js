/**
 * Audio Manager System
 * Manages audio tracks, playback, mixing, and synchronization with timeline
 */

import { Howl } from 'howler';

/**
 * Audio track types
 */
export const AudioTrackType = {
  BACKGROUND_MUSIC: 'background_music',
  NARRATION: 'narration',
  SOUND_EFFECT: 'sound_effect',
  TYPEWRITER: 'typewriter',
  DRAWING: 'drawing',
};

/**
 * Create an audio track
 * @param {string} type - Track type
 * @param {string} path - Audio file path or data URL
 * @param {Object} options - Track options
 * @returns {Object} Audio track configuration
 */
export const createAudioTrack = (type, path, options = {}) => {
  return {
    id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    path,
    volume: options.volume ?? 1.0,
    loop: options.loop ?? false,
    startTime: options.startTime ?? 0.0,
    duration: options.duration ?? null,
    fadeIn: options.fadeIn ?? 0.0,
    fadeOut: options.fadeOut ?? 0.0,
    enabled: options.enabled ?? true,
  };
};

/**
 * Audio Manager class
 * Handles multiple audio tracks and their synchronization
 */
export class AudioManager {
  constructor() {
    this.tracks = new Map(); // Map<trackId, { config, howl, state }>
    this.masterVolume = 1.0;
    this.currentTime = 0.0;
    this.isPlaying = false;
    this.timeUpdateCallbacks = [];
  }

  /**
   * Add an audio track
   * @param {Object} trackConfig - Track configuration
   * @returns {string} Track ID
   */
  addTrack(trackConfig) {
    const howl = new Howl({
      src: [trackConfig.path],
      loop: trackConfig.loop,
      volume: trackConfig.volume * this.masterVolume,
      onload: () => {
        console.log(`Audio track ${trackConfig.id} loaded`);
      },
      onloaderror: (id, error) => {
        console.error(`Error loading audio track ${trackConfig.id}:`, error);
      },
    });

    this.tracks.set(trackConfig.id, {
      config: trackConfig,
      howl,
      state: {
        loaded: false,
        playing: false,
        scheduledStart: null,
      },
    });

    return trackConfig.id;
  }

  /**
   * Remove an audio track
   * @param {string} trackId - Track ID
   */
  removeTrack(trackId) {
    const track = this.tracks.get(trackId);
    if (track) {
      track.howl.unload();
      this.tracks.delete(trackId);
    }
  }

  /**
   * Update track configuration
   * @param {string} trackId - Track ID
   * @param {Object} updates - Configuration updates
   */
  updateTrack(trackId, updates) {
    const track = this.tracks.get(trackId);
    if (track) {
      track.config = { ...track.config, ...updates };
      
      // Apply volume changes immediately
      if (updates.volume !== undefined) {
        track.howl.volume(updates.volume * this.masterVolume);
      }
      
      // Apply loop changes
      if (updates.loop !== undefined) {
        track.howl.loop(updates.loop);
      }
    }
  }

  /**
   * Set master volume
   * @param {number} volume - Volume level (0.0 - 1.0)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all track volumes
    this.tracks.forEach(track => {
      track.howl.volume(track.config.volume * this.masterVolume);
    });
  }

  /**
   * Play audio synchronized with timeline
   * @param {number} time - Current timeline time in seconds
   */
  play(time = 0) {
    this.currentTime = time;
    this.isPlaying = true;

    this.tracks.forEach((track) => {
      if (!track.config.enabled) return;

      const trackStartTime = track.config.startTime;
      const trackEndTime = track.config.duration 
        ? trackStartTime + track.config.duration 
        : Infinity;

      // Check if track should be playing at this time
      if (time >= trackStartTime && time < trackEndTime) {
        const seekTime = time - trackStartTime;
        
        // Apply fade in if starting from beginning
        if (seekTime < track.config.fadeIn && track.config.fadeIn > 0) {
          const fadeVolume = (seekTime / track.config.fadeIn) * track.config.volume;
          track.howl.volume(fadeVolume * this.masterVolume);
        }

        track.howl.seek(seekTime);
        track.howl.play();
        track.state.playing = true;
      }
    });

    // Start time tracking
    this.startTimeTracking();
  }

  /**
   * Pause all audio
   */
  pause() {
    this.isPlaying = false;
    
    this.tracks.forEach(track => {
      if (track.state.playing) {
        track.howl.pause();
        track.state.playing = false;
      }
    });

    this.stopTimeTracking();
  }

  /**
   * Stop all audio
   */
  stop() {
    this.isPlaying = false;
    this.currentTime = 0;
    
    this.tracks.forEach(track => {
      track.howl.stop();
      track.state.playing = false;
    });

    this.stopTimeTracking();
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    this.currentTime = time;
    
    this.tracks.forEach(track => {
      if (!track.config.enabled) return;

      const trackStartTime = track.config.startTime;
      const trackEndTime = track.config.duration 
        ? trackStartTime + track.config.duration 
        : Infinity;

      if (time >= trackStartTime && time < trackEndTime) {
        const seekTime = time - trackStartTime;
        track.howl.seek(seekTime);
      } else {
        track.howl.stop();
        track.state.playing = false;
      }
    });
  }

  /**
   * Start time tracking for synchronization
   */
  startTimeTracking() {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
    }

    this.timeTrackingInterval = setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 0.1; // Update every 100ms
        
        // Notify callbacks
        this.timeUpdateCallbacks.forEach(callback => {
          callback(this.currentTime);
        });

        // Check for track start/end times
        this.updatePlayingTracks();
      }
    }, 100);
  }

  /**
   * Stop time tracking
   */
  stopTimeTracking() {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
      this.timeTrackingInterval = null;
    }
  }

  /**
   * Update which tracks should be playing based on current time
   */
  updatePlayingTracks() {
    this.tracks.forEach(track => {
      if (!track.config.enabled) return;

      const trackStartTime = track.config.startTime;
      const trackEndTime = track.config.duration 
        ? trackStartTime + track.config.duration 
        : Infinity;

      const shouldBePlaying = this.currentTime >= trackStartTime && this.currentTime < trackEndTime;

      if (shouldBePlaying && !track.state.playing) {
        // Start playing
        const seekTime = this.currentTime - trackStartTime;
        track.howl.seek(seekTime);
        track.howl.play();
        track.state.playing = true;
      } else if (!shouldBePlaying && track.state.playing) {
        // Stop playing
        track.howl.stop();
        track.state.playing = false;
      }

      // Handle fade out
      if (track.state.playing && track.config.fadeOut > 0) {
        const timeUntilEnd = trackEndTime - this.currentTime;
        if (timeUntilEnd <= track.config.fadeOut) {
          const fadeVolume = (timeUntilEnd / track.config.fadeOut) * track.config.volume;
          track.howl.volume(fadeVolume * this.masterVolume);
        }
      }
    });
  }

  /**
   * Add time update callback
   * @param {Function} callback - Callback function
   */
  onTimeUpdate(callback) {
    this.timeUpdateCallbacks.push(callback);
  }

  /**
   * Remove time update callback
   * @param {Function} callback - Callback function
   */
  offTimeUpdate(callback) {
    this.timeUpdateCallbacks = this.timeUpdateCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Get all tracks
   * @returns {Array} Array of track configurations
   */
  getTracks() {
    return Array.from(this.tracks.values()).map(track => track.config);
  }

  /**
   * Get tracks by type
   * @param {string} type - Track type
   * @returns {Array} Array of track configurations
   */
  getTracksByType(type) {
    return this.getTracks().filter(track => track.type === type);
  }

  /**
   * Cleanup and unload all audio
   */
  dispose() {
    this.stop();
    this.tracks.forEach(track => {
      track.howl.unload();
    });
    this.tracks.clear();
    this.timeUpdateCallbacks = [];
  }
}

/**
 * Create audio configuration for a scene
 * @param {Object} options - Audio options
 * @returns {Object} Audio configuration
 */
export const createSceneAudioConfig = (options = {}) => {
  return {
    backgroundMusic: options.backgroundMusic || null,
    narration: options.narration || [],
    soundEffects: options.soundEffects || [],
    typewriter: options.typewriter || null,
    drawing: options.drawing || null,
  };
};

/**
 * Parse audio configuration from JSON format (from issue spec)
 * @param {Object} audioConfig - Audio configuration from JSON
 * @returns {Array} Array of audio tracks
 */
export const parseAudioConfig = (audioConfig) => {
  const tracks = [];

  // Background music
  if (audioConfig.background_music) {
    const bg = audioConfig.background_music;
    tracks.push(createAudioTrack(
      AudioTrackType.BACKGROUND_MUSIC,
      bg.path || bg.file,
      {
        volume: bg.volume ?? 0.5,
        loop: bg.loop ?? true,
        fadeIn: bg.fade_in ?? 0.0,
        fadeOut: bg.fade_out ?? 0.0,
        startTime: 0.0,
      }
    ));
  }

  // Voice-overs/Narration
  if (audioConfig.voice_overs || audioConfig.narration) {
    const narrations = audioConfig.voice_overs || audioConfig.narration || [];
    narrations.forEach(narration => {
      tracks.push(createAudioTrack(
        AudioTrackType.NARRATION,
        narration.path || narration.file,
        {
          volume: narration.volume ?? 1.0,
          startTime: narration.start_time ?? 0.0,
          duration: narration.duration,
        }
      ));
    });
  }

  // Sound effects
  if (audioConfig.sound_effects || audioConfig.effects) {
    const effects = audioConfig.sound_effects || audioConfig.effects || [];
    effects.forEach(effect => {
      tracks.push(createAudioTrack(
        AudioTrackType.SOUND_EFFECT,
        effect.path || effect.file,
        {
          volume: effect.volume ?? 0.8,
          startTime: effect.start_time ?? 0.0,
          duration: effect.duration ?? 0.5,
        }
      ));
    });
  }

  return tracks;
};

export default {
  AudioTrackType,
  createAudioTrack,
  AudioManager,
  createSceneAudioConfig,
  parseAudioConfig,
};
