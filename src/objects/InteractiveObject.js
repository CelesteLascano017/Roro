/**
 * Base class for everything Roro can interact with using E.
 *
 * Subclasses override `isAvailable`, `getPrompt` and `interact`. The
 * InteractionManager selects the closest available object within range and
 * calls these methods, so evidence, hiding places, doors, the note and
 * distractions all share one interaction flow.
 *
 * The `context` argument passed to every method gives access to the game
 * services (evidence manager, UI, audio...) without hard dependencies.
 *
 * No Phaser import: visuals are attached through `onFocusChange`.
 */
export class InteractiveObject {
    /**
     * @param {object} config
     * @param {string} config.id
     * @param {{x:number,y:number}} config.position interaction point (world px)
     * @param {number} [config.range] override of the default interaction range
     */
    constructor({ id, position, range = null }) {
        this.id = id;
        this.position = position;
        this.range = range;
        this.focused = false;
        this.onFocusChange = null;
    }

    /** Whether the object currently accepts interaction. */
    // eslint-disable-next-line no-unused-vars
    isAvailable(context) {
        return true;
    }

    /** Text displayed in the interaction prompt. */
    // eslint-disable-next-line no-unused-vars
    getPrompt(context) {
        return 'Interact';
    }

    /**
     * Whether pressing E does something right now. A prompt can be shown for
     * information ("Your hands are full") while the action is disabled.
     */
    // eslint-disable-next-line no-unused-vars
    canInteract(context) {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    interact(context) {}

    setFocused(focused) {
        if (this.focused === focused) {
            return;
        }
        this.focused = focused;
        this.onFocusChange?.(focused);
    }
}
