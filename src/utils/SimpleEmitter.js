/**
 * Minimal event emitter used by the pure logic modules (evidence, inspection,
 * detective state machine). Keeping these modules free of Phaser imports lets
 * them run in Node for automated tests (scripts/verify-logic.mjs).
 */
export class SimpleEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
        return this;
    }

    off(eventName, callback) {
        this.listeners.get(eventName)?.delete(callback);
        return this;
    }

    emit(eventName, payload) {
        const callbacks = this.listeners.get(eventName);
        if (!callbacks) {
            return;
        }
        for (const callback of [...callbacks]) {
            callback(payload);
        }
    }

    removeAllListeners() {
        this.listeners.clear();
    }
}
