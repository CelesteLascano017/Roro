/**
 * Creates the Arcade Physics static bodies of the apartment, independently
 * of the graphics:
 * - walls (merged rectangles from ApartmentLayout),
 * - solid furniture (colliders declared in apartmentData.js),
 * - door blockers (enabled only while a door is closed),
 * - player-only blockers (keep Roro inside the apartment).
 */
export class CollisionManager {
    /**
     * @param {Phaser.Scene} scene
     * @param {import('../world/ApartmentLayout.js').ApartmentLayout} layout
     */
    constructor(scene, layout) {
        this.scene = scene;
        this.layout = layout;
        this.solids = scene.physics.add.staticGroup();
        this.doors = scene.physics.add.staticGroup();
        this.playerOnly = scene.physics.add.staticGroup();

        for (const rect of layout.getWallRectangles()) {
            this.addZone(this.solids, rect, 'wall');
        }
        for (const collider of layout.furnitureColliders) {
            this.addZone(this.solids, collider, collider.id);
        }

        const { width, height } = layout.getWorldSize();
        scene.physics.world.setBounds(0, 0, width, height);
    }

    addZone(group, rect, name) {
        const zone = this.scene.add.zone(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height);
        zone.setName(name);
        group.add(zone);
        zone.body.updateFromGameObject();
        return zone;
    }

    addDoorBlocker(rect) {
        return this.addZone(this.doors, rect, 'door');
    }

    addPlayerOnlyBlocker(rect) {
        return this.addZone(this.playerOnly, rect, 'playerOnly');
    }

    /** Roro collides with everything, including the player-only barriers. */
    attachPlayer(sprite) {
        sprite.setCollideWorldBounds(true);
        this.scene.physics.add.collider(sprite, this.solids);
        this.scene.physics.add.collider(sprite, this.doors);
        this.scene.physics.add.collider(sprite, this.playerOnly);
    }

    /** The detective collides with walls, furniture and closed doors. */
    attachNonPlayer(sprite) {
        this.scene.physics.add.collider(sprite, this.solids);
        this.scene.physics.add.collider(sprite, this.doors);
    }
}
