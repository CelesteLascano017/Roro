import { COLORS, DEPTH, GAME_HEIGHT, GAME_WIDTH, VISIBILITY_MODE } from '../data/gameConfig.js';

const LIGHT_TEXTURE_KEY = 'visibility-light';

/**
 * Darkness overlay that implements the difficulty visibility rules,
 * independently of how the apartment is drawn.
 *
 * - FULL (Easy): no overlay.
 * - ROOM (Normal): everything is darkened except the room Roro is in
 *   (both rooms while standing in a doorway).
 * - RADIUS (Hard): everything is darkened except a soft circle around Roro.
 *
 * A camera-sized RenderTexture is filled with darkness every frame, then the
 * visible area is erased from it. The overlay is not interactive, so it never
 * blocks input. The detective is hidden separately when he is outside the
 * visible area (see `isPointVisible`).
 */
export class VisibilityOverlay {
    /**
     * @param {Phaser.Scene} scene
     * @param {import('../world/ApartmentLayout.js').ApartmentLayout} layout
     * @param {object} settings DIFFICULTY_SETTINGS entry
     */
    constructor(scene, layout, settings) {
        this.scene = scene;
        this.layout = layout;
        this.settings = settings;
        this.mode = settings.visibility;
        this.visibleRects = [];
        this.center = { x: 0, y: 0 };

        if (this.mode === VISIBILITY_MODE.FULL) {
            return;
        }

        this.texture = scene.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(DEPTH.visibility);
        this.eraser = scene.make.graphics({ x: 0, y: 0 }, false);

        if (this.mode === VISIBILITY_MODE.RADIUS) {
            this.radius = settings.visibilityRadius;
            this.createLightTexture(this.radius);
        }
    }

    /** Radial gradient used to erase a soft-edged circle. */
    createLightTexture(radius) {
        const { textures } = this.scene;
        if (textures.exists(LIGHT_TEXTURE_KEY)) {
            textures.remove(LIGHT_TEXTURE_KEY);
        }
        const size = radius * 2;
        const canvasTexture = textures.createCanvas(LIGHT_TEXTURE_KEY, size, size);
        const context = canvasTexture.getContext();
        const gradient = context.createRadialGradient(radius, radius, radius * 0.55, radius, radius, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);
        canvasTexture.refresh();
    }

    /**
     * @param {{x:number,y:number}} playerPosition Roro's feet (world)
     * @param {{rooms:string[]}} playerLocation from RoomTriggerSystem
     */
    update(playerPosition, playerLocation) {
        if (this.mode === VISIBILITY_MODE.FULL) {
            return;
        }
        // Centre of the visible circle: a little above the feet (Roro's body).
        this.center.x = playerPosition.x;
        this.center.y = playerPosition.y - 18;

        if (this.mode === VISIBILITY_MODE.ROOM && playerLocation.rooms.length > 0) {
            this.visibleRects = playerLocation.rooms
                .map((roomId) => this.layout.getRoomVisibleRect(roomId))
                .filter(Boolean);
        }

        const camera = this.scene.cameras.main;
        const scrollX = camera.scrollX;
        const scrollY = camera.scrollY;

        this.texture.clear();
        this.texture.fill(COLORS.darkness, this.settings.obscuredAlpha);

        if (this.mode === VISIBILITY_MODE.ROOM) {
            this.eraser.clear();
            this.eraser.fillStyle(0xffffff, 1);
            for (const rect of this.visibleRects) {
                this.eraser.fillRect(rect.x - scrollX, rect.y - scrollY, rect.width, rect.height);
            }
            this.texture.erase(this.eraser, 0, 0);
        } else {
            this.texture.erase(LIGHT_TEXTURE_KEY, Math.round(this.center.x - scrollX - this.radius), Math.round(this.center.y - scrollY - this.radius));
        }
    }

    /** Whether a world point is currently visible to the player. */
    isPointVisible(point) {
        switch (this.mode) {
            case VISIBILITY_MODE.FULL:
                return true;
            case VISIBILITY_MODE.ROOM:
                return this.visibleRects.some((rect) =>
                    point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height);
            default:
                return Math.hypot(point.x - this.center.x, point.y - this.center.y) <= this.radius * 0.8;
        }
    }

    /** Fades the darkness away (used at the end of the game). */
    reveal() {
        if (this.texture) {
            this.mode = VISIBILITY_MODE.FULL;
            this.scene.tweens.add({ targets: this.texture, alpha: 0, duration: 500 });
        }
    }

    destroy() {
        this.texture?.destroy();
        this.eraser?.destroy();
    }
}
