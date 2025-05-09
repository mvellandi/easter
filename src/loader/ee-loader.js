import easterEgg from "../core/ee-core.js";

class EasterEggLoader {
  constructor() {
    this.registry = new Map();
    this.loadedEggs = new Set();
    this.mainRegistryConfig = null;
  }

  async initialize(config = {}) {
    console.log("Initializing Easter egg loader with config:", config);

    // Use the specifically passed path/URL
    const mainRegistryPathOrUrl = config.mainRegistryPathOrUrl;

    if (mainRegistryPathOrUrl) {
      console.log(
        `Loader: Starting with main registry: ${mainRegistryPathOrUrl}`
      );
      await this.loadMainRegistry(mainRegistryPathOrUrl);
      // } else if (config.registry) { // Keep old fallback?
      //   // Fallback for old direct registry loading (optional)
      //   await this.loadRegistry(config.registry, config.eggs);
    } else {
      console.error(
        "EasterEggLoader: No mainRegistryPathOrUrl specified in config."
      );
    }

    console.log("Easter egg loader initialized");
  }

  // Add the loadMainRegistry method back
  async loadMainRegistry(mainRegistryPathOrUrl) {
    // Use the passed argument directly
    console.log("Loading main registry from:", mainRegistryPathOrUrl);
    try {
      const response = await fetch(mainRegistryPathOrUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        console.warn(
          `Warning: Main registry response is not JSON. Content-Type: ${response.headers.get(
            "content-type"
          )}`
        );
      }
      const mainRegistryData = await response.json();
      this.mainRegistryConfig = mainRegistryData;
      console.log("Loaded main registry data:", mainRegistryData);

      if (
        mainRegistryData.registries &&
        Array.isArray(mainRegistryData.registries)
      ) {
        for (const registryRef of mainRegistryData.registries) {
          if (registryRef.enabled) {
            const relativeOrAbsolutePath = registryRef.path; // Path from JSON
            let nextPathOrUrl;

            const isProductionUrl =
              mainRegistryPathOrUrl.startsWith("http://") ||
              mainRegistryPathOrUrl.startsWith("https://");

            if (isProductionUrl) {
              // Production: Resolve relative path against the main registry's URL
              if (
                relativeOrAbsolutePath.startsWith("http://") ||
                relativeOrAbsolutePath.startsWith("https://")
              ) {
                nextPathOrUrl = relativeOrAbsolutePath; // It's already absolute
              } else {
                // Assume relativeOrAbsolutePath is relative to the registry location
                nextPathOrUrl = new URL(
                  relativeOrAbsolutePath,
                  mainRegistryPathOrUrl
                ).href;
              }
              console.log(
                `Loader (Prod): Resolved registry path ${relativeOrAbsolutePath} to ${nextPathOrUrl}`
              );
            } else {
              // Development: mainRegistryPathOrUrl is a local file path (e.g., /src/dev-registry-sources.json)
              // relativeOrAbsolutePath is the path from dev-registry-sources.json,
              // which could be an absolute URL (http://...) or a file path.

              if (
                relativeOrAbsolutePath.startsWith("http://") ||
                relativeOrAbsolutePath.startsWith("https://")
              ) {
                // If registryRef.path is an absolute URL, use it directly
                nextPathOrUrl = relativeOrAbsolutePath;
                console.log(
                  `Loader (Dev): Using absolute URL for egg registry: ${nextPathOrUrl}`
                );
              } else if (relativeOrAbsolutePath.startsWith("/")) {
                // Path from JSON is already root-relative, use it directly
                nextPathOrUrl = relativeOrAbsolutePath;
                console.log(
                  `Loader (Dev): Using root-relative path ${nextPathOrUrl}`
                );
              } else {
                // Path from JSON is relative to the current main registry's directory
                const baseDir = mainRegistryPathOrUrl.substring(
                  0,
                  mainRegistryPathOrUrl.lastIndexOf("/")
                );
                nextPathOrUrl = `${baseDir}/${relativeOrAbsolutePath}`;
                // Basic normalization
                nextPathOrUrl = nextPathOrUrl
                  .replace(/\/\/\//g, "/")
                  .replace(/\/\.\//g, "/");
                console.log(
                  `Loader (Dev): Resolved file-relative path ${relativeOrAbsolutePath} to ${nextPathOrUrl}`
                );
              }
            }

            await this.loadRegistry(nextPathOrUrl);
          } else {
            console.log(`Skipping disabled registry: ${registryRef.id}`);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load main Easter egg registry:", error);
      easterEgg.handleError("loader", "networkError", error, {
        file: mainRegistryPathOrUrl,
      });
    }
  }

  async loadRegistry(registryPathOrUrl) {
    console.log("Loading individual registry from:", registryPathOrUrl);
    try {
      const response = await fetch(registryPathOrUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        console.warn(
          `Warning: Registry response is not JSON. Content-Type: ${response.headers.get(
            "content-type"
          )}`
        );
      }

      let registryData;
      try {
        registryData = await response.json();
      } catch (parseError) {
        console.error(
          `Failed to parse JSON for registry: ${registryPathOrUrl}`,
          parseError
        );
        const textResponse = await response.text(); // Get text for logging
        console.error("Raw response text:", textResponse);
        easterEgg.handleError("loader", "parseError", parseError, {
          file: registryPathOrUrl,
          responseText: textResponse,
        });
        return; // Stop processing this registry
      }

      console.log(
        `Loaded registry data from ${registryPathOrUrl}:`,
        registryData
      );

      // Determine the base path for all assets defined in this registry.
      // This base path is the directory containing the registry.json file itself.
      let eggAssetBaseUrlOrPath;
      const isRegistryAUrl =
        registryPathOrUrl.startsWith("http://") ||
        registryPathOrUrl.startsWith("https://");

      if (isRegistryAUrl) {
        // For URLs, the base is the directory containing the registry.json
        // e.g., if registryPathOrUrl = "http://example.com/eggs/my-egg/registry.json"
        // then eggAssetBaseUrlOrPath = "http://example.com/eggs/my-egg/"
        // new URL('.', registryPathOrUrl).href ensures the base ends with a '/'
        eggAssetBaseUrlOrPath = new URL(".", registryPathOrUrl).href;
      } else {
        // For local file paths (e.g., "/src/eggs/my-egg/registry.json")
        // the base is "/src/eggs/my-egg/"
        const lastSlash = registryPathOrUrl.lastIndexOf("/");
        if (lastSlash === -1) {
          eggAssetBaseUrlOrPath = "./"; // Relative to current if no slash (unlikely for our setup)
        } else {
          eggAssetBaseUrlOrPath = registryPathOrUrl.substring(0, lastSlash + 1);
        }
      }
      console.log(
        `Loader: Determined asset base for ${registryPathOrUrl} as: ${eggAssetBaseUrlOrPath}`
      );

      // Helper function to resolve a relative path against the egg's asset base.
      const _resolveAssetPath = (relativePath, base) => {
        if (!relativePath) return null;
        const isBaseAbsoluteUrl =
          base.startsWith("http://") || base.startsWith("https://");

        if (isBaseAbsoluteUrl) {
          try {
            return new URL(relativePath, base).href;
          } catch (e) {
            console.error(
              `Error resolving URL: relative='${relativePath}', base='${base}'`,
              e
            );
            return relativePath; // Fallback or handle error
          }
        } else {
          // Handle local paths (e.g., base="/src/eggs/my-egg/")
          if (relativePath.startsWith("/")) {
            // Already root-relative
            return relativePath.replace(/\/\/\//g, "/").replace(/\/\.\//g, "/");
          }
          let joinedPath = `${base}${relativePath}`;
          return joinedPath.replace(/\/\/\//g, "/").replace(/\/\.\//g, "/");
        }
      };

      // Process eggs from this registry
      const eggIds = Object.keys(registryData);
      for (const eggId of eggIds) {
        const originalEggConfig = registryData[eggId];
        // Clone the config to modify paths without altering the original registryData object
        const eggConfig = JSON.parse(JSON.stringify(originalEggConfig));

        // Ensure uiOptions is part of the eggConfig
        eggConfig.uiOptions = originalEggConfig.uiOptions || {};

        console.log(
          `Loader: Processing egg '${eggId}' from ${registryPathOrUrl}`
        );

        // --- Resolve all relevant paths in eggConfig against eggAssetBaseUrlOrPath ---

        // Resolve script path
        if (eggConfig.script) {
          eggConfig.script = _resolveAssetPath(
            eggConfig.script,
            eggAssetBaseUrlOrPath
          );
          console.log(
            `Loader: Resolved script for ${eggId} to: ${eggConfig.script}`
          );
        } else {
          console.error(`Loader: Egg '${eggId}' has no script defined.`);
          easterEgg.handleError(
            "loader",
            "configError",
            new Error("No script defined"),
            { eggId, file: registryPathOrUrl }
          );
          continue; // Skip this egg
        }

        // --- NEW: Resolve style path ---
        if (
          originalEggConfig.style &&
          typeof originalEggConfig.style === "string" &&
          originalEggConfig.style.trim() !== ""
        ) {
          eggConfig.styleUrl = _resolveAssetPath(
            originalEggConfig.style,
            eggAssetBaseUrlOrPath
          );
          console.log(
            `Loader: Resolved style for ${eggId} to: ${eggConfig.styleUrl}`
          );
        } else {
          eggConfig.styleUrl = null; // Explicitly set to null if not defined or invalid
          console.log(
            `Loader: Egg '${eggId}' has no specific style sheet defined or path is invalid.`
          );
        }
        // --- END NEW ---

        let absoluteDataUrlOrPath = null;
        if (eggConfig.props && eggConfig.props.dataUrl) {
          absoluteDataUrlOrPath = _resolveAssetPath(
            eggConfig.props.dataUrl,
            eggAssetBaseUrlOrPath
          );
          eggConfig.props.dataUrl = absoluteDataUrlOrPath; // Update config with resolved path
          console.log(
            `Loader: Resolved dataUrl for ${eggId} to: ${absoluteDataUrlOrPath}`
          );
        }

        if (
          eggConfig.props &&
          eggConfig.props.assetConfig &&
          eggConfig.props.assetConfig.fallbackUrl
        ) {
          eggConfig.props.assetConfig.fallbackUrl = _resolveAssetPath(
            eggConfig.props.assetConfig.fallbackUrl,
            eggAssetBaseUrlOrPath
          );
          console.log(
            `Loader: Resolved fallbackUrl for ${eggId} to: ${eggConfig.props.assetConfig.fallbackUrl}`
          );
        }

        // --- Pre-fetch data and pre-resolve remoteImage paths (if dataUrl exists) ---
        let resolvedStaffData = null;
        if (absoluteDataUrlOrPath) {
          try {
            console.log(
              `Loader: Fetching data for ${eggId} from ${absoluteDataUrlOrPath}`
            );
            const dataResponse = await fetch(absoluteDataUrlOrPath);
            if (!dataResponse.ok) {
              throw new Error(
                `HTTP error fetching data: ${dataResponse.status} for ${absoluteDataUrlOrPath}`
              );
            }
            // Ensure data response is JSON if that's expected
            if (
              !dataResponse.headers
                .get("content-type")
                ?.includes("application/json")
            ) {
              console.warn(
                `Warning: Data response for ${eggId} from ${absoluteDataUrlOrPath} is not JSON. Content-Type: ${response.headers.get(
                  "content-type"
                )}`
              );
            }
            const staffDataArray = await dataResponse.json(); // Assuming data is an array like staffData

            // Example: if staffDataArray is an array of objects with 'remoteImage'
            if (Array.isArray(staffDataArray)) {
              resolvedStaffData = staffDataArray.map((item) => {
                let resolvedRemoteImageUrl = item.remoteImage; // Keep original if not defined
                if (item.remoteImage) {
                  resolvedRemoteImageUrl = _resolveAssetPath(
                    item.remoteImage,
                    eggAssetBaseUrlOrPath
                  );
                }
                return { ...item, remoteImage: resolvedRemoteImageUrl };
              });
              console.log(
                `Loader: Pre-resolved remoteImage URLs/Paths for egg ${eggId}`
              );
            } else {
              // If data is not an array or doesn't fit the staffData structure,
              // assign it directly or handle as needed.
              resolvedStaffData = staffDataArray;
              console.log(
                `Loader: Fetched data for ${eggId}, structure might not contain 'remoteImage'.`
              );
            }
          } catch (e) {
            console.error(
              `Loader: Failed to fetch or resolve data for ${eggId} from ${absoluteDataUrlOrPath}`,
              e
            );
            // Potentially call easterEgg.handleError or decide if registration should proceed
          }
        }
        // --- End Path Resolution and Data Fetching ---

        if (!this.registry.has(eggId)) {
          // Store the modified eggConfig (with resolved URLs/Paths)
          this.registry.set(eggId, eggConfig);
          // Register, passing the potentially modified config AND the pre-resolved data
          // The eggConfig in this.registry now has a fully resolved script path.
          await this.registerEgg(eggId, resolvedStaffData);
        } else {
          console.warn(
            `Egg ${eggId} from ${registryPathOrUrl} already loaded from another registry. Skipping.`
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to load Easter egg registry: ${registryPathOrUrl}`,
        error
      );
      easterEgg.handleError("loader", "networkError", error, {
        file: registryPathOrUrl,
      });
    }
  }

  // registerEggs method is no longer needed if we register immediately in loadRegistry
  // async registerEggs(eggIds) { ... }

  async registerEgg(eggId, preResolvedData = null) {
    // This method now assumes eggConfig is already in this.registry
    if (this.loadedEggs.has(eggId)) {
      return;
    }

    const eggConfig = this.registry.get(eggId);
    if (!eggConfig) {
      console.error(
        `Internal Error: Egg config ${eggId} not found in registry during registration`
      );
      return;
    }

    console.log(`Registering Easter egg: ${eggId}`, eggConfig);
    this.loadedEggs.add(eggId); // Mark as loading/loaded early

    try {
      let component;
      // Load egg script as a module if needed
      if (eggConfig.script) {
        console.log(`Loading script module for ${eggId}: ${eggConfig.script}`);
        const module = await import(eggConfig.script /* @vite-ignore */); // vite-ignore might be needed if using Vite later
        console.log(`Loaded module for ${eggId}:`, module);
        if (!eggConfig.componentExportName) {
          throw new Error(
            `Missing 'componentExportName' in registry for egg ${eggId}`
          );
        }
        component = module[eggConfig.componentExportName];
        if (!component) {
          throw new Error(
            `Component export '${eggConfig.componentExportName}' not found in module ${eggConfig.script}`
          );
        }
      } else {
        throw new Error(`Missing 'script' in registry for egg ${eggId}`);
      }

      // Prepare props, potentially adding the pre-resolved data
      const finalProps = { ...(eggConfig.props || {}) };
      if (preResolvedData) {
        finalProps.staffData = preResolvedData; // Add data directly to props
        // The component will now expect props.staffData instead of fetching props.dataUrl
        delete finalProps.dataUrl; // Remove the URL as it's no longer needed by component
        console.log(`Loader: Passing pre-resolved staff data to egg ${eggId}`);
      }

      // Register with core, passing the imported component definition
      easterEgg.register(eggId, {
        keyCombination: eggConfig.keyCombination,
        component: component, // Pass the actual imported component
        props: finalProps, // Pass potentially modified props
        uiOptions: eggConfig.uiOptions, // Pass uiOptions to the core
        scriptUrl: eggConfig.script, // Pass along for context
        styleUrl: eggConfig.styleUrl, // Pass the resolved style URL
      });

      console.log(`Successfully registered Easter egg: ${eggId}`);
    } catch (error) {
      console.error(`Failed to register Easter egg ${eggId}:`, error);
      easterEgg.handleError(eggId, "loadError", error, { config: eggConfig });
      this.loadedEggs.delete(eggId); // Unmark if registration failed
    }
  }

  destroy() {
    easterEgg.destroy();
  }
}

// Create and export singleton instance
const loader = new EasterEggLoader();
export { loader, easterEgg };
