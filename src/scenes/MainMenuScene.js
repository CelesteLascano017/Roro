import Phaser from 'phaser';
import { COLORS, DIFFICULTY_SETTINGS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS, SCORE_CONFIG } from '../data/gameConfig.js';
import { AudioManager } from '../managers/AudioManager.js';
import { SaveManager } from '../managers/SaveManager.js';
import { Button, ButtonList } from '../ui/Button.js';
import { MuteButton } from '../ui/MuteButton.js';
import { TEXT_STYLES, textStyle } from '../ui/textStyles.js';
import { fadeIn, fadeToScene } from './sceneTransitions.js';

const INSTRUCTIONS = [
    'The detective is searching your apartment.',
    'Find the six pieces of evidence and hide them before he finds them.',
    '',
    'Move: WASD or arrow keys',
    'Interact (pick up, hide, read, open/close doors): E',
    'Pause: ESC        Sound on/off: M',
    '',
    'He searches in four rounds, from the most obvious places',
    'to the most hidden ones, and interviews you between rounds.',
    'A place he has already searched is safe. You can move hidden',
    'objects again. Evidence left near him will be found.',
    'Listen to his footsteps. The kettle can distract him.'
];

/** Title screen: start, instructions, sound toggle and saved records. */
export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.MAIN_MENU);
    }

    create() {
        fadeIn(this);
        AudioManager.playMusic('music-menu');
        this.cameras.main.setBackgroundColor(COLORS.backgroundCss);

        this.add.image(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 + 40, 'roro-idle-front').setScale(2);
        this.add.image(GAME_WIDTH / 2 + 250, GAME_HEIGHT / 2 + 40, 'detective-idle-side').setScale(2).setFlipX(true).setTint(0x6670a0);

        this.add.text(GAME_WIDTH / 2, 110, 'RORO', TEXT_STYLES.title).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, 172, 'Six months. Six blackouts. One knock at the door.', textStyle({ color: COLORS.textMuted })).setOrigin(0.5);

        const buttons = [
            new Button(this, GAME_WIDTH / 2, 250, 'Start', () => fadeToScene(this, SCENE_KEYS.DIFFICULTY)),
            new Button(this, GAME_WIDTH / 2, 300, 'How to play', () => this.toggleInstructions(true))
        ];
        this.menu = new ButtonList(this, buttons);

        new MuteButton(this, GAME_WIDTH - 72, 24);

        const records = Object.entries(DIFFICULTY_SETTINGS)
            .map(([key, settings]) => `${settings.label} ${SaveManager.getHighScore(key)}/${SCORE_CONFIG.MAX_SCORE}`)
            .join('   ');
        const { gamesPlayed, gamesWon } = SaveManager.getStats();
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 56, `Best scores (games won):  ${records}`, textStyle({ color: COLORS.accent })).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 32, `Visits survived: ${gamesWon} / ${gamesPlayed}`, textStyle({ color: COLORS.textMuted })).setOrigin(0.5);

        this.createInstructionsPanel();
    }

    createInstructionsPanel() {
        const panel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 680, 420, COLORS.panel, 0.98).setStrokeStyle(3, COLORS.panelBorder);
        const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 180, 'How to play', TEXT_STYLES.heading).setOrigin(0.5);
        const body = this.add.text(GAME_WIDTH / 2 - 300, GAME_HEIGHT / 2 - 140, INSTRUCTIONS.join('\n'), textStyle({ lineSpacing: 6 }));
        const close = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 186, 'Press ESC, Enter or click to close', textStyle({ color: COLORS.textMuted })).setOrigin(0.5);
        this.instructions = this.add.container(0, 0, [panel, title, body, close]).setDepth(10).setVisible(false);
        panel.setInteractive().on('pointerdown', () => this.toggleInstructions(false));
        // The key press that opened the panel must not close it again.
        const closeHandler = () => {
            if (this.instructions.visible && this.time.now - this.instructionsOpenedAt > 150) {
                this.time.delayedCall(0, () => this.toggleInstructions(false));
            }
        };
        this.input.keyboard.on('keydown-ESC', closeHandler);
        this.input.keyboard.on('keydown-ENTER', closeHandler);
    }

    toggleInstructions(visible) {
        this.instructionsOpenedAt = this.time.now;
        this.instructions.setVisible(visible);
        // Disable the menu buttons while the panel is open.
        this.menu.buttons.forEach((button) => button.setVisible(!visible));
        this.menu.enabled = !visible;
    }
}
