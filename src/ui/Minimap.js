import { t } from '../managers/LanguageManager.js';
import { SaveManager } from '../managers/SaveManager.js';
import { CELL_TYPE } from '../world/ApartmentLayout.js';
import { createMinimapProjection, getMinimapMarkers } from '../world/minimapProjection.js';
import { COLORS, DEPTH, GAME_WIDTH } from '../data/gameConfig.js';
import { textStyle } from './textStyles.js';

const STATIC_TEXTURE_KEY = 'minimap-static';
const PADDING = 4;
const HEADER_HEIGHT = 20;
const SCREEN_MARGIN = 12;
const TOP = 44; // Debajo de la barra del HUD (36 px).
// Espacio extra a la derecha para no tapar el boton de pausa tactil.
const TOUCH_SHIFT = 64;

const FLOOR_COLOR = 0x4a3f5c;
const OUTSIDE_COLOR = 0x2f2a3a;
const WALL_COLOR = 0x14121b;
const DOOR_CLOSED_COLOR = 0xb5793a;
const DOOR_OPEN_COLOR = 0x8fd19e;

/**
 * Minimapa fijo a la camara en la esquina superior derecha.
 *
 * El plano (paredes y suelos) se dibuja una sola vez en una textura. Cada cuadro
 * solo se mueven dos marcadores y, cuando cambian, la habitacion resaltada y el
 * estado de las puertas. No muestra pruebas ni escondites. El detective aparece
 * unicamente cuando el juego ya lo muestra al jugador.
 *
 * La barra superior siempre es visible: tocarla (o pulsar N) pliega o despliega
 * el mapa, y la preferencia se guarda en SaveManager.
 */
export class Minimap {
    /**
     * @param {Phaser.Scene} scene
     * @param {import('../world/ApartmentLayout.js').ApartmentLayout} layout
     * @param {{ touch?: boolean }} options touch desplaza el mapa junto al boton de pausa
     */
    constructor(scene, layout, { touch = false } = {}) {
        this.scene = scene;
        this.layout = layout;
        this.projection = createMinimapProjection(layout);
        this.expanded = SaveManager.isMinimapVisible();
        this.highlightKey = null;
        this.doorStateKey = null;

        const width = this.projection.width + PADDING * 2;
        const x = GAME_WIDTH - SCREEN_MARGIN - width - (touch ? TOUCH_SHIFT : 0);
        this.container = scene.add.container(x, TOP).setScrollFactor(0, 0, true).setDepth(DEPTH.hud);

        this.header = scene.add.rectangle(0, 0, width, HEADER_HEIGHT, COLORS.panel, 0.9)
            .setOrigin(0, 0).setStrokeStyle(2, COLORS.panelBorder);
        this.title = scene.add.text(width / 2, HEADER_HEIGHT / 2, t('MAP (N)'), textStyle({ color: COLORS.textMuted })).setOrigin(0.5);
        this.header.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
            event?.stopPropagation();
            this.toggle();
        });

        this.body = scene.add.container(0, HEADER_HEIGHT);
        this.body.add(this.createBackground(width));
        this.createStaticLayer();
        this.highlight = scene.add.graphics({ x: PADDING, y: PADDING });
        this.doorGraphics = scene.add.graphics({ x: PADDING, y: PADDING });
        this.playerMarker = scene.add.circle(0, 0, 3, COLORS.accentHex).setStrokeStyle(1, 0x000000);
        this.detectiveMarker = scene.add.circle(0, 0, 3, COLORS.dangerHex).setStrokeStyle(1, 0x000000).setVisible(false);
        this.body.add([this.highlight, this.doorGraphics, this.playerMarker, this.detectiveMarker]);

        this.container.add([this.header, this.title, this.body]);
        this.applyExpanded();
    }

    createBackground(width) {
        return this.scene.add.rectangle(0, 0, width, this.projection.height + PADDING * 2, COLORS.background, 0.82)
            .setOrigin(0, 0).setStrokeStyle(2, COLORS.panelBorder);
    }

    /** Dibuja el plano una vez y lo convierte en textura; despues solo es una imagen. */
    createStaticLayer() {
        const { scene, layout, projection } = this;
        const cell = projection.cell;
        const graphics = scene.make.graphics({ x: 0, y: 0 }, false);
        for (let y = 0; y < layout.height; y++) {
            for (let x = 0; x < layout.width; x++) {
                const type = layout.getCell(x, y);
                if (type === CELL_TYPE.VOID) {
                    continue;
                }
                const room = layout.getRoom(layout.getRoomIdAtTile(x, y));
                const color = type === CELL_TYPE.WALL ? WALL_COLOR : room?.outside ? OUTSIDE_COLOR : FLOOR_COLOR;
                graphics.fillStyle(color, 1);
                graphics.fillRect(x * cell, y * cell, cell, cell);
            }
        }
        if (scene.textures.exists(STATIC_TEXTURE_KEY)) {
            scene.textures.remove(STATIC_TEXTURE_KEY);
        }
        graphics.generateTexture(STATIC_TEXTURE_KEY, projection.width, projection.height);
        graphics.destroy();
        this.body.add(scene.add.image(PADDING, PADDING, STATIC_TEXTURE_KEY).setOrigin(0, 0));
    }

    /**
     * @param {object} state
     * @param {{x:number,y:number}} state.player pies de Roro en el mundo
     * @param {{x:number,y:number}} state.detective pies del detective en el mundo
     * @param {boolean} state.detectiveVisible el juego muestra ahora al detective
     * @param {{rooms:string[]}} state.location ubicacion de Roro (RoomTriggerSystem)
     * @param {Map<string,{isOpen:boolean}>} state.doors puertas de la escena
     */
    update({ player, detective, detectiveVisible, location, doors }) {
        if (!this.expanded) {
            return;
        }
        for (const marker of getMinimapMarkers(this.projection, { player, detective, detectiveVisible: Boolean(detectiveVisible) })) {
            const target = marker.kind === 'player' ? this.playerMarker : this.detectiveMarker;
            target.setPosition(PADDING + marker.x, PADDING + marker.y);
        }
        this.detectiveMarker.setVisible(Boolean(detectiveVisible));
        this.refreshHighlight(location.rooms);
        this.refreshDoors(doors);
    }

    refreshHighlight(rooms) {
        const key = rooms.join('|');
        if (key === this.highlightKey) {
            return;
        }
        this.highlightKey = key;
        this.highlight.clear().fillStyle(COLORS.accentHex, 0.28);
        for (const roomId of rooms) {
            const rect = this.projection.roomRect(roomId);
            if (rect) {
                this.highlight.fillRect(rect.x, rect.y, rect.width, rect.height);
            }
        }
    }

    /** Redibuja las puertas solo cuando alguna cambia de estado. */
    refreshDoors(doors) {
        const key = this.layout.doors.map((door) => (doors.get(door.id)?.isOpen ? 1 : 0)).join('');
        if (key === this.doorStateKey) {
            return;
        }
        this.doorStateKey = key;
        this.doorGraphics.clear();
        for (const door of this.layout.doors) {
            const rect = this.projection.doorRect(door.id);
            this.doorGraphics.fillStyle(doors.get(door.id)?.isOpen ? DOOR_OPEN_COLOR : DOOR_CLOSED_COLOR, 1);
            this.doorGraphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
    }

    toggle() {
        this.expanded = !this.expanded;
        SaveManager.setMinimapVisible(this.expanded);
        this.applyExpanded();
        // Al volver a mostrarlo, fuerza el redibujado del resaltado y las puertas.
        this.highlightKey = null;
        this.doorStateKey = null;
    }

    applyExpanded() {
        this.body.setVisible(this.expanded);
        this.title.setColor(this.expanded ? COLORS.textMuted : COLORS.accent);
    }

    destroy() {
        this.container.destroy();
    }
}
