import { SimpleEmitter } from '../utils/SimpleEmitter.js';
import { pickDistinct } from '../utils/random.js';
import { EVIDENCE_STATE } from '../data/evidenceData.js';
import { HIDING_RULES, SCORE_CONFIG } from '../data/gameConfig.js';

/**
 * Allowed evidence state transitions. Any other change is rejected, which
 * guarantees that an object can never be scored twice.
 */
const ALLOWED_TRANSITIONS = Object.freeze({
    [EVIDENCE_STATE.NOT_FOUND]: [EVIDENCE_STATE.CARRIED, EVIDENCE_STATE.DISCOVERED],
    [EVIDENCE_STATE.CARRIED]: [EVIDENCE_STATE.HIDDEN],
    [EVIDENCE_STATE.HIDDEN]: [EVIDENCE_STATE.CARRIED, EVIDENCE_STATE.DISCOVERED],
    [EVIDENCE_STATE.DISCOVERED]: []
});

export const EVIDENCE_EVENTS = Object.freeze({
    STATE_CHANGED: 'stateChanged',
    SCORE_CHANGED: 'scoreChanged'
});

/**
 * Owns the state of the six evidence objects and the score.
 *
 * The score is derived from the states (number of HIDDEN objects) instead of
 * being incremented separately, so it is always consistent: it cannot exceed
 * the number of objects and the same object cannot be counted twice.
 *
 * Pure logic (no Phaser) so it can be tested in Node.
 */
export class EvidenceManager extends SimpleEmitter {
    constructor(definitions, rules = HIDING_RULES) {
        super();
        this.rules = rules;
        this.items = new Map(definitions.map((definition) => [definition.id, {
            id: definition.id,
            definition,
            state: EVIDENCE_STATE.NOT_FOUND,
            // World position while NOT_FOUND.
            position: null,
            room: null,
            hidingSpotId: null,
            hasBeenRead: false
        }]));
        this.carriedIds = [];
    }

    /**
     * Chooses spawn points: random items get distinct points from the
     * predefined list, fixed items use their configured point.
     * @returns {Map<string, object>} evidence id -> spawn point (tile units)
     */
    static chooseSpawnPoints(definitions, randomPoints, fixedPoints, random = Math.random) {
        const randomItems = definitions.filter((definition) => definition.spawn === 'random');
        const chosen = pickDistinct(randomPoints, randomItems.length, random);
        const result = new Map();
        randomItems.forEach((definition, index) => result.set(definition.id, chosen[index]));
        for (const definition of definitions) {
            if (definition.spawn !== 'random') {
                const point = fixedPoints[definition.spawn];
                if (!point) {
                    throw new Error(`Missing fixed spawn point "${definition.spawn}" for evidence "${definition.id}".`);
                }
                result.set(definition.id, point);
            }
        }
        return result;
    }

    // ---------------------------------------------------------------- queries

    getItem(id) {
        return this.items.get(id) ?? null;
    }

    getAll() {
        return [...this.items.values()];
    }

    getCarriedItem() {
        return this.carriedIds.length > 0 ? this.items.get(this.carriedIds[0]) : null;
    }

    getScore() {
        const hidden = this.getAll().filter((item) => item.state === EVIDENCE_STATE.HIDDEN).length;
        return Math.min(hidden, SCORE_CONFIG.MAX_SCORE);
    }

    getMaxScore() {
        return Math.min(this.items.size, SCORE_CONFIG.MAX_SCORE);
    }

    countByState(state) {
        return this.getAll().filter((item) => item.state === state).length;
    }

    // -------------------------------------------------------------- mutations

    setSpawn(id, position, room) {
        const item = this.items.get(id);
        item.position = position;
        item.room = room;
    }

    markRead(id) {
        const item = this.items.get(id);
        if (item) {
            item.hasBeenRead = true;
        }
    }

    transition(item, nextState) {
        if (!ALLOWED_TRANSITIONS[item.state].includes(nextState)) {
            return false;
        }
        const previousScore = this.getScore();
        const from = item.state;
        item.state = nextState;
        this.emit(EVIDENCE_EVENTS.STATE_CHANGED, { item, from, to: nextState });
        const score = this.getScore();
        if (score !== previousScore) {
            this.emit(EVIDENCE_EVENTS.SCORE_CHANGED, { score, previousScore, item });
        }
        return true;
    }

    /** Roro picks up an object lying in the apartment. */
    pickUp(id) {
        const item = this.items.get(id);
        if (!item || item.state !== EVIDENCE_STATE.NOT_FOUND) {
            return { ok: false, reason: 'unavailable' };
        }
        if (this.carriedIds.length >= this.rules.carryLimit) {
            return { ok: false, reason: 'handsFull' };
        }
        this.carriedIds.push(id);
        item.position = null;
        item.room = null;
        this.transition(item, EVIDENCE_STATE.CARRIED);
        return { ok: true, action: 'pickUp', item };
    }

    /** Hides the carried object in a hiding place. Awards one point. */
    hideCarried(hidingSpot) {
        const item = this.getCarriedItem();
        if (!item) {
            return { ok: false, reason: 'nothingCarried' };
        }
        if (!hidingSpot.hasCapacity()) {
            return { ok: false, reason: 'occupied' };
        }
        if (!hidingSpot.store(item.id)) {
            return { ok: false, reason: 'occupied' };
        }
        this.carriedIds = this.carriedIds.filter((id) => id !== item.id);
        item.hidingSpotId = hidingSpot.id;
        this.transition(item, EVIDENCE_STATE.HIDDEN);
        return { ok: true, action: 'hide', item, hidingSpot };
    }

    /** Takes a hidden object back out of a hiding place (score -1). */
    retrieveFrom(hidingSpot) {
        if (!this.rules.allowRetrieval) {
            return { ok: false, reason: 'notAllowed' };
        }
        if (this.carriedIds.length >= this.rules.carryLimit) {
            return { ok: false, reason: 'handsFull' };
        }
        const id = hidingSpot.storedEvidenceIds[0];
        const item = id ? this.items.get(id) : null;
        if (!item || item.state !== EVIDENCE_STATE.HIDDEN) {
            return { ok: false, reason: 'empty' };
        }
        hidingSpot.remove(id);
        item.hidingSpotId = null;
        this.carriedIds.push(id);
        this.transition(item, EVIDENCE_STATE.CARRIED);
        return { ok: true, action: 'retrieve', item, hidingSpot };
    }

    /**
     * Evidence the detective finds while searching an inspection point:
     * - every object stored in the hiding place being searched, and
     * - every object lying exposed within `lookRadius` in the same room.
     * Carried objects are never found.
     */
    findDiscoverable({ hidingSpot = null, position, lookRadius, room }) {
        const found = [];
        if (hidingSpot) {
            for (const id of hidingSpot.storedEvidenceIds) {
                const item = this.items.get(id);
                if (item?.state !== EVIDENCE_STATE.HIDDEN) continue;
                found.push({ item, reason: 'hidingSpot', hidingSpot });
            }
        }
        for (const item of this.items.values()) {
            if (item.state !== EVIDENCE_STATE.NOT_FOUND || !item.position) {
                continue;
            }
            const distance = Math.hypot(item.position.x - position.x, item.position.y - position.y);
            if (distance <= lookRadius && (!room || item.room === room)) {
                found.push({ item, reason: 'exposed' });
            }
        }
        return found;
    }

    markDiscovered(id) {
        const item = this.items.get(id);
        if (!item || !this.transition(item, EVIDENCE_STATE.DISCOVERED)) return false;
        item.position = null;
        item.room = null;
        item.hidingSpotId = null;
        return true;
    }
}
