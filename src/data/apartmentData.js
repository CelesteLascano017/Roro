/**
 * Apartment level definition.
 *
 * All coordinates are in TILE units (1 tile = TILE_SIZE world pixels) and may
 * be fractional. Rectangles are { x, y, w, h } with x/y at the top-left.
 *
 * The walkability grid, collision bodies, navigation graph and visibility
 * regions are all derived from this data by ApartmentLayout, so the level
 * can be edited here without touching gameplay code.
 *
 * Layout overview (28 x 23 tiles, porch outside on the right):
 *
 *   +----------+--------+----------+
 *   | Bedroom  |Bathroom| Kitchen  |
 *   +---[]-----+--[]----+---[]-----+
 *   |           Hallway            [] front door -> porch
 *   +----[]-----------------[]-----+
 *   |         Living room          |
 *   +------------------------------+
 */

export const GRID_WIDTH = 28;
export const GRID_HEIGHT = 23;

// Outer walls of the apartment (everything inside starts as wall, then rooms are carved).
export const APARTMENT_BOUNDS = { x: 0, y: 0, w: 26, h: 23 };

export const ROOM_IDS = Object.freeze({
    BEDROOM: 'bedroom',
    BATHROOM: 'bathroom',
    KITCHEN: 'kitchen',
    HALLWAY: 'hallway',
    LIVING_ROOM: 'livingRoom',
    PORCH: 'porch'
});

/**
 * Rooms. `floor` and `wall` select tileset styles (see tilesetData.js).
 * `outside: true` marks areas that are not part of the apartment.
 */
export const ROOMS = [
    { id: ROOM_IDS.BEDROOM, name: 'Bedroom', rect: { x: 1, y: 2, w: 8, h: 8 }, floor: 'wood', wall: 'blue' },
    { id: ROOM_IDS.BATHROOM, name: 'Bathroom', rect: { x: 10, y: 2, w: 6, h: 8 }, floor: 'stone', wall: 'stone' },
    { id: ROOM_IDS.KITCHEN, name: 'Kitchen', rect: { x: 17, y: 2, w: 8, h: 8 }, floor: 'wood', wall: 'stone' },
    { id: ROOM_IDS.HALLWAY, name: 'Hallway', rect: { x: 1, y: 12, w: 24, h: 2 }, floor: 'stone', wall: 'blue' },
    { id: ROOM_IDS.LIVING_ROOM, name: 'Living room', rect: { x: 1, y: 16, w: 24, h: 6 }, floor: 'wood', wall: 'blue' },
    { id: ROOM_IDS.PORCH, name: 'Porch', rect: { x: 26, y: 11, w: 2, h: 4 }, floor: 'stone', wall: 'blue', outside: true }
];

/**
 * Doors connect exactly two rooms.
 * - `startsOpen`: initial state.
 * - `playerCanUse`: whether Roro can open/close it with E.
 * - `alwaysBlocksPlayer`: an invisible barrier keeps Roro inside even when open.
 */
export const DOORS = [
    { id: 'bedroomDoor', rect: { x: 4, y: 10, w: 2, h: 2 }, rooms: [ROOM_IDS.BEDROOM, ROOM_IDS.HALLWAY], startsOpen: true, playerCanUse: true },
    { id: 'bathroomDoor', rect: { x: 12, y: 10, w: 2, h: 2 }, rooms: [ROOM_IDS.BATHROOM, ROOM_IDS.HALLWAY], startsOpen: false, playerCanUse: true },
    { id: 'kitchenDoor', rect: { x: 20, y: 10, w: 2, h: 2 }, rooms: [ROOM_IDS.KITCHEN, ROOM_IDS.HALLWAY], startsOpen: true, playerCanUse: true },
    { id: 'livingDoorWest', rect: { x: 5, y: 14, w: 2, h: 2 }, rooms: [ROOM_IDS.HALLWAY, ROOM_IDS.LIVING_ROOM], startsOpen: true, playerCanUse: true },
    { id: 'livingDoorEast', rect: { x: 17, y: 14, w: 2, h: 2 }, rooms: [ROOM_IDS.HALLWAY, ROOM_IDS.LIVING_ROOM], startsOpen: true, playerCanUse: true },
    { id: 'frontDoor', rect: { x: 25, y: 12, w: 1, h: 2 }, rooms: [ROOM_IDS.HALLWAY, ROOM_IDS.PORCH], startsOpen: false, playerCanUse: false, alwaysBlocksPlayer: true }
];

export const FURNITURE_LAYER = Object.freeze({
    WALL: 'wall', // decorations hung on wall faces
    RUG: 'rug', // flat objects on the floor (never block movement)
    WORLD: 'world' // depth-sorted objects
});

/**
 * Furniture and decorations.
 * - `frame`: region of the interiors tileset (tilesetData.js), or
 * - `texture` + `size`: an optional asset that may still be a placeholder.
 * - `collider`: solid area RELATIVE to the sprite's top-left (tiles), or null.
 * - `stackedOn`: id of the furniture this object rests on (drawn just above it).
 */
export const FURNITURE = [
    // ---------------- Bedroom ----------------
    { id: 'bedroomWindowA', frame: 'window', x: 2.2, y: 0.35, layer: FURNITURE_LAYER.WALL },
    { id: 'bedroomWindowB', frame: 'window', x: 6.6, y: 0.35, layer: FURNITURE_LAYER.WALL },
    { id: 'bedroomPicture', frame: 'pictureB', x: 4.6, y: 0.5, layer: FURNITURE_LAYER.WALL },
    { id: 'bed', frame: 'bedDouble', x: 1, y: 2, collider: { x: 0, y: 0.2, w: 2.875, h: 3.4 } },
    { id: 'nightstand', frame: 'nightstand', x: 4, y: 2, collider: { x: 0, y: 0.1, w: 1, h: 1.1 } },
    { id: 'wardrobe', frame: 'wardrobe', x: 6.5, y: 2, collider: { x: 0, y: 0.1, w: 1.5, h: 1.2 } },
    { id: 'bedroomRug', frame: 'rugBlue', x: 4.5, y: 6.2, layer: FURNITURE_LAYER.RUG },
    { id: 'bedroomPlant', frame: 'plantTall', x: 8, y: 7.9, collider: { x: 0.1, y: 1.2, w: 0.8, h: 0.7 } },
    { id: 'bedroomStool', frame: 'stool', x: 1.2, y: 8.6, collider: { x: 0, y: 0.4, w: 0.875, h: 0.6 } },

    // ---------------- Bathroom ----------------
    { id: 'bathtub', texture: 'bathroom-bathtub', size: { w: 2, h: 3.25 }, x: 10, y: 2, collider: { x: 0, y: 0, w: 2, h: 3.2 } },
    { id: 'bathMat', frame: 'rugBlue', x: 10, y: 5.45, layer: FURNITURE_LAYER.RUG },
    { id: 'washbasin', texture: 'bathroom-washbasin', size: { w: 1, h: 1.125 }, x: 13, y: 2, collider: { x: 0, y: 0, w: 1, h: 1 } },
    { id: 'toilet', texture: 'bathroom-toilet', size: { w: 0.875, h: 1.375 }, x: 15.06, y: 2, collider: { x: 0, y: 0.2, w: 0.875, h: 1.1 } },
    { id: 'bathroomCabinet', frame: 'cabinetSmall', x: 15, y: 6, collider: { x: 0, y: 0.1, w: 1, h: 1.1 } },

    // ---------------- Kitchen ----------------
    { id: 'kitchenCounter', texture: 'kitchen-counter', size: { w: 3, h: 1.25 }, x: 17, y: 2, collider: { x: 0, y: 0, w: 3, h: 1.05 } },
    { id: 'kettle', frame: 'kettle', x: 19.1, y: 2.15, stackedOn: 'kitchenCounter' },
    { id: 'stove', texture: 'kitchen-stove', size: { w: 1, h: 1.25 }, x: 20, y: 2, collider: { x: 0, y: 0, w: 1, h: 1.05 } },
    { id: 'kitchenSink', texture: 'kitchen-sink', size: { w: 1, h: 1.25 }, x: 21, y: 2, collider: { x: 0, y: 0, w: 1, h: 1.05 } },
    { id: 'fridge', texture: 'kitchen-fridge', size: { w: 1.25, h: 2 }, x: 23.75, y: 2, collider: { x: 0, y: 0.1, w: 1.25, h: 1.8 } },
    { id: 'diningTable', frame: 'tableLarge', x: 19.5, y: 5.2, collider: { x: 0, y: 0.5, w: 3, h: 1.9 } },
    { id: 'diningChairLeft', frame: 'chairGreenRight', x: 18.4, y: 5.6, collider: { x: 0.1, y: 1.0, w: 0.8, h: 0.9 } },
    { id: 'diningChairRight', frame: 'chairGreenLeft', x: 22.6, y: 5.6, collider: { x: 0.1, y: 1.0, w: 0.8, h: 0.9 } },
    { id: 'trashBin', texture: 'trash-bin', size: { w: 0.69, h: 0.875 }, x: 17.15, y: 8.9, collider: { x: 0, y: 0.3, w: 0.69, h: 0.55 } },

    // ---------------- Hallway ----------------
    { id: 'hallPictureA', frame: 'pictureA', x: 8.2, y: 10.5, layer: FURNITURE_LAYER.WALL },
    { id: 'hallPictureB', frame: 'pictureB', x: 16.3, y: 10.5, layer: FURNITURE_LAYER.WALL },

    // ---------------- Living room ----------------
    { id: 'livingWindow', frame: 'window', x: 1.9, y: 14.35, layer: FURNITURE_LAYER.WALL },
    { id: 'livingPicture', frame: 'pictureA', x: 12.5, y: 14.45, layer: FURNITURE_LAYER.WALL },
    { id: 'bookshelf', frame: 'bookshelf', x: 1.2, y: 16, collider: { x: 0, y: 0.3, w: 2, h: 2.3 } },
    { id: 'sideArmchair', frame: 'armchairRight', x: 7, y: 16.2, collider: { x: 0, y: 0.6, w: 1.44, h: 1.3 } },
    { id: 'sofa', frame: 'sofaFront', x: 8.5, y: 16, collider: { x: 0, y: 0.2, w: 2.94, h: 1.55 } },
    { id: 'livingRug', frame: 'rugRed', x: 9, y: 18.2, layer: FURNITURE_LAYER.RUG },
    { id: 'coffeeTable', frame: 'tableSmall', x: 9.7, y: 18.7, collider: { x: 0, y: 0.4, w: 1.5, h: 1.1 } },
    { id: 'coffeeTableFlowers', frame: 'flowerPot', x: 10.15, y: 18.75, stackedOn: 'coffeeTable' },
    { id: 'armchair', frame: 'armchairFront', x: 14.5, y: 16.1, collider: { x: 0, y: 0.3, w: 1.75, h: 1.4 } },
    { id: 'livingSofaSide', frame: 'sofaSide', x: 21.8, y: 17.2, collider: { x: 0, y: 0.3, w: 1.44, h: 2.6 } },
    { id: 'livingPlant', frame: 'plantTall', x: 24, y: 16, collider: { x: 0.1, y: 1.2, w: 0.8, h: 0.7 } },
    { id: 'livingRugSmall', frame: 'rugBlue', x: 3.5, y: 20, layer: FURNITURE_LAYER.RUG },
    { id: 'livingBooks', frame: 'bookBlue', x: 6.2, y: 21.2, collider: null }
];

/**
 * Hiding categories, ordered from most to least obvious. Inspection route N
 * searches the hiding places of category N (see detectiveRoutes.js).
 */
export const HIDING_CATEGORY = Object.freeze({
    VERY_OBVIOUS: 'veryObvious',
    NOT_SO_OBVIOUS: 'notSoObvious',
    HIDDEN: 'hidden',
    VERY_HIDDEN: 'veryHidden'
});

export const HIDING_CATEGORY_LABELS = Object.freeze({
    [HIDING_CATEGORY.VERY_OBVIOUS]: 'Very obvious',
    [HIDING_CATEGORY.NOT_SO_OBVIOUS]: 'Not so obvious',
    [HIDING_CATEGORY.HIDDEN]: 'Hidden',
    [HIDING_CATEGORY.VERY_HIDDEN]: 'Very hidden'
});

/**
 * Hiding places.
 * - `point`: where the interaction prompt appears; Roro must be within
 *   PLAYER_CONFIG.interactionRange of it.
 * - `inspectTile`: walkable tile where the detective stands to search it.
 * - `furnitureId`: furniture highlighted when the spot is focused.
 */
export const HIDING_SPOTS = [
    // Very obvious
    { id: 'underBed', name: 'under the bed', room: ROOM_IDS.BEDROOM, category: HIDING_CATEGORY.VERY_OBVIOUS, furnitureId: 'bed', point: { x: 2.4, y: 5.8 }, inspectTile: { x: 2, y: 6 } },
    { id: 'bathtub', name: 'behind the shower curtain', room: ROOM_IDS.BATHROOM, category: HIDING_CATEGORY.VERY_OBVIOUS, furnitureId: 'bathtub', point: { x: 11, y: 5.4 }, inspectTile: { x: 11, y: 6 } },
    { id: 'trashBin', name: 'in the trash bin', room: ROOM_IDS.KITCHEN, category: HIDING_CATEGORY.VERY_OBVIOUS, furnitureId: 'trashBin', point: { x: 17.5, y: 9.5 }, inspectTile: { x: 18, y: 9 } },
    { id: 'sofaCushions', name: 'between the sofa cushions', room: ROOM_IDS.LIVING_ROOM, category: HIDING_CATEGORY.VERY_OBVIOUS, furnitureId: 'sofa', point: { x: 10, y: 17.8 }, inspectTile: { x: 10, y: 18 } },

    // Not so obvious
    { id: 'nightstandDrawer', name: 'in the nightstand drawer', room: ROOM_IDS.BEDROOM, category: HIDING_CATEGORY.NOT_SO_OBVIOUS, furnitureId: 'nightstand', point: { x: 4.5, y: 3.4 }, inspectTile: { x: 4, y: 4 } },
    { id: 'bathroomCabinet', name: 'in the bathroom cabinet', room: ROOM_IDS.BATHROOM, category: HIDING_CATEGORY.NOT_SO_OBVIOUS, furnitureId: 'bathroomCabinet', point: { x: 14.9, y: 6.9 }, inspectTile: { x: 14, y: 6 } },
    { id: 'kitchenCabinets', name: 'in the kitchen cabinets', room: ROOM_IDS.KITCHEN, category: HIDING_CATEGORY.NOT_SO_OBVIOUS, furnitureId: 'kitchenCounter', point: { x: 17.6, y: 3.2 }, inspectTile: { x: 18, y: 3 } },
    { id: 'armchairCushion', name: 'under the armchair cushion', room: ROOM_IDS.LIVING_ROOM, category: HIDING_CATEGORY.NOT_SO_OBVIOUS, furnitureId: 'armchair', point: { x: 15.4, y: 17.8 }, inspectTile: { x: 15, y: 18 } },

    // Hidden
    { id: 'wardrobe', name: 'inside the wardrobe', room: ROOM_IDS.BEDROOM, category: HIDING_CATEGORY.HIDDEN, furnitureId: 'wardrobe', point: { x: 7.25, y: 3.5 }, inspectTile: { x: 7, y: 4 } },
    { id: 'underSink', name: 'under the washbasin', room: ROOM_IDS.BATHROOM, category: HIDING_CATEGORY.HIDDEN, furnitureId: 'washbasin', point: { x: 13.5, y: 3.2 }, inspectTile: { x: 13, y: 3 } },
    { id: 'oven', name: 'inside the oven', room: ROOM_IDS.KITCHEN, category: HIDING_CATEGORY.HIDDEN, furnitureId: 'stove', point: { x: 20.6, y: 3.2 }, inspectTile: { x: 20, y: 3 } },
    { id: 'behindBooks', name: 'behind the books', room: ROOM_IDS.LIVING_ROOM, category: HIDING_CATEGORY.HIDDEN, furnitureId: 'bookshelf', point: { x: 2.2, y: 18.7 }, inspectTile: { x: 2, y: 19 } },

    // Very hidden
    { id: 'plantPot', name: 'in the soil of the plant pot', room: ROOM_IDS.BEDROOM, category: HIDING_CATEGORY.VERY_HIDDEN, furnitureId: 'bedroomPlant', point: { x: 8.2, y: 9.3 }, inspectTile: { x: 7, y: 9 } },
    { id: 'toiletCistern', name: 'inside the toilet cistern', room: ROOM_IDS.BATHROOM, category: HIDING_CATEGORY.VERY_HIDDEN, furnitureId: 'toilet', point: { x: 15.3, y: 3.4 }, inspectTile: { x: 14, y: 3 } },
    { id: 'behindFridge', name: 'behind the fridge', room: ROOM_IDS.KITCHEN, category: HIDING_CATEGORY.VERY_HIDDEN, furnitureId: 'fridge', point: { x: 24.2, y: 4.0 }, inspectTile: { x: 24, y: 4 } },
    { id: 'looseFloorboard', name: 'under a loose floorboard', room: ROOM_IDS.LIVING_ROOM, category: HIDING_CATEGORY.VERY_HIDDEN, furnitureId: 'livingRugSmall', point: { x: 4.5, y: 20.7 }, inspectTile: { x: 4, y: 20 } }
];

/**
 * Distraction sources. Interacting with one makes a noise after a delay that
 * temporarily redirects the detective (Redirected state).
 */
export const DISTRACTIONS = [
    {
        id: 'kettle',
        name: 'kettle',
        room: ROOM_IDS.KITCHEN,
        furnitureId: 'kettle',
        point: { x: 19.4, y: 3.2 },
        // Where the detective goes to investigate the noise.
        investigateTile: { x: 19, y: 3 },
        prompt: 'Switch on the kettle',
        noiseText: 'The kettle starts whistling!'
    }
];

/**
 * Spawn points for the four victim belongings. Four of these are picked at
 * random each game. Every point is the centre of an object on a walkable
 * tile (validated by `npm test`).
 */
export const BELONGING_SPAWN_POINTS = [
    { id: 'spawnBedroomCorner', room: ROOM_IDS.BEDROOM, x: 2.5, y: 7.6 },
    { id: 'spawnBedroomFloor', room: ROOM_IDS.BEDROOM, x: 6.2, y: 5.0 },
    { id: 'spawnBathroomFloor', room: ROOM_IDS.BATHROOM, x: 12.5, y: 8.2 },
    { id: 'spawnBathroomCorner', room: ROOM_IDS.BATHROOM, x: 14.6, y: 8.8 },
    { id: 'spawnKitchenCorner', room: ROOM_IDS.KITCHEN, x: 23.5, y: 8.6 },
    { id: 'spawnKitchenFloor', room: ROOM_IDS.KITCHEN, x: 17.6, y: 5.2 },
    { id: 'spawnHallwayWest', room: ROOM_IDS.HALLWAY, x: 8.5, y: 13.4 },
    { id: 'spawnHallwayEast', room: ROOM_IDS.HALLWAY, x: 16.0, y: 12.6 },
    { id: 'spawnLivingWest', room: ROOM_IDS.LIVING_ROOM, x: 6.5, y: 20.6 },
    { id: 'spawnLivingCenter', room: ROOM_IDS.LIVING_ROOM, x: 13.5, y: 18.8 },
    { id: 'spawnLivingEast', room: ROOM_IDS.LIVING_ROOM, x: 19.5, y: 20.8 }
];

// Fixed spawn points for the murder weapon and the victim's note.
export const FIXED_SPAWN_POINTS = Object.freeze({
    bat: { room: ROOM_IDS.BEDROOM, x: 3.4, y: 7.0 },
    note: { room: ROOM_IDS.LIVING_ROOM, x: 20.5, y: 18.6 }
});

// Key positions (tile coordinates; characters stand at the tile centre).
export const KEY_TILES = Object.freeze({
    roroStart: { x: 21, y: 13 },
    detectiveOutside: { x: 26, y: 12 },
    detectiveEntry: { x: 23, y: 12 },
    detectiveExit: { x: 27, y: 13 }
});
