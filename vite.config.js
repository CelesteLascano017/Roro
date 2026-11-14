import { existsSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { defineConfig } from 'vite';

const PUBLIC_DIR = resolve('public');
const VIRTUAL_ID = 'virtual:available-assets';
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

/** Lists every file under public/ as a path relative to it (e.g. "assets/x.png"). */
function listPublicFiles(directory = PUBLIC_DIR) {
    if (!existsSync(directory)) {
        return [];
    }
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = join(directory, entry.name);
        return entry.isDirectory() ? listPublicFiles(fullPath) : [relative(PUBLIC_DIR, fullPath).split(sep).join('/')];
    });
}

/**
 * Exposes the list of files present in public/ as `virtual:available-assets`.
 * The AssetManager uses it to skip optional assets that have not been added
 * yet, instead of requesting them and logging load errors. Adding or removing
 * a file in public/ reloads the page during development.
 */
function availableAssetsPlugin() {
    return {
        name: 'roro-available-assets',
        resolveId(id) {
            return id === VIRTUAL_ID ? RESOLVED_VIRTUAL_ID : null;
        },
        load(id) {
            return id === RESOLVED_VIRTUAL_ID ? `export default ${JSON.stringify(listPublicFiles())};` : null;
        },
        configureServer(server) {
            const onChange = (file) => {
                if (!resolve(file).startsWith(PUBLIC_DIR)) {
                    return;
                }
                const graphs = [server.moduleGraph, ...Object.values(server.environments ?? {}).map((environment) => environment.moduleGraph)];
                for (const graph of graphs) {
                    const module = graph?.getModuleById(RESOLVED_VIRTUAL_ID);
                    if (module) {
                        graph.invalidateModule(module);
                    }
                }
                server.ws.send({ type: 'full-reload' });
            };
            server.watcher.add(PUBLIC_DIR);
            server.watcher.on('add', onChange);
            server.watcher.on('unlink', onChange);
        }
    };
}

export default defineConfig({
    plugins: [availableAssetsPlugin()],
    // Relative paths so the production build in dist/ works from any folder
    // (for example when the project is delivered as a ZIP).
    base: './',
    build: {
        // Phaser alone is ~1.2 MB minified; this is expected for a Phaser game.
        chunkSizeWarningLimit: 1600
    }
});
