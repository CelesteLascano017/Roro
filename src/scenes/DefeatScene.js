import { COLORS, SCENE_KEYS } from '../data/gameConfig.js';
import { ResultScene } from './ResultScene.js';

/** Shown when the detective discovers decisive evidence. */
export class DefeatScene extends ResultScene {
    constructor() {
        super(SCENE_KEYS.DEFEAT, {
            title: 'CAUGHT',
            color: COLORS.danger,
            message: (result) => `${result.reason ?? 'The detective found the evidence.'}\nThe routine is over.`
        });
    }
}
