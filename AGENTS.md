# Agent Guidelines — vpet-emu-zepp

## Vision

vpet-emu-zepp aims to faithfully emulate first-generation virtual pet devices (E0C6200 CPU architecture) on modern Zepp OS 4 smartwatches. The goal is to let people experience classic virtual pets — such as the Tamagotchi P1 and Digimon — on wearable hardware, with accuracy, performance, and a minimal footprint as guiding principles.

## Before Committing

Run `npm run format:check` before committing. Fix any issues with `npm run format`.

Run `npm run lint` before committing. Fix any issues with `npm run lint:fix`.

Many changes require manual validation before committing. When in doubt, ask the user to validate before committing.

## Commit Message Guidelines

- Write commit messages that are clear and self-contained.
- **Focus on what was added or changed**, not how. Omit implementation details unless a non-obvious decision was made that future readers would need to understand.
- **Do not include URLs in commit messages** unless the URL serves as a direct reference (e.g., linking to an upstream specification, a relevant issue in another project, or a source that directly informed the change). Informational or promotional URLs are not appropriate.
- **Do not attribute commits to AI agents.** Do not add `Co-Authored-By` trailers or any other attribution for AI tools.

## Pull Request Description Guidelines

- Keep descriptions focused on what was added or changed and why.
- Omit implementation details unless a meaningful decision was made (e.g., a non-obvious trade-off or a constraint that shaped the approach).
- A test plan with concrete steps is welcome.
