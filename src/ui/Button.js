import Phaser from 'phaser';
import { COLORS } from '../data/gameConfig.js';
import { AudioManager } from '../managers/AudioManager.js';
import { textStyle } from './textStyles.js';

/**
 * Pixel-style text button usable with the mouse, touch, or keyboard
 * (through ButtonList). Drawn with Phaser shapes, no image assets needed.
 */
export class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, label, onClick, { width = 260, height = 40, fontSize = '16px' } = {}) {
        super(scene, x, y);
        this.onClick = onClick;
        this.selected = false;

        this.background = scene.add.rectangle(0, 0, width, height, COLORS.panel, 1)
            .setStrokeStyle(2, COLORS.panelBorder);
        this.label = scene.add.text(0, 0, label, textStyle({ fontSize })).setOrigin(0.5);
        this.add([this.background, this.label]);
        this.setSize(width, height);

        this.background.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.emit('hover', this))
            .on('pointerdown', () => this.activate());

        scene.add.existing(this);
    }

    setText(label) {
        this.label.setText(label);
        return this;
    }

    setSelected(selected) {
        this.selected = selected;
        this.background.setFillStyle(selected ? 0x3a2f4a : COLORS.panel, 1);
        this.background.setStrokeStyle(2, selected ? COLORS.accentHex : COLORS.panelBorder);
        this.label.setColor(selected ? COLORS.accent : COLORS.text);
        return this;
    }

    activate() {
        AudioManager.playSfx('sfx-ui', { volume: 0.6 });
        this.onClick?.();
    }
}

/**
 * Vertical list of buttons with keyboard navigation (W/S or arrows, Enter
 * or Space to activate) and mouse hover selection.
 */
export class ButtonList {
    constructor(scene, buttons) {
        this.scene = scene;
        this.buttons = buttons;
        this.index = 0;
        // Set to false while an overlay (instructions...) covers the list.
        this.enabled = true;
        buttons.forEach((button, index) => button.on('hover', () => this.select(index)));
        this.select(0);

        const keyboard = scene.input.keyboard;
        this.handlers = {
            'keydown-UP': () => this.move(-1),
            'keydown-W': () => this.move(-1),
            'keydown-DOWN': () => this.move(1),
            'keydown-S': () => this.move(1),
            'keydown-ENTER': () => this.activateSelected(),
            'keydown-SPACE': () => this.activateSelected()
        };
        Object.entries(this.handlers).forEach(([event, handler]) => keyboard.on(event, handler));
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
    }

    activateSelected() {
        if (this.enabled) {
            this.buttons[this.index]?.activate();
        }
    }

    move(step) {
        if (!this.enabled) {
            return;
        }
        this.select((this.index + step + this.buttons.length) % this.buttons.length);
    }

    select(index) {
        this.index = index;
        this.buttons.forEach((button, buttonIndex) => button.setSelected(buttonIndex === index));
    }

    destroy() {
        Object.entries(this.handlers).forEach(([event, handler]) => this.scene.input.keyboard?.off(event, handler));
    }
}
