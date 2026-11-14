/**
 * Central game configuration.
 *
 * Every tunable value (resolution, speeds, timings, difficulty settings,
 * story constants) lives here so gameplay code never hardcodes them.
 */

// Internal rendering resolution. Phaser scales this to the browser window.
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

// The interior tileset uses 16x16 source tiles. Everything in the world is
// drawn at an integer scale of 2, so one world tile is 32x32 pixels.
export const TILE_SOURCE_SIZE = 16;
export const WORLD_SCALE = 2;
export const TILE_SIZE = TILE_SOURCE_SIZE * WORLD_SCALE;

export const SCENE_KEYS = Object.freeze({
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    MAIN_MENU: 'MainMenuScene',
    DIFFICULTY: 'DifficultyScene',
    INTRODUCTION: 'IntroductionScene',
    APARTMENT: 'ApartmentScene',
    DIALOGUE: 'DialogueScene',
    PAUSE: 'PauseScene',
    VICTORY: 'VictoryScene',
    DEFEAT: 'DefeatScene'
});

export const DIFFICULTY = Object.freeze({
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard'
});

export const VISIBILITY_MODE = Object.freeze({
    FULL: 'full',
    ROOM: 'room',
    RADIUS: 'radius'
});

/**
 * Difficulty only changes what the player can see. The detective behaves the
 * same in every mode, as defined in GAME_DESIGN.md (section 11).
 */
export const DIFFICULTY_SETTINGS = Object.freeze({
    [DIFFICULTY.EASY]: {
        label: 'Easy',
        description: 'The whole apartment is visible.\nYou can see the detective at all times.',
        visibility: VISIBILITY_MODE.FULL
    },
    [DIFFICULTY.NORMAL]: {
        label: 'Normal',
        description: 'Only the room you are in is visible.\nListen for the detective\'s footsteps.',
        visibility: VISIBILITY_MODE.ROOM,
        // Darkness applied to the rooms Roro is not in (0 = none, 1 = black).
        obscuredAlpha: 0.93
    },
    [DIFFICULTY.HARD]: {
        label: 'Hard',
        description: 'You only see a small circle around Roro.\nListen for the detective\'s footsteps.',
        visibility: VISIBILITY_MODE.RADIUS,
        obscuredAlpha: 0.985,
        // Radius of the visible circle around Roro, in world pixels.
        visibilityRadius: 110
    }
});

export const DEFAULT_DIFFICULTY = DIFFICULTY.NORMAL;

export const SCORE_CONFIG = Object.freeze({
    MAX_SCORE: 6
});

export const PLAYER_CONFIG = Object.freeze({
    speed: 110,
    // Small physics body at the character's feet (world pixels).
    bodyWidth: 16,
    bodyHeight: 8,
    // Maximum distance between Roro's feet and an interaction point.
    interactionRange: 40,
    footstepInterval: 330
});

export const DETECTIVE_CONFIG = Object.freeze({
    speed: 58,
    bodyWidth: 16,
    bodyHeight: 8,
    // Distance (px) at which a waypoint is considered reached.
    arriveThreshold: 3,
    // Time the detective spends looking around after entering (ms).
    entryPause: 5000,
    // Time spent opening a closed door before walking through it (ms).
    doorOpenDelay: 450,
    // Distance from Roro at which an interview starts (px).
    interviewDistance: 44,
    // How often the path towards a moving target (Roro) is recalculated (ms).
    chaseRepathInterval: 600,
    // If no progress is made for this long, the path is recalculated (ms).
    stuckTimeout: 1500,
    // Retries before an unreachable destination is skipped.
    maxPathRetries: 4,
    retryDelay: 500,
    // If Roro cannot be reached for this long, the interview starts anyway (ms).
    interviewFallbackTimeout: 6000,
    footstepInterval: 420,
    // Footsteps are inaudible beyond this distance from Roro (px).
    footstepHearingDistance: 650
});

/**
 * Rules that decide how evidence can be hidden and found.
 * See README "Design decisions" for the reasoning behind these defaults.
 */
export const HIDING_RULES = Object.freeze({
    // Roro carries at most one evidence object at a time.
    carryLimit: 1,
    // Each hiding place stores at most this many evidence objects.
    hidingSpotCapacity: 1,
    // Roro may take an object back out of a hiding place (score decreases by 1).
    allowRetrieval: true
});

export const DISTRACTION_CONFIG = Object.freeze({
    // Delay between switching the kettle on and the whistle (ms).
    triggerDelay: 2000,
    // Time the detective spends at the distraction before returning (ms).
    investigateDuration: 4000,
    // Time before the same distraction can be used again (ms).
    cooldown: 30000
});

export const STORY = Object.freeze({
    playerName: 'Roro',
    detectiveName: 'Detective',
    // Displayed on the victim's note and revealed in the third interview.
    victimFullName: 'Daniel Ortega Vidal',
    monthsWithBlackouts: 6
});

export const AUDIO_DEFAULTS = Object.freeze({
    muted: false,
    musicVolume: 0.5,
    sfxVolume: 0.8
});

export const STORAGE_KEY = 'roro.save.v1';

export const FONT_FAMILY = '"m6x11", "Courier New", monospace';

export const COLORS = Object.freeze({
    background: 0x14121b,
    backgroundCss: '#14121b',
    panel: 0x1f1b29,
    panelBorder: 0x5a4a6e,
    text: '#f2e9dc',
    textMuted: '#a89bb5',
    accent: '#e0b354',
    accentHex: 0xe0b354,
    danger: '#d65a5a',
    dangerHex: 0xd65a5a,
    success: '#7fc28a',
    wallTop: 0x2a2233,
    wallTopEdge: 0x3c3149,
    darkness: 0x07060c,
    focusTint: 0xfff2a8
});

/**
 * Placeholder graphics for assets that do not exist yet are drawn with this
 * outline colour so they are easy to identify in screenshots.
 */
export const PLACEHOLDER_STYLE = Object.freeze({
    showOutline: true,
    outlineColor: 0xff00ff
});

// Depth layers. Characters and furniture use their bottom y coordinate.
export const DEPTH = Object.freeze({
    floor: 0,
    walls: 1,
    rugs: 2,
    worldBase: 10,
    visibility: 5000,
    prompt: 5500,
    hud: 6000,
    modal: 7000,
    touch: 8000
});
