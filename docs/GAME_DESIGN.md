# RORO — Game Design Document

## 1. Game Overview

- **Title:** Roro
- **Genre:** Psychological Thriller / Stealth / Narrative Adventure
- **Perspective:** 2D Top-Down
- **Visual Style:** Pixel Art
- **Framework:** Phaser.js
- **Platform:** Web Browser
- **Scope:** One playable level — Roro's apartment

## 2. Premise

For six months, Roro has been waking up without remembering what happened during the previous night.

Each month, Roro discovers disturbing evidence: bloodied clothes, objects belonging to victims, a weapon, and notes containing information about the victims.

Over time, Roro has developed a routine to deal with these discoveries.

During the sixth month, however, the police arrive before Roro can finish the routine.

A detective enters the apartment to investigate a murder. The player must complete Roro's objectives and hide the evidence before the detective discovers it.

## 3. Main Objective

The player controls Roro inside the apartment.

The objective is to find and hide six evidence objects before the detective finishes inspecting the apartment.

The player must:

1. Find four belongings belonging to the victim.
2. Find and hide the baseball bat.
3. Find and hide the note containing the victim's name.

Each successfully hidden object awards one point.

**Maximum score: 6 points.**

The player wins if the detective finishes the visit without discovering decisive evidence.

The player loses if the detective discovers decisive evidence and catches Roro.

## 4. Visual Direction

- 2D top-down perspective.
- Pixel-art graphics.
- RPG-inspired apartment environment.
- One connected apartment with multiple rooms.
- Furniture, walls, doors, and interactive objects.
- Character sprites with directional movement.
- Dark psychological thriller atmosphere.

Current assets are provisional and may be replaced without changing the game's mechanics.

## 5. Characters

### 5.1 Roro

- Main playable character.
- Brown-haired character from the selected character pack.
- Controlled using keyboard input.
- Can move through the apartment.
- Can interact with objects and hiding places.

### 5.2 Detective

- Non-playable character controlled by game AI.
- Blonde-haired character from the same character pack.
- Moves through the apartment following inspection routes.
- Can inspect relevant locations.
- Can discover evidence.
- Can temporarily change destination when distracted.

## 6. Apartment Environment

The game takes place in one apartment containing connected rooms and corridors.

The environment should include:

- Bedroom.
- Living room.
- Kitchen.
- Bathroom.
- Hallways and connecting spaces.
- Doors and walls.
- Furniture.
- Interactive objects.
- Hiding places.

Furniture and decorations can be reused in different rooms.

The apartment must have collision boundaries so characters cannot walk through walls or solid furniture.

## 7. Player Movement

Roro moves in four directions:

- Up.
- Down.
- Left.
- Right.

The character uses three visual orientations:

- Front.
- Back.
- Side.

The side animation is reused for left and right movement by horizontally flipping the sprite.

Idle images represent the character's last orientation.

Diagonal movement must not be faster than horizontal or vertical movement.

## 8. Evidence Objects and Tasks

There are six evidence objects in total.

### 8.1 Victim's Belongings

Four objects belonging to the victim.

- Their initial positions are selected randomly from predefined valid spawn points.
- They must appear in accessible locations.
- They must not spawn inside walls, furniture, or inaccessible areas.
- The player must find and hide each object.

### 8.2 Baseball Bat

The baseball bat is the murder weapon.

- It is an important evidence object.
- The player must find and hide it.
- Its initial position is defined by the level configuration.

### 8.3 Victim's Note

The note contains the victim's name.

- The note appears as a small paper object in the apartment.
- The player can interact with it.
- Interaction opens an enlarged paper interface.
- The victim's name is displayed dynamically.
- The player can close the interface and return to gameplay.
- The note must also be hidden.

## 9. Hiding System

The apartment contains predefined hiding places.

The player can interact with these locations to hide evidence.

A hidden object must no longer be visible or discoverable at its original location.

The detective must be able to inspect relevant hiding locations according to its inspection route.

A successfully hidden object awards one point.

The score ranges from 0 to 6.

## 10. Detective AI

The detective uses a finite state machine (FSM).

The states are:

- Waiting.
- Entering.
- Inspecting.
- Interviewing.
- Redirected.
- Returning.
- Finished.
- Caught.

### 10.1 Inspection Routes

The detective follows predefined inspection routes.

- There are four inspection routes.
- Inspection points are visited in randomized order.
- Every relevant inspection point must be visited.
- The fourth route is faster than the previous routes.
- The detective must navigate around walls and solid furniture.
- The detective must move between connected rooms.

### 10.2 Evidence Discovery

The detective can inspect locations containing evidence.

If the detective discovers decisive evidence, the player loses.

If the detective finishes the visit without discovering decisive evidence, the player wins.

### 10.3 Distractions

Distractions can temporarily change the detective's destination.

After the distraction ends, the detective returns to its inspection route.

## 11. Difficulty Modes

The game has three difficulty modes.

### Easy

- Complete apartment map visible.
- Detective location visible in real time.

### Normal

- Only the current room is visible.
- Detective location in other rooms is unknown.

### Hard

- Limited visibility radius around Roro.
- Other rooms and distant areas remain obscured.

Sound cues should help the player infer the detective's location in all modes.

## 12. Audio Design

Audio will be implemented after the initial gameplay mechanics.

Planned sounds:

- Background music.
- Roro's footsteps.
- Detective's footsteps.
- Door knocking.
- Door opening and closing.
- Object interaction.
- Victory and defeat.

A mute option must be available.

## 13. Dialogue System

Interviews are presented separately from top-down gameplay.

The dialogue interface includes:

- Character portrait.
- Character name.
- Dialogue box.
- Text.

Dialogues are fixed, linear, and non-skippable.

They do not contain choices or branching paths.

The interviews reveal:

1. Information about the murder weapon.
2. Information about the victim's belongings.
3. The victim's full name.

Dialogues do not affect suspicion or create alternative endings.

## 14. Score System

- Each successfully hidden evidence object awards one point.
- Four victim belongings: four possible points.
- Baseball bat: one possible point.
- Victim's note: one possible point.
- Maximum score: six points.

The HUD must display the current score.

## 15. Game Outcomes

There are only two possible outcomes.

### Victory

The detective finishes the visit without discovering decisive evidence.

### Defeat

The detective discovers decisive evidence and catches Roro.

## 16. Game Flow

1. Main menu.
2. Difficulty selection.
3. Game introduction.
4. Police knock on the apartment door.
5. Roro opens the door and the detective enters.
6. The detective begins inspecting the apartment.
7. The player searches for and hides evidence.
8. The detective follows inspection routes and may conduct interviews.
9. The detective either finishes the visit or discovers decisive evidence.
10. Victory or defeat screen.
11. Option to restart or return to the main menu.

## 17. Features Explicitly Excluded

The following features are not part of the current prototype:

- Clothing changes or wardrobe mechanics.
- Suspicion meter.
- Dialogue choices.
- Branching dialogue.
- Alternative endings.
- Additional playable levels.
- Mouse-gaze mechanics.
- Generative AI inside the game.
- Complex detective emotions.

The project is limited to one playable apartment level.

## 18. Development Priority

The priority is to build a stable, playable prototype.

Development should proceed incrementally:

1. Apartment environment.
2. Roro movement and collisions.
3. Object interaction.
4. Hiding system and score.
5. Detective movement and AI.
6. Inspection routes and evidence discovery.
7. Difficulty and visibility modes.
8. Dialogue interface.
9. Audio.
10. Menus, polish, and persistence.