import { AUDIO_ASSETS, AUDIO_TYPE } from '../data/assetManifest.js';
import { SaveManager } from './SaveManager.js';

const AUDIO_TYPES_BY_KEY = new Map(AUDIO_ASSETS.map((asset) => [asset.key, asset.type]));

/**
 * Central audio service, independent from gameplay logic.
 *
 * - Uses the game-wide Phaser sound manager, so music survives scene changes.
 * - Every play request first checks that the file was actually loaded. Audio
 *   files may be unavailable; missing sounds are skipped silently, so the
 *   game runs without errors and the real files can be dropped in later at
 *   the paths declared in assetManifest.js.
 * - Settings (mute, volumes) are persisted through SaveManager.
 */
class AudioManagerClass {
    constructor() {
        this.game = null;
        this.settings = SaveManager.getAudioSettings();
        this.currentMusicKey = null;
        this.currentMusic = null;
        this.warnedKeys = new Set();
        this.listeners = new Set();
    }

    init(game) {
        this.game = game;
        this.applyMute();
    }

    isAvailable(key) {
        const available = Boolean(this.game?.cache.audio.exists(key));
        if (!available && !this.warnedKeys.has(key)) {
            this.warnedKeys.add(key);
            console.info(`[AudioManager] "${key}" is not loaded; playback skipped.`);
        }
        return available;
    }

    // ------------------------------------------------------------------ music

    playMusic(key, { loop = true } = {}) {
        if (this.currentMusicKey === key && this.currentMusic?.isPlaying) {
            return;
        }
        this.stopMusic();
        this.currentMusicKey = key;
        if (!this.isAvailable(key)) {
            return;
        }
        try {
            this.currentMusic = this.game.sound.add(key, {
                loop,
                volume: this.settings.musicVolume,
                rate: key === 'music-rest' ? 0.75 : 1
            });
            this.currentMusic.play();
        } catch (error) {
            console.warn(`[AudioManager] Could not play music "${key}".`, error);
            this.currentMusic = null;
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
        }
        this.currentMusic = null;
        this.currentMusicKey = null;
    }

    // --------------------------------------------------------------- effects

    /**
     * Plays a one-shot sound effect.
     * @param {string} key
     * @param {object} [options]
     * @param {number} [options.volume] 0..1 multiplier of the SFX volume
     * @param {number} [options.pan] -1 (left) .. 1 (right), WebAudio only
     * @param {number} [options.detune]
     */
    playSfx(key, { volume = 1, pan = 0, detune = 0 } = {}) {
        if (this.settings.muted || !this.isAvailable(key)) {
            return;
        }
        try {
            // `pan` is honoured by the WebAudio sound manager and ignored by HTML5 audio.
            this.game.sound.play(key, {
                volume: Math.max(0, Math.min(1, volume * this.settings.sfxVolume)),
                detune,
                pan: Math.max(-1, Math.min(1, pan))
            });
        } catch (error) {
            console.warn(`[AudioManager] Could not play "${key}".`, error);
        }
    }

    /**
     * Plays a footstep heard from `listener`. Volume falls off with distance
     * and the sound is panned left/right, so the player can locate the
     * detective by ear in Normal and Hard modes.
     */
    playPositionalSfx(key, source, listener, hearingDistance) {
        const dx = source.x - listener.x;
        const distance = Math.hypot(dx, source.y - listener.y);
        if (hearingDistance <= 0 || distance >= hearingDistance) {
            return;
        }
        const volume = 1 - distance / hearingDistance;
        this.playSfx(key, { volume, pan: dx / (hearingDistance * 0.6), detune: (Math.random() - 0.5) * 100 });
    }

    // -------------------------------------------------------------- settings

    getSettings() {
        return { ...this.settings };
    }

    isMuted() {
        return this.settings.muted;
    }

    setMuted(muted) {
        this.settings.muted = muted;
        this.applyMute();
        this.persist();
    }

    toggleMute() {
        this.setMuted(!this.settings.muted);
        return this.settings.muted;
    }

    /** One control for effects and music; retain the softer music balance. */
    setVolume(volume) {
        const level = Math.max(0, Math.min(1, volume));
        this.settings.sfxVolume = level;
        this.settings.musicVolume = level * 0.6;
        this.currentMusic?.setVolume(this.settings.musicVolume);
        this.persist();
    }

    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic && 'setVolume' in this.currentMusic) {
            this.currentMusic.setVolume(this.settings.musicVolume);
        }
        this.persist();
    }

    setSfxVolume(volume) {
        this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
        this.persist();
    }

    applyMute() {
        if (this.game) {
            this.game.sound.mute = this.settings.muted;
        }
    }

    persist() {
        SaveManager.setAudioSettings(this.settings);
        this.listeners.forEach((listener) => listener(this.getSettings()));
    }

    /** Subscribe to settings changes (used by mute buttons). Returns an unsubscribe function. */
    onChange(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    getType(key) {
        return AUDIO_TYPES_BY_KEY.get(key) ?? AUDIO_TYPE.SFX;
    }
}

export const AudioManager = new AudioManagerClass();
