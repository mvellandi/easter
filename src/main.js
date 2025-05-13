import core, { registerKeyCombo } from "./core/core.js";
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
        trigger: {
          type: "keyboard",
          key: "s",
          ctrlKey: true,
        },
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

  // Register trigger if specified
  if (options.trigger?.type === "keyboard") {
    core.keyHandler.registerCombination(eggId, {
      key: options.trigger.key,
      ctrlKey: options.trigger.ctrlKey,
    });

    // Add event listener for the key combo
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === options.trigger.key) {
        e.preventDefault();
        core.showEgg(eggId, options);
      }
    });
  }
});
