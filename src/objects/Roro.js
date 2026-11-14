import { PLAYER_CONFIG } from '../data/gameConfig.js';
import { Character } from './Character.js';

/**
 * The player character. Movement comes from the InputManager (keyboard or
 * touch), is normalised so diagonals are not faster, and is resolved by
 * Arcade Physics against walls, furniture and closed doors.
 */
export class Roro extends Character {
    constructor(scene, footPosition, controls) {
        super(scene, footPosition, 'roro', PLAYER_CONFIG);
        this.controls = controls;
        this.controlsEnabled = true;
        this.carryIcon = scene.add.image(0, 0, '__DEFAULT').setOrigin(0.5, 1).setVisible(false);
    }

    setControlsEnabled(enabled) {
        this.controlsEnabled = enabled;
        if (!enabled) {
            this.body.setVelocity(0, 0);
            this.updateAnimation(0, 0);
        }
    }

    /** Shows the carried evidence above Roro's head (null hides it). */
    setCarriedTexture(textureKey) {
        if (!textureKey) {
            this.carryIcon.setVisible(false);
            return;
        }
        this.carryIcon.setTexture(textureKey).setVisible(true);
        // Large objects are shown smaller above the head.
        const scale = Math.min(1, 20 / this.carryIcon.height, 30 / this.carryIcon.width);
        this.carryIcon.setScale(scale);
    }

    update(delta) {
        if (this.controlsEnabled) {
            const direction = this.controls.getMovementVector();
            this.body.setVelocity(direction.x * PLAYER_CONFIG.speed, direction.y * PLAYER_CONFIG.speed);
            this.updateAnimation(direction.x * PLAYER_CONFIG.speed, direction.y * PLAYER_CONFIG.speed);
        } else {
            this.body.setVelocity(0, 0);
            this.updateAnimation(0, 0);
        }
        this.updateFootsteps(delta);
        this.carryIcon.setPosition(Math.round(this.x), Math.round(this.y - this.height - 2));
        this.carryIcon.setDepth(this.depth + 1);
    }

    destroy(fromScene) {
        this.carryIcon?.destroy();
        super.destroy(fromScene);
    }
}
