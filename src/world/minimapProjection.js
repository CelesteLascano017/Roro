/**
 * Proyeccion del mundo al minimapa. Funciones puras, sin Phaser: se pueden
 * verificar con Node (npm test) y el componente visual solo dibuja el resultado.
 */

// Pixeles de pantalla que ocupa cada tile del departamento en el minimapa.
export const MINIMAP_CELL = 5;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * @param {import('./ApartmentLayout.js').ApartmentLayout} layout
 * @param {number} cell pixeles por tile en el minimapa
 */
export function createMinimapProjection(layout, cell = MINIMAP_CELL) {
    const width = layout.width * cell;
    const height = layout.height * cell;
    const toRect = (rect) => ({ x: rect.x * cell, y: rect.y * cell, width: rect.w * cell, height: rect.h * cell });

    return {
        cell,
        width,
        height,

        /** Punto del mundo (pixeles) a punto del minimapa, limitado a sus bordes. */
        toMap(point) {
            return {
                x: clamp((point.x / layout.tileSize) * cell, 0, width),
                y: clamp((point.y / layout.tileSize) * cell, 0, height)
            };
        },

        roomRect(roomId) {
            const room = layout.getRoom(roomId);
            return room ? toRect(room.rect) : null;
        },

        doorRect(doorId) {
            const door = layout.getDoor(doorId);
            return door ? toRect(door.rect) : null;
        }
    };
}

/**
 * Marcadores a dibujar. El detective solo aparece si el juego ya lo muestra al
 * jugador (detectiveVisible), asi el minimapa no revela mas que la pantalla.
 */
export function getMinimapMarkers(projection, { player, detective, detectiveVisible }) {
    const markers = [{ kind: 'player', ...projection.toMap(player) }];
    if (detectiveVisible) {
        markers.push({ kind: 'detective', ...projection.toMap(detective) });
    }
    return markers;
}
