# RORO — Technical Requirements

## 1. Project Information

- **Course:** Aplicaciones Web
- **Project:** Final project of the first term
- **Game:** Roro
- **Main framework:** Phaser.js
- **Programming language:** JavaScript
- **Development tool:** Vite
- **Version control:** Git and GitHub

## 2. Selected Game Archetype

**Top-Down Adventure / RTS Lite**

The project uses a top-down perspective with free character movement, basic enemy AI, interactions, and navigation through a connected environment.

For Roro, the detective acts as the main dynamic challenge. The player must navigate the apartment, interact with objects, and avoid being caught.

## 3. Mandatory Technical Requirements

### 3.1 Phaser Architecture

- [ ] Phaser scenes.
- [ ] Asset loader.
- [ ] State management system.
- [ ] Main menu.
- [ ] Pause system.
- [ ] Game Over screen.
- [ ] Game restart functionality.

### 3.2 Project Structure

The project should maintain a modular structure with separated responsibilities.

Suggested organization:

```text
src/
├── scenes/
├── objects/
├── ui/
├── managers/
├── assets/
├── physics/
├── audio/
└── main.js
```

### 3.3 Mandatory Gameplay Mechanics

- [ ] Character movement.
- [ ] Collision detection.
- [ ] Score system.
- [ ] HUD.
- [ ] Enemies or challenges.
- [ ] Victory condition.
- [ ] Defeat condition.
- [ ] Progress persistence.

### 3.4 Physics and Collisions

The project must use Phaser Arcade Physics and implement:

- [ ] Collision detection.
- [ ] Triggers.
- [ ] Overlaps.
- [ ] Bouncing or gravity when appropriate for the game type.

### 3.5 Audio

- [ ] Background music.
- [ ] At least two sound effects.
- [ ] Mute button.

### 3.6 Data Persistence

The project must use `localStorage` to save:

- [ ] High Score.
- [ ] Reached level.
- [ ] Audio settings.

### 3.7 Responsive Design and Controls

The game must work correctly on desktop computers, tablets, and mobile resolutions.

- [ ] Desktop: keyboard and optionally mouse.
- [ ] Mobile: equivalent touch controls.

### 3.8 Performance

- [ ] Minimum 45 FPS.
- [ ] No freezes during execution.
- [ ] Efficient asset loading.

### 3.9 Minimum Accessibility

- [ ] Adequate contrast.
- [ ] Visible instructions.
- [ ] Documented controls.
- [ ] Mute option.

## 4. Academic Programming Requirements

### 4.1 Programming Practices

- [ ] Modularity.
- [ ] Reusability.
- [ ] Separation of responsibilities.
- [ ] Good development practices.

### 4.2 Code Quality

- [ ] Explanatory comments.
- [ ] Descriptive names.
- [ ] Clear organization.
- [ ] Appropriate use of functions, classes, or modules.

## 5. Deliverables

| Deliverable | Requirement |
|---|---|
| GitHub repository | Complete source code and commit history; accessible and organized. |
| Compressed project | Executable ZIP that can run locally. |
| Demo video | 45–90 seconds, showing gameplay, menus, audio, and features. |
| Screenshots | 4–6 images showing screens, levels, and mechanics. |
| README.md | Execution guide, controls, structure, and credits. |
| Self-evaluation | Completed rubric explaining strengths, limitations, and future improvements. |

## 6. Technologies

### Mandatory

- Phaser.js
- JavaScript

### Recommended

- Vite
- Visual Studio Code
- Git

## 7. Free Asset Sources Recommended by the Professor

- Sprites: https://kenney.nl/assets
- Audio: https://opengameart.org
- Music: https://pixabay.com/music/

## 8. Evaluation Rubric

| Evaluation criterion | Weight |
|---|---:|
| Main functionality | 20% |
| Game mechanics | 15% |
| Physics and collisions | 10% |
| Architecture and modularity | 15% |
| Performance and optimization | 10% |
| UX/UI and user experience | 10% |
| Audio and immersion | 5% |
| Responsiveness and touch controls | 5% |
| Clean code and documentation | 5% |
| README, video, and presentation | 5% |
| **Total** | **100%** |

## 9. Optional Bonus Features

The professor offers up to 10% additional credit for one or more advanced features:

- Multiplayer.
- Online leaderboard.
- Installable PWA.
- Advanced AI.
- Procedural generation.
- Shader effects.
- Minimap.
- Final boss.
- Inventory system.
- Multiple save slots.
- ECS architecture.
- External API integration.

These are optional and should not take priority over mandatory requirements.

## 10. Project Restrictions

- Do not use complete downloaded templates.
- Do not reuse complete projects from the internet.
- Do not submit incomplete projects.
- Do not use AI to generate the entire project without technical understanding.

## 11. Suggested Architecture

The professor recommends the following conceptual architecture:

```text
Scene Manager
      ↓
Game Objects
      ↓
Physics
      ↓
UI / HUD
      ↓
Audio Manager
      ↓
Storage Manager
```

## 12. Important Development Principle

Roro must demonstrate authorship, creativity, and technical understanding of Phaser.js and interactive web application architecture.

The implementation should be modular, understandable, and developed incrementally.