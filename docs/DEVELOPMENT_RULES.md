# RORO — Development Rules

These rules must be followed throughout the development of Roro.

## 1. General Development Principles

- Develop the game incrementally.
- Prioritize a functional and understandable implementation over unnecessary complexity.
- Follow the requirements defined in `GAME_DESIGN.md` and `TECHNICAL_REQUIREMENTS.md`.
- Do not introduce new gameplay mechanics without approval.
- Do not modify established game rules without discussing the change first.
- Keep the implementation aligned with the project's scope: one playable level.

## 2. Technology Restrictions

- Use JavaScript.
- Use Phaser.js as the main game framework.
- Use Vite as the development server and build tool.
- Do not migrate the project to TypeScript.
- Do not introduce additional frameworks or libraries unless there is a clear technical reason and approval.

## 3. Code Language and Naming

- Write all code in English.
- Use English for variable names, function names, class names, filenames, and comments.
- Use descriptive and consistent names.
- Avoid abbreviations unless they are widely understood.
- Comments should explain relevant decisions or non-obvious behavior, not repeat the code.

## 4. Architecture and Organization

- Maintain separation of responsibilities.
- Keep scenes, game objects, UI, managers, physics, and audio logic organized.
- Avoid placing the entire game implementation inside `main.js`.
- Avoid unnecessarily large classes or functions.
- Reuse code when it improves clarity and maintainability.
- Avoid duplicated logic.
- Keep dependencies between modules explicit.

## 5. Phaser Development

- Use Phaser scenes to organize the different screens and stages of the game.
- Use Phaser Arcade Physics for movement and collision handling where appropriate.
- Use Phaser's asset loader to load game resources.
- Keep gameplay state separate from presentation logic when practical.
- Use Phaser's update loop appropriately.
- Avoid creating unnecessary objects every frame.

## 6. Game Design Consistency

Before implementing or changing a mechanic, consult `GAME_DESIGN.md`.

The implementation must preserve these decisions:

- Top-down 2D gameplay.
- One playable apartment level.
- Roro is controlled by the player.
- The detective is controlled by a finite state machine.
- The player must complete four tasks.
- Each completed task awards one point.
- Maximum score: four points.
- The detective follows inspection routes.
- Inspection points are visited in randomized order.
- The game has three difficulty modes.
- Sound cues provide information about the detective's movement.
- Dialogues are fixed, linear, and non-skippable.
- There are only two possible outcomes: victory or defeat.

Do not add a suspicion meter, dialogue choices, alternative endings, or additional levels unless explicitly approved.

## 7. Asset Rules

- Do not generate images using AI.
- Do not create placeholder artwork unless explicitly requested.
- Prefer assets downloaded from legitimate sources with clear licensing.
- Do not assume an asset is free for commercial use without checking its license.
- Do not modify or rename downloaded assets without a reason.
- Preserve original asset files when editing or converting them.
- Record each asset's source, filename, dimensions, and license in `ASSETS.md`.
- Do not invent filenames or assume assets exist.

## 8. Incremental Workflow

Follow this workflow for every development task:

1. Inspect the existing project structure.
2. Read the relevant project documentation.
3. Identify the specific feature or problem to implement.
4. Explain the proposed implementation briefly.
5. Modify only the files necessary for the task.
6. Explain what changed and why.
7. Provide the commands needed to run or test the implementation.
8. Verify that the feature works before moving to the next task.

Do not implement several unrelated features in one step.

## 9. Working with Existing Code

- Inspect a file before modifying it.
- Do not overwrite existing code without understanding its purpose.
- Preserve working functionality.
- Do not remove code just because it is unfamiliar.
- Explain significant changes.
- If a requirement is ambiguous, ask before making assumptions.

## 10. Debugging Rules

When an error occurs:

1. Read the complete error message.
2. Identify the likely cause.
3. Inspect the relevant code.
4. Explain the problem.
5. Apply the smallest appropriate correction.
6. Run the relevant test again.

Do not rewrite entire modules to fix a localized problem.

## 11. Git Rules

- Use Git to track development.
- Make commits after completing coherent, working milestones.
- Use descriptive commit messages.
- Do not commit temporary files, dependencies, build output, or local configuration secrets.
- Keep `.gitignore` updated.

## 12. Communication Rules for AI Coding Assistance

When assisting with development:

- Explain the purpose of the code before or while introducing it.
- Do not assume the developer understands an unfamiliar API.
- Explain important Phaser concepts when they are first introduced.
- Provide complete code for the files being created or replaced.
- Clearly identify each file's path.
- Avoid giving commands without explaining what they do when the command is not obvious.
- Do not claim that code has been tested if it has not been executed.
- Do not continue to the next feature until the current one has been verified.

## 13. Scope Control

The priority is to finish a stable, playable prototype.

Optional features, bonus mechanics, and visual polish must not compromise the implementation of mandatory requirements.

If a proposed change increases complexity without improving the core experience or satisfying an academic requirement, explain why it may not be worthwhile.