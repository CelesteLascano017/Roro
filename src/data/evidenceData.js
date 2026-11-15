/**
 * Evidence definitions. There are exactly six objects; each one hidden
 * successfully is worth one point (SCORE_CONFIG.MAX_SCORE = 6).
 */

export const EVIDENCE_TYPE = Object.freeze({
    BELONGING: 'belonging',
    WEAPON: 'weapon',
    NOTE: 'note'
});

/**
 * Explicit evidence states (no loose booleans):
 * - NOT_FOUND:  lying somewhere in the apartment, visible.
 * - CARRIED:    in Roro's hands.
 * - HIDDEN:     stored in a hiding place (counts for the score).
 * - DISCOVERED: found by the detective (advances the case).
 */
export const EVIDENCE_STATE = Object.freeze({
    NOT_FOUND: 'notFound',
    CARRIED: 'carried',
    HIDDEN: 'hidden',
    DISCOVERED: 'discovered'
});

/**
 * - `spawn`: 'random' picks from BELONGING_SPAWN_POINTS; otherwise a key of
 *   FIXED_SPAWN_POINTS (apartmentData.js).
 * - `decisive`: counts toward the evidence needed to solve the case.
 *   GAME_DESIGN.md does not say which objects are decisive, so all six are.
 */
export const EVIDENCE_ITEMS = [
    { id: 'globe', name: 'desk globe', type: EVIDENCE_TYPE.BELONGING, textureKey: 'item-globe', spawn: 'random', decisive: true },
    { id: 'stars', name: 'star ornaments', type: EVIDENCE_TYPE.BELONGING, textureKey: 'item-stars', spawn: 'random', decisive: true },
    { id: 'lamp', name: 'blue lamp', type: EVIDENCE_TYPE.BELONGING, textureKey: 'item-lamp', spawn: 'random', decisive: true },
    { id: 'framedMap', name: 'framed map', type: EVIDENCE_TYPE.BELONGING, textureKey: 'item-map', spawn: 'random', decisive: true },
    { id: 'bat', name: 'baseball bat', type: EVIDENCE_TYPE.WEAPON, textureKey: 'item-bat', spawn: 'bat', decisive: true },
    { id: 'note', name: 'victim\'s note', type: EVIDENCE_TYPE.NOTE, textureKey: 'item-note', spawn: 'note', decisive: true, readable: true }
];

/**
 * Text written on the victim's note. `{victimName}` is replaced with
 * STORY.victimFullName at runtime.
 */
export const NOTE_CONTENT = Object.freeze({
    heading: 'Month six.',
    body: 'Name:',
    nameTemplate: '{victimName}',
    footer: 'Hide everything. Like always.'
});
