/**
 * Random helpers that accept an injectable random function so the logic can
 * be tested deterministically.
 */

/** Returns a new array with the elements shuffled (Fisher-Yates). */
export function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
}

/** Picks `count` distinct elements. */
export function pickDistinct(items, count, random = Math.random) {
    if (count > items.length) {
        throw new Error(`Cannot pick ${count} items from a list of ${items.length}.`);
    }
    return shuffle(items, random).slice(0, count);
}

/** Small seeded generator (mulberry32) for reproducible tests. */
export function createSeededRandom(seed) {
    let state = seed >>> 0;
    return function seededRandom() {
        state = (state + 0x6d2b79f5) >>> 0;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}
