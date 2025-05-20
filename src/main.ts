import core, { registerKeyCombo, registerModalTrigger } from "./core/core";
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

  // Register triggers from config using the new generic system
  const triggers = Array.isArray(options.trigger)
    ? options.trigger
    : [options.trigger];
  triggers.forEach((trigger) => {
    if (trigger?.type === "keyboard") {
      registerModalTrigger({
        trigger: {
          type: "keyboard",
          key: trigger.key,
          ctrlKey: trigger.ctrlKey,
          altKey: trigger.altKey,
          shiftKey: trigger.shiftKey,
        },
        action: { type: "egg", eggId, options },
      });
    }
    // Add other trigger types here as needed
  });
});

// Example: Register a trigger for the controller modal
// 1. Invisible button trigger
registerModalTrigger({
  trigger: { type: "click", elementId: "controller-trigger" },
  action: { type: "controller" },
});
// 2. (Optional) Keyboard shortcut for controller modal (Ctrl+M)
registerModalTrigger({
  trigger: { type: "keyboard", key: "m", ctrlKey: true },
  action: { type: "controller" },
});

// Restore the multi-click trigger for staff-grid (5 clicks on any staff-grid trigger button)
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-modal-trigger="staff-grid"]').forEach((el) => {
    if (el instanceof HTMLElement) {
      registerMultiClickTrigger({
        element: el,
        count: 5,
        callback: () => {
          core.showEgg("staff-grid", config.eggs["staff-grid"].options);
        },
      });
    }
  });

  // Controller multi-click trigger
  document.querySelectorAll('[data-modal-trigger="controller"]').forEach((el) => {
    if (el instanceof HTMLElement) {
      registerMultiClickTrigger({
        element: el,
        count: 5,
        callback: () => {
          core.showController();
        },
      });
    }
  });
});
