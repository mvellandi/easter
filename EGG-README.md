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
*   **`src/style.css`**: Contains the `@import "tailwindcss";` rule, responsible for enabling Tailwind CSS for this egg. It's imported by `src/index.js`.
*   **`src/assets/`**: Contains static assets used by this egg, such as images, local JSON data files (used during development or if bundled), etc.
*   **`vite.config.js`**: Configuration for Vite, used to run the local development server for this egg and to build it for production.
*   **`package.json`**: Standard Node.js project file defining dependencies and scripts.
*   **`scripts/prepare-dist-registry.js`**: A build utility script that runs after Vite builds the egg. It locates the generated (potentially hashed) CSS file in `dist/assets/` and updates the `dist/[egg-id]-registry.json` to include the correct relative path to this stylesheet under the `style` key. It also ensures the `script` path points to the correct production JavaScript bundle.

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
*   This command, typically configured in `package.json` (e.g., `vite build && node scripts/prepare-dist-registry.js`), bundles the egg's component and assets into a `dist/` directory.
*   The `dist/` directory will contain:
    *   The optimized JavaScript bundle for the Vue component (e.g., `staff-grid-egg.es.js`).
    *   The egg-specific CSS file (e.g., `assets/[egg-name]-[hash].css`) containing used Tailwind utilities and base styles, if any styles were generated.
    *   A production-ready `[egg-id]-registry.json` file, with its `script` and `style` paths correctly pointing to the files within the `dist` structure, generated by the `prepare-dist-registry.js` script.
*   The contents of this `dist/` folder are what would be uploaded to a hosting service (e.g., Tigris, S3, CDN) for production use.

## Integration with Core System

*   This egg is designed to be loaded by the "Easter Egg System - Core Application."
*   **For local development:** The core application's `src/dev-registry-sources.json` file must be updated to include the URL of this egg's local development server (e.g., `"path": "http://localhost:8001/registry.json"`).
*   **For production:** The contents of this egg's `dist/` folder (including its `registry.json`) are hosted. The core application's production "global registry" will then contain an entry pointing to this egg's hosted `registry.json`.

## Styling and Theming

This egg utilizes **Tailwind CSS v4** for its internal styling.

### Egg-Specific Styles (Tailwind CSS)

*   **Independent Styling:** The egg is responsible for its own look and feel using Tailwind utility classes within its Vue component templates.
*   **Build Process:**
    *   The egg's `src/style.css` file (or equivalent) should contain `@import "tailwindcss";`. This is typically imported into the egg's main JavaScript entry point (e.g., `src/index.js`).
    *   During the egg's production build (`npm run build`), the Tailwind Vite plugin (`@tailwindcss/vite`) scans the egg's template files and generates a CSS file (e.g., `dist/assets/[egg-name]-[hash].css`). This CSS file contains Tailwind's base/preflight styles and the specific utility classes used by this egg.
    *   The `scripts/prepare-dist-registry.js` script (executed as part of the build) is crucial. It identifies this generated CSS file and includes its relative path (e.g., `assets/[egg-name]-[hash].css`) in the `style` property of the `dist/[egg-id]-registry.json` file. If no CSS file is generated (e.g., the egg uses no Tailwind classes or custom styles), the `style` property will be omitted or set to null.
*   **Shadow DOM Encapsulation:** When the egg is loaded by the Core Application, if a `style` path is provided in its production registry, this generated CSS file is linked directly within the Core's Shadow DOM (where the egg is rendered). This ensures the egg's Tailwind utility styles are scoped appropriately and do not conflict with the host page or other eggs.

### Using Core Theme Variables

*   The Core Application provides a theming system based on CSS Custom Properties (variables) (e.g., `--color-ee-primary`, `--radius-ee-modal`).
*   These core theme variables are defined in the Core Application's styles and are accessible within the Shadow DOM due to CSS variable inheritance.
*   **Direct CSS Usage:** Your egg can directly use these variables in its own `<style>` blocks within Vue components or in its Tailwind-generated CSS if you use arbitrary value support:
    ```css
    /* Example in an egg's component <style> or if custom CSS is added */
    .my-custom-element {
      background-color: var(--color-ee-modal-bg); /* Uses a core theme variable */
      border-radius: var(--radius-ee-modal);
      padding: var(--ee-sys-modal-padding);
    }
    ```
*   **Tailwind CSS Usage:** You can also use these variables with Tailwind's arbitrary value syntax directly in your templates:
    ```html
    <!-- Example in an egg's template -->
    <div class="bg-[var(--color-ee-modal-bg)] p-[var(--ee-sys-modal-padding)] text-[var(--color-ee-modal-text)]">
      Content styled with core theme variables via Tailwind.
    </div>
    ```
*   **Important:** The egg does *not* redefine these core theme variables. It consumes them. If an egg needs significantly different base styling not covered by tweaking its own components with utilities or themed variables, it might be a candidate for using `uiOptions` to hide parts of the core UI and take full control of its presentation (see "UI Customization for Eggs" in `CORE-README.md`).

### No Custom `tailwind.config.js` (Typically)

For Tailwind CSS v4, a `tailwind.config.js` is often not required if you are using the default theme and your `content` paths (for scanning classes) are correctly inferred by the `@tailwindcss/vite` plugin from your Vue components. The necessary Tailwind engine is included and configured by the Vite plugin.

### Using Fonts and Images

#### Fonts

*   **Inherited from Core:** Your egg will generally inherit the base font family set by the Core Application (via its Tailwind base styles and `theme.css`).
*   **Core Theme Fonts:** If the Core's `theme.css` defines specific font families using CSS custom properties (e.g., `--font-family-display`), your egg can use these variables in its CSS:
    ```css
    .egg-title { font-family: var(--font-family-display); }
    ```
*   **Custom Fonts for Your Egg:**
    *   If your egg requires a unique font not provided by the core, you are responsible for including it.
    *   Define `@font-face` rules within your egg's own CSS (e.g., in a `<style>` block in your Vue component, or in a CSS file that gets processed by Tailwind).
    *   Place the font files (e.g., `.woff2`) in your egg's `src/assets/fonts/` directory (or similar). Vite will process these during the build, typically copying them to `dist/assets` and making the paths in your CSS work correctly relative to the egg's deployed structure.

#### Images (SVGs, PNGs, etc.)

*   **Egg-Specific Images:**
    *   Place any images your egg directly uses (e.g., for `<img>` tags or CSS `background-image`) within your egg's `src/assets/images/` directory (or similar).
    *   Reference them with relative paths in your templates or CSS (e.g., `<img src="./assets/images/my-egg-image.png">`).
    *   Vite will handle bundling these images, usually placing them in `dist/assets` with potentially hashed filenames, and will update the paths in your compiled egg code and CSS.
*   **Using Images from the Core Application:**
    *   **Directly Referencing Core CSS `url()`s:** You generally **cannot** directly use `url()` paths for images defined in the Core Application's internal CSS.
    *   **Via CSS Variables (Recommended for Shared UI Elements):** If the Core Application intends to provide a shared UI asset (like an icon), it may expose it via a CSS custom property in its `theme.css`:
        ```css
        /* Core theme.css might have: */
        /* :root { --icon-core-info: url('https://<cdn_path_to_core_asset>/info-icon.svg'); } */
        ```
        Your egg can then use this variable:
        ```css
        .info-button::before { content: ""; background-image: var(--icon-core-info); /* ... other styles */ }
        ```
        **Note:** The URL in such a CSS variable provided by the core *must* be an absolute URL (e.g., pointing to a CDN or a fully qualified path on your asset server like Tigris) to be resolvable from the egg's context.

---

Remember to replace bracketed placeholders like `[Egg Name - e.g., Staff Grid]`, `[egg-id]`, `[Description of the egg]`, `[Key1, Key2]`, and `[ExportedVueComponentName]` with the specific details of your egg.