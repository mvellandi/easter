import {
  createApp,
  ref,
  reactive,
  computed,
  nextTick,
  watch,
  markRaw,
} from "vue";

import tailwindAndCustomCssString from "../styles/main.css?inline"; // Import CSS as string

// Use Vue from the global scope instead of importing
// import Modal from "./components/Modal.vue";

import {
  ErrorModalComponent,
  ErrorModalStyles,
  ErrorHandler,
} from "./components/ErrorModal.js";
import { KeyHandler } from "./key-handler.js";

const coreStructuralStyles = `
  /* --- Styles for .ee-container, .ee-backdrop, .ee-content, .ee-close-button --- */
  /* --- These ensure the container/backdrop/modal structure works --- */
  .ee-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
    /* Ensure it captures space even if backdrop is hidden */
    display: flex; 
    justify-content: center;
    align-items: center;
  }

  .ee-backdrop {
    position: absolute; /* Position within container */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
  }

  .ee-content {
    position: relative; /* Needed for absolute positioning of the close button */
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    pointer-events: auto; /* Allow interaction with content */
  }

  .ee-close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    transition: background-color 0.2s ease, color 0.2s ease;
    z-index: 10; /* Ensure it's above content if needed */
  }

  .ee-close-button:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #000;
  }

  .ee-close-button svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
  }

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

    // 1. Create the reactive state object FIRST
    this.reactiveState = reactive({
      activeEgg: null, // Stores wrapper { id, component, props }
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

    // 1. Attach Shadow DOM
    const shadowRoot = this.container.attachShadow({ mode: "open" });
    console.log("EasterEggCore: Shadow DOM attached.");

    // 2. Inject ALL Styles into Shadow DOM
    const coreStyleElement = document.createElement("style");
    coreStyleElement.textContent = coreStructuralStyles;
    shadowRoot.appendChild(coreStyleElement);
    console.log(
      "EasterEggCore: Core structural styles injected into Shadow DOM."
    );

    const tailwindStyleElement = document.createElement("style");
    tailwindStyleElement.textContent = tailwindAndCustomCssString;
    shadowRoot.appendChild(tailwindStyleElement);
    console.log(
      "EasterEggCore: Inlined Tailwind/Custom styles injected into Shadow DOM."
    );

    // (Optional: If ErrorModalStyles were separate and needed, inject them too)
    // const errorModalStyleElement = document.createElement('style');
    // errorModalStyleElement.textContent = ErrorModalStyles;
    // shadowRoot.appendChild(errorModalStyleElement);

    // Create Vue app (template remains the same, renders inside shadow)
    this.vueApp = createApp({
      components: {
        ErrorModal: ErrorModalComponent,
      },
      template: `
        <div class="ee-container">
          <div v-if="state.activeEggComponent" class="ee-backdrop" @click="handleBackdropClick">
            <div class="ee-content">
              <button 
                class="ee-close-button" 
                @click="closeActiveEgg" 
                aria-label="Close Easter Egg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <component :is="state.activeEggComponent" v-bind="state.activeEgg?.props" />
            </div>
          </div>
          <ErrorModal 
            :show="state.errorModal.show"
            :message="state.errorModal.message"
            @close="closeErrorModal"
          />
        </div>
      `,
      setup: () => {
        // Arrow function to maintain 'this' context if needed, though we pass state directly
        // 2. Use the pre-defined reactive state
        const state = coreInstance.reactiveState;

        const handleBackdropClick = (event) => {
          if (event.target === event.currentTarget) {
            const eggIdToToggle = state.activeEgg?.id;
            if (eggIdToToggle) {
              coreInstance.unmount();
            }
          }
        };

        const closeErrorModal = () => {
          state.errorModal.show = false;
        };

        const closeActiveEgg = () => {
          console.log(
            "EasterEggCore: Close button clicked, unmounting active egg."
          );
          coreInstance.unmount();
        };

        // Expose the state and methods needed by the template
        return {
          state,
          handleBackdropClick,
          closeErrorModal,
          closeActiveEgg,
        };
      },
    });

    // Initialize error handler (ensure it works with shadow DOM if needed)
    // Error modal component itself uses Tailwind classes, so should be styled by injected styles.
    this.errorHandler = new ErrorHandler(this.reactiveState.errorModal);

    // 3. Mount Vue app INSIDE the Shadow Root
    this.vueApp.mount(shadowRoot);
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
      ...config,
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
    console.log(`EasterEggCore: Mounting egg ${eggId}`);
    const egg = this.eggs.get(eggId);
    if (!egg) {
      console.warn(`EasterEggCore: Egg ${eggId} not found for mounting`);
      return;
    }

    // Make sure the component is available
    if (!egg.component) {
      console.error(
        `EasterEggCore: Component for egg ${eggId} is not available`
      );
      // Optionally trigger error handler
      this.handleError(
        eggId,
        "componentMissing",
        new Error(`Component for ${eggId} not found`),
        { config: egg }
      );
      return;
    }

    // Create the wrapper object with the raw component
    const eggData = {
      id: eggId,
      component: markRaw(egg.component),
      props: egg.props || {},
    };
    const rawComponent = markRaw(egg.component);

    // 3. Update the shared reactive state directly
    if (this.reactiveState) {
      this.reactiveState.activeEgg = eggData;
      this.reactiveState.activeEggComponent = rawComponent;
      console.log("EasterEggCore: Shared reactive state updated for mount");
    } else {
      console.error(
        "EasterEggCore: Reactive state not initialized during mount!"
      );
      return; // Prevent further issues
    }

    console.log(`EasterEggCore: Successfully mounted egg ${eggId}`);
  }

  unmount() {
    console.log("EasterEggCore: Unmounting active egg");
    // 4. Update the shared reactive state directly
    if (this.reactiveState) {
      this.reactiveState.activeEgg = null;
      this.reactiveState.activeEggComponent = null;
      console.log("EasterEggCore: Shared reactive state updated for unmount");
    } else {
      console.error(
        "EasterEggCore: Reactive state not initialized during unmount!"
      );
    }

    this.activeEgg = null; // Clear internal class reference too
    console.log("EasterEggCore: Active egg cleared");
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
