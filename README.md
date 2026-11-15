# Roro

A 2D top-down psychological thriller / stealth game made with **Phaser 3.90**, **JavaScript (ES modules)** and **Vite**.

For six months Roro has been waking up with no memory of the night before, and finding evidence in the apartment. This month, the police knock before Roro has finished hiding it. Find the six pieces of evidence and hide them before the detective finds them.

## Running the game

```bash
npm install
npm run dev          # development server (http://localhost:5173)
npm run build        # production build in dist/
npm run preview      # serve the production build
npm test             # automated logic checks (level data, navigation, scoring, detective FSM)
npm run check-assets # report of present / missing asset files
```

Development URL options:

- `?debug` draws the Arcade Physics bodies.
- `?touch` forces the on-screen touch controls on a desktop.

## Background music

- Main menu: `public/assets/sounds/menu_sound.mp3`.
- Active gameplay: `public/assets/sounds/suspenseful.mp3`.
- Difficulty, introduction, pause, interviews and results: `public/assets/sounds/rest_sound.mp3`.

Tracks loop, replace the previous track, and respect the saved mute and volume settings. Gameplay music returns when resuming after pause or an interview.

## Language

Use **Language: English / Idioma: Espanol** in the main menu to switch languages. The selection is saved locally and applies to menus, instructions, story, interviews and gameplay messages.

## Controls

| Key | Action |
|---|---|
| W A S D / Arrow keys | Move |
| E | Interact: pick up, hide, take back, read the note, open/close doors, switch on the kettle |
| ESC | Pause |
| M | Sound on/off |
| Enter / Space | Confirm in menus and dialogues |

Touch devices get an on-screen pad, an **E** button and a pause button.

## How to play

- There are **six pieces of evidence**: four of the victim's belongings (random positions), the baseball bat and the victim's note. Each object hidden is worth **1 point (max 6)**.
- Roro carries **one object at a time**. Bring it to a hiding place and press E.
- The detective searches in **four rounds**: very obvious places (and a look around every room), not so obvious places, hidden places, and very hidden places (the last round is faster). He interviews Roro after each of the first three rounds.
- He searches each hiding place **once**. Evidence in a hiding place he is searching, or lying near him while he searches, is found and advances the case. The detective needs 3 objects on Easy, 2 on Normal, or 1 on Hard to solve it and end the game. A place he has already searched is safe, and hidden objects can be taken back and moved.
- The kettle in the kitchen makes a noise that draws the detective away for a moment.
- If the detective finishes his visit before solving the case, Roro wins.

Difficulty changes evidence required and visibility: **Easy** shows everything, **Normal** shows only Roro's room, **Hard** shows a small circle around Roro. Listen for the detective's footsteps.

## Project structure

```text
src/
├── main.js                 Phaser configuration and scene list
├── data/                   All configuration and content (no logic)
│   ├── gameConfig.js       Resolution, speeds, timings, difficulty, story constants
│   ├── assetManifest.js    Every asset key, path and processing option
│   ├── apartmentData.js    Rooms, doors, furniture, hiding places, spawn points
│   ├── evidenceData.js     The six evidence objects, evidence states, note text
│   ├── detectiveRoutes.js  The four inspection routes and room sweep points
│   ├── dialogueData.js     Introduction and the three interviews
│   ├── animationData.js    Character animation definitions
│   └── tilesetData.js      Regions of the interior tileset
├── scenes/                 Boot, Preload, MainMenu, Difficulty, Introduction,
│                           Apartment (gameplay), Dialogue, Pause, Victory, Defeat
├── world/                  ApartmentLayout (pure level model), ApartmentRenderer (graphics)
├── physics/                CollisionManager (static bodies), NavigationManager (A*),
│                           RoomTriggerSystem (overlap triggers per room)
├── ai/                     DetectiveStateMachine (finite state machine)
├── objects/                Character, Roro, Detective, Door, EvidenceItem, HidingSpot,
│                           DistractionSource, InteractiveObject (base class)
├── managers/               Asset, Audio, Save (localStorage), GameSession, Evidence,
│                           Inspection, Interaction, Input
├── ui/                     HUD, InteractionPrompt, NoteInterface, DialogueBox,
│                           VisibilityOverlay, TouchControls, Button, MuteButton
└── utils/                  Image processing, random helpers, event emitter
scripts/
├── verify-logic.mjs        npm test
└── check-assets.mjs        npm run check-assets
```

The level model, navigation, evidence rules, inspection routes and detective FSM have no Phaser dependency, so they are tested in Node by `npm test`.

### Detective state machine

```text
WAITING -> ENTERING -> INSPECTING -> INTERVIEWING -> INSPECTING ... -> FINISHED (victory)
                          |   ^                                  
                          |   +---- RETURNING <- REDIRECTED (distraction)
                          +-> CAUGHT (defeat)
```

Allowed transitions are listed in `DETECTIVE_TRANSITIONS` (`src/ai/DetectiveStateMachine.js`); any other transition is rejected.

## Adding the missing assets

Asset paths are declared in `src/data/assetManifest.js`. Put a file at the declared path and it is used automatically (the dev server reloads). Until then:

- missing images use a programmatic placeholder outlined in magenta (doors, kitchen and bathroom fixtures) or reuse an existing sprite (dialogue portraits);
- missing sounds are silently skipped.

Run `npm run check-assets` for the full list of expected files.

The cropped character and object PNGs contain an opaque background. It is removed in memory when the game loads; the files on disk are not modified.

## Credits

- Characters: Lexlom, *32 Free Animated Characters Pack* (CC0), https://lexlom.itch.io/32-character-pack-pixel-art-4-direction-idle-walking
- Interior tileset: Trislin, *Pixel Lands Interiors (demo)*, https://trislin.itch.io/pixel-lands-interiors
- Font: m6x11 by Daniel Linssen (license to be confirmed, see `docs/ASSETS.md`)
- Evidence objects: see `docs/ASSETS.md` (source to be confirmed)

### Volume and interaction sounds

The pause menu volume bar supports clicking, dragging, touch, and Left / Right keys. It controls music and effects from 0 to 100%, saves the setting, and respects mute. Picking up or retrieving evidence and successfully hiding evidence play distinct effects. Detective footsteps fade to silence at 96 world pixels (three tiles) from Roro.

All declared sound effects are present, including Roro footsteps, doors, note rustling, kettle whistle, menu activation and game outcomes. The kettle whistles once after its heating delay. Effects respect mute and the saved volume.

### Case pressure

The HUD shows case evidence found and how many objects are still needed. Each distinct discovered object counts once. With 3 objects remaining, gameplay music plays at 1.0 speed; with 2, at 1.15; with 1, at 1.3. A soft red border and tint become stronger as the count falls. Hard begins at maximum tension. The effect stays below the HUD and prompts and does not change visibility. Pause and interviews retain case progress. Restart clears it. Rest music remains at 0.75.
