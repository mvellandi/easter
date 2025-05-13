import { createApp, reactive, markRaw } from "vue";

// Import core UI system styles
import coreCssString from "./core.css?inline";

// Import the new CoreModalShell component
import CoreModalShell from "./components/CoreModalShell.vue";

import {
  ErrorModalComponent,
  ErrorModalStyles,
  ErrorHandler,
} from "./components/ErrorModal.js";
import { KeyHandler } from "./key-handler.js";

class EasterEggCore {
  constructor() {
    this.eggs = new Map();
    this.activeEgg = null;
    this.vueApp = null;
    this.container = null;
    this.isVisible = false;
    this.keyHandler = new KeyHandler();
    this.errorHandlers = new Map();
    this.reactiveState = null;
    this.styleElement = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  initialize() {
    console.log("EasterEggCore: Initializing...");

    // 1. Create the reactive state object FIRST
    this.reactiveState = reactive({
      activeEgg: null,
      errorModal: {
        show: false,
        message: "",
        eggId: null,
      },
    });

    // Create container element
    this.container = document.createElement("div");
    this.container.id = "easter-egg-root-container";
    this.container.className = "ee-root-container";
    document.body.appendChild(this.container);
    console.log("EasterEggCore: Root container appended to body");

    // Create and inject core styles
    this.styleElement = document.createElement("style");
    this.styleElement.id = "easter-egg-core-styles";

    // Combine all core styles
    const coreStyles = `
      ${ErrorModalStyles}
      ${coreCssString}
    `;

    this.styleElement.textContent = coreStyles;
    document.head.appendChild(this.styleElement);
    console.log("EasterEggCore: Core styles injected into document head.");

    // Create the core interface with all necessary methods
    const coreInterfaceForEggs = {
      requestClose: (eggId) => {
        console.log(`EasterEggCore: Request to close egg ${eggId} received`);
        this.hideEgg(eggId);
      },
      showEgg: (eggId, options) => {
        console.log(`EasterEggCore: Request to show egg ${eggId} received`);
        this.showEgg(eggId, options);
      },
      registerEgg: (eggId, component, options) => {
        console.log(`EasterEggCore: Request to register egg ${eggId} received`);
        this.registerEgg(eggId, component, options);
      },
    };

    // Create Vue app using the new CoreModalShell component
    this.vueApp = createApp(CoreModalShell, {
      reactiveState: this.reactiveState,
      coreInterface: coreInterfaceForEggs,
    });

    // Initialize error handler
    this.errorHandler = new ErrorHandler(this.reactiveState.errorModal);

    // 3. Mount Vue app
    this.vueApp.mount(this.container);
    console.log("EasterEggCore: Vue app mounted.");

    // Add keyboard event listeners
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    console.log("EasterEggCore: Keyboard event listeners added to document.");

    console.log("EasterEggCore: Initialization complete");
  }

  /**
   * Registers an egg with the core system
   * @param {string} eggId - The ID of the egg
   * @param {Function|Object} component - The egg component (can be a dynamic import)
   * @param {Object} options - The egg options
   */
  registerEgg(eggId, component, options = {}) {
    console.log(
      `EasterEggCore: Registering egg ${eggId} with options:`,
      options
    );

    this.eggs.set(eggId, {
      component,
      options,
      isVisible: false,
    });

    console.log(`EasterEggCore: Successfully registered egg ${eggId}`);
    console.log(
      "EasterEggCore: Current registered eggs:",
      Array.from(this.eggs.keys())
    );
  }

  handleKeyDown(event) {
    this.keyHandler.handleKeyDown(event);

    // Check for Escape key first if an egg is active
    if (event.key === "Escape" && this.activeEgg) {
      console.log("EasterEggCore: Escape key pressed, unmounting active egg.");
      event.preventDefault();
      this.unmount();
      return;
    }

    console.log(
      "EasterEggCore: Checking key combinations for eggs:",
      Array.from(this.eggs.entries()).map(([id, egg]) => ({
        id,
        isVisible: egg.isVisible,
      }))
    );
  }

  handleKeyUp(event) {
    this.keyHandler.handleKeyUp(event);
  }

  /**
   * Shows an egg in the modal
   * @param {string} eggId - The ID of the egg to show
   * @param {Object} options - Additional options for the egg
   */
  async showEgg(eggId, options = {}) {
    console.log(`EasterEggCore: Showing egg ${eggId} with options:`, options);

    const egg = this.eggs.get(eggId);
    if (!egg) {
      console.error(`EasterEggCore: Egg ${eggId} not found`);
      return;
    }

    try {
      // Load the component if it's a dynamic import
      const component =
        typeof egg.component === "function"
          ? (await egg.component()).StaffGridEggComponent
          : egg.component;

      // Log the staff data
      console.log("Staff data from options:", options.staffData);
      console.log("Staff data from egg options:", egg.options.staffData);

      // Ensure all required props are present and properly formatted
      const mergedOptions = {
        title: options.title || egg.options.title || "Our Team",
        assetConfig: {
          fallbackUrl:
            options.assetConfig?.fallbackUrl ||
            egg.options.assetConfig?.fallbackUrl ||
            "/src/eggs/staff-grid/images/fallback.webp",
        },
        staffData: Array.isArray(options.staffData)
          ? options.staffData
          : Array.isArray(egg.options.staffData)
          ? egg.options.staffData
          : [],
        coreInterface: {
          requestClose: () => this.hideEgg(eggId),
        },
      };

      console.log("Final merged options:", mergedOptions);

      // Update the reactive state to show the egg
      this.reactiveState.activeEgg = {
        id: eggId,
        component: markRaw(component),
        props: mergedOptions,
      };

      // Show the modal
      this.isVisible = true;
      const content = this.container.querySelector(".ee-content");
      const backdrop = this.container.querySelector(".ee-backdrop");
      if (content) content.classList.add("ee-content-visible");
      if (backdrop) backdrop.classList.add("ee-backdrop-visible");

      // Update egg state
      this.eggs.set(eggId, {
        ...egg,
        isVisible: true,
      });
    } catch (error) {
      console.error(`EasterEggCore: Error showing egg ${eggId}:`, error);
    }
  }

  /**
   * Hides an egg
   * @param {string} eggId - The ID of the egg to hide
   */
  hideEgg(eggId) {
    console.log(`EasterEggCore: Hiding egg ${eggId}`);

    // Get the egg before clearing state
    const egg = this.eggs.get(eggId);
    if (!egg) {
      console.warn(
        `EasterEggCore: Attempted to hide non-existent egg ${eggId}`
      );
      return;
    }

    // Clear the active egg
    this.reactiveState.activeEgg = null;

    // Hide the modal
    this.isVisible = false;

    // Remove visibility classes
    const content = this.container.querySelector(".ee-content");
    const backdrop = this.container.querySelector(".ee-backdrop");

    if (content) {
      console.log("Removing ee-content-visible class");
      content.classList.remove("ee-content-visible");
    } else {
      console.warn("Could not find .ee-content element");
    }

    if (backdrop) {
      console.log("Removing ee-backdrop-visible class");
      backdrop.classList.remove("ee-backdrop-visible");
    } else {
      console.warn("Could not find .ee-backdrop element");
    }

    // Update egg state
    this.eggs.set(eggId, {
      ...egg,
      isVisible: false,
    });

    // Reset key handler state
    this.keyHandler.reset();

    console.log(`EasterEggCore: Egg ${eggId} hidden successfully`);
  }

  mount(eggId) {
    const eggToMount = this.eggs.get(eggId);
    if (!eggToMount) {
      console.error(`EasterEggCore: Attempted to mount unknown egg ${eggId}`);
      return;
    }

    // Unmount any currently active egg first
    if (this.activeEgg && this.activeEgg.id !== eggId) {
      this.unmount();
    }

    console.log(`EasterEggCore: Mounting egg ${eggId}`, eggToMount);
    this.activeEgg = { ...eggToMount, id: eggId };

    // Update reactive state for Vue to render the component
    this.reactiveState.activeEgg = this.activeEgg;

    this.isVisible = true;
    console.log(
      `EasterEggCore: Egg ${eggId} is now active and visible (pending Vue render).`
    );
  }

  unmount() {
    if (!this.activeEgg) return;
    console.log(`EasterEggCore: Unmounting active egg ${this.activeEgg.id}`);

    this.activeEgg = null;
    this.reactiveState.activeEgg = null;
    this.isVisible = false;
    this.keyHandler.reset();
    console.log("EasterEggCore: Active egg unmounted and hidden.");
  }

  destroy() {
    console.log("EasterEggCore: Destroying instance");
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    if (this.vueApp) {
      this.vueApp.unmount();
    }
    if (this.container) {
      this.container.remove();
    }
    if (this.styleElement) {
      this.styleElement.remove();
    }
    console.log("EasterEggCore: Cleanup complete");
  }

  handleError(eggId, errorType, error, context = {}) {
    console.error(`EasterEggCore: Error in egg ${eggId}:`, errorType, error);

    // Check if there's a specific handler for this egg and error type
    const eggHandlers = this.errorHandlers.get(eggId);
    if (eggHandlers && eggHandlers[errorType]) {
      try {
        eggHandlers[errorType](error, context);
        return true;
      } catch (handlerError) {
        console.error(
          `EasterEggCore: Error handler for ${eggId} failed:`,
          handlerError
        );
      }
    }

    // Default error handling
    this.handleDefaultError(eggId, errorType, error, context);
    return false;
  }

  handleDefaultError(eggId, errorType, error, context) {
    if (this.reactiveState) {
      this.reactiveState.errorModal.eggId = eggId;
      this.reactiveState.errorModal.message = `Error in ${eggId} (${errorType}): ${error.message}`;
      this.reactiveState.errorModal.show = true;
    } else {
      console.error(
        "EasterEggCore: Reactive state not available. Cannot show error modal."
      );
    }

    switch (errorType) {
      case "renderError":
        console.warn(
          `EasterEggCore: Render error for egg ${eggId}, attempting recovery`
        );
        this.unmount();
        setTimeout(() => this.mount(eggId), 100);
        break;
      default:
        console.error(
          `EasterEggCore: Unhandled error type ${errorType} for egg ${eggId}`
        );
    }
  }
}

// Create a singleton instance
const core = new EasterEggCore();

// Export the registerKeyCombo function
export function registerKeyCombo() {
  core.initialize();
}

// Export the core instance
export default core;
