# Easter Egg System - Core Application

This repository contains the core application for the Easter Egg System. It is responsible for loading, managing, and displaying Easter eggs within a host webpage. The system is designed to load individual Easter eggs from external sources, allowing for modular development and deployment of eggs.

## Core Technologies

*   **Vue.js 3 (Composition API)**: Used for rendering Easter egg modals and managing their state.
*   **Vite**: Used as the build tool and development server for this core application.
*   **Tailwind CSS**: Used for styling (bundled with the core application).

## Architecture Overview

The core system consists of several key parts:

1.  **`src/main.js`**: The main entry point for the application. It initializes the loader and the core system. It differentiates between development and production environments to determine how to locate the initial egg registry information.
2.  **`src/loader/ee-loader.js` (EasterEggLoader)**: This is the heart of the dynamic loading mechanism.
    *   It fetches a "main registry sources" file (which is `src/dev-registry-sources.json` in development mode, or the URL provided by `data-main-registry-url` in production mode leading to a global registry).
    *   This main file lists URLs to other **Egg Definition Registry files**.
    *   Each "Egg Definition Registry" file is a `*.json` file (conventionally named `registry.json` or similar) that can define one or more individual eggs. The loader fetches and processes each of these listed registry files.
    *   For each egg defined within an "Egg Definition Registry" file, it resolves asset paths (scripts, data, images) relative to that specific registry file's own location.
    *   It dynamically imports the egg's main component script (ES module).
    *   It registers the egg (component, key combination, props) with the `ee-core.js`, applying a "first definition wins" strategy if multiple registries define an egg with the same ID.
3.  **`src/core/ee-core.js` (EasterEgg)**:
    *   Manages the registered Easter eggs.
    *   Listens for keyboard combinations.
    *   When a combination is detected, it mounts and displays the corresponding Vue component as a modal.
    *   Handles the lifecycle of the displayed egg.

### UI Customization for Eggs

The core system provides a default modal UI (overlay, content container, and close button) for displaying Easter eggs. However, individual eggs can customize this appearance and behavior through `uiOptions` in their `registry.json` file:

*   **`uiOptions.hideCoreOverlay` (boolean):** If `true`, the default semi-transparent overlay is not rendered.
*   **`uiOptions.hideCoreContainer` (boolean):** If `true`, the default content container (the "box" of the modal) is not rendered. The egg is then responsible for its own layout and background if this is hidden.
*   **`uiOptions.prefersCustomClose` (boolean):** If `true`, the core system's default close button is not rendered. The egg is then responsible for providing its own close mechanism.

To facilitate custom closing, the core system passes a `coreInterface` prop to the egg's main Vue component. This object currently contains:

*   **`coreInterface.requestClose()` (function):** The egg should call this function to signal to the core system that it should be closed and unmounted.

This allows eggs to range from using the full default core UI to providing a completely custom presentation layer.

4.  **Individual Easter Eggs (External)**:
    *   Each Easter egg is expected to be a self-contained unit, typically managed in its own repository.
    *   An egg consists of:
        *   A `registry.json` file at its root: This file defines the egg's metadata, such as its ID, trigger key combination, main script file, component export name, and any properties (`props`) to be passed to its Vue component. Asset paths within this file are relative to its own location.
        *   A Vue component (ES module).
        *   Any associated assets (images, data files, etc.).

## Loading Mechanism

### Development Mode

1.  When running the core application locally (`npm run dev`), `src/main.js` loads **`src/dev-registry-sources.json`**.
2.  `src/dev-registry-sources.json` (which is gitignored) should contain a list of URLs pointing to the `registry.json` files of *locally running external egg development servers*. For example:
    ```json
    // src/dev-registry-sources.json
    {
      "registries": [
        {
          "id": "staff-grid-local-dev",
          "path": "http://localhost:8001/registry.json", // Points to staff-grid egg's dev server
          "enabled": true
        }
        // ... other locally developed eggs
      ]
    }
    ```
3.  The `EasterEggLoader` then fetches each listed `registry.json` and its associated assets from these local URLs.

### Production Mode

1.  The core application is bundled into a single JavaScript file (`easter-egg-system.iife.js`).
2.  The host webpage includes this script with a `data-main-registry-url` attribute:
    ```html
    <script 
      id="easter-egg-script" 
      src="path/to/easter-egg-system.iife.js" 
      data-main-registry-url="https://your-cdn.com/path/to/production-global-registry.json"
    ></script>
    ```
3.  `src/main.js` (in production mode) reads this URL.
4.  The `EasterEggLoader` fetches the `production-global-registry.json` from this URL.
5.  This "global" registry file contains a list of URLs pointing to the `registry.json` files of production-ready Easter eggs (e.g., hosted on S3, CDNs, or other servers).
    ```json
    // Example: production-global-registry.json (hosted on a CDN)
    {
      "registries": [
        {
          "id": "production-staff-grid",
          "path": "https://your-s3-bucket.s3.amazonaws.com/eggs/staff-grid/v1.0/registry.json",
          "enabled": true
        }
        // ... other production eggs
      ]
    }
    ```
6.  The `EasterEggLoader` then proceeds to load each egg as described.

## Build Process

*   Running `npm run build` (or the Vite build command) bundles the entire core application (Vue, Tailwind, loader, core logic) into a single IIFE JavaScript file specified in `vite.config.js` (e.g., `dist/easter-egg-system.iife.js`).
*   This single file is what gets deployed and included in host webpages.

## Example Registry Structures

Refer to the files in `src/data/` for examples:
*   `src/data/example.global-registry.json`: Shows the structure of the main "global" registry file used in production.
*   `src/data/example.default-registry.json`: Shows the structure of a `registry.json` file that defines specific eggs (like what an individual egg would host).
*   `src/data/README.md`: Provides detailed explanations of these example files and the loading workflow.

## Setting Up This Core Application for Development

1.  Clone this repository.
2.  Install dependencies: `npm install`
3.  To run the development server for this core application: `npm run dev`
4.  Ensure you have external Easter egg repositories also running their own development servers.
5.  Update `src/dev-registry-sources.json` to point to the `registry.json` URLs of your locally running external eggs.
6.  Open the application in your browser (typically `http://localhost:5173` or as specified by Vite).

This core application itself does not display any UI directly on its own; it needs to be integrated into a host page (for production) or will attempt to load eggs defined in `src/dev-registry-sources.json` (for development). 