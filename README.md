# Easter Egg Core System

A modular Easter Egg system built with Vue 3, Vite, and **TypeScript**, designed to be integrated into a specific website with an existing design system.

## Overview

The Easter Egg Core System provides a framework for creating and managing interactive "Easter Eggs" - hidden features that can be triggered by specific user actions. The system is built to integrate seamlessly with a parent website's design system while maintaining its own core UI functionality.

**Tech Stack & Tooling:**
- **Vue 3** for UI components and reactivity
- **Vite** for fast development and build tooling
- **TypeScript** for type safety and maintainability
- **Tailwind CSS v4** for utility-first styling
  - No configuration file required (zero-config)
  - Uses the official Vite plugin for Tailwind compilation

---

## Architecture

- **TypeScript Support**
  - All core logic, eggs, and utilities are written in TypeScript (`.ts`).
  - All Vue components use `<script lang="ts">` for type safety.
  - Type checking is enforced via `npx tsc --noEmit`.
  - Imports/exports use `.ts` extensions for local files.
  - See the [Changelog & Migration Notes](#changelog--migration-notes) for details.

- **Core System (`src/core/`)**
  - Handles modal UI, display, and interaction for eggs and controllers.
  - Uses inlined CSS for isolation.
  - Leverages the parent website's design system for variables and assets.
  - Modal/backdrop logic is currently tied to eggs and controllers.
- **Eggs (`src/eggs/`)**
  - Each egg is a self-contained module/component.
  - Eggs are statically imported in `main.ts` and registered with the core system.
  - Eggs are triggered by keyboard shortcuts (e.g., Ctrl+H for Hello World).
- **Controllers (`src/core/components/controller/`)**
  - Contains all controller-related components: Wii, NES, D-pad, display, and buttons.
  - Controllers are responsive and accessible, with reusable D-pad and button components.
  - Button sequences and feedback (success image, shake animation) are handled here.
- **Triggers**
  - Keyboard shortcuts for eggs and controllers.
  - Multi-click triggers for some eggs (e.g., staff directory button).
- **Modal System**
  - Modal and backdrop are used to display eggs and controllers.
  - Close button logic is part of the modal shell.
- **Accessibility**
  - Modal and controllers are visually robust and accessible, with ARIA roles and keyboard support.

### Directory Structure
```
src/
├── core/
│   ├── components/
│   │   ├── controller/         # Controller UI system (Wii, NES, DPad, Display, Buttons)
│   │   ├── error/
│   │   ├── shell/
│   │   └── ui/
│   ├── utils/
├── eggs/                      # Easter egg modules
│   ├── hello-world/
│   └── staff-grid/
└── styles/                    # Design system styles
    ├── animations.css
    ├── backgrounds.css
    ├── colors.css
    ├── extras.css
    ├── fonts.css
    └── utilities.css
```

## Build Output
- The production build outputs to a root-level `dist` directory (not inside `src`).
- To build for production, run:

```bash
npm run build
```

## Known Issues

### Modal System
- The modal fade-in uses a short (200ms) delay before showing content, unless the egg component explicitly signals readiness via a callback. This is a workaround for the lack of a true Vue Suspense or asset preloading mechanism. Eggs with images or assets can call the `notifyContentReady` prop to control when the modal appears, but most eggs will simply fade in after the delay. This may not be robust for long-loading assets.

### Production Build
The following assets need to be manually copied over after building:
- egg directories and their assets, but only their graphic assets
- src/asset/img files need to be copied to docs/assets, as images reference by CSS files aren't copied
- custom css files in _temp/bootdev with asset paths differing from the development files, so they resolve correctly in Github Pages

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Changelog & Migration Notes

### Recent Modal Shell Refactor
- Refactored modal shell into composable, layered components (`FixModalFrame`, `FixModalShell`, `ShellBackdrop`, `FloatModalFrame`) for clarity and maintainability.
- Replaced prop/event drilling for modal close actions with Vue's provide/inject pattern, allowing any modal descendant to close the modal directly.
- Cleaned up slot usage and removed unnecessary named slots.
- Improved z-index and pointer-events handling for correct modal layering and interactivity.
- Renamed modal shell components for semantic clarity.

### Modal Close Logic
- Modal close logic now uses provide/inject (no more prop drilling).
- Modal shell and floating modals are now fully modular and layered.
- Slot and event usage simplified and clarified.

## Roadmap / Next Steps

**Accessibility Improvements**
   - Add ARIA roles (e.g., `role="dialog"`), `aria-modal="true"`, and proper labeling to the modal.
   - Implement a focus trap so keyboard users can't tab out of the modal.
   - Ensure the close button is always accessible and labeled.

**Dynamic Egg Imports**
   - Refactor egg registration to use dynamic imports for performance and bundle size reduction.

**Extending the Generic Trigger System**
   - Add support for more trigger types (e.g., gestures, multi-click, long-press).
   - Optionally, unify multi-click into the generic system for even more consistency.

**Modal System Enhancements**
   - Refactor modal state to allow stacking or queuing of modals (if needed).
   - Add animation and transition improvements.

**Testing & Documentation**
   - Add unit and integration tests for modal and trigger logic.
   - Update documentation to reflect the new trigger system and usage patterns.


---

## License and Asset Usage

**Important:**  
This project contains a mix of open-source code and third-party or company-copyrighted assets.  
Some directories and files may contain both open-source and copyrighted materials.

- **Source code** is licensed under the MIT License (see [LICENSE](LICENSE)), except as noted below.
- **Images, styles, and demo content** derived from [Company Name] are copyright their respective owners and are included for demonstration purposes only. These assets may not be reused, redistributed, or modified without permission.

If you wish to reuse any part of this project, you must review individual files and asset origins to ensure compliance with applicable licenses.