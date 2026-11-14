/**
 * Fade-out / fade-in helpers shared by all scenes.
 */
const FADE_DURATION = 300;

export function fadeIn(scene, duration = FADE_DURATION) {
    scene.cameras.main.fadeIn(duration, 0, 0, 0);
}

/** Fades the camera to black, then starts `key`. Ignores repeated calls. */
export function fadeToScene(scene, key, data = {}, duration = FADE_DURATION) {
    if (scene.isTransitioning) {
        return;
    }
    scene.isTransitioning = true;
    scene.cameras.main.fadeOut(duration, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', () => {
        scene.isTransitioning = false;
        scene.scene.start(key, data);
    });
}
