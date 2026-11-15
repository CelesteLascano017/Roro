import Phaser from 'phaser';
import './style.css';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './data/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { DifficultyScene } from './scenes/DifficultyScene.js';
import { IntroductionScene } from './scenes/IntroductionScene.js';
import { ApartmentScene } from './scenes/ApartmentScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { DefeatScene } from './scenes/DefeatScene.js';


const debugPhysics = new URLSearchParams(window.location.search).has('debug');

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLORS.backgroundCss,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: debugPhysics
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        keyboard: true,
        // Para varios toques simultáneos en los controles en pantalla.
        activePointers: 3
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        DifficultyScene,
        IntroductionScene,
        ApartmentScene,
        DialogueScene,
        PauseScene,
        VictoryScene,
        DefeatScene
    ]
};

const game = new Phaser.Game(config);

// Disponible solo en desarrollo, para inspeccionar el juego desde la consola del navegador.
if (import.meta.env.DEV) {
    window.__RORO__ = game;
}
