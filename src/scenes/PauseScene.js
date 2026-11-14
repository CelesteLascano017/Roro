import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../data/gameConfig.js';
import { AudioManager } from '../managers/AudioManager.js';
import { Button, ButtonList } from '../ui/Button.js';
import { TEXT_STYLES, textStyle } from '../ui/textStyles.js';

/**
 * Pause menu shown over the paused ApartmentScene (which stops updating,
 * including physics, timers and the detective FSM).
 */
export class PauseScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.PAUSE);
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0, 0);
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 360, 400, COLORS.panel, 0.97).setStrokeStyle(3, COLORS.panelBorder);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 160, 'PAUSED', TEXT_STYLES.heading).setOrigin(0.5);

        const centerX = GAME_WIDTH / 2;
        let y = GAME_HEIGHT / 2 - 100;
        const step = 48;
        this.soundButton = new Button(this, centerX, y + step * 3, '', () => {
            AudioManager.toggleMute();
            this.refreshAudioLabels();
        });
        this.volumeButton = new Button(this, centerX, y + step * 4, '', () => {
            // Cycles the master volume of music and effects: 100% -> 75% -> 50% -> 25%.
            const levels = [1, 0.75, 0.5, 0.25];
            const current = AudioManager.getSettings().sfxVolume;
            const next = levels[(levels.findIndex((level) => Math.abs(level - current) < 0.01) + 1) % levels.length] ?? 1;
            AudioManager.setSfxVolume(next);
            AudioManager.setMusicVolume(next * 0.6);
            this.refreshAudioLabels();
        });

        const buttons = [
            new Button(this, centerX, y, 'Resume', () => this.resumeGame()),
            new Button(this, centerX, y + step, 'Restart', () => this.restartGame()),
            new Button(this, centerX, y + step * 2, 'Main menu', () => this.goToMenu()),
            this.soundButton,
            this.volumeButton
        ];
        y += step * 5;
        this.add.text(centerX, y + 6, 'ESC: resume', textStyle({ color: COLORS.textMuted })).setOrigin(0.5);

        new ButtonList(this, buttons);
        this.refreshAudioLabels();
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }

    refreshAudioLabels() {
        const settings = AudioManager.getSettings();
        this.soundButton.setText(settings.muted ? 'Sound: OFF' : 'Sound: ON');
        this.volumeButton.setText(`Volume: ${Math.round(settings.sfxVolume * 100)}%`);
    }

    resumeGame() {
        this.scene.resume(SCENE_KEYS.APARTMENT);
        this.scene.stop();
    }

    restartGame() {
        // Restarting the paused scene re-creates the apartment from scratch.
        this.scene.stop(SCENE_KEYS.APARTMENT);
        this.scene.start(SCENE_KEYS.APARTMENT);
    }

    goToMenu() {
        this.scene.stop(SCENE_KEYS.APARTMENT);
        this.scene.start(SCENE_KEYS.MAIN_MENU);
    }
}
