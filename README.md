# Easter Egg Core System

A modular Easter Egg system built with Vue 3 and Vite, designed to be integrated into a specific website with an existing design system.

## Overview

The Easter Egg Core System provides a framework for creating and managing interactive "Easter Eggs" - hidden features that can be triggered by specific user actions. The system is built to integrate seamlessly with a parent website's design system while maintaining its own core UI functionality.

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

### Styling System
- Font assets are not loading correctly
- Graphics and images need proper path resolution
- Core UI modal is not properly centered on the page
- Need to verify all design system variable references

### Integration Points
- Review all CSS variable references to ensure they match the parent website
- Verify asset paths for images and fonts
- Check animation compatibility with parent website
- Ensure proper z-index layering with parent website elements

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

## Gesture Support (ZingTouch)

Gesture support is provided via [ZingTouch](https://github.com/zingchart/zingtouch). You can configure eggs to be triggered by single gestures (such as swipe, tap, or rotate) in addition to keyboard shortcuts.

### How to Add a Gesture Trigger

Add a gesture trigger to your egg's config:

```js
trigger: [
  { type: "keyboard", key: "h", ctrlKey: true },
  { type: "gesture", gesture: "swipe", direction: "left" }
]
```
- Supported gestures: `swipe`, `tap`, `rotate`
- For `swipe`, you can specify `direction`: `"left"`, `"right"`, `"up"`, or `"down"`.
- Only single gestures are supported via config. Gesture sequences (e.g., swipe left then right) require custom logic.

### Example
```js
core.registerEgg("staff-grid", StaffGridEggComponent, {
  title: "Our Team",
  trigger: [
    { type: "keyboard", key: "s", ctrlKey: true },
    { type: "gesture", gesture: "swipe", direction: "left" }
  ],
  staffData: staffData,
  assetConfig: {
    fallbackUrl: "./eggs/staff-grid/images/fallback.webp",
  },
});
```

### Known Caveats and Limitations
- **Only single gestures are supported via config.** Gesture sequences (e.g., double-tap then swipe) require custom code in your main.js.
- **Mobile browser limitations:**
  - Pull-to-refresh (PTR) and scrolling can interfere with down swipes and pan gestures, especially at the top of the page.
  - Some gestures may not be detected if the browser intercepts the event (e.g., PTR, navigation gestures).
  - You may need to use CSS like `overscroll-behavior-y: contain;` or `touch-action: none;` to improve gesture reliability, but this can affect scrolling UX.
- **Tap/Swipe sensitivity:** ZingTouch may be more or less sensitive than native events; test on your target devices.
- **Custom gesture sequences:** If you want to support multi-step gesture sequences, you must implement a state machine or custom handler in your main.js (see code comments for examples).

## Styling System Review Needed

The following areas need attention:

1. **Core UI Positioning**
   - Modal centering needs to be fixed
   - Z-index layering needs to be reviewed
   - Responsive behavior needs to be verified

2. **Asset Loading**
   - Font loading system needs to be reviewed
   - Image path resolution needs to be fixed
   - Asset preloading strategy needs to be implemented

3. **Design System Integration**
   - CSS variable mapping needs to be documented
   - Animation compatibility needs to be verified
   - Color scheme integration needs to be tested

4. **Component Styling**
   - Review all component-specific styles
   - Verify scoped vs. global style usage
   - Check for style conflicts with parent website

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here] 