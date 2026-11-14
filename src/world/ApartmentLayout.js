import { TILE_SIZE } from '../data/gameConfig.js';
import {
    APARTMENT_BOUNDS,
    DOORS,
    FURNITURE,
    GRID_HEIGHT,
    GRID_WIDTH,
    ROOMS
} from '../data/apartmentData.js';

export const CELL_TYPE = Object.freeze({
    VOID: 0,
    WALL: 1,
    FLOOR: 2,
    DOOR: 3
});

// A furniture collider must overlap a tile by more than this many pixels on
// both axes to make the tile unwalkable for navigation.
const NAVIGATION_BLOCK_MARGIN = 4;

/**
 * Pure model of the apartment built from apartmentData.js.
 *
 * It answers spatial questions (which room is at a position, which tiles are
 * walkable, where the walls are) for the renderer, the collision system, the
 * navigation system and the visibility system. It has no Phaser dependency.
 */
export class ApartmentLayout {
    constructor(data = { GRID_WIDTH, GRID_HEIGHT, APARTMENT_BOUNDS, ROOMS, DOORS, FURNITURE }) {
        this.width = data.GRID_WIDTH;
        this.height = data.GRID_HEIGHT;
        this.tileSize = TILE_SIZE;
        this.rooms = data.ROOMS;
        this.doors = data.DOORS;
        this.furniture = data.FURNITURE;

        this.roomsById = new Map(this.rooms.map((room) => [room.id, room]));
        this.cells = new Uint8Array(this.width * this.height);
        this.roomAtCell = new Array(this.width * this.height).fill(null);
        this.doorAtCell = new Array(this.width * this.height).fill(null);
        this.furnitureBlocked = new Uint8Array(this.width * this.height);

        this.buildCells(data.APARTMENT_BOUNDS);
        this.furnitureColliders = this.buildFurnitureColliders();
        this.markFurnitureBlockedCells();
    }

    // ------------------------------------------------------------------ build

    buildCells(bounds) {
        this.fillRect(bounds, CELL_TYPE.WALL);

        for (const room of this.rooms) {
            this.forEachCellInRect(room.rect, (x, y) => {
                this.setCell(x, y, CELL_TYPE.FLOOR);
                this.roomAtCell[this.index(x, y)] = room.id;
            });
        }

        for (const door of this.doors) {
            this.forEachCellInRect(door.rect, (x, y) => {
                this.setCell(x, y, CELL_TYPE.DOOR);
                this.doorAtCell[this.index(x, y)] = door.id;
            });
        }
    }

    buildFurnitureColliders() {
        const colliders = [];
        for (const item of this.furniture) {
            if (!item.collider) {
                continue;
            }
            colliders.push({
                id: item.id,
                x: (item.x + item.collider.x) * this.tileSize,
                y: (item.y + item.collider.y) * this.tileSize,
                width: item.collider.w * this.tileSize,
                height: item.collider.h * this.tileSize
            });
        }
        return colliders;
    }

    markFurnitureBlockedCells() {
        for (const collider of this.furnitureColliders) {
            const firstX = Math.floor(collider.x / this.tileSize);
            const lastX = Math.floor((collider.x + collider.width) / this.tileSize);
            const firstY = Math.floor(collider.y / this.tileSize);
            const lastY = Math.floor((collider.y + collider.height) / this.tileSize);

            for (let y = firstY; y <= lastY; y++) {
                for (let x = firstX; x <= lastX; x++) {
                    if (!this.inBounds(x, y)) {
                        continue;
                    }
                    const overlapX = Math.min(collider.x + collider.width, (x + 1) * this.tileSize) - Math.max(collider.x, x * this.tileSize);
                    const overlapY = Math.min(collider.y + collider.height, (y + 1) * this.tileSize) - Math.max(collider.y, y * this.tileSize);
                    if (overlapX > NAVIGATION_BLOCK_MARGIN && overlapY > NAVIGATION_BLOCK_MARGIN) {
                        this.furnitureBlocked[this.index(x, y)] = 1;
                    }
                }
            }
        }
    }

    forEachCellInRect(rect, callback) {
        for (let y = rect.y; y < rect.y + rect.h; y++) {
            for (let x = rect.x; x < rect.x + rect.w; x++) {
                if (this.inBounds(x, y)) {
                    callback(x, y);
                }
            }
        }
    }

    fillRect(rect, type) {
        this.forEachCellInRect(rect, (x, y) => this.setCell(x, y, type));
    }

    // ---------------------------------------------------------------- queries

    index(x, y) {
        return y * this.width + x;
    }

    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    setCell(x, y, type) {
        if (this.inBounds(x, y)) {
            this.cells[this.index(x, y)] = type;
        }
    }

    getCell(x, y) {
        return this.inBounds(x, y) ? this.cells[this.index(x, y)] : CELL_TYPE.VOID;
    }

    isWall(x, y) {
        return this.getCell(x, y) === CELL_TYPE.WALL;
    }

    /** Walkable for navigation: floor or door, not blocked by furniture. */
    isWalkable(x, y) {
        const cell = this.getCell(x, y);
        return (cell === CELL_TYPE.FLOOR || cell === CELL_TYPE.DOOR) && !this.furnitureBlocked[this.index(x, y)];
    }

    getRoomIdAtTile(x, y) {
        return this.inBounds(x, y) ? this.roomAtCell[this.index(x, y)] : null;
    }

    getDoorIdAtTile(x, y) {
        return this.inBounds(x, y) ? this.doorAtCell[this.index(x, y)] : null;
    }

    getRoom(roomId) {
        return this.roomsById.get(roomId) ?? null;
    }

    getDoor(doorId) {
        return this.doors.find((door) => door.id === doorId) ?? null;
    }

    worldToTile(worldX, worldY) {
        return { x: Math.floor(worldX / this.tileSize), y: Math.floor(worldY / this.tileSize) };
    }

    tileCenter(tile) {
        return { x: (tile.x + 0.5) * this.tileSize, y: (tile.y + 0.5) * this.tileSize };
    }

    /** Converts a fractional tile point (as used in apartmentData) to world pixels. */
    tilePointToWorld(point) {
        return { x: point.x * this.tileSize, y: point.y * this.tileSize };
    }

    rectToWorld(rect) {
        return {
            x: rect.x * this.tileSize,
            y: rect.y * this.tileSize,
            width: rect.w * this.tileSize,
            height: rect.h * this.tileSize
        };
    }

    /**
     * Location of a world position: the room id, plus the door id when the
     * position is inside a doorway (doorways belong to two rooms).
     */
    getLocationAt(worldX, worldY) {
        const tile = this.worldToTile(worldX, worldY);
        const doorId = this.getDoorIdAtTile(tile.x, tile.y);
        if (doorId) {
            return { roomId: null, doorId, rooms: this.getDoor(doorId).rooms };
        }
        const roomId = this.getRoomIdAtTile(tile.x, tile.y);
        return { roomId, doorId: null, rooms: roomId ? [roomId] : [] };
    }

    /**
     * World rectangle shown when a room is visible: the floor plus the
     * surrounding walls (two tiles above, for the visible wall face).
     */
    getRoomVisibleRect(roomId) {
        const room = this.getRoom(roomId);
        if (!room) {
            return null;
        }
        return this.rectToWorld({
            x: room.rect.x - 1,
            y: room.rect.y - 2,
            w: room.rect.w + 2,
            h: room.rect.h + 3
        });
    }

    /** Rooms directly connected to `roomId` through a door. */
    getConnectedRooms(roomId) {
        const connected = new Set();
        for (const door of this.doors) {
            if (door.rooms.includes(roomId)) {
                door.rooms.filter((other) => other !== roomId).forEach((other) => connected.add(other));
            }
        }
        return [...connected];
    }

    /**
     * Wall cells merged into rectangles (world pixels) so the collision system
     * creates a few large static bodies instead of one per tile.
     */
    getWallRectangles() {
        const rowRuns = [];
        for (let y = 0; y < this.height; y++) {
            let x = 0;
            while (x < this.width) {
                if (!this.isWall(x, y)) {
                    x++;
                    continue;
                }
                const start = x;
                while (x < this.width && this.isWall(x, y)) {
                    x++;
                }
                rowRuns.push({ x: start, y, w: x - start, h: 1 });
            }
        }

        // Merge runs with the same horizontal extent on consecutive rows.
        const merged = [];
        for (const run of rowRuns) {
            const previous = merged.find((rect) => rect.x === run.x && rect.w === run.w && rect.y + rect.h === run.y);
            if (previous) {
                previous.h += 1;
            } else {
                merged.push({ ...run });
            }
        }

        return merged.map((rect) => this.rectToWorld(rect));
    }

    /** World size in pixels. */
    getWorldSize() {
        return { width: this.width * this.tileSize, height: this.height * this.tileSize };
    }
}
