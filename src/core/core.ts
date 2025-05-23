// Add these at the top for type declarations
// @ts-ignore
import type {} from 'vue';

import { createApp, reactive, markRaw, App } from "vue";

// Import core UI system styles
import coreCssString from "./core.css?inline";

// Import the Core UI
import Core from "./components/Core.vue";

import {
  ErrorModalStyles,
  ErrorHandler,
} from "./components/error/ErrorModal";
import { KeyHandler } from "./key-handler";

// Interfaces for type safety
interface EggOptions {
  title?: string;
  trigger?: any; // TODO: Define trigger type
  info?: any;
  [key: string]: any;
}

interface Egg {
  component: any; // Vue component or async import
  options: EggOptions;
  isVisible: boolean;
}

interface ActiveModal {
  type: string; // 'egg', 'controller', etc.
  props: any;
}

interface ErrorModalState {
  show: boolean;
  message: string;
  eggId: string | null;
}

interface ReactiveState {
  activeModal: ActiveModal | null;
  errorModal: ErrorModalState;
}

type ErrorHandlerMap = Map<string, Record<string, (error: Error, context?: any) => void>>;

class EasterEggCore {
  eggs: Map<string, Egg>;
  activeModal: ActiveModal | null;
  vueApp: App<Element> | null;
  container: HTMLDivElement | null;
  isVisible: boolean;
  keyHandler: KeyHandler;
  errorHandlers: ErrorHandlerMap;
  reactiveState: ReactiveState | null;
  styleElement: HTMLStyleElement | null;
  errorHandler: ErrorHandler | null;

  constructor() {
    this.eggs = new Map();
    this.activeModal = null;
    this.vueApp = null;
    this.container = null;
    this.isVisible = false;
    this.keyHandler = new KeyHandler();
    this.errorHandlers = new Map();
    this.reactiveState = null;
    this.styleElement = null;
    this.errorHandler = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.handleError = this.handleError.bind(this);
    this.showController = this.showController.bind(this);
  }

  initialize(): void {
    console.log("EasterEggCore: Initializing...");

    // 1. Create the reactive state object FIRST
    this.reactiveState = reactive<ReactiveState>({
      activeModal: null,
      errorModal: {
        show: false,
        message: "",
        eggId: null,
      },
    });

    // Create container element
    this.container = document.createElement("div");
    this.container.id = "easter-root";
    this.container.className = "easter-root";
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
      requestClose: (eggId: string) => {
        console.log(`EasterEggCore: Request to close egg ${eggId} received`);
        this.hideEgg(eggId);
      },
      showEgg: (eggId: string, options: EggOptions) => {
        console.log(`EasterEggCore: Request to show egg ${eggId} received`);
        this.showEgg(eggId, options);
      },
      registerEgg: (eggId: string, component: any, options: EggOptions) => {
        console.log(`EasterEggCore: Request to register egg ${eggId} received`);
        this.registerEgg(eggId, component, options);
      },
      showController: () => {
        this.showController();
      },
    };

    // Create Vue app using the Core UI
    this.vueApp = createApp(Core, {
      reactiveState: this.reactiveState,
      coreInterface: coreInterfaceForEggs,
    });

    // Initialize error handler
    this.errorHandler = new ErrorHandler(this.reactiveState.errorModal);

    // 3. Mount Vue app
    this.vueApp.mount(this.container);
    console.log("EasterEggCore: Vue app mounted.");

    // Add keyboard event listeners
    document.addEventListener("keydown", this.handleKeyDown as (event: Event) => void);
    document.addEventListener("keyup", this.handleKeyUp as (event: Event) => void);
    console.log("EasterEggCore: Keyboard event listeners added to document.");

    console.log("EasterEggCore: Initialization complete");
  }

  /**
   * Registers an egg with the core system
   * @param {string} eggId - The ID of the egg
   * @param {Function|Object} component - The egg component (can be a dynamic import)
   * @param {Object} options - The egg options
   */
  registerEgg(eggId: string, component: any, options: EggOptions = {}): void {
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

  handleKeyDown(event: KeyboardEvent): void {
    this.keyHandler.handleKeyDown(event);

    // Check for Escape key first if an egg is active
    if (event.key === "Escape" && this.activeModal) {
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

  handleKeyUp(event: KeyboardEvent): void {
    this.keyHandler.handleKeyUp(event);
  }

  /**
   * Shows an egg in the modal
   * @param {string} eggId - The ID of the egg to show
   * @param {Object} options - Additional options for the egg
   */
  async showEgg(eggId: string, options: EggOptions = {}): Promise<void> {
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
      console.log("Staff data from options:", options.info);
      console.log("Staff data from egg options:", egg.options.info);

      // Ensure all required props are present and properly formatted
      const mergedOptions = {
        title: options.title || egg.options.title || "Our Team",
        info: Array.isArray(options.info)
          ? options.info
          : Array.isArray(egg.options.info)
          ? egg.options.info
          : [],
        coreInterface: {
          requestClose: () => this.hideEgg(eggId),
        },
      };

      console.log("Final merged options:", mergedOptions);

      // Update the reactive state to show the egg modal
      this.reactiveState!.activeModal = {
        type: 'egg',
        props: {
          id: eggId,
          component: markRaw(component),
          props: mergedOptions,
        },
      };

      // Show the modal
      this.isVisible = true;
      const content = this.container!.querySelector(".ee-content");
      const backdrop = this.container!.querySelector(".ee-backdrop");
      if (content) content.classList.add("ee-content-visible");
      if (backdrop) backdrop.classList.add("ee-backdrop-visible");

      // Update egg state
      this.eggs.set(eggId, {
        ...egg,
        isVisible: true,
      });
    } catch (error: any) {
      console.error(`EasterEggCore: Error showing egg ${eggId}:`, error);
    }
  }

  /**
   * Shows the controller modal (placeholder for now)
   */
  showController(): void {
    this.reactiveState!.activeModal = {
      type: 'controller',
      props: {},
    };
    this.isVisible = true;
    const content = this.container!.querySelector(".ee-content");
    const backdrop = this.container!.querySelector(".ee-backdrop");
    if (content) content.classList.add("ee-content-visible");
    if (backdrop) backdrop.classList.add("ee-backdrop-visible");
  }

  /**
   * Hides an egg (now hides any modal)
   * @param {string} eggId - The ID of the egg to hide
   */
  hideEgg(eggId: string): void {
    console.log(`EasterEggCore: Hiding egg ${eggId}`);

    // Get the egg before clearing state
    const egg = this.eggs.get(eggId);
    if (!egg) {
      console.warn(
        `EasterEggCore: Attempted to hide non-existent egg ${eggId}`
      );
      return;
    }

    // Clear the active modal
    this.reactiveState!.activeModal = null;

    // Hide the modal
    this.isVisible = false;

    // Remove visibility classes
    const content = this.container!.querySelector(".ee-content");
    const backdrop = this.container!.querySelector(".ee-backdrop");

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

  mount(eggId: string): void {
    const eggToMount = this.eggs.get(eggId);
    if (!eggToMount) {
      console.error(`EasterEggCore: Attempted to mount unknown egg ${eggId}`);
      return;
    }
    if (this.activeModal && this.activeModal.props.id !== eggId) {
      this.unmount();
    }
    console.log(`EasterEggCore: Mounting egg ${eggId}`, eggToMount);
    this.activeModal = {
      type: 'egg',
      props: { ...eggToMount, id: eggId, props: eggToMount.options },
    };
    this.reactiveState!.activeModal = this.activeModal;
    this.isVisible = true;
    console.log(
      `EasterEggCore: Egg ${eggId} is now active and visible (pending Vue render).`
    );
  }

  unmount(): void {
    if (!this.activeModal) return;
    console.log(`EasterEggCore: Unmounting active modal`);

    this.activeModal = null;
    this.reactiveState!.activeModal = null;
    this.isVisible = false;
    this.keyHandler.reset();
    console.log("EasterEggCore: Active modal unmounted and hidden.");
  }

  destroy(): void {
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

  handleError(eggId: string, errorType: string, error: Error, context: any = {}): boolean {
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

  handleDefaultError(eggId: string, errorType: string, error: Error, context: any): void {
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

// --- Generic Modal Trigger System ---

// Types for modal actions and triggers
export type ModalAction =
  | { type: 'egg', eggId: string, options?: any }
  | { type: 'controller' };

export type ModalTrigger =
  | { type: 'keyboard', key: string, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean }
  | { type: 'click', elementId?: string, selector?: string };

/**
 * Register a generic modal trigger (keyboard, click, etc.)
 * @param trigger - The trigger config
 * @param action - The modal action to perform
 */
export function registerModalTrigger({ trigger, action }: { trigger: ModalTrigger, action: ModalAction }) {
  if (trigger.type === 'keyboard') {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === trigger.key.toLowerCase() &&
        (!!trigger.ctrlKey === e.ctrlKey) &&
        (!!trigger.altKey === e.altKey) &&
        (!!trigger.shiftKey === e.shiftKey)
      ) {
        e.preventDefault();
        if (action.type === 'egg') core.showEgg(action.eggId, action.options);
        if (action.type === 'controller') core.showController();
      }
    });
  } else if (trigger.type === 'click') {
    // Wait for DOMContentLoaded in case the element(s) aren't present yet
    const setupClick = () => {
      if (trigger.elementId) {
        const el = document.getElementById(trigger.elementId);
        if (el) {
          el.addEventListener('click', () => {
            if (action.type === 'egg') core.showEgg(action.eggId, action.options);
            if (action.type === 'controller') core.showController();
          });
        }
      } else if (trigger.selector) {
        document.querySelectorAll(trigger.selector).forEach((el) => {
          el.addEventListener('click', () => {
            if (action.type === 'egg') core.showEgg(action.eggId, action.options);
            if (action.type === 'controller') core.showController();
          });
        });
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupClick);
    } else {
      setupClick();
    }
  }
}
