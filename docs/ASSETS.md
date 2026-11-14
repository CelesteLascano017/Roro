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

Audio will be incorporated after the initial gameplay implementation.

Planned resources:

| Asset | Status |
|---|---|
| Background music | Pending |
| Roro footsteps | Pending |
| Detective footsteps | Pending |
| Door knocking | Pending |
| Door opening and closing | Pending |
| Object interaction | Pending |
| Victory and defeat sounds | Pending |

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