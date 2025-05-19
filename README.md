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
  - See the [TypeScript Migration Plan](#typescript-migration-plan) for details.

- **Core System (`src/core/`)**
  - Handles modal UI, display, and interaction for eggs.
  - Uses inlined CSS for isolation.
  - Leverages the parent website's design system for variables and assets.
  - Modal/backdrop logic is currently tied to eggs.
- **Eggs (`src/eggs/`)**
  - Each egg is a self-contained module/component.
  - Eggs are statically imported in `main.ts` and registered with the core system.
  - Eggs are triggered by keyboard shortcuts (e.g., Ctrl+H for Hello World).
- **Triggers**
  - Keyboard shortcuts for eggs.
  - Multi-click triggers for some eggs (e.g., staff directory button).
- **Modal System**
  - Modal and backdrop are used to display eggs.
  - Close button logic is part of the modal shell.
- **Accessibility**
  - Modal visually robust, but may lack full ARIA/focus trap accessibility features.

### TypeScript Migration Plan (Complete)

- All core, eggs, and utilities are now in TypeScript.
- All Vue SFCs use `<script lang="ts">`.
- Type checking is part of the workflow (`npx tsc --noEmit`).
- See `tsconfig.json` for configuration.

### Usage Example (TypeScript)

1. Import the core system:
```typescript
import core, { registerKeyCombo } from "./core/core.ts";
```

2. Register eggs:
```typescript
import { HelloWorldEggComponent } from "./eggs/hello-world/index.ts";
import { StaffGridEggComponent } from "./eggs/staff-grid/index.ts";

core.registerEgg("egg-id", HelloWorldEggComponent, {
  title: "Egg Title",
  trigger: {
    type: "keyboard",
    key: "k",
    ctrlKey: true
  }
});
```

3. Initialize the system:
```typescript
registerKeyCombo();
```

---

*TypeScript migration is complete. All new features and contributions should use TypeScript and `<script lang="ts">` in Vue SFCs.*

### Design System Integration
The system expects the following from the parent website:
- CSS variables for colors, spacing, and typography
- Font assets
- Image assets
- Animation definitions

### Directory Structure
```
src/
├── core/               # Core UI system
│   ├── components/     # Core UI components
│   ├── core.css       # Core UI styles
│   └── core.js        # Core system logic
├── eggs/              # Easter egg modules
│   ├── hello-world/   # Hello World egg
│   └── staff-grid/    # Staff Grid egg
└── styles/            # Design system styles
    ├── animations.css
    ├── backgrounds.css
    ├── colors.css
    ├── extras.css
    ├── fonts.css
    └── utilities.css
```

## Known Issues

### Modal System
- The modal fade-in uses a short (200ms) delay before showing content, unless the egg component explicitly signals readiness via a callback. This is a workaround for the lack of a true Vue Suspense or asset preloading mechanism. Eggs with images or assets can call the `notifyContentReady` prop to control when the modal appears, but most eggs will simply fade in after the delay. This may not be robust for long-loading assets.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Import the core system:
```javascript
import core, { registerKeyCombo } from "./core/core.js";
```

2. Register eggs:
```javascript
core.registerEgg("egg-id", EggComponent, {
  title: "Egg Title",
  trigger: {
    type: "keyboard",
    key: "k",
    ctrlKey: true
  }
});
```

3. Initialize the system:
```javascript
registerKeyCombo();
```

## Planned Refactor & Roadmap Part 1
### TypeScript Migration Plan

To ensure a robust and maintainable codebase, we will migrate the project to TypeScript before proceeding with major feature refactors. This plan outlines the steps for a smooth transition:

1. **Update Tooling**
   - Add TypeScript and necessary types as dev dependencies.
   - Update Vite config to support `.ts` and `.vue` with TypeScript.

2. **Rename Files**
   - Change `.js` files to `.ts` (and `.vue` files to use `<script lang="ts">`).

3. **Add TypeScript Config**
   - Create a `tsconfig.json` with sensible defaults for Vue 3 + Vite.

4. **Incremental Conversion**
   - Start with the core system (`src/core/`), then eggs, then utilities.
   - Add types/interfaces where possible, use `any` as a temporary fallback if needed.
   - Fix type errors as they arise.

5. **Update Imports/Exports**
   - Ensure all imports/exports use the correct file extensions and type syntax.

6. **Test the Build**
   - Run the dev server and build to ensure everything works.

7. **Update README**
   - Document the new TypeScript setup and any changes to development workflow.

---


## Planned Refactor & Roadmap Part 2

### Controller/Remote as a Core Modal
- Place the controller (Wii/NES remote) component in `core/components/`.
- Use the same modal/backdrop system as eggs.
- Trigger it from an invisible, semantic, accessible `<button>`.
- When the correct sequence is entered, dynamically load and show the corresponding egg.

### Modal System Improvements
- Refactor modal state to be generic (e.g., `activeModal` with type and props), not just `activeEgg`.
- Allow the modal shell to render either an egg or the controller, using shared close/backdrop logic.
- Ensure only one overlay/modal is visible at a time.

### Accessibility
- Add ARIA roles (e.g., `role="dialog"`), `aria-modal="true"`, and proper labeling to the modal.
- Implement a focus trap so keyboard users can't tab out of the modal.
- Ensure the close button is always accessible and labeled.

### Dynamic Egg Imports
- Refactor egg registration to use dynamic imports (e.g., `() => import('./eggs/hello-world/index.js')`) for performance and bundle size reduction.

### Controller/Remote Features
- Responsive: Wii remote (vertical) for <1024px screens, NES controller (horizontal) for >=1024px screens.
- Both remotes are functionally identical (D-pad, A/B, Reset, Enter), but visually different.
- Display the sequence of button presses, with reset and enter controls.
- Both remotes respond to keyboard events as well as pointer/touch.
- The controller emits button sequence events to the core system, which can trigger eggs dynamically.

### General Refactoring
- Centralize modal state and logic for extensibility.
- Use a registry or mapping for modal content, so adding new modal types is easy.
- Decouple trigger logic (keyboard, multi-click, controller) from modal logic.

---

*This roadmap is intended to guide the next phase of development, making the system more modular, accessible, and extensible for new input methods and features.*

### First Commit Plan

**Goal:**
Refactor the modal system so it can generically handle multiple modal types (not just eggs), laying the groundwork for future features like the controller modal, dynamic imports, and improved accessibility.

#### Steps

1. **Refactor Modal State**
   - Change the modal state from something like `activeEgg` to a more generic `activeModal`.
   - `activeModal` should be an object with at least:
     - `type`: e.g., `"egg"`, `"controller"`, etc.
     - `props`: any props/data needed for the modal content.

2. **Update Modal Shell**
   - Refactor the modal shell component to render its content based on `activeModal.type`.
   - For `"egg"`, render the current egg component.
   - For `"controller"`, render a placeholder or stub for the controller (even if not implemented yet).

3. **Centralize Modal Logic**
   - Ensure all open/close logic, backdrop, and close button handling is centralized and works for any modal type.

4. **Maintain Backward Compatibility**
   - Make sure existing eggs and their triggers still work as before, but now use the new modal state system.

5. **Testing**
   - Test that:
     - Eggs still open/close as expected.
     - The modal shell can handle at least two types (`egg` and a placeholder for `controller`).
     - No regressions in modal display or interaction.

#### Example State Shape

```js
// Before:
activeEgg: 'hello-world' // or null

// After:
activeModal: {
  type: 'egg', // or 'controller'
  props: { eggId: 'hello-world' } // or other props as needed
} // or null
```

#### Commit Message Suggestion

```
refactor: make modal state generic to support multiple modal types

- Replace activeEgg with activeModal (type + props)
- Update modal shell to render content based on modal type
- Ensure existing eggs still work with new modal system
- Prepare for future controller modal and extensibility
```

This commit will set the stage for all future improvements, making the modal system more flexible and maintainable.

**Next Steps:**
Once the modal state refactor is complete and stable, proceed to implement the controller modal, dynamic imports, and accessibility improvements as outlined above.

---