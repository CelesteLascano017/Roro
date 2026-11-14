import { COLORS, FONT_FAMILY } from '../data/gameConfig.js';

/**
 * Shared text styles. The m6x11 pixel font is designed for multiples of
 * 16px, which keeps its pixels sharp.
 */
export function textStyle(overrides = {}) {
    return {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: COLORS.text,
        ...overrides
    };
}

export const TEXT_STYLES = Object.freeze({
    title: textStyle({ fontSize: '96px', color: COLORS.text, stroke: '#000000', strokeThickness: 8 }),
    heading: textStyle({ fontSize: '32px', color: COLORS.accent }),
    body: textStyle({ fontSize: '16px', lineSpacing: 6 }),
    bodyLarge: textStyle({ fontSize: '32px', lineSpacing: 8 }),
    muted: textStyle({ fontSize: '16px', color: COLORS.textMuted }),
    hud: textStyle({ fontSize: '16px', stroke: '#000000', strokeThickness: 4 }),
    hudLarge: textStyle({ fontSize: '32px', stroke: '#000000', strokeThickness: 6 }),
    prompt: textStyle({ fontSize: '16px', color: '#ffffff', backgroundColor: '#1a1420dd', padding: { x: 6, y: 3 } })
});
