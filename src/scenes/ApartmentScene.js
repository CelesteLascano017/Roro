import Phaser from 'phaser';
import {
    COLORS,
    DETECTIVE_CONFIG,
    GAME_HEIGHT,
    GAME_WIDTH,
    HIDING_RULES,
    SCENE_KEYS,
    VISIBILITY_MODE
} from '../data/gameConfig.js';
import {
    BELONGING_SPAWN_POINTS,
    DISTRACTIONS,
    FIXED_SPAWN_POINTS,
    HIDING_SPOTS,
    KEY_TILES
} from '../data/apartmentData.js';
import { EVIDENCE_ITEMS } from '../data/evidenceData.js';
import { INSPECTION_ROUTES, ROOM_SWEEP_POINTS } from '../data/detectiveRoutes.js';
import { formatStoryText } from '../data/dialogueData.js';
import { ApartmentLayout } from '../world/ApartmentLayout.js';
import { ApartmentRenderer } from '../world/ApartmentRenderer.js';
import { CollisionManager } from '../physics/CollisionManager.js';
import { NavigationManager } from '../physics/NavigationManager.js';
import { RoomTriggerSystem } from '../physics/RoomTriggerSystem.js';
import { InputManager } from '../managers/InputManager.js';
import { InteractionManager } from '../managers/InteractionManager.js';
import { EVIDENCE_EVENTS, EvidenceManager } from '../managers/EvidenceManager.js';
import { InspectionManager } from '../managers/InspectionManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { GameSession } from '../managers/GameSession.js';
import { DETECTIVE_EVENTS, DETECTIVE_STATE, DetectiveStateMachine } from '../ai/DetectiveStateMachine.js';
import { CHARACTER_EVENTS } from '../objects/Character.js';
import { Roro } from '../objects/Roro.js';
import { Detective } from '../objects/Detective.js';
import { Door } from '../objects/Door.js';
import { EvidenceItem } from '../objects/EvidenceItem.js';
import { HidingSpot } from '../objects/HidingSpot.js';
import { DistractionSource } from '../objects/DistractionSource.js';
import { HUD } from '../ui/HUD.js';
import { InteractionPrompt } from '../ui/InteractionPrompt.js';
import { NoteInterface } from '../ui/NoteInterface.js';
import { VisibilityOverlay } from '../ui/VisibilityOverlay.js';
import { TouchControls } from '../ui/TouchControls.js';
import { fadeIn, fadeToScene } from './sceneTransitions.js';

const FRONT_DOOR_ID = 'frontDoor';
const VISIT_START_DELAY = 1200;
const END_SCREEN_DELAY = 2400;

/**
 * Main gameplay scene: the apartment.
 *
 * This scene only wires systems together; the rules live in the managers,
 * the detective FSM and the game objects:
 *   ApartmentLayout ─▶ ApartmentRenderer (graphics) / CollisionManager (physics)
 *                    ─▶ NavigationManager (A*) ─▶ Detective ◀─ DetectiveStateMachine
 *   EvidenceManager (states & score) ◀─ EvidenceItem / HidingSpot ◀─ InteractionManager
 *   HUD, VisibilityOverlay, NoteInterface (presentation)
 */
export class ApartmentScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.APARTMENT);
    }

    create() {
        fadeIn(this, 500);
        this.gameOver = false;
        this.difficultySettings = GameSession.getDifficultySettings();

        this.layout = new ApartmentLayout();
        this.apartmentRenderer = new ApartmentRenderer(this, this.layout).build();
        this.collisions = new CollisionManager(this, this.layout);
        this.navigation = new NavigationManager(this.layout, { clearance: DETECTIVE_CONFIG.bodyWidth / 2 + 2 });
        this.inputManager = new InputManager(this);

        this.createDoors();
        this.createCharacters();
        this.createEvidence();
        this.createHidingSpots();
        this.createDistractions();
        this.createUserInterface();
        this.createInteractions();
        this.createDetectiveAI();
        this.setupCamera();

        this.events.on(Phaser.Scenes.Events.RESUME, this.onResume, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);

        AudioManager.playMusic('music-ambience');
        this.hud.showMessage('The detective is at the door. Hide the evidence!', { duration: 3200 });
        this.time.delayedCall(VISIT_START_DELAY, () => this.detectiveAI.start());
    }

    // ================================================================= setup

    createDoors() {
        this.doors = new Map();
        const isRectOccupied = (rect) => this.isRectOccupied(rect);
        for (const definition of this.layout.doors) {
            this.doors.set(definition.id, new Door(this, definition, this.layout, this.collisions, isRectOccupied));
        }
    }

    /** True when Roro's or the detective's body overlaps a world rectangle. */
    isRectOccupied(rect) {
        return [this.roro, this.detective].some((character) => {
            if (!character?.body) {
                return false;
            }
            const body = character.body;
            return body.right > rect.x && body.x < rect.x + rect.width && body.bottom > rect.y && body.y < rect.y + rect.height;
        });
    }

    getDoorAtTile(tile) {
        const doorId = this.layout.getDoorIdAtTile(tile.x, tile.y);
        return doorId ? this.doors.get(doorId) : null;
    }

    createCharacters() {
        this.roro = new Roro(this, this.layout.tileCenter(KEY_TILES.roroStart), this.inputManager);
        this.detective = new Detective(this, this.layout.tileCenter(KEY_TILES.detectiveOutside), {
            navigation: this.navigation,
            layout: this.layout,
            getDoorAtTile: (tile) => this.getDoorAtTile(tile)
        });
        this.detective.setFacing('side', -1);
        this.detective.showIdle();

        this.collisions.attachPlayer(this.roro);
        this.collisions.attachNonPlayer(this.detective);

        this.roomTriggers = new RoomTriggerSystem(this, this.layout);
        this.roomTriggers.track(this.roro, this.roro.getFootPosition());
        this.roomTriggers.track(this.detective, this.detective.getFootPosition());

        this.roro.on(CHARACTER_EVENTS.FOOTSTEP, () => AudioManager.playSfx('sfx-step-roro', { volume: 0.35 }));
        this.detective.on(CHARACTER_EVENTS.FOOTSTEP, () => {
            AudioManager.playPositionalSfx('sfx-step-detective', this.detective.getFootPosition(), this.roro.getFootPosition(), DETECTIVE_CONFIG.footstepHearingDistance);
        });
    }

    createEvidence() {
        this.evidence = new EvidenceManager(EVIDENCE_ITEMS, HIDING_RULES);
        this.evidenceItems = new Map();
        const spawnPoints = EvidenceManager.chooseSpawnPoints(EVIDENCE_ITEMS, BELONGING_SPAWN_POINTS, FIXED_SPAWN_POINTS);

        for (const [id, point] of spawnPoints) {
            const position = this.layout.tilePointToWorld(point);
            this.evidence.setSpawn(id, position, point.room);
            this.evidenceItems.set(id, new EvidenceItem(this, this.evidence.getItem(id), position));
        }

        this.evidence.on(EVIDENCE_EVENTS.STATE_CHANGED, ({ item }) => {
            this.evidenceItems.get(item.id)?.syncVisibility();
            const carried = this.evidence.getCarriedItem();
            this.roro.setCarriedTexture(carried?.definition.textureKey ?? null);
            this.hud?.setCarried(carried?.definition.name ?? null);
        });
        this.evidence.on(EVIDENCE_EVENTS.SCORE_CHANGED, ({ score }) => this.hud?.setScore(score));
    }

    createHidingSpots() {
        this.hidingSpots = HIDING_SPOTS.map((definition) => {
            const spot = new HidingSpot(definition, {
                position: this.layout.tilePointToWorld(definition.point),
                inspectPosition: this.layout.tileCenter(definition.inspectTile)
            }, HIDING_RULES.hidingSpotCapacity);
            const furniture = this.apartmentRenderer.getFurnitureSprite(definition.furnitureId);
            spot.onFocusChange = (focused) => {
                if (focused) {
                    furniture?.setTint(COLORS.focusTint);
                } else {
                    furniture?.clearTint();
                }
            };
            return spot;
        });
    }

    createDistractions() {
        this.distractions = DISTRACTIONS.map((definition) => {
            const source = new DistractionSource(definition, {
                position: this.layout.tilePointToWorld(definition.point),
                investigatePosition: this.layout.tileCenter(definition.investigateTile)
            }, (noiseSource) => this.onDistractionNoise(noiseSource));
            source.highlightTarget = this.apartmentRenderer.getFurnitureSprite(definition.furnitureId);
            return source;
        });
    }

    createUserInterface() {
        this.hud = new HUD(this, { maxScore: this.evidence.getMaxScore(), difficultyLabel: this.difficultySettings.label });
        this.prompt = new InteractionPrompt(this);
        this.noteInterface = new NoteInterface(this);
        this.visibility = new VisibilityOverlay(this, this.layout, this.difficultySettings);
        const touch = TouchControls.isSupported(this);
        if (touch) {
            this.touchControls = new TouchControls(this, this.inputManager);
        }
        this.hud.setTouchMode(touch);
    }

    createInteractions() {
        const context = {
            evidence: this.evidence,
            openNote: (item) => this.openNote(item),
            onEvidenceAction: (result) => this.onEvidenceAction(result)
        };
        this.interaction = new InteractionManager(context, this.prompt);
        this.evidenceItems.forEach((item) => this.interaction.register(item));
        this.hidingSpots.forEach((spot) => this.interaction.register(spot));
        this.doors.forEach((door) => this.interaction.register(door));
        this.distractions.forEach((source) => this.interaction.register(source));
    }

    createDetectiveAI() {
        this.inspection = new InspectionManager({
            routes: INSPECTION_ROUTES,
            sweepPoints: ROOM_SWEEP_POINTS,
            hidingSpots: this.hidingSpots,
            layout: this.layout,
            navigation: this.navigation,
            originTile: KEY_TILES.detectiveEntry
        });

        this.detectiveAI = new DetectiveStateMachine({
            detective: this.detective,
            inspection: this.inspection,
            evidence: this.evidence,
            getPlayerPosition: () => this.roro.getFootPosition(),
            positions: {
                entry: this.layout.tileCenter(KEY_TILES.detectiveEntry),
                exit: this.layout.tileCenter(KEY_TILES.detectiveExit)
            },
            doors: { closeFrontDoor: () => this.doors.get(FRONT_DOOR_ID).close() }
        });

        const ai = this.detectiveAI;
        ai.on(DETECTIVE_EVENTS.STATE_CHANGED, ({ from, to }) => {
            if (import.meta.env.DEV) {
                console.debug(`[Detective] ${from} -> ${to}`);
            }
            this.updatePhaseText();
        });
        ai.on(DETECTIVE_EVENTS.ROUTE_STARTED, ({ route }) => {
            this.hud.showMessage(`The detective starts searching: ${route.name.toLowerCase()}.`);
            this.updatePhaseText();
        });
        ai.on(DETECTIVE_EVENTS.INSPECTION_FINISHED, () => this.updatePhaseText());
        ai.on(DETECTIVE_EVENTS.DISTRACTED, () => this.hud.showMessage('The detective goes to check the noise.'));
        ai.on(DETECTIVE_EVENTS.INTERVIEW_REQUESTED, ({ interviewIndex }) => this.startInterview(interviewIndex));
        ai.on(DETECTIVE_EVENTS.EVIDENCE_DISCOVERED, (payload) => this.onCaught(payload));
        ai.on(DETECTIVE_EVENTS.VISIT_FINISHED, () => this.onVisitFinished());
        ai.on(DETECTIVE_EVENTS.TRANSITION_REJECTED, ({ from, to }) => console.warn(`[Detective] Rejected transition ${from} -> ${to}`));
        this.updatePhaseText();
    }

    setupCamera() {
        const { width, height } = this.layout.getWorldSize();
        const camera = this.cameras.main;
        // When the apartment is narrower than the screen, centre it; leave a
        // margin above and below so walls are not hidden under the HUD.
        const boundsWidth = Math.max(width, GAME_WIDTH);
        const boundsHeight = Math.max(height + 80, GAME_HEIGHT);
        camera.setBounds((width - boundsWidth) / 2, -40, boundsWidth, boundsHeight);
        camera.startFollow(this.roro, true, 0.12, 0.12);
        camera.setFollowOffset(0, 28);
        camera.setBackgroundColor(COLORS.backgroundCss);
    }

    // ================================================================ update

    update(time, delta) {
        if (this.gameOver) {
            return;
        }
        if (this.noteInterface.isOpen) {
            this.noteInterface.update();
            return;
        }
        if (this.inputManager.consumePause()) {
            this.pauseGame();
            return;
        }

        this.roro.update(delta);
        this.detective.update(delta);
        this.detectiveAI.update(delta);
        if (this.gameOver) {
            // The detective just caught Roro or left: stop updating the world.
            return;
        }
        this.distractions.forEach((source) => source.update(delta));

        this.roomTriggers.update();
        const roroPosition = this.roro.getFootPosition();
        this.interaction.update(roroPosition, this.inputManager.consumeInteract());
        this.visibility.update(roroPosition, this.roomTriggers.getLocation(this.roro));
        this.detective.setVisibleToPlayer(this.isDetectiveVisible());
    }

    isDetectiveVisible() {
        const position = this.detective.getFootPosition();
        const location = this.roomTriggers.getLocation(this.detective);
        const outside = location.roomId && this.layout.getRoom(location.roomId)?.outside;
        // In Easy mode the detective is always shown, even on the porch.
        if (outside && this.visibility.mode !== VISIBILITY_MODE.FULL) {
            return false;
        }
        return this.visibility.isPointVisible(position);
    }

    updatePhaseText() {
        const state = this.detectiveAI.state;
        const progress = this.inspection.getProgress();
        const labels = {
            [DETECTIVE_STATE.WAITING]: 'Someone is knocking...',
            [DETECTIVE_STATE.ENTERING]: 'The detective comes in',
            [DETECTIVE_STATE.INTERVIEWING]: 'The detective wants to talk to you',
            [DETECTIVE_STATE.FINISHED]: 'The detective is leaving',
            [DETECTIVE_STATE.CAUGHT]: 'Caught'
        };
        const searchText = `Search ${progress.routeNumber}/${progress.routeCount}: ${progress.routeName} (${progress.pointsDone}/${progress.pointCount})`;
        this.hud.setPhase(labels[state] ?? searchText);
    }

    // ============================================================ interaction

    onEvidenceAction(result) {
        if (!result.ok) {
            const messages = {
                handsFull: 'Your hands are full. Hide what you are carrying first.',
                occupied: 'Something is already hidden there.',
                nothingCarried: 'You are not carrying anything.'
            };
            this.hud.showMessage(messages[result.reason] ?? 'You cannot do that now.', { color: COLORS.textMuted });
            return;
        }
        AudioManager.playSfx('sfx-interact');
        const name = result.item.definition.name;
        switch (result.action) {
            case 'pickUp':
                this.hud.showMessage(`You picked up the ${name}. Find a place to hide it.`);
                break;
            case 'hide':
                this.hud.showMessage(`You hid the ${name} ${result.hidingSpot.name}. +1`, { color: COLORS.success });
                break;
            case 'retrieve':
                this.hud.showMessage(`You took the ${name} back. -1`, { color: COLORS.accent });
                break;
            default:
                break;
        }
    }

    openNote(item) {
        this.setWorldSuspended(true);
        this.interaction.clearFocus();
        this.noteInterface.open(() => {
            this.evidence.markRead(item.id);
            this.setWorldSuspended(false);
            this.hud.showMessage(formatStoryText('{victimName}. The note has to disappear too.'));
        });
    }

    /** Freezes physics and animations while a modal interface is open. */
    setWorldSuspended(suspended) {
        if (suspended) {
            this.physics.pause();
            this.roro.anims.pause();
            this.detective.anims.pause();
        } else {
            this.physics.resume();
            this.roro.anims.resume();
            this.detective.anims.resume();
            this.inputManager.reset();
        }
    }

    onDistractionNoise(source) {
        AudioManager.playSfx('sfx-kettle');
        const redirected = this.detectiveAI.notifyDistraction(source);
        this.hud.showMessage(redirected ? source.definition.noiseText : `${source.definition.noiseText} Nobody comes to check.`);
    }

    // ======================================================== scene changes

    pauseGame() {
        this.roro.setControlsEnabled(false);
        this.scene.launch(SCENE_KEYS.PAUSE);
        this.scene.pause();
    }

    startInterview(interviewIndex) {
        this.roro.setControlsEnabled(false);
        this.interaction.clearFocus();
        this.scene.launch(SCENE_KEYS.DIALOGUE, { interviewIndex });
        this.scene.pause();
    }

    onResume(_systems, data = {}) {
        this.inputManager.reset();
        this.roro.setControlsEnabled(true);
        if (data.interviewCompleted) {
            this.detectiveAI.completeInterview();
            this.hud.showMessage('The detective goes back to searching.');
        }
    }

    onCaught({ discoveries, point }) {
        if (this.gameOver) {
            return;
        }
        this.gameOver = true;
        this.physics.pause();
        this.roro.setControlsEnabled(false);
        this.detective.setVisibleToPlayer(true);
        this.visibility.reveal();
        this.interaction.clearFocus();

        const { item, reason, hidingSpot } = discoveries[0];
        const roomName = this.layout.getRoom(point.room)?.name.toLowerCase() ?? 'apartment';
        const where = reason === 'hidingSpot' ? hidingSpot.name : `lying in the ${roomName}`;
        const message = `The detective found the ${item.definition.name} ${where}.`;
        this.hud.showMessage(message, { duration: END_SCREEN_DELAY, color: COLORS.danger });

        AudioManager.stopMusic();
        AudioManager.playSfx('sfx-defeat');
        this.cameras.main.shake(400, 0.008);
        this.cameras.main.flash(300, 120, 0, 0);

        GameSession.finishGame({ won: false, score: this.evidence.getScore(), maxScore: this.evidence.getMaxScore(), reason: message });
        this.time.delayedCall(END_SCREEN_DELAY, () => fadeToScene(this, SCENE_KEYS.DEFEAT, {}, 600));
    }

    onVisitFinished() {
        if (this.gameOver) {
            return;
        }
        this.gameOver = true;
        this.physics.pause();
        this.roro.setControlsEnabled(false);
        this.interaction.clearFocus();
        this.hud.showMessage('The front door closes. The detective is gone.', { duration: END_SCREEN_DELAY, color: COLORS.success });
        AudioManager.stopMusic();
        AudioManager.playSfx('sfx-victory');

        GameSession.finishGame({ won: true, score: this.evidence.getScore(), maxScore: this.evidence.getMaxScore() });
        this.time.delayedCall(END_SCREEN_DELAY, () => fadeToScene(this, SCENE_KEYS.VICTORY, {}, 600));
    }

    onShutdown() {
        this.events.off(Phaser.Scenes.Events.RESUME, this.onResume, this);
        this.detectiveAI?.removeAllListeners();
        this.evidence?.removeAllListeners();
        this.visibility?.destroy();
    }
}
