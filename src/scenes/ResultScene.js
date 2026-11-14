import Phaser from 'phaser';
import { COLORS, DIFFICULTY_SETTINGS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../data/gameConfig.js';
import { GameSession } from '../managers/GameSession.js';
import { Button, ButtonList } from '../ui/Button.js';
import { TEXT_STYLES, textStyle } from '../ui/textStyles.js';
import { fadeIn, fadeToScene } from './sceneTransitions.js';

/**
 * Shared layout of the victory and defeat screens: title, message, final
 * score, high score, and Restart / Main menu buttons.
 */
export class ResultScene extends Phaser.Scene {
    /**
     * @param {string} key scene key
     * @param {{title:string, color:string, message:(result)=>string}} presentation
     */
    constructor(key, presentation) {
        super(key);
        this.presentation = presentation;
    }

    create() {
        fadeIn(this, 500);
        const result = GameSession.lastResult ?? { score: 0, maxScore: 6, won: false, highScore: 0, difficulty: GameSession.difficulty };
        const centerX = GAME_WIDTH / 2;

        this.add.text(centerX, 90, this.presentation.title, { ...TEXT_STYLES.title, fontSize: '64px', color: this.presentation.color }).setOrigin(0.5);
        this.add.text(centerX, 160, this.presentation.message(result), textStyle({ align: 'center', lineSpacing: 6, wordWrap: { width: 700 } })).setOrigin(0.5, 0);

        this.add.text(centerX, 250, `Evidence hidden: ${result.score} / ${result.maxScore}`, TEXT_STYLES.heading).setOrigin(0.5);
        const difficultyLabel = DIFFICULTY_SETTINGS[result.difficulty]?.label ?? '';
        const highScoreText = result.newHighScore ? 'New best score!' : `Best score: ${result.highScore} / ${result.maxScore}`;
        this.add.text(centerX, 292, `${difficultyLabel}  -  ${highScoreText}`, textStyle({ color: result.newHighScore ? COLORS.accent : COLORS.textMuted })).setOrigin(0.5);

        const buttons = [
            new Button(this, centerX, 370, 'Restart', () => fadeToScene(this, SCENE_KEYS.APARTMENT)),
            new Button(this, centerX, 420, 'Main menu', () => fadeToScene(this, SCENE_KEYS.MAIN_MENU))
        ];
        new ButtonList(this, buttons);
        this.add.text(centerX, GAME_HEIGHT - 30, 'Arrows + Enter, or click', textStyle({ color: COLORS.textMuted })).setOrigin(0.5);
    }
}
