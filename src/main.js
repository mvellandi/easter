// src/main.js - Entry point for initializing the Easter Egg system

// import './styles/main.css'; // REMOVED Global CSS import

// Import the loader AND the core instance
import { loader, easterEgg } from "./loader/ee-loader.js";

// Async IIFE to handle await
(async () => {
  console.log("Main: Initializing Easter Egg system...");

  let mainRegistryPathOrUrl = null;

  if (import.meta.env.DEV) {
    // --- Development Mode ---
    console.log("Main: Running in Development mode.");
    mainRegistryPathOrUrl = "/src/dev-registry-sources.json"; // Use local path for Vite dev server
    console.log(`Main: Using local registry path: ${mainRegistryPathOrUrl}`);
  } else {
    // --- Production Mode ---
    console.log("Main: Running in Production mode (build output).");
    const scriptElement = document.getElementById("easter-egg-script");
    if (scriptElement && scriptElement.dataset.mainRegistryUrl) {
      mainRegistryPathOrUrl = scriptElement.dataset.mainRegistryUrl;
      console.log(
        `Main: Using registry URL from script tag: ${mainRegistryPathOrUrl}`
      );
    } else {
      console.error(
        "Main: Could not find script tag with id='easter-egg-script' or missing 'data-main-registry-url' attribute."
      );
      // Handle error - perhaps initialization should fail?
      // For now, we'll proceed with null, which will likely cause loader to fail.
    }
  }

  if (!mainRegistryPathOrUrl) {
    console.error(
      "Main: No main registry path or URL determined. Aborting initialization."
    );
    return; // Stop if we don't have a source
  }

  try {
    // Initialize the LOADER first (pass the determined source)
    await loader.initialize({ mainRegistryPathOrUrl }); // Pass as part of config object
    console.log("Main: Loader initialized.");

    // THEN initialize the CORE (attaches key listeners, mounts Vue app)
    easterEgg.initialize();
    console.log("Main: Core initialized.");

    console.log("Main: Easter Egg system ready.");
  } catch (error) {
    console.error("Main: Failed to initialize Easter Egg system:", error);
    // Optionally, display a user-facing error message here
  }
})();
