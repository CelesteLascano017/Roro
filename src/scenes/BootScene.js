import Phaser from 'phaser';
import { SCENE_KEYS } from '../data/gameConfig.js';

/**
 * First scene. Nothing needs to be loaded before the progress bar can be
 * drawn, so it immediately hands over to the PreloadScene.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.BOOT);
    }

    create() {
        this.scene.start(SCENE_KEYS.PRELOAD);
    }
}
