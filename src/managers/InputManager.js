import Phaser from 'phaser';

/**
 * Gameplay input for one scene. Combines the keyboard (WASD / arrows, E,
 * ESC) with the optional on-screen touch controls into a single interface,
 * so Roro does not need to know where the input comes from.
 */
export class InputManager {
    constructor(scene) {
        this.scene = scene;
        const keyboard = scene.input.keyboard;
        const codes = Phaser.Input.Keyboard.KeyCodes;
        this.keys = keyboard.addKeys({
            up: codes.W,
            down: codes.S,
            left: codes.A,
            right: codes.D,
            upArrow: codes.UP,
            downArrow: codes.DOWN,
            leftArrow: codes.LEFT,
            rightArrow: codes.RIGHT,
            interact: codes.E,
            pause: codes.ESC
        });
        // Touch state is written by TouchControls.
        this.touch = { up: false, down: false, left: false, right: false };
        this.touchInteractQueued = false;
        this.touchPauseQueued = false;
        this.enabled = true;
        this.vector = { x: 0, y: 0 };
    }

    /** Normalised movement vector: diagonal movement is not faster. */
    getMovementVector() {
        if (!this.enabled) {
            this.vector.x = 0;
            this.vector.y = 0;
            return this.vector;
        }
        const k = this.keys;
        const x = (k.right.isDown || k.rightArrow.isDown || this.touch.right ? 1 : 0) -
            (k.left.isDown || k.leftArrow.isDown || this.touch.left ? 1 : 0);
        const y = (k.down.isDown || k.downArrow.isDown || this.touch.down ? 1 : 0) -
            (k.up.isDown || k.upArrow.isDown || this.touch.up ? 1 : 0);
        const length = Math.hypot(x, y) || 1;
        this.vector.x = x / length;
        this.vector.y = y / length;
        return this.vector;
    }

    /** True once per press of E (or the touch interact button). */
    consumeInteract() {
        const pressed = Phaser.Input.Keyboard.JustDown(this.keys.interact) || this.touchInteractQueued;
        this.touchInteractQueued = false;
        return this.enabled && pressed;
    }

    consumePause() {
        const pressed = Phaser.Input.Keyboard.JustDown(this.keys.pause) || this.touchPauseQueued;
        this.touchPauseQueued = false;
        return pressed;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /** Clears held keys, e.g. when returning from a pause or dialogue. */
    reset() {
        Object.values(this.keys).forEach((key) => key.reset());
        this.touch.up = this.touch.down = this.touch.left = this.touch.right = false;
        this.touchInteractQueued = false;
        this.touchPauseQueued = false;
    }
}
