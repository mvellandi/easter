import core, { registerKeyCombo } from "./core/core.js";
import { registerMultiClickTrigger } from "./core/utils/multiClickTrigger.js";
import { HelloWorldEggComponent } from "./eggs/hello-world/index.js";
import { StaffGridEggComponent } from "./eggs/staff-grid/index.js";
import staffData from "./eggs/staff-grid/staff-data.json";

// Configuration object for the Easter Egg system
const config = {
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
        staffData: staffData,
        assetConfig: {
          fallbackUrl: "./eggs/staff-grid/images/fallback.webp",
        },
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
      core.keyHandler.registerCombination(eggId, {
        key: trigger.key,
        ctrlKey: trigger.ctrlKey,
      });
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === trigger.key) {
          e.preventDefault();
          core.showEgg(eggId, options);
        }
      });
    } else if (trigger?.type === "gesture") {
      registerEggGesture(eggId, trigger.gesture, {
        direction: trigger.direction,
        ...options,
      });
    }
  });

  // Custom gesture sequences (tap, swipe, pan, etc.) for staff-grid can be re-enabled here as needed.
  // Note: Downward gestures may be affected by browser pull-to-refresh or scrolling behavior on mobile.
});

// Attach multi-click trigger to the invisible header button after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const controllerBtn = document.querySelector(
    'button[aria-label="staff directory"]'
  );
  if (controllerBtn) {
    registerMultiClickTrigger({
      element: controllerBtn,
      count: 5,
      callback: () => {
        core.showEgg("staff-grid", config.eggs["staff-grid"].options);
      },
    });
  }
});
