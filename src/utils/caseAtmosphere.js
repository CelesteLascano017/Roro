/** Absolute remaining-evidence count also makes harder modes tense from the start. */
export function caseAtmosphere(remaining) {
    const intensity = Math.max(0, Math.min(1, (3 - remaining) / 2));
    return { intensity, musicRate: 1 + 0.3 * intensity };
}
