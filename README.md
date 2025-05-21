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

### TypeScript Migration Plan (Completed)

- All core, eggs, and utilities are now in TypeScript.
- All Vue SFCs use `<script lang="ts">`.
- Type checking is part of the workflow (`npx tsc --noEmit`).
- Imports/exports use `.ts` extensions for local files.
- Updated all usage examples and documentation to reflect TypeScript usage.
- Build output is now at the root-level `dist` directory.

---

## Completed Tasks
- Modal state refactor: switched from `activeEgg` to generic `activeModal` (type + props) [**Complete**]
- Refactored modal shell to render content based on modal type [**Complete**]
- Centralized modal logic for extensibility [**Complete**]
- Implemented a generic modal trigger system (keyboard, click, selector-based) [**Complete**]
- Restored secret multi-click trigger for staff-grid [**Complete**]
- **Controller/Remote Modal:**
  - Wii and NES controller UIs with responsive switching [**Complete**]
  - Reusable, accessible D-pad and button components [**Complete**]
  - Button sequence display and reset [**Complete**]
  - Success/failure feedback (image overlay, shake animation) [**Complete**]
  - Refactored and organized controller components [**Complete**]
  - Responsive layout for display and controllers [**Complete**]
  - Cleaned up unused modal shell components and imports [**Complete**]

## Roadmap / Next Steps

1. **UI System Cleanup & Refactor**
   - Review and remove any remaining unused components, slots, or imports.
   - Consider simplifying the modal shell (e.g., remove unnecessary slots/templates).
   - Standardize naming conventions for all UI components.
   - Ensure all controller-related components are in the `controller` directory.
   - Document the UI system structure and component responsibilities.

2. **Accessibility Improvements**
   - Add ARIA roles (e.g., `role="dialog"`), `aria-modal="true"`, and proper labeling to the modal.
   - Implement a focus trap so keyboard users can't tab out of the modal.
   - Ensure the close button is always accessible and labeled.

3. **Dynamic Egg Imports**
   - Refactor egg registration to use dynamic imports for performance and bundle size reduction.

4. **Extending the Generic Trigger System**
   - Add support for more trigger types (e.g., gestures, multi-click, long-press).
   - Optionally, unify multi-click into the generic system for even more consistency.

5. **Modal System Enhancements**
   - Refactor modal state to allow stacking or queuing of modals (if needed).
   - Add animation and transition improvements.

6. **Testing & Documentation**
   - Add unit and integration tests for modal and trigger logic.
   - Update documentation to reflect the new trigger system and usage patterns.

---

**Next up:** Begin work on the controller/remote modal (task 3).

---

### Controller/Remote Modal UI Design (Planned)

- **Hybrid Approach:**
  - Use SVG for the controller body and decorative elements (scalable, crisp, custom shapes).
  - Use HTML elements (e.g., `<button>`) for interactive controls (D-pad, A/B, Start/Select, etc.), overlaid or embedded using absolute positioning or `<foreignObject>`.
- **Styling:**
  - Leverage Tailwind CSS for all HTML elements.
  - For SVG, use `fill="currentColor"` and Tailwind's `text-*` classes to control color, or use Tailwind CSS variables in SVG `style` attributes.
- **Accessibility:**
  - Use real `<button>` elements for controls to ensure keyboard accessibility, focus, and ARIA labeling.
  - If using SVG for buttons, add `tabindex`, `role="button"`, and keyboard handlers.
- **Rationale:**
  - SVG is ideal for the controller's visual design, while HTML is best for interactivity and accessibility.
  - This approach is scalable, maintainable, and leverages the strengths of both technologies.
- **Next Steps:**
  1. Sketch the controller layout (Wii/NES) in SVG.
  2. Overlay HTML buttons for D-pad, A/B, Start/Select, etc., using absolute positioning.
  3. Style everything with Tailwind classes.
  4. Make each button emit events for sequence entry.

---