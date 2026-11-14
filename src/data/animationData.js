/**
 * Character animation definitions, built from the texture keys declared in
 * assetManifest.js. Walk frames 001-003 are played as a ping-pong loop
 * (1-2-3-2-1...), which matches the stance order in the source images.
 */
export const DIRECTION = Object.freeze({
    FRONT: 'front',
    BACK: 'back',
    SIDE: 'side'
});

export const WALK_FRAME_RATE = 7;

export const CHARACTER_KEYS = Object.freeze(['roro', 'detective']);

export function idleTextureKey(character, direction) {
    return `${character}-idle-${direction}`;
}

export function walkAnimationKey(character, direction) {
    return `${character}-walk-${direction}`;
}

/** Returns the list of animation configs for every character and direction. */
export function getCharacterAnimationConfigs() {
    const configs = [];

    for (const character of CHARACTER_KEYS) {
        for (const direction of Object.values(DIRECTION)) {
            configs.push({
                key: walkAnimationKey(character, direction),
                frames: [1, 2, 3].map((index) => ({ key: `${character}-walk-${direction}-${index}` })),
                frameRate: WALK_FRAME_RATE,
                repeat: -1,
                yoyo: true
            });
        }
    }

    return configs;
}
