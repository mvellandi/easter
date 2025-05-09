# Easter Egg: [Egg Name - e.g., Staff Grid]

This repository contains the source code and assets for the "[Egg Name]" Easter egg. It is designed to be dynamically loaded and displayed by the main "Easter Egg System - Core Application."

## Purpose

Briefly describe what this Easter egg does or displays.
*Example for Staff Grid:*
"This egg displays a modal window showcasing a grid of staff members, including their names, roles, and images. It's typically triggered by a specific key combination."

## Key Files & Structure

A typical structure for this egg repository includes:

*   **`registry.json`**: (Located at the root of this repository) Defines the metadata and configuration for this specific egg, enabling the core system to load and display it. All paths within this file are relative to this repository's root when served.
*   **`src/index.js`** (or similar, e.g., `src/main.js`): The main Vue.js component file for this egg.
*   **`src/assets/`**: Contains static assets used by this egg, such as images, local JSON data files (used during development or if bundled), etc.
*   **`vite.config.js`**: Configuration for Vite, used to run the local development server for this egg and to build it for production.
*   **`package.json`**: Standard Node.js project file defining dependencies and scripts.

## `registry.json` Configuration

The `registry.json` file at the root of this repository is crucial. It tells the core loader how to handle this egg. Example:

```json
// registry.json (for this specific egg, e.g., staff-grid)
{
  "[egg-id]": { // The unique ID for this egg. Change [egg-id] to your egg's actual ID.
    "name": "[Egg Name]",
    "version": "1.0.0",
    "description": "[Description of the egg]",
    "keyCombination": ["Key1", "Key2"], // Key sequence to trigger this egg
    "componentExportName": "[ExportedVueComponentName]", // Name of the exported Vue component in the script
    "script": "src/index.js", // Path to the main Vue component script, relative to this registry.json
    "props": {
      "title": "My Awesome Egg!", // Example prop
      "theme": "default",      // Example theme prop
      "assetConfig": {
        // Fallback image path, relative to this registry.json
        "fallbackUrl": "src/assets/images/default-avatar.png", 
        "version": "1.0.0" // Asset versioning (optional, handled by component)
      },
      // Path to data, relative to this registry.json
      "dataUrl": "src/assets/data/my-data.json" 
    },
    "uiOptions": { // Optional: Customize core UI behavior
      "hideCoreOverlay": false,    // Set to true to hide the default overlay
      "hideCoreContainer": false,  // Set to true to hide the default modal content box
      "prefersCustomClose": false // Set to true if this egg provides its own close button/logic
    }
  }
}
```
*   **Egg ID (e.g., `"staff-grid"`)**: The top-level key is the unique identifier for this egg. Ensure you replace `"[egg-id]"` with your actual egg ID.
*   **`script`**: Path to the main component file, relative to this `registry.json`.
*   **`props`**: An object containing properties that will be passed to the Vue component.
    *   **`dataUrl`**: (Optional) Relative path to a JSON file containing data for the egg. The loader will pre-fetch this data and pass it as a prop (e.g., `staffData` if the egg is designed for it).
    *   **`assetConfig.fallbackUrl`**: (Optional) Relative path to a fallback image. The loader resolves this to an absolute URL.
*   **`uiOptions` (Object, Optional):**
    *   `hideCoreOverlay` (boolean, defaults to `false`): If set to `true`, the core system will not render its default semi-transparent background overlay.
    *   `hideCoreContainer` (boolean, defaults to `false`): If set to `true`, the core system will not render its default content container (the styled box). The egg will be responsible for its own background and main layout if this is true.
    *   `prefersCustomClose` (boolean, defaults to `false`): If set to `true`, the core system will not render its default close button. The egg component **must** then provide its own mechanism to close and call `this.coreInterface.requestClose()`.

## Expected Vue Component Props

The main Vue component (`src/index.js`) for this egg can expect the following props:

*   Any props defined in the `props` object of its `registry.json` entry (e.g., `title`, `theme`).
*   If `dataUrl` is used in `registry.json`, the fetched data will often be passed as a specific prop (e.g., `staffData` for the staff grid example). The loader handles this.
*   `assetConfig` (Object): Contains resolved asset configurations, including the absolute `fallbackUrl` if specified.
*   **`coreInterface` (Object):** An object passed by the core system. It provides methods for the egg to interact with the core. Currently contains:
    *   `requestClose()`: A function to call when the egg wants to be closed (e.g., from a custom close button). This is crucial if `uiOptions.prefersCustomClose` is `true`.

*(Adjust the props list based on the specific egg's needs and how the loader processes them.)*

## Customizing the UI and Close Behavior

You can customize how your egg is presented by the core system using the `uiOptions` in your `registry.json`:

*   **Hiding the Overlay:** Set `uiOptions.hideCoreOverlay: true` if your egg should appear without the semi-transparent background (e.g., if it's a small notification or provides its own full-screen experience).
*   **Hiding the Content Container:** Set `uiOptions.hideCoreContainer: true` if your egg should not be constrained by the default modal box. Your egg will then be responsible for its entire appearance including background, padding, and positioning within the area provided by the core.
*   **Providing a Custom Close Button:**
    1.  Set `uiOptions.prefersCustomClose: true` in `registry.json`. This will hide the core's default close button.
    2.  In your egg's Vue component, ensure you accept the `coreInterface` prop:
        ```javascript
        // Your egg's component (e.g., src/index.js)
        export default {
          props: {
            // ... other props defined in your registry.json ...
            coreInterface: {
              type: Object,
              required: true 
            }
          },
          methods: {
            handleMyCustomClose() {
              // Optional: any cleanup specific to your egg before closing
              console.log("Egg: Requesting close via coreInterface.");
              if (this.coreInterface && this.coreInterface.requestClose) {
                this.coreInterface.requestClose();
              } else {
                console.warn("Egg: coreInterface.requestClose() is not available.");
              }
            }
          }
          // ... your template, including a button or other element that calls handleMyCustomClose ...
          // Example: <button @click="handleMyCustomClose">Close Egg</button>
        }
        ```
    3.  Implement your own button or closing logic within your egg's template and call your method (e.g., `handleMyCustomClose`) that then uses `this.coreInterface.requestClose()`.

This allows for a range of presentations, from using the standard core modal to a completely custom UI controlled by the egg.

## Local Development Setup

1.  **Clone this repository.**
2.  **Install dependencies:** `npm install`
3.  **Run the development server for this egg:** `npm run dev`
    *   This will typically start a Vite server on a dedicated port (e.g., `http://localhost:8001` - check `vite.config.js`).
    *   The server must be configured for **CORS** to allow the core application (running on a different port) to fetch this egg's files.
    *   This server will serve this egg's `registry.json` from its root (e.g., `http://localhost:8001/registry.json`).

## Build Process

*   **Build for production:** `npm run build`
*   This command bundles the egg's component and assets, typically into a `dist/` directory.
*   The `dist/` directory will contain:
    *   The optimized JavaScript bundle for the Vue component.
    *   Copied assets.
    *   A production-ready `registry.json` with paths updated to be relative within the `dist/` structure if necessary (or to remain relative to the hosted `registry.json`).
*   The contents of this `dist/` folder are what would be uploaded to a hosting service (e.g., S3, CDN) for production use.

## Integration with Core System

*   This egg is designed to be loaded by the "Easter Egg System - Core Application."
*   **For local development:** The core application's `src/dev-registry-sources.json` file must be updated to include the URL of this egg's local development server (e.g., `"path": "http://localhost:8001/registry.json"`).
*   **For production:** The contents of this egg's `dist/` folder (including its `registry.json`) are hosted. The core application's production "global registry" will then contain an entry pointing to this egg's hosted `registry.json`.

---

Remember to replace bracketed placeholders like `[Egg Name - e.g., Staff Grid]`, `[egg-id]`, `[Description of the egg]`, `[Key1, Key2]`, and `[ExportedVueComponentName]` with the specific details of your egg.