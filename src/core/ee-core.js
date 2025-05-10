import {
  createApp,
  ref,
  reactive,
  computed,
  nextTick,
  watch,
  markRaw,
} from "vue";

// Import styles in order of specificity
import masterCssString from "../styles/index.css?inline"; // Master CSS file for all styles

// Import the new CoreModalShell component
import CoreModalShell from "./components/CoreModalShell.vue";

// Import styles for CoreModalShell to be injected manually
import coreModalShellCssString from "./components/CoreModalShell.css?inline";
// Import styles for CoreOverlay to be injected manually
import coreOverlayCssString from "./components/CoreOverlay.css?inline";
// Import styles for CoreModalContent to be injected manually
import coreModalContentCssString from "./components/CoreModalContent.css?inline";
// Import styles for CoreFloatingCloseButton to be injected manually
import coreFloatingCloseButtonCssString from "./components/CoreFloatingCloseButton.css?inline";
// Import styles for CoreDefaultCloseButton to be injected manually
import coreDefaultCloseButtonCssString from "./components/CoreDefaultCloseButton.css?inline";

// Use Vue from the global scope instead of importing
// import Modal from "./components/Modal.vue";

import {
  ErrorModalComponent,
  ErrorModalStyles,
  ErrorHandler,
} from "./components/ErrorModal.js";
import { KeyHandler } from "./key-handler.js";

const coreStructuralStyles = `
  ${ErrorModalStyles}
`;

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
    this.activeEggStyleLinkElement = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  initialize() {
    console.log("EasterEggCore: Initializing with Shadow DOM...");
    const coreInstance = this;
    // this.shadowRoot = this.container.attachShadow({ mode: "open" }); // MOVED DOWN

    // 1. Create the reactive state object FIRST
    this.reactiveState = reactive({
      activeEgg: null, // Will store { id, component, props, uiOptions }
      activeEggComponent: null, // Stores the actual Vue component definition
      errorModal: {
        show: false,
        message: "",
        eggId: null,
      },
    });

    // Create container element (remains in light DOM)
    this.container = document.createElement("div");
    this.container.id = "easter-egg-root-container"; // Renamed ID for clarity
    document.body.appendChild(this.container);
    console.log("EasterEggCore: Root container appended to body");

    // Attach Shadow DOM AFTER container is created
    this.shadowRoot = this.container.attachShadow({ mode: "open" });
    console.log("EasterEggCore: Shadow DOM attached.");

    // 2. Inject ALL Styles into Shadow DOM
    // 2.1 Core structural styles (error modal)
    const coreStyleElement = document.createElement("style");
    coreStyleElement.textContent = coreStructuralStyles;
    this.shadowRoot.appendChild(coreStyleElement);
    console.log(
      "EasterEggCore: Core structural styles injected into Shadow DOM."
    );

    // 2.2 Master CSS (Tailwind base, baseline, theme, custom)
    const masterStyleElement = document.createElement("style");
    masterStyleElement.textContent = masterCssString;
    this.shadowRoot.appendChild(masterStyleElement);
    console.log(
      "EasterEggCore: Master CSS (Tailwind, baseline, theme, custom) injected into Shadow DOM."
    );

    // 2.3 Component-specific styles
    // Inject CoreModalShell.css styles
    const coreModalShellStyleElement = document.createElement("style");
    coreModalShellStyleElement.textContent = coreModalShellCssString;
    this.shadowRoot.appendChild(coreModalShellStyleElement);
    console.log(
      "EasterEggCore: CoreModalShell.css styles injected into Shadow DOM."
    );

    // Inject CoreOverlay.css styles
    const coreOverlayStyleElement = document.createElement("style");
    coreOverlayStyleElement.textContent = coreOverlayCssString;
    this.shadowRoot.appendChild(coreOverlayStyleElement);
    console.log(
      "EasterEggCore: CoreOverlay.css styles injected into Shadow DOM."
    );

    // Inject CoreModalContent.css styles
    const coreModalContentStyleElement = document.createElement("style");
    coreModalContentStyleElement.textContent = coreModalContentCssString;
    this.shadowRoot.appendChild(coreModalContentStyleElement);
    console.log(
      "EasterEggCore: CoreModalContent.css styles injected into Shadow DOM."
    );

    // Inject CoreFloatingCloseButton.css styles
    const coreFloatingCloseButtonStyleElement = document.createElement("style");
    coreFloatingCloseButtonStyleElement.textContent =
      coreFloatingCloseButtonCssString;
    this.shadowRoot.appendChild(coreFloatingCloseButtonStyleElement);
    console.log(
      "EasterEggCore: CoreFloatingCloseButton.css styles injected into Shadow DOM."
    );

    // Inject CoreDefaultCloseButton.css styles
    const coreDefaultCloseButtonStyleElement = document.createElement("style");
    coreDefaultCloseButtonStyleElement.textContent =
      coreDefaultCloseButtonCssString;
    this.shadowRoot.appendChild(coreDefaultCloseButtonStyleElement);
    console.log(
      "EasterEggCore: CoreDefaultCloseButton.css styles injected into Shadow DOM."
    );

    // (Optional: If ErrorModalStyles were separate and needed, inject them too)
    // const errorModalStyleElement = document.createElement('style');
    // errorModalStyleElement.textContent = ErrorModalStyles;
    // shadowRoot.appendChild(errorModalStyleElement);

    const coreInterfaceForEggs = {
      // Bind 'this' to ensure 'unmount' is called on the coreInstance
      requestClose: coreInstance.unmount.bind(coreInstance),
      // We can add other functions here later if eggs need more ways to interact with the core
    };

    // Create Vue app using the new CoreModalShell component
    this.vueApp = createApp(CoreModalShell, {
      reactiveState: this.reactiveState, // Pass the reactive state object
      onUnmountRequest: this.unmount, // Pass the core's unmount method (for shell's own close)
      coreInterface: coreInterfaceForEggs, // Pass the interface for the egg itself
    });

    // Initialize error handler (ensure it works with shadow DOM if needed)
    // Error modal component itself uses Tailwind classes, so should be styled by injected styles.
    this.errorHandler = new ErrorHandler(this.reactiveState.errorModal);

    // 3. Mount Vue app INSIDE the Shadow Root
    this.vueApp.mount(this.shadowRoot);
    console.log("EasterEggCore: Vue app mounted inside Shadow DOM.");

    // Add keyboard event listeners (remain on document)
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    console.log("EasterEggCore: Keyboard event listeners added to document.");

    console.log("EasterEggCore: Initialization complete");
  }

  register(eggId, config) {
    console.log(`EasterEggCore: Registering egg ${eggId} with config:`, config);

    if (this.eggs.has(eggId)) {
      console.warn(`Easter egg ${eggId} is already registered`);
      return;
    }

    // Make sure the component is available
    if (!config.component) {
      console.error(
        `EasterEggCore: Component for egg ${eggId} is not available`
      );
      return;
    }

    this.eggs.set(eggId, {
      component: config.component,
      props: config.props || {},
      keyCombination: config.keyCombination,
      uiOptions: config.uiOptions || {},
      scriptUrl: config.scriptUrl,
      styleUrl: config.styleUrl,
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

    // --- Check for Escape key first if an egg is active ---
    if (event.key === "Escape" && this.activeEgg) {
      console.log("EasterEggCore: Escape key pressed, unmounting active egg.");
      event.preventDefault(); // Prevent potential browser default Escape behavior
      this.unmount();
      return; // Stop processing further for this key event
    }
    // --- End Escape key check ---

    console.log(
      "EasterEggCore: Checking key combinations for eggs:",
      Array.from(this.eggs.entries()).map(([id, egg]) => ({
        id,
        keyCombination: egg.keyCombination,
        isVisible: egg.isVisible,
      }))
    );

    for (const [eggId, egg] of this.eggs) {
      console.log(
        `EasterEggCore: Checking egg ${eggId} with combination:`,
        egg.keyCombination
      );

      if (this.keyHandler.isKeyCombinationMatch(event, egg.keyCombination)) {
        console.log(`EasterEggCore: Key combination matched for egg: ${eggId}`);
        event.preventDefault();
        this.toggleEgg(eggId);
        break;
      }
    }
  }

  handleKeyUp(event) {
    this.keyHandler.handleKeyUp(event);
  }

  toggleEgg(eggId) {
    console.log(`EasterEggCore: Toggling egg ${eggId}`);
    const egg = this.eggs.get(eggId);
    if (!egg) {
      console.warn(`EasterEggCore: Egg ${eggId} not found`);
      return;
    }

    if (this.activeEgg?.id === eggId) {
      console.log(`EasterEggCore: Unmounting active egg ${eggId}`);
      this.unmount();
    } else {
      console.log(`EasterEggCore: Mounting egg ${eggId}`);
      this.mount(eggId);
    }
  }

  mount(eggId) {
    const eggToMount = this.eggs.get(eggId);
    if (!eggToMount) {
      console.error(`EasterEggCore: Attempted to mount unknown egg ${eggId}`);
      return;
    }

    // Unmount any currently active egg first
    if (this.activeEgg && this.activeEgg.id !== eggId) {
      this.unmount(); // This will also clear its specific stylesheet
    }

    console.log(`EasterEggCore: Mounting egg ${eggId}`, eggToMount);
    this.activeEgg = { ...eggToMount, id: eggId }; // Store a copy with id

    // --- NEW: Manage egg-specific stylesheet in Shadow DOM ---
    // Remove previous egg's stylesheet if it exists and belongs to a different egg
    if (
      this.activeEggStyleLinkElement &&
      this.activeEggStyleLinkElement.parentNode === this.shadowRoot
    ) {
      this.shadowRoot.removeChild(this.activeEggStyleLinkElement);
      this.activeEggStyleLinkElement = null;
      console.log("EasterEggCore: Removed previous egg specific stylesheet.");
    }

    // If the new egg has a styleUrl, create and append its <link> tag
    if (eggToMount.styleUrl) {
      console.log(
        `EasterEggCore: Loading stylesheet for egg ${eggId} from ${eggToMount.styleUrl}`
      );
      this.activeEggStyleLinkElement = document.createElement("link");
      this.activeEggStyleLinkElement.setAttribute("rel", "stylesheet");
      this.activeEggStyleLinkElement.setAttribute("href", eggToMount.styleUrl);
      this.activeEggStyleLinkElement.onload = () => {
        console.log(
          `EasterEggCore: Successfully loaded stylesheet for egg ${eggId}: ${eggToMount.styleUrl}`
        );
      };
      this.activeEggStyleLinkElement.onerror = () => {
        console.error(
          `EasterEggCore: Failed to load stylesheet for egg ${eggId}: ${eggToMount.styleUrl}`
        );
      };
      this.shadowRoot.appendChild(this.activeEggStyleLinkElement);
    } else {
      console.log(
        `EasterEggCore: Egg ${eggId} does not have a specific stylesheet.`
      );
    }
    // --- END NEW ---

    // Update reactive state for Vue to render the component
    this.reactiveState.activeEgg = this.activeEgg;
    this.reactiveState.activeEggComponent = markRaw(this.activeEgg.component);

    this.isVisible = true;
    // this.container.style.display = "block"; // Visibility handled by CoreModalShell based on reactiveState
    console.log(
      `EasterEggCore: Egg ${eggId} is now active and visible (pending Vue render).`
    );
  }

  unmount() {
    if (!this.activeEgg) return;
    console.log(`EasterEggCore: Unmounting active egg ${this.activeEgg.id}`);

    // --- NEW: Remove active egg's specific stylesheet ---
    if (
      this.activeEggStyleLinkElement &&
      this.activeEggStyleLinkElement.parentNode === this.shadowRoot
    ) {
      this.shadowRoot.removeChild(this.activeEggStyleLinkElement);
      this.activeEggStyleLinkElement = null;
      console.log(
        "EasterEggCore: Removed active egg specific stylesheet during unmount."
      );
    }
    // --- END NEW ---

    this.activeEgg = null;
    this.reactiveState.activeEgg = null;
    this.reactiveState.activeEggComponent = null;
    this.isVisible = false;
    // this.container.style.display = "none"; // Visibility handled by CoreModalShell
    this.keyHandler.reset(); // Reset key sequence on unmount
    console.log("EasterEggCore: Active egg unmounted and hidden.");
  }

  destroy() {
    console.log("EasterEggCore: Destroying instance");
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    if (this.vueApp) {
      // Check if app exists before unmounting
      this.vueApp.unmount(); // Unmount from shadow root
    }
    if (this.container) {
      // Check if container exists before removing
      this.container.remove(); // Remove the host element from the light DOM
    }
    console.log("EasterEggCore: Cleanup complete");
  }

  /**
   * Register an error handler for a specific egg
   * @param {string} eggId - The ID of the egg
   * @param {Object} handlers - Object containing error handlers
   * @param {Function} handlers.assetLoadError - Handler for asset loading errors
   * @param {Function} handlers.renderError - Handler for rendering errors
   * @param {Function} handlers.networkError - Handler for network errors
   */
  registerErrorHandler(eggId, handlers) {
    this.errorHandlers.set(eggId, handlers);
    console.log(`EasterEggCore: Registered error handlers for egg ${eggId}`);
  }

  /**
   * Handle an error that occurred in an egg
   * @param {string} eggId - The ID of the egg where the error occurred
   * @param {string} errorType - The type of error (assetLoadError, renderError, networkError)
   * @param {Error} error - The error object
   * @param {Object} context - Additional context about the error
   * @returns {boolean} - Whether the error was handled
   */
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

  /**
   * Default error handling when no specific handler is available
   */
  handleDefaultError(eggId, errorType, error, context) {
    // Show error modal using shared state
    if (this.reactiveState) {
      this.reactiveState.errorModal.eggId = eggId;
      this.reactiveState.errorModal.message = `Error in ${eggId} (${errorType}): ${error.message}`;
      this.reactiveState.errorModal.show = true;
    } else {
      console.error(
        "EasterEggCore: Reactive state not available. Cannot show error modal."
      );
      // Log original error details here...
    }

    // Log error for debugging (this part is safe)
    switch (errorType) {
      case "assetLoadError":
        console.warn(
          `EasterEggCore: Asset load error for egg ${eggId}, using fallback`
        );
        break;
      case "renderError":
        console.warn(
          `EasterEggCore: Render error for egg ${eggId}, attempting recovery`
        );
        // Try to unmount and remount the egg
        this.unmount();
        setTimeout(() => this.mount(eggId), 100);
        break;
      case "networkError":
        console.warn(
          `EasterEggCore: Network error for egg ${eggId}, will retry`
        );
        break;
      default:
        console.error(
          `EasterEggCore: Unhandled error type ${errorType} for egg ${eggId}`
        );
    }
  }
}

// Create and export singleton instance
const easterEgg = new EasterEggCore();
export default easterEgg;
