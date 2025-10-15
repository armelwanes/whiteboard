/**
 * Audio Manager System
 * Manages audio tracks, playback, mixing, and synchronization with timeline
 */

import { Howl } from 'howler';

export const AudioTrackType = {
  BACKGROUND_MUSIC: 'background_music',
  NARRATION: 'narration',
  SOUND_EFFECT: 'sound_effect',
  TYPEWRITER: 'typewriter',
  DRAWING: 'drawing',
} as const;

export type AudioTrackTypeValue = typeof AudioTrackType[keyof typeof AudioTrackType];

export interface AudioTrackOptions {
  volume?: number;
  loop?: boolean;
  startTime?: number;
  duration?: number | null;
  fadeIn?: number;
  fadeOut?: number;
  enabled?: boolean;
}

export interface AudioTrack {
  id: string;
  type: AudioTrackTypeValue;
  path: string;
  volume: number;
  loop: boolean;
  startTime: number;
  duration: number | null;
  fadeIn: number;
  fadeOut: number;
  enabled: boolean;
}

export interface AudioTrackState {
  loaded: boolean;
  playing: boolean;
  scheduledStart: number | null;
}

export interface AudioTrackInternal {
  config: AudioTrack;
  howl: Howl;
  state: AudioTrackState;
}

export interface SceneAudioConfig {
  backgroundMusic: AudioTrack | null;
}

export interface LayerAudioConfig {
  narration: AudioTrack | null;
  soundEffects: AudioTrack[];
  typewriter: AudioTrack | null;
  drawing: AudioTrack | null;
}

export interface AudioConfigJSON {
  background_music?: {
    path?: string;
    file?: string;
    volume?: number;
    loop?: boolean;
    fade_in?: number;
    fade_out?: number;
  };
  voice_overs?: Array<{
    path?: string;
    file?: string;
    volume?: number;
    start_time?: number;
    duration?: number;
  }>;
  narration?: Array<{
    path?: string;
    file?: string;
    volume?: number;
    start_time?: number;
    duration?: number;
  }>;
  sound_effects?: Array<{
    path?: string;
    file?: string;
    volume?: number;
    start_time?: number;
    duration?: number;
  }>;
  effects?: Array<{
    path?: string;
    file?: string;
    volume?: number;
    start_time?: number;
    duration?: number;
  }>;
}

type TimeUpdateCallback = (time: number) => void;

/**
 * Create an audio track
 * @param {string} type - Track type
 * @param {string} path - Audio file path or data URL
 * @param {Object} options - Track options
 * @returns {Object} Audio track configuration
 */
export const createAudioTrack = (type: AudioTrackTypeValue, path: string, options: AudioTrackOptions = {}): AudioTrack => {
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
  private tracks: Map<string, AudioTrackInternal>;
  private masterVolume: number;
  private currentTime: number;
  private isPlaying: boolean;
  private timeUpdateCallbacks: TimeUpdateCallback[];
  private timeTrackingInterval: NodeJS.Timeout | null;

  constructor() {
    this.tracks = new Map();
    this.masterVolume = 1.0;
    this.currentTime = 0.0;
    this.isPlaying = false;
    this.timeUpdateCallbacks = [];
    this.timeTrackingInterval = null;
  }

  /**
   * Add an audio track
   * @param {Object} trackConfig - Track configuration
   * @returns {string} Track ID
   */
  addTrack(trackConfig: AudioTrack): string {
    const howl = new Howl({
      src: [trackConfig.path],
      loop: trackConfig.loop,
      volume: trackConfig.volume * this.masterVolume,
      onload: () => {
        console.log(`Audio track ${trackConfig.id} loaded`);
      },
      onloaderror: (_id: number, error: any) => {
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
  removeTrack(trackId: string): void {
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
  updateTrack(trackId: string, updates: Partial<AudioTrack>): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.config = { ...track.config, ...updates };
      
      if (updates.volume !== undefined) {
        track.howl.volume(updates.volume * this.masterVolume);
      }
      
      if (updates.loop !== undefined) {
        track.howl.loop(updates.loop);
      }
    }
  }

  /**
   * Set master volume
   * @param {number} volume - Volume level (0.0 - 1.0)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    this.tracks.forEach(track => {
      track.howl.volume(track.config.volume * this.masterVolume);
    });
  }

  /**
   * Play audio synchronized with timeline
   * @param {number} time - Current timeline time in seconds
   */
  play(time: number = 0): void {
    this.currentTime = time;
    this.isPlaying = true;

    this.tracks.forEach((track) => {
      if (!track.config.enabled) return;

      const trackStartTime = track.config.startTime;
      const trackEndTime = track.config.duration 
        ? trackStartTime + track.config.duration 
        : Infinity;

      if (time >= trackStartTime && time < trackEndTime) {
        const seekTime = time - trackStartTime;
        
        if (seekTime < track.config.fadeIn && track.config.fadeIn > 0) {
          const fadeVolume = (seekTime / track.config.fadeIn) * track.config.volume;
          track.howl.volume(fadeVolume * this.masterVolume);
        }

        track.howl.seek(seekTime);
        track.howl.play();
        track.state.playing = true;
      }
    });

    this.startTimeTracking();
  }

  /**
   * Pause all audio
   */
  pause(): void {
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
  stop(): void {
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
  seek(time: number): void {
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
  private startTimeTracking(): void {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
    }

    this.timeTrackingInterval = setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 0.1;
        
        this.timeUpdateCallbacks.forEach(callback => {
          callback(this.currentTime);
        });

        this.updatePlayingTracks();
      }
    }, 100);
  }

  /**
   * Stop time tracking
   */
  private stopTimeTracking(): void {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
      this.timeTrackingInterval = null;
    }
  }

  /**
   * Update which tracks should be playing based on current time
   */
  private updatePlayingTracks(): void {
    this.tracks.forEach(track => {
      if (!track.config.enabled) return;

      const trackStartTime = track.config.startTime;
      const trackEndTime = track.config.duration 
        ? trackStartTime + track.config.duration 
        : Infinity;

      const shouldBePlaying = this.currentTime >= trackStartTime && this.currentTime < trackEndTime;

      if (shouldBePlaying && !track.state.playing) {
        const seekTime = this.currentTime - trackStartTime;
        track.howl.seek(seekTime);
        track.howl.play();
        track.state.playing = true;
      } else if (!shouldBePlaying && track.state.playing) {
        track.howl.stop();
        track.state.playing = false;
      }

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
  onTimeUpdate(callback: TimeUpdateCallback): void {
    this.timeUpdateCallbacks.push(callback);
  }

  /**
   * Remove time update callback
   * @param {Function} callback - Callback function
   */
  offTimeUpdate(callback: TimeUpdateCallback): void {
    this.timeUpdateCallbacks = this.timeUpdateCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Get all tracks
   * @returns {Array} Array of track configurations
   */
  getTracks(): AudioTrack[] {
    return Array.from(this.tracks.values()).map(track => track.config);
  }

  /**
   * Get tracks by type
   * @param {string} type - Track type
   * @returns {Array} Array of track configurations
   */
  getTracksByType(type: AudioTrackTypeValue): AudioTrack[] {
    return this.getTracks().filter(track => track.type === type);
  }

  /**
   * Cleanup and unload all audio
   */
  dispose(): void {
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
 * Background music only - other audio (narration, sound effects) should be at layer level
 * @param {Object} options - Audio options
 * @returns {Object} Audio configuration
 */
export const createSceneAudioConfig = (options: { backgroundMusic?: AudioTrack | null } = {}): SceneAudioConfig => {
  return {
    backgroundMusic: options.backgroundMusic || null,
  };
};

/**
 * Create audio configuration for a layer
 * Layers can have narration, sound effects, typewriter sounds, etc.
 * @param {Object} options - Audio options
 * @returns {Object} Audio configuration
 */
export const createLayerAudioConfig = (options: Partial<LayerAudioConfig> = {}): LayerAudioConfig => {
  return {
    narration: options.narration || null,
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
export const parseAudioConfig = (audioConfig: AudioConfigJSON): AudioTrack[] => {
  const tracks: AudioTrack[] = [];

  if (audioConfig.background_music) {
    const bg = audioConfig.background_music;
    tracks.push(createAudioTrack(
      AudioTrackType.BACKGROUND_MUSIC,
      bg.path || bg.file || '',
      {
        volume: bg.volume ?? 0.5,
        loop: bg.loop ?? true,
        fadeIn: bg.fade_in ?? 0.0,
        fadeOut: bg.fade_out ?? 0.0,
        startTime: 0.0,
      }
    ));
  }

  if (audioConfig.voice_overs || audioConfig.narration) {
    const narrations = audioConfig.voice_overs || audioConfig.narration || [];
    narrations.forEach(narration => {
      tracks.push(createAudioTrack(
        AudioTrackType.NARRATION,
        narration.path || narration.file || '',
        {
          volume: narration.volume ?? 1.0,
          startTime: narration.start_time ?? 0.0,
          duration: narration.duration,
        }
      ));
    });
  }

  if (audioConfig.sound_effects || audioConfig.effects) {
    const effects = audioConfig.sound_effects || audioConfig.effects || [];
    effects.forEach(effect => {
      tracks.push(createAudioTrack(
        AudioTrackType.SOUND_EFFECT,
        effect.path || effect.file || '',
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
  createLayerAudioConfig,
  parseAudioConfig,
};
