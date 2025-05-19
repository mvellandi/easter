import core, { registerKeyCombo } from "./core/core";
import { registerMultiClickTrigger } from "./core/utils/multiClickTrigger";
import { HelloWorldEggComponent } from "./eggs/hello-world/index";
import { StaffGridEggComponent } from "./eggs/staff-grid/index";
import type { StaffMember } from "./eggs/staff-grid/StaffMember";
import staffData from "./eggs/staff-grid/staff-data.json";

// --- TypeScript interfaces for triggers and egg configs ---
interface KeyboardTrigger {
  type: "keyboard";
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}
// If you add gesture support in the future, add a GestureTrigger interface here.
type EggTrigger = KeyboardTrigger; // | GestureTrigger

interface EggOptions {
  title: string;
  trigger: EggTrigger | EggTrigger[];
  info?: StaffMember[];
  [key: string]: any;
}

interface EggConfig {
  component: any;
  options: EggOptions;
}

interface EggsConfig {
  [eggId: string]: EggConfig;
}

// Configuration object for the Easter Egg system
const config: { eggs: EggsConfig } = {
  eggs: {
    "hello-world": {
      component: HelloWorldEggComponent,
      options: {
        title: "Hello World Egg",
        trigger: {
          type: "keyboard",
          key: "h",
          ctrlKey: true,
        },
      },
    },
    "staff-grid": {
      component: StaffGridEggComponent,
      options: {
        title: "Our Team",
        trigger: [
          {
            type: "keyboard",
            key: "s",
            ctrlKey: true,
          },
        ],
        info: staffData as StaffMember[],
      },
    },
  },
};

// Initialize the core system
registerKeyCombo();

// Register eggs from config
Object.entries(config.eggs).forEach(([eggId, { component, options }]) => {
  console.log(`Registering egg ${eggId} with options:`, options);

  // Register the egg with the core system
  core.registerEgg(eggId, component, options);

  // Register triggers from config
  const triggers = Array.isArray(options.trigger)
    ? options.trigger
    : [options.trigger];
  triggers.forEach((trigger) => {
    if (trigger?.type === "keyboard") {
      core.keyHandler.registerCombination(eggId, trigger);
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key.toLowerCase() === trigger.key) {
          e.preventDefault();
          core.showEgg(eggId, options);
        }
      });
    }
  });

  // Custom gesture sequences (tap, swipe, pan, etc.) for staff-grid can be re-enabled here as needed.
  // Note: Downward gestures may be affected by browser pull-to-refresh or scrolling behavior on mobile.
});

// Attach multi-click trigger to the invisible header button after DOM is ready
window.addEventListener("DOMContentLoaded", (event: Event) => {
  const staffDirectoryBtns = document.querySelectorAll(
    'button[aria-label="staff directory"]'
  );
  staffDirectoryBtns.forEach((staffDirectoryBtn) => {
    if (staffDirectoryBtn instanceof HTMLElement) {
      registerMultiClickTrigger({
        element: staffDirectoryBtn,
        count: 5,
        callback: () => {
          core.showEgg("staff-grid", config.eggs["staff-grid"].options);
        },
      });
    }
  });
});
