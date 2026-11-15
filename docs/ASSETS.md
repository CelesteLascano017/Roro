# RORO — Asset Inventory

This document records the external assets used in the project.

Asset files are provisional and may be replaced during development. Their source and license information must be preserved.

## 1. Characters

### 1.1 Roro

- **Source:** Lexlom — 32 Free Animated Characters Pack
- **Character:** Brown-haired character.
- **Original spritesheet:** `VillagersSheetPNG.png`
- **Format:** PNG, transparent.
- **Original dimensions:** 1516 × 810 px.
- **Animations:** Idle and walking.
- **Orientations:** Front, back, side.
- **License:** CC0, as indicated by the asset creator.

Files:

```text
characters/roro/
├── idle/
│   ├── front.png
│   ├── back.png
│   └── side.png
└── walk/
    ├── front/
    ├── back/
    └── side/
```

### 1.2 Detective

- **Source:** Lexlom — 32 Free Animated Characters Pack
- **Character:** Blonde-haired character with blue clothing.
- **Original spritesheet:** `VillagersSheetPNG.png`
- **Format:** PNG, transparent.
- **Original dimensions:** 1516 × 810 px.
- **Animations:** Idle and walking.
- **Orientations:** Front, back, side.
- **License:** CC0, as indicated by the asset creator.

Files:

```text
characters/detective/
├── idle/
│   ├── front.png
│   ├── back.png
│   └── side.png
└── walk/
    ├── front/
    ├── back/
    └── side/
```

Both characters originate from the same spritesheet to maintain visual consistency.

## 2. Environment

### 2.1 Interior Tileset

- **Name:** Pixel Lands — Interiors Demo
- **Creator:** Trislin
- **File:** `interiors_demo.png`
- **Dimensions:** 256 × 176 px.
- **Format:** PNG, transparent.
- **Tile scale:** 16 × 16 px assets.
- **Contents:** Floors, walls, furniture, decorations, beds, chairs, sofas, tables, plants, books, rugs, and other interior elements.
- **License:** Verify the applicable terms on the original asset page.

Source: https://trislin.itch.io/pixel-lands-interiors

Location:

```text
environment/tilesets/interiors_demo.png
```

### 2.2 Furniture

Furniture is reused from the Pixel Lands Interiors tileset.

No additional furniture pack is currently required.

## 3. Evidence and Interactive Objects

### 3.1 Victim's Belongings

Four objects are used as evidence belonging to the victim.

| Object | Description | Status |
|---|---|---|
| Compass-like object | First belonging | Downloaded; original filename to verify |
| Star-shaped object | Second belonging | Downloaded; original filename to verify |
| Framed map | Third belonging | Downloaded; original filename to verify |
| Blue backpack | Fourth belonging | Downloaded; original filename to verify |

These objects will appear at predefined random spawn points in the apartment.

### 3.2 Murder Weapon

- **Object:** Baseball bat.
- **Status:** Downloaded; original filename to verify.
- **Usage:** Interactive evidence object.

### 3.3 Victim's Note

- **Object:** Small paper note.
- **Status:** To be implemented using the paper graphic and Phaser text.
- **Interaction:** Opens an enlarged note interface.
- **Dynamic content:** Victim's full name.

## 4. User Interface

The interface will primarily be implemented using Phaser.

Planned elements:

- Main menu.
- Difficulty selection.
- HUD and score.
- Dialogue boxes.
- Enlarged note interface.
- Pause menu.
- Victory screen.
- Defeat screen.
- Buttons and icons.

### 4.1 Font

- **Name:** m6x11 Medium.
- **File:** Original font file to verify.
- **Format:** TTF or OTF, depending on the downloaded file.
- **Status:** Downloaded; license and exact filename to verify.

Location:

```text
ui/fonts/
```

## 5. Audio

Background music and all declared sound effects are now integrated.

Planned resources:

| Asset | Status |
|---|---|
| Background music | Integrated |
| Roro footsteps | Integrated |
| Detective footsteps | Integrated |
| Door knocking | Integrated |
| Door opening and closing | Integrated |
| Object interaction | Integrated |
| Victory and defeat sounds | Integrated |

Required academic features:

- Background music.
- At least two sound effects.
- Mute button.

## 6. Asset Sources

| Asset | Source |
|---|---|
| Characters | https://lexlom.itch.io/32-character-pack-pixel-art-4-direction-idle-walking |
| Interior tileset | https://trislin.itch.io/pixel-lands-interiors |
| Victim belongings | Original downloaded item pack; exact source and filename to verify |
| Baseball bat | Original downloaded item pack; exact source and filename to verify |
| Font | m6x11 Medium; exact source to verify |

## 7. Compatibility Checklist

- [ ] Confirm character image dimensions.
- [ ] Confirm walking animation frame order.
- [ ] Confirm idle image dimensions.
- [ ] Confirm furniture and environment scale.
- [ ] Confirm evidence object dimensions.
- [ ] Confirm font file and browser compatibility.
- [ ] Verify asset licenses and retain source information.
- [ ] Test all transparent PNG files in Phaser.

## 8. Asset Management Rules

- Preserve original downloaded assets.
- Do not overwrite original spritesheets.
- Keep assets organized by category.
- Do not assume all images use the same frame dimensions.
- Do not introduce new asset packs without checking visual compatibility.
- Assets can be replaced without changing gameplay logic whenever possible.
- Update this inventory whenever an asset is added, removed, or replaced.
## Integrated background music

The following MP3 files were supplied locally and are loaded by the asset manifest. Audio files have no image dimensions. Their original source and license remain to be recorded.

| File | Usage | Status |
|---|---|---|
| `public/assets/sounds/menu_sound.mp3` | Main menu | Integrated; source and license unverified |
| `public/assets/sounds/suspenseful.mp3` | Active gameplay | Integrated; source and license unverified |
| `public/assets/sounds/rest_sound.mp3` | Difficulty, introduction, pause, interviews and results | Integrated; source and license unverified |

Background music is now integrated. The earlier audio checklist still applies to the missing sound effects.

## Door knocking effect

- File: `public/assets/sounds/door_knock.wav`.
- Format: PCM WAV, mono, 44100 Hz, 16 bit, 0.6 seconds.
- Content: three synthesized wooden-door impacts.
- Source: original procedural audio generated for this project; no external recording or sample.
- Usage: plays once when the introduction displays `KNOCK. KNOCK. KNOCK.` / `TOC. TOC. TOC.`. Uses the existing SFX volume and mute settings.

## Evidence and detective effects

Original procedural audio generated for this project; no external recording or sample. All three files use mono PCM WAV, 44100 Hz, 16 bit.

| File | Duration | Use |
|---|---|---|
| `public/assets/sounds/item_pickup.wav` | 0.24 s | Successful pickup or retrieval |
| `public/assets/sounds/item_hide.wav` | 0.27 s | Successful hide |
| `public/assets/sounds/footstep_detective.wav` | 0.16 s | Detective movement, audible within 96 world pixels of Roro |

## Completed sound effects

Original procedural audio generated for this project, with no external recordings or samples. Reproduce these eight effects with `node scripts/generate-effects.mjs`. Format: mono PCM WAV, 44100 Hz, 16 bit; image dimensions do not apply. These original effects are included under the project license (ISC); no third-party sample license is needed.

| File in public/assets/sounds | Duration | Use |
|---|---|---|
| `footstep_roro.wav` | 0.13 s | Roro movement |
| `door_open.wav` | 0.55 s | Door latch and creak |
| `door_close.wav` | 0.32 s | Door closing thud |
| `paper_rustle.wav` | 0.22 s | Reading the note |
| `kettle_whistle.wav` | 2.00 s | Kettle distraction, once after heating |
| `ui_select.wav` | 0.09 s | Button activation |
| `victory.wav` | 1.20 s | Winning a game |
| `defeat.wav` | 1.25 s | Being caught |
