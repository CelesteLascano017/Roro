import { DISTRACTION_CONFIG } from '../data/gameConfig.js';
import { InteractiveObject } from './InteractiveObject.js';

export const DISTRACTION_STATE = Object.freeze({
    READY: 'ready',
    ARMED: 'armed',
    COOLDOWN: 'cooldown'
});

/**
 * An object that makes a noise to redirect the detective (e.g. the kettle).
 *
 * READY --E--> ARMED --triggerDelay--> noise (detective notified) --> COOLDOWN --cooldown--> READY
 *
 * Timers advance in `update(delta)` so they stop while the game is paused.
 */
export class DistractionSource extends InteractiveObject {
    /**
     * @param {object} definition entry of DISTRACTIONS (apartmentData.js)
     * @param {{position:{x,y}, investigatePosition:{x,y}}} world positions in pixels
     * @param {(source: DistractionSource) => void} onNoise
     */
    constructor(definition, { position, investigatePosition }, onNoise) {
        super({ id: definition.id, position });
        this.definition = definition;
        this.name = definition.name;
        this.room = definition.room;
        this.investigatePosition = investigatePosition;
        this.onNoise = onNoise;
        this.state = DISTRACTION_STATE.READY;
        this.timer = 0;
        this.highlightTarget = null;
    }

    isAvailable() {
        return true;
    }

    canInteract() {
        return this.state === DISTRACTION_STATE.READY;
    }

    getPrompt() {
        switch (this.state) {
            case DISTRACTION_STATE.READY:
                return this.definition.prompt;
            case DISTRACTION_STATE.ARMED:
                return `The ${this.name} is heating up...`;
            default:
                return `The ${this.name} is still hot (wait ${Math.ceil(this.timer / 1000)}s)`;
        }
    }

    interact() {
        if (this.state !== DISTRACTION_STATE.READY) {
            return;
        }
        this.state = DISTRACTION_STATE.ARMED;
        this.timer = DISTRACTION_CONFIG.triggerDelay;
    }

    update(delta) {
        if (this.state === DISTRACTION_STATE.READY) {
            return;
        }
        this.timer -= delta;
        if (this.timer > 0) {
            return;
        }
        if (this.state === DISTRACTION_STATE.ARMED) {
            this.state = DISTRACTION_STATE.COOLDOWN;
            this.timer = DISTRACTION_CONFIG.cooldown;
            this.onNoise(this);
        } else {
            this.state = DISTRACTION_STATE.READY;
        }
    }

    setFocused(focused) {
        super.setFocused(focused);
        if (this.highlightTarget) {
            if (focused) {
                this.highlightTarget.setTint(0xfff2a8);
            } else {
                this.highlightTarget.clearTint();
            }
        }
    }
}
