import "./style.css"; // Import Tailwind CSS
import { defineComponent, type PropType } from "vue";
import StaffGridEgg from "./StaffGridEgg.vue";

// Staff Grid Easter Egg (now in TypeScript)
// console.log("Loading staff-grid.js");

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

export const StaffGridEggComponent = StaffGridEgg;

export default {
  StaffGridEggComponent,
};
