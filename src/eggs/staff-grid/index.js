import "./style.css"; // Import Tailwind CSS
import { defineComponent } from "vue";

// Staff Grid Easter Egg
console.log("Loading staff-grid.js");

// Define the component configuration directly
export const StaffGridEggComponent = defineComponent({
  name: "StaffGridEggComponent",
  props: {
    title: {
      type: String,
      default: "Our Team",
    },
    assetConfig: {
      type: Object,
      default: () => ({
        fallbackUrl: "images/fallback.webp",
      }),
    },
    staffData: {
      type: Array,
      default: () => [],
    },
    coreInterface: {
      type: Object,
      default: () => ({
        requestClose: () => {},
      }),
    },
  },
  setup(props) {
    console.log("Staff Grid: Component setup with props:", props);

    const getAssetUrl = (member) => {
      if (!member || !member.image) {
        // Prepend the staff-grid directory to the fallback image path
        return `./eggs/staff-grid/${props.assetConfig.fallbackUrl}`;
      }
      // Prepend the staff-grid directory to the image path from JSON
      return `./eggs/staff-grid/${member.image}`;
    };

    const handleImageError = (member) => {
      console.warn(
        `Staff Grid: Failed to load image for ${member.name}. Using fallback.`
      );
      return props.assetConfig.fallbackUrl;
    };

    return {
      getAssetUrl,
      handleImageError,
    };
  },
  data() {
    return {
      imageLoadErrors: new Set(),
    };
  },
  created() {
    console.log("Staff Grid: Component CREATED hook fired.");
    console.log("Staff Grid: Props in created:", this.$props);
    // Use nextTick to check DOM status after potential updates
    this.$nextTick(() => {
      console.log("Staff Grid: nextTick after created fired.");
      if (this.$el) {
        console.log(
          "Staff Grid: this.$el exists in nextTick after created.",
          this.$el
        );
      } else {
        console.log(
          "Staff Grid: this.$el does NOT exist in nextTick after created."
        );
      }
    });
  },
  beforeMount() {
    console.log("Staff Grid: Component BEFOREMOUNT hook fired.");
    console.log("Staff Grid: Props in beforeMount:", this.$props);
  },
  methods: {
    requestEggClose() {
      if (this.coreInterface?.requestClose) {
        this.coreInterface.requestClose();
      }
    },
  },
  template: `
    <div class="flex flex-col gap-6 items-center">
      <h2 class="text-3xl">{{ title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="member in staffData" :key="member.name" class="flex flex-col items-center  max-w-[250px]">
          <div class="">
            <img
              :src="getAssetUrl(member)"
              :alt="member.name"
              @error="handleImageError(member)"
              class="rounded-full max-w-[100px] mb-1.5"
            />
          </div>
          <h3 class="text-xl">{{ member.name }}</h3>
          <p class="text-md leading-4">{{ member.role }}</p>
        </div>
      </div>
    </div>
  `,
});
