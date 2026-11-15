import { t } from '../managers/LanguageManager.js';
import { DEPTH } from '../data/gameConfig.js';
import { AudioManager } from '../managers/AudioManager.js';
import { InteractiveObject } from './InteractiveObject.js';

/**
 * A door between two rooms.
 *
 * When closed, a static Arcade body blocks both characters. Roro can open or
 * close interior doors with E; the detective opens closed doors when his path
 * reaches them. A door cannot close while a character stands in the doorway.
 * The front door additionally has a permanent barrier that keeps Roro inside.
 */
export class Door extends InteractiveObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {object} definition entry of DOORS (apartmentData.js)
     * @param {import('../world/ApartmentLayout.js').ApartmentLayout} layout
     * @param {import('../physics/CollisionManager.js').CollisionManager} collisions
     * @param {(rect:object) => boolean} isRectOccupied
     */
    constructor(scene, definition, layout, collisions, isRectOccupied) {
        const rect = layout.rectToWorld(definition.rect);
        super({
            id: definition.id,
            position: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
            // Doors are large, so the prompt is reachable from either side.
            range: Math.max(rect.width, rect.height) / 2 + 26
        });
        this.scene = scene;
        this.definition = definition;
        this.rect = rect;
        this.isOpen = definition.startsOpen;
        this.isRectOccupied = isRectOccupied;

        this.sprite = scene.add.image(rect.x, rect.y, this.isOpen ? 'door-open' : 'door-closed')
            .setOrigin(0, 0)
            .setDisplaySize(rect.width, rect.height)
            .setDepth(DEPTH.walls + 1);

        this.blocker = collisions.addDoorBlocker(rect);
        if (definition.alwaysBlocksPlayer) {
            collisions.addPlayerOnlyBlocker(rect);
        }
        this.refreshBody();
    }

    refreshBody() {
        this.blocker.body.enable = !this.isOpen;
        this.sprite.setTexture(this.isOpen ? 'door-open' : 'door-closed');
        this.sprite.setDisplaySize(this.rect.width, this.rect.height);
    }

    open(openedBy = 'roro') {
        if (this.isOpen) {
            return true;
        }
        this.isOpen = true;
        this.refreshBody();
        AudioManager.playSfx('sfx-door-open', { volume: openedBy === 'roro' ? 0.8 : 1 });
        return true;
    }

    close() {
        if (!this.isOpen) {
            return true;
        }
        if (this.isRectOccupied(this.rect)) {
            return false;
        }
        this.isOpen = false;
        this.refreshBody();
        AudioManager.playSfx('sfx-door-close');
        return true;
    }

    // ------------------------------------------------------------ interaction

    isAvailable() {
        return this.definition.playerCanUse;
    }

    canInteract() {
        return !this.isOpen || !this.isRectOccupied(this.rect);
    }

    getPrompt() {
        if (!this.isOpen) {
            return t('Open the door');
        }
        return this.isRectOccupied(this.rect) ? t('Someone is in the doorway') : t('Close the door');
    }

    interact() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open('roro');
        }
    }

    setFocused(focused) {
        super.setFocused(focused);
        if (focused) {
            this.sprite.setTint(0xfff2a8);
        } else {
            this.sprite.clearTint();
        }
    }
}
