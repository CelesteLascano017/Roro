import Phaser from 'phaser';
import { COLORS } from '../data/gameConfig.js';
import { AudioManager } from '../managers/AudioManager.js';
import { textStyle } from './textStyles.js';

/**
 * Small "Sound: ON / OFF" toggle shown in menus and the HUD. Also toggled
 * with the M key. Stays in sync with AudioManager settings.
 */
export class MuteButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, { fixed = false } = {}) {
        super(scene, x, y);
        this.ownerScene = scene;
        this.background = scene.add.rectangle(0, 0, 112, 28, COLORS.panel, 0.9).setStrokeStyle(2, COLORS.panelBorder);
        this.label = scene.add.text(0, 0, '', textStyle()).setOrigin(0.5);
        this.add([this.background, this.label]);
        this.setSize(112, 28);
        if (fixed) {
            // Children need the scroll factor too, otherwise their input hit
            // areas move with the camera.
            this.setScrollFactor(0, 0, true);
        }

        this.background.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
            event?.stopPropagation();
            AudioManager.toggleMute();
        });

        this.unsubscribe = AudioManager.onChange(() => this.refresh());
        this.onKey = () => AudioManager.toggleMute();
        scene.input.keyboard.on('keydown-M', this.onKey);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());

        this.refresh();
        scene.add.existing(this);
    }

    refresh() {
        const muted = AudioManager.isMuted();
        this.label.setText(muted ? 'Sound: OFF' : 'Sound: ON');
        this.label.setColor(muted ? COLORS.textMuted : COLORS.text);
    }

    cleanup() {
        this.unsubscribe?.();
        this.ownerScene.input.keyboard?.off('keydown-M', this.onKey);
    }
}
