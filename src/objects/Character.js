import Phaser from 'phaser';
import { DEPTH } from '../data/gameConfig.js';
import { DIRECTION, idleTextureKey, walkAnimationKey } from '../data/animationData.js';

export const CHARACTER_EVENTS = Object.freeze({
    FOOTSTEP: 'footstep'
});

/**
 * Base class for Roro and the detective: a physics sprite with a small body
 * at the feet, three visual orientations (front, back, side) and footsteps.
 *
 * Position convention: the sprite origin is at the bottom-centre (the feet).
 * `getFootPosition()` returns the centre of the physics body, which is the
 * point used for navigation, interaction distances and room detection.
 */
export class Character extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {{x:number,y:number}} footPosition
     * @param {string} characterKey 'roro' | 'detective'
     * @param {{bodyWidth:number, bodyHeight:number, footstepInterval:number}} config
     */
    constructor(scene, footPosition, characterKey, config) {
        super(scene, footPosition.x, footPosition.y + config.bodyHeight / 2, idleTextureKey(characterKey, DIRECTION.FRONT));
        this.characterKey = characterKey;
        this.config = config;
        this.facing = DIRECTION.FRONT;
        this.isWalking = false;
        this.footstepTimer = 0;
        this.footPosition = { x: 0, y: 0 };

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 1);
        // All frames of a character share one size (see AssetManager), so the
        // body offset computed once stays aligned with the feet.
        this.body.setSize(config.bodyWidth, config.bodyHeight);
        this.body.setOffset((this.width - config.bodyWidth) / 2, this.height - config.bodyHeight);
        this.updateDepth();
    }

    getFootPosition() {
        this.footPosition.x = this.x;
        this.footPosition.y = this.y - this.config.bodyHeight / 2;
        return this.footPosition;
    }

    /**
     * Places the character so that its feet are centred on a world point.
     *
     * Note: Arcade's `body.reset()` is not used because it aligns the body
     * with the sprite's top-left corner and ignores the feet offset.
     */
    placeAtFoot(position) {
        this.setPosition(position.x, position.y + this.config.bodyHeight / 2);
        const body = this.body;
        body.stop();
        body.updateFromGameObject();
        body.prev.copy(body.position);
        body.prevFrame.copy(body.position);
        this.updateDepth();
    }

    /**
     * Chooses the orientation and animation from a velocity.
     * The dominant axis decides the direction; when both axes are equal
     * (diagonal), the current orientation is kept to avoid flickering.
     */
    updateAnimation(velocityX, velocityY) {
        const moving = Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5;

        if (moving) {
            const absX = Math.abs(velocityX);
            const absY = Math.abs(velocityY);
            let direction = this.facing;
            if (absX > absY + 0.5) {
                direction = DIRECTION.SIDE;
            } else if (absY > absX + 0.5) {
                direction = velocityY < 0 ? DIRECTION.BACK : DIRECTION.FRONT;
            } else if (this.facing === DIRECTION.FRONT || this.facing === DIRECTION.BACK) {
                direction = velocityY < 0 ? DIRECTION.BACK : DIRECTION.FRONT;
            }
            this.setFacing(direction, velocityX);
            this.anims.play(walkAnimationKey(this.characterKey, this.facing), true);
        } else if (this.isWalking) {
            this.showIdle();
        }

        this.isWalking = moving;
        this.updateDepth();
    }

    setFacing(direction, horizontalHint = 0) {
        this.facing = direction;
        if (direction === DIRECTION.SIDE && horizontalHint !== 0) {
            // The side frames face right; left reuses them mirrored.
            this.setFlipX(horizontalHint < 0);
        } else if (direction !== DIRECTION.SIDE) {
            this.setFlipX(false);
        }
    }

    showIdle() {
        this.anims.stop();
        this.setTexture(idleTextureKey(this.characterKey, this.facing));
    }

    /** Turns to look at a world point while standing still. */
    faceTowards(target) {
        const foot = this.getFootPosition();
        const dx = target.x - foot.x;
        const dy = target.y - foot.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            this.setFacing(DIRECTION.SIDE, dx);
        } else {
            this.setFacing(dy < 0 ? DIRECTION.BACK : DIRECTION.FRONT);
        }
        this.showIdle();
        this.isWalking = false;
    }

    /** Emits FOOTSTEP at a regular interval while walking. */
    updateFootsteps(delta) {
        if (!this.isWalking) {
            this.footstepTimer = this.config.footstepInterval * 0.5;
            return;
        }
        this.footstepTimer -= delta;
        if (this.footstepTimer <= 0) {
            this.footstepTimer += this.config.footstepInterval;
            this.emit(CHARACTER_EVENTS.FOOTSTEP, this);
        }
    }

    updateDepth() {
        this.setDepth(DEPTH.worldBase + this.y);
    }
}
