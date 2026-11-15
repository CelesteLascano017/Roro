import { t } from '../managers/LanguageManager.js';
import { COLORS, DEPTH } from '../data/gameConfig.js';
import { EVIDENCE_STATE } from '../data/evidenceData.js';
import { InteractiveObject } from './InteractiveObject.js';

/**
 * Visual and interactive representation of one evidence object lying in the
 * apartment. Its state is owned by EvidenceManager; this class only shows or
 * hides the sprite and forwards interactions.
 *
 * The victim's note is readable: the first interaction opens the note
 * interface, the next one picks it up.
 */
export class EvidenceItem extends InteractiveObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {object} record evidence record from EvidenceManager
     * @param {{x:number,y:number}} position world position (centre)
     */
    constructor(scene, record, position) {
        super({ id: record.id, position });
        this.record = record;
        this.definition = record.definition;
        // Objects lie on the floor: the sprite's bottom sits slightly below the centre.
        this.sprite = scene.add.image(Math.round(position.x), Math.round(position.y + 6), this.definition.textureKey)
            .setOrigin(0.5, 1)
            .setDepth(DEPTH.worldBase + position.y);
        this.shadow = scene.add.ellipse(Math.round(position.x), Math.round(position.y + 6), Math.max(10, this.sprite.width * 0.8), 5, 0x000000, 0.25)
            .setDepth(DEPTH.rugs + 1);
    }

    isAvailable() {
        return this.record.state === EVIDENCE_STATE.NOT_FOUND;
    }

    needsReading() {
        return this.definition.readable && !this.record.hasBeenRead;
    }

    canInteract({ evidence }) {
        return this.needsReading() || evidence.getCarriedItem() === null;
    }

    getPrompt({ evidence }) {
        if (this.needsReading()) {
            return t('Read the note');
        }
        if (evidence.getCarriedItem()) {
            return t("Your hands are full ({name})", { name: t(this.definition.name) });
        }
        return t("Pick up the {name}", { name: t(this.definition.name) });
    }

    interact(context) {
        if (this.needsReading()) {
            context.openNote(this);
            return;
        }
        const result = context.evidence.pickUp(this.id);
        context.onEvidenceAction?.(result, this);
    }

    /** Called when the evidence state changes. */
    syncVisibility() {
        const visible = this.record.state === EVIDENCE_STATE.NOT_FOUND;
        this.sprite.setVisible(visible);
        this.shadow.setVisible(visible);
    }

    setFocused(focused) {
        super.setFocused(focused);
        if (focused) {
            this.sprite.setTint(COLORS.focusTint);
        } else {
            this.sprite.clearTint();
        }
    }
}
