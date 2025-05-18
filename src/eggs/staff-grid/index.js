import "./style.css"; // Import Tailwind CSS
import { defineComponent, ref, computed, onMounted } from "vue";

// Staff Grid Easter Egg
console.log("Loading staff-grid.js");

export const StaffGridEggComponent = defineComponent({
  name: "StaffGridEggComponent",
  props: {
    title: {
      type: String,
      default: "Our Team",
    },
    info: {
      type: Array,
      default: () => [],
    },
    coreInterface: {
      type: Object,
      default: () => ({
        requestClose: () => {},
      }),
    },
    notifyContentReady: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      imageLoadErrors: new Set(),
      fallbackUrl: "images/avatar.png",
      erroredImages: new Set(),
    };
  },
  computed: {
    totalImages() {
      return this.info.length;
    },
  },
  methods: {
    getAssetUrl(member) {
      if (!member || !member.image || this.erroredImages.has(member.name)) {
        return `./eggs/staff-grid/${this.fallbackUrl}`;
      }
      return `./eggs/staff-grid/${member.image}`;
    },
    handleImageLoad() {
      if (!this.imageLoadCount) this.imageLoadCount = 0;
      this.imageLoadCount++;
      if (this.imageLoadCount >= this.totalImages && this.notifyContentReady) {
        this.notifyContentReady();
      }
    },
    handleImageError(member, event) {
      this.erroredImages.add(member.name);
      if (!this.imageLoadCount) this.imageLoadCount = 0;
      this.imageLoadCount++;
      if (this.imageLoadCount >= this.totalImages && this.notifyContentReady) {
        this.notifyContentReady();
      }
      console.warn(
        `Staff Grid: Failed to load image for ${member.name}. Using fallback.`
      );
      if (event && event.target) {
        event.target.src = `./eggs/staff-grid/${this.fallbackUrl}`;
      }
    },
    requestEggClose() {
      if (this.coreInterface?.requestClose) {
        this.coreInterface.requestClose();
      }
    },
  },
  mounted() {
    if (this.totalImages === 0 && this.notifyContentReady) {
      this.notifyContentReady();
    }
  },
  template: `
    <div class="flex flex-col gap-6 items-center">
      <h2 class="text-3xl">{{ title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="member in info" :key="member.name" class="flex flex-col items-center  max-w-[250px]">
          <div class="">
            <img
              :src="getAssetUrl(member)"
              :alt="member.name"
              @load="handleImageLoad"
              @error="(event) => handleImageError(member, event)"
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
