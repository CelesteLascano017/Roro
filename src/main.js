import Phaser from 'phaser';
import './style.css';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 540,
    backgroundColor: '#1b1b24',
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        create() {
            this.add.text(480, 270, 'RORO', {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
};

new Phaser.Game(config);