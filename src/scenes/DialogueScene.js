import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../data/gameConfig.js';
import { INTERVIEWS, SPEAKERS, formatStoryText } from '../data/dialogueData.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { TEXT_STYLES } from '../ui/textStyles.js';

/**
 * Interview screen, shown on top of the paused apartment and visually
 * separated from it. Lines come from dialogueData.js and are fixed, linear
 * and non-skippable: each line must be fully revealed before continuing,
 * and there are no choices.
 *
 * When the last line is read, the apartment scene is resumed with
 * `{ interviewCompleted: true }`.
 */
export class DialogueScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.DIALOGUE);
    }

    init(data) {
        this.interview = INTERVIEWS[data.interviewIndex] ?? INTERVIEWS[0];
        this.lineIndex = -1;
        this.finished = false;
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x07060c, 0.94).setOrigin(0, 0);
        this.add.text(GAME_WIDTH / 2, 48, this.interview.title.toUpperCase(), TEXT_STYLES.heading).setOrigin(0.5);

        // Both characters face each other above the dialogue box.
        this.add.image(GAME_WIDTH / 2 - 150, 300, SPEAKERS.roro.portraitKey).setScale(2).setOrigin(0.5, 1);
        this.add.image(GAME_WIDTH / 2 + 150, 300, SPEAKERS.detective.portraitKey).setScale(2).setOrigin(0.5, 1).setTint(0xb8c4ff);
        this.add.rectangle(GAME_WIDTH / 2, 302, 420, 4, COLORS.panelBorder);

        this.dialogueBox = new DialogueBox(this);

        const advance = () => this.advance();
        this.input.keyboard.on('keydown-E', advance);
        this.input.keyboard.on('keydown-SPACE', advance);
        this.input.keyboard.on('keydown-ENTER', advance);
        this.input.on('pointerdown', advance);

        this.cameras.main.fadeIn(250, 0, 0, 0);
        this.showNextLine();
    }

    update(time, delta) {
        this.dialogueBox.update(delta);
    }

    advance() {
        // Non-skippable: ignore input until the current line is fully shown.
        if (!this.finished && this.dialogueBox.isComplete) {
            this.showNextLine();
        }
    }

    showNextLine() {
        this.lineIndex += 1;
        if (this.lineIndex >= this.interview.lines.length) {
            this.finish();
            return;
        }
        const line = this.interview.lines[this.lineIndex];
        this.dialogueBox.showLine(SPEAKERS[line.speaker], formatStoryText(line.text));
    }

    finish() {
        this.finished = true;
        this.dialogueBox.destroy();
        this.scene.resume(SCENE_KEYS.APARTMENT, { interviewCompleted: true });
        this.scene.stop();
    }
}
