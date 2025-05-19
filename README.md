# Easter Egg Core System

A modular Easter Egg system built with Vue 3 and Vite, designed to be integrated into a specific website with an existing design system.

## Overview

The Easter Egg Core System provides a framework for creating and managing interactive "Easter Eggs" - hidden features that can be triggered by specific user actions. The system is built to integrate seamlessly with a parent website's design system while maintaining its own core UI functionality.

**Tech Stack & Tooling:**
- **Vue 3** for UI components and reactivity
- **Vite** for fast development and build tooling
- **Tailwind CSS v4** for utility-first styling
  - No configuration file required (zero-config)
  - Uses the official Vite plugin for Tailwind compilation

---

## Existing System Architecture (2024)

- **Core System (`src/core/`)**
  - Handles modal UI, display, and interaction for eggs.
  - Uses inlined CSS for isolation.
  - Leverages the parent website's design system for variables and assets.
  - Modal/backdrop logic is currently tied to eggs.
- **Eggs (`src/eggs/`)**
  - Each egg is a self-contained module/component.
  - Eggs are currently statically imported in `main.js` and registered with the core system.
  - Eggs are triggered by keyboard shortcuts (e.g., Ctrl+H for Hello World).
- **Triggers**
  - Keyboard shortcuts for eggs.
  - Multi-click triggers for some eggs (e.g., staff directory button).
- **Modal System**
  - Modal and backdrop are used to display eggs.
  - Close button logic is part of the modal shell.
- **Accessibility**
  - Modal visually robust, but may lack full ARIA/focus trap accessibility features.

---

## Planned Refactor & Roadmap

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

## Architecture

### Core System
- Located in `src/core/`
- Contains the essential UI system for modal display and interaction
- Uses inlined CSS for core UI components to ensure isolation
- Relies on the parent website's design system for styling variables and assets

### Eggs
- Located in `src/eggs/`
- Each egg is a self-contained module
- Can utilize the parent website's design system styles
- Currently includes:
  - Hello World Egg (Ctrl + H)
  - Staff Grid Egg (Ctrl + S)

## Integration Requirements

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here] 