import { HIDING_CATEGORY, ROOM_IDS } from './apartmentData.js';

/**
 * The detective's four inspection routes, visited in this order.
 * An interview takes place after each of the first three routes.
 *
 * Each route searches every hiding place of its `category`. Route 1 also
 * includes a sweep of every room ("very obvious": evidence left in plain
 * sight). Points are visited in a randomised order: rooms are shuffled and
 * the points inside each room are shuffled, so the detective never zigzags
 * across the apartment but the order still differs every game.
 *
 * - `speedMultiplier`: applied to DETECTIVE_CONFIG.speed.
 * - `inspectDuration`: time (ms) spent searching each point.
 * - `lookRadius`: exposed evidence closer than this (px) to the detective is
 *   discovered while he searches a point.
 */
export const INSPECTION_ROUTES = [
    {
        id: 1,
        name: 'Very obvious places',
        category: HIDING_CATEGORY.VERY_OBVIOUS,
        includeRoomSweeps: true,
        speedMultiplier: 1,
        inspectDuration: 2200,
        lookRadius: 64
    },
    {
        id: 2,
        name: 'Not so obvious places',
        category: HIDING_CATEGORY.NOT_SO_OBVIOUS,
        includeRoomSweeps: false,
        speedMultiplier: 1,
        inspectDuration: 2600,
        lookRadius: 64
    },
    {
        id: 3,
        name: 'Hidden places',
        category: HIDING_CATEGORY.HIDDEN,
        includeRoomSweeps: false,
        speedMultiplier: 1,
        inspectDuration: 3000,
        lookRadius: 64
    },
    {
        id: 4,
        name: 'Very hidden places',
        category: HIDING_CATEGORY.VERY_HIDDEN,
        includeRoomSweeps: false,
        // The final route is faster than the previous ones (GAME_DESIGN 10.1).
        speedMultiplier: 1.6,
        inspectDuration: 1600,
        lookRadius: 64
    }
];

/**
 * Room sweep points (tile coordinates): the detective stops in the middle of
 * each room and looks around. Used by routes with `includeRoomSweeps`.
 */
export const ROOM_SWEEP_POINTS = [
    { id: 'sweepBedroom', room: ROOM_IDS.BEDROOM, tile: { x: 5, y: 6 }, lookRadius: 96 },
    { id: 'sweepBathroom', room: ROOM_IDS.BATHROOM, tile: { x: 12, y: 7 }, lookRadius: 96 },
    { id: 'sweepKitchen', room: ROOM_IDS.KITCHEN, tile: { x: 21, y: 8 }, lookRadius: 96 },
    { id: 'sweepHallway', room: ROOM_IDS.HALLWAY, tile: { x: 12, y: 12 }, lookRadius: 96 },
    { id: 'sweepLivingRoom', room: ROOM_IDS.LIVING_ROOM, tile: { x: 13, y: 19 }, lookRadius: 96 }
];
