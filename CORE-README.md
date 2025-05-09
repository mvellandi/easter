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

### Styling and Theming Architecture

The Core Application and its dynamically loaded eggs employ a layered styling strategy designed for encapsulation, theming, and maintainability.

#### 1. Core Application Styling (Tailwind CSS & Custom Properties)

*   **Core UI Components:** The Core Application's own UI elements (modal shell, overlay, default close button, etc., found in `src/core/components/`) are styled using standard CSS in their respective `.css` files. These styles primarily define structure and base appearance and utilize the core's CSS custom properties for theming.
*   **Tailwind CSS for Core (Internal Use & Base):** The Core Application itself uses Tailwind CSS.
    *   The full Tailwind CSS (base/preflight, components, and utilities needed by the core) and the custom theme variables are bundled into the main `easter-egg-system.iife.js`.
    *   These styles are injected directly into the Shadow DOM that hosts the active egg.
*   **Global Styles & Theme Definition (`src/styles/main.css` & `src/styles/theme.css`):**
    *   `src/styles/main.css` imports Tailwind's base styles and `src/styles/theme.css`.
    *   `src/styles/theme.css` defines a comprehensive set of CSS Custom Properties (variables) within an `@theme {}` block (compatible with Tailwind's engine). These variables cover:
        *   Colors (e.g., `--color-ee-primary`, `--color-ee-modal-bg`, `--color-ee-overlay-bg`) using OKLCH where appropriate for modern color definitions.
        *   Spacing, radii, shadows (e.g., `--ee-sys-modal-padding`, `--radius-ee-modal`, `--shadow-ee-modal`).
        *   Font properties (though primarily relying on Tailwind's default font stack).
        *   Z-indexes (e.g., `--ee-sys-z-index-overlay`).
    *   These styles, including the theme variables and Tailwind's base/preflight, are injected by `ee-core.js` into the Shadow DOM created for each egg instance. This provides a consistent baseline styling environment and makes all theme variables available to the loaded egg.

#### 2. Egg Styling (Independent & Themed)

*   **Shadow DOM Encapsulation:** Each egg's content is rendered within the Core's Shadow DOM. This isolates the egg's styles from the main page and other eggs, and vice-versa.
*   **Egg-Specific Tailwind CSS:**
    *   Each egg is responsible for including the Tailwind utilities it uses. This is achieved by having a `src/style.css` in the egg (or similar, as defined in its registry) containing `@import "tailwindcss";`. This CSS file is then imported by the egg's main JavaScript module.
    *   The egg's Vite build process, utilizing the `@tailwindcss/vite` plugin, scans the egg's own component templates and generates a CSS file. This file contains *only* the Tailwind base styles (to ensure consistency if the egg were viewed in isolation, though usually overridden by core's base in the Shadow DOM) and the *specific utility classes used by that particular egg*.
    *   The `prepare-dist-registry.js` script in the egg's repository identifies this generated, hashed CSS file (e.g., `assets/[egg-name]-[hash].css`) and updates the egg's `dist/[egg-id]-registry.json` to include a `style` property pointing to this file (relative to its `dist` directory).
    *   This generated, scoped CSS file is then dynamically linked by `ee-core.js` into the Shadow DOM when the egg is activated.
    *   This ensures eggs are self-contained and only contribute the CSS for the utilities they actually use, preventing the core from needing to provide an exhaustive list of all possible Tailwind utilities.
*   **Consuming Core Theme Variables:**
    *   Due to CSS variable inheritance, the CSS Custom Properties defined in the Core Application's `theme.css` (and injected into the Shadow DOM) are directly usable by the egg in its own stylesheets (both in `<style>` tags of Vue components and in its linked Tailwind-generated CSS) or inline styles.
    *   Example: An egg's CSS can use `background-color: var(--color-ee-modal-bg);` or a Tailwind class like `bg-[var(--color-ee-modal-bg)]`.
    *   This allows eggs to adhere to the overall theme provided by the Core Application while maintaining control over their specific component styling with their own set of Tailwind utilities.

#### 3. Style Injection Order in Shadow DOM

When an egg is activated, the styles are effectively layered within the Shadow DOM by `ee-core.js` as follows:
1.  **Core Component Styles:** Dedicated CSS files for `CoreModalShell`, `CoreOverlay`, `CoreModalContent`, `CoreDefaultCloseButton`, `CoreFloatingCloseButton` are injected.
2.  **Core Inlined Tailwind & Theme Variables:** The content of the Core's `main.css` (which includes Tailwind base/preflight and `theme.css` with all custom properties).
3.  **Egg-Specific Stylesheet (if provided):** The `<link>` tag pointing to the egg's own generated CSS (e.g., `assets/[egg-name]-[hash].css`), which contains its used Tailwind utilities and potentially its own custom styles.

This layered approach ensures that core structure and theming are established, and then the egg's specific styles are applied within its encapsulated environment, scoped by the Shadow DOM.

#### 4. Asset Referencing (Fonts & Images)

*   **Fonts:**
    *   The Core Application defines its base font stack (typically via Tailwind's defaults, potentially customized in `theme.css` with variables like `--font-sans`). These are inherited by eggs in the Shadow DOM.
    *   If the Core uses custom web fonts (e.g., via `@font-face` for `--font-family-display`), these rules are part of the core's main CSS injected into the Shadow DOM, making the font families available.
    *   Eggs needing unique fonts not provided by the core are responsible for their own `@font-face` definitions and font file bundling.
*   **Images:**
    *   **Core's Internal Images:** Images used internally by the Core Application's CSS (e.g., `background-image: url(...)` within `CoreModalShell.css`) are relative to the core's own asset structure and are not directly reusable by eggs' CSS.
    *   **Exposing Core Images to Eggs (via CSS Variables):** To provide a shared UI asset (e.g., a standard icon) for eggs to use, the Core can define a CSS custom property in `theme.css` containing an **absolute URL** to that asset:
        ```css
        /* In src/styles/theme.css */
        /* :root { --icon-standard-close: url('https://your-cdn.com/assets/core/standard-close-icon.svg'); } */
        ```
        Eggs can then use `var(--icon-standard-close)` in their CSS. The use of absolute URLs is critical here for reliable path resolution.
    *   **Egg-Specific Images:** Eggs manage and bundle their own images. Vite processes these, making paths relative to the egg's `dist` output. The `ee-loader.js` further resolves any image paths passed as props (like `fallbackUrl` or paths within `dataUrl` JSON) to absolute URLs before passing them to the egg component.

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