/**
 * Room detection with Arcade Physics overlap triggers.
 *
 * Every room and doorway gets an invisible static trigger zone. Arcade
 * overlap callbacks record which zones a character's feet touch during the
 * physics step; the scene then reads the character's current location.
 *
 * A doorway belongs to the two rooms it connects, which the visibility
 * system uses to reveal both rooms while Roro stands in it.
 */
export class RoomTriggerSystem {
    /**
     * @param {Phaser.Scene} scene
     * @param {import('../world/ApartmentLayout.js').ApartmentLayout} layout
     */
    constructor(scene, layout) {
        this.scene = scene;
        this.layout = layout;
        this.triggers = scene.physics.add.staticGroup();
        this.tracked = new Map();

        for (const room of layout.rooms) {
            this.createTrigger(layout.rectToWorld(room.rect), { roomId: room.id, doorId: null, rooms: [room.id] });
        }
        for (const door of layout.doors) {
            this.createTrigger(layout.rectToWorld(door.rect), { roomId: null, doorId: door.id, rooms: door.rooms });
        }
    }

    createTrigger(rect, location) {
        const zone = this.scene.add.zone(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height);
        zone.setData('location', location);
        this.triggers.add(zone);
        zone.body.updateFromGameObject();
    }

    /** Starts tracking a character; overlaps are recorded every physics step. */
    track(character, initialPosition) {
        const entry = {
            hits: [],
            location: this.layout.getLocationAt(initialPosition.x, initialPosition.y)
        };
        this.tracked.set(character, entry);
        this.scene.physics.add.overlap(character, this.triggers, (_character, zone) => {
            entry.hits.push(zone.getData('location'));
        });
    }

    /**
     * Resolves the location from the overlaps recorded since the last call.
     * Doorways take priority over rooms because they reveal both rooms.
     * If no physics step ran this frame, the previous location is kept.
     */
    update() {
        for (const entry of this.tracked.values()) {
            if (entry.hits.length === 0) {
                continue;
            }
            entry.location = entry.hits.find((hit) => hit.doorId) ?? entry.hits[0];
            entry.hits.length = 0;
        }
    }

    getLocation(character) {
        return this.tracked.get(character)?.location ?? { roomId: null, doorId: null, rooms: [] };
    }
}
