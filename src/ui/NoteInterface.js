import { t } from '../managers/LanguageManager.js';
import Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../data/gameConfig.js';
import { NOTE_CONTENT } from '../data/evidenceData.js';
import { formatStoryText } from '../data/dialogueData.js';
import { textStyle } from './textStyles.js';

/**
 * Enlarged view of the victim's note: the paper graphic with the victim's
 * name written on it. The name comes from STORY.victimFullName and the text
 * from NOTE_CONTENT, nothing is hardcoded here.
 *
 * While open, the scene suspends gameplay (see ApartmentScene.openNote).
 * Closes with E, ESC, Space, Enter or a click/tap.
 */
export class NoteInterface {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.onClose = null;

        const ink = '#4a2f1e';
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        this.dim = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.72).setOrigin(0, 0);
        this.paper = scene.add.image(centerX, centerY - 6, 'ui-note-paper');
        // Fit the paper to the screen using an integer-friendly scale.
        const scale = Math.min(1, (GAME_HEIGHT - 70) / this.paper.height);
        this.paper.setScale(scale);

        const top = this.paper.y - this.paper.displayHeight / 2;
        this.heading = scene.add.text(centerX, top + 70, t(NOTE_CONTENT.heading), textStyle({ color: ink, fontSize: '32px' })).setOrigin(0.5);
        this.label = scene.add.text(centerX, top + 130, t(NOTE_CONTENT.body), textStyle({ color: ink })).setOrigin(0.5);
        this.name = scene.add.text(centerX, top + 172, '', textStyle({
            color: '#7a1f1f',
            fontSize: '32px',
            align: 'center',
            wordWrap: { width: this.paper.displayWidth - 70 }
        })).setOrigin(0.5);
        this.footer = scene.add.text(centerX, top + this.paper.displayHeight - 90, t(NOTE_CONTENT.footer), textStyle({
            color: ink,
            align: 'center',
            wordWrap: { width: this.paper.displayWidth - 70 }
        })).setOrigin(0.5);
        this.closeHint = scene.add.text(centerX, GAME_HEIGHT - 16, t('Press E or click to put the note down'), textStyle({ color: '#d8cfc0' })).setOrigin(0.5, 1);

        this.container = scene.add.container(0, 0, [this.dim, this.paper, this.heading, this.label, this.name, this.footer, this.closeHint])
            .setScrollFactor(0, 0, true)
            .setDepth(DEPTH.modal)
            .setVisible(false);

        this.dim.setInteractive().on('pointerdown', () => this.close());
        this.keys = scene.input.keyboard.addKeys('E,ESC,SPACE,ENTER');
    }

    open(onClose) {
        this.onClose = onClose;
        this.name.setText(formatStoryText(NOTE_CONTENT.nameTemplate));
        this.container.setVisible(true).setAlpha(0);
        this.scene.tweens.add({ targets: this.container, alpha: 1, duration: 200 });
        this.isOpen = true;
        // Ignore the E press that opened the note.
        Object.values(this.keys).forEach((key) => key.reset());
    }

    /** Polled by the scene while the note is open. */
    update() {
        if (!this.isOpen) {
            return;
        }
        if (Object.values(this.keys).some((key) => Phaser.Input.Keyboard.JustDown(key))) {
            this.close();
        }
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.container.setVisible(false);
        const callback = this.onClose;
        this.onClose = null;
        callback?.();
    }
}
