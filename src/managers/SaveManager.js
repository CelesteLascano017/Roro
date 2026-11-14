import { AUDIO_DEFAULTS, DEFAULT_DIFFICULTY, DIFFICULTY, STORAGE_KEY } from '../data/gameConfig.js';

/**
 * localStorage persistence.
 *
 * Only long-lived data is stored: high scores, the level reached, the last
 * difficulty and the audio settings. The state of a game in progress is
 * never saved, so a restart always begins from a clean apartment.
 *
 * Every access is wrapped in try/catch: storage can be unavailable (private
 * mode, blocked cookies) and the game must still work without it.
 */
function createDefaultData() {
    return {
        version: 1,
        highScore: 0,
        highScoreByDifficulty: { [DIFFICULTY.EASY]: 0, [DIFFICULTY.NORMAL]: 0, [DIFFICULTY.HARD]: 0 },
        // The game has a single level. 1 = apartment unlocked, 2 = apartment completed.
        levelReached: 1,
        gamesPlayed: 0,
        gamesWon: 0,
        lastDifficulty: DEFAULT_DIFFICULTY,
        audio: { ...AUDIO_DEFAULTS }
    };
}

class SaveManagerClass {
    constructor() {
        this.data = this.load();
    }

    load() {
        const defaults = createDefaultData();
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return defaults;
            }
            const parsed = JSON.parse(raw);
            return {
                ...defaults,
                ...parsed,
                highScoreByDifficulty: { ...defaults.highScoreByDifficulty, ...(parsed.highScoreByDifficulty ?? {}) },
                audio: { ...defaults.audio, ...(parsed.audio ?? {}) }
            };
        } catch (error) {
            console.warn('[SaveManager] Could not read saved data, using defaults.', error);
            return defaults;
        }
    }

    save() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (error) {
            console.warn('[SaveManager] Could not write saved data.', error);
        }
    }

    getHighScore(difficulty = null) {
        return difficulty ? this.data.highScoreByDifficulty[difficulty] ?? 0 : this.data.highScore;
    }

    getLevelReached() {
        return this.data.levelReached;
    }

    getStats() {
        return { gamesPlayed: this.data.gamesPlayed, gamesWon: this.data.gamesWon };
    }

    getLastDifficulty() {
        return Object.values(DIFFICULTY).includes(this.data.lastDifficulty) ? this.data.lastDifficulty : DEFAULT_DIFFICULTY;
    }

    setLastDifficulty(difficulty) {
        this.data.lastDifficulty = difficulty;
        this.save();
    }

    /**
     * Records a finished game. High scores only count games won, because a
     * score is only meaningful if the detective left without catching Roro.
     * @returns {{ newHighScore: boolean }}
     */
    recordResult({ score, difficulty, won }) {
        this.data.gamesPlayed += 1;
        let newHighScore = false;
        if (won) {
            this.data.gamesWon += 1;
            this.data.levelReached = Math.max(this.data.levelReached, 2);
            if (score > this.data.highScore) {
                this.data.highScore = score;
                newHighScore = true;
            }
            if (score > (this.data.highScoreByDifficulty[difficulty] ?? 0)) {
                this.data.highScoreByDifficulty[difficulty] = score;
            }
        }
        this.save();
        return { newHighScore };
    }

    getAudioSettings() {
        return { ...this.data.audio };
    }

    setAudioSettings(settings) {
        this.data.audio = { ...this.data.audio, ...settings };
        this.save();
    }
}

export const SaveManager = new SaveManagerClass();
