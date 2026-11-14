import { PLAYER_CONFIG } from '../data/gameConfig.js';

/**
 * Finds the interactive object Roro can use and triggers it.
 *
 * Every frame:
 * 1. Collect available objects whose interaction point is within range.
 * 2. Keep only the closest one (Roro never interacts with two at once).
 * 3. Show its prompt; pressing E calls its `interact` method.
 */
export class InteractionManager {
    /**
     * @param {object} context services passed to interactive objects
     * @param {import('../ui/InteractionPrompt.js').InteractionPrompt} prompt
     */
    constructor(context, prompt) {
        this.context = context;
        this.prompt = prompt;
        this.objects = [];
        this.focused = null;
    }

    register(object) {
        this.objects.push(object);
        return object;
    }

    findClosest(position) {
        let closest = null;
        let closestDistance = Infinity;
        for (const object of this.objects) {
            if (!object.isAvailable(this.context)) {
                continue;
            }
            const range = object.range ?? PLAYER_CONFIG.interactionRange;
            const distance = Math.hypot(object.position.x - position.x, object.position.y - position.y);
            if (distance <= range && distance < closestDistance) {
                closest = object;
                closestDistance = distance;
            }
        }
        return closest;
    }

    update(playerPosition, interactPressed) {
        const target = this.findClosest(playerPosition);

        if (target !== this.focused) {
            this.focused?.setFocused(false);
            target?.setFocused(true);
            this.focused = target;
        }

        if (!target) {
            this.prompt.hide();
            return;
        }

        const enabled = target.canInteract(this.context);
        this.prompt.show(target.getPrompt(this.context), target.position, enabled);

        if (interactPressed && enabled) {
            target.interact(this.context);
        }
    }

    clearFocus() {
        this.focused?.setFocused(false);
        this.focused = null;
        this.prompt.hide();
    }
}
