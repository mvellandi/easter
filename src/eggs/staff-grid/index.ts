import "./style.css"; // Import Tailwind CSS
import { defineComponent, type PropType } from "vue";

// Staff Grid Easter Egg
console.log("Loading staff-grid.js");

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

export const StaffGridEggComponent = defineComponent({
  name: "StaffGridEggComponent",
  props: {
    title: {
      type: String,
      default: "Our Team",
    },
    info: {
      type: Array as PropType<StaffMember[]>,
      default: () => [],
    },
    coreInterface: {
      type: Object as PropType<{ requestClose?: () => void }>,
      default: () => ({
        requestClose: () => {},
      }),
    },
    notifyContentReady: {
      type: Function as PropType<() => void>,
      default: null,
    },
  },
  data() {
    return {
      imageLoadErrors: new Set<string>(),
      fallbackUrl: "images/avatar.png",
      erroredImages: new Set<string>(),
      imageLoadCount: 0 as number,
    };
  },
  computed: {
    totalImages(): number {
      return this.info.length;
    },
  },
  methods: {
    getAssetUrl(member: StaffMember) {
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
    handleImageError(member: StaffMember, event: Event) {
      this.erroredImages.add(member.name);
      if (!this.imageLoadCount) this.imageLoadCount = 0;
      this.imageLoadCount++;
      if (this.imageLoadCount >= this.totalImages && this.notifyContentReady) {
        this.notifyContentReady();
      }
      console.warn(
        `Staff Grid: Failed to load image for ${member.name}. Using fallback.`
      );
      if (event && (event.target as HTMLImageElement)) {
        (event.target as HTMLImageElement).src = `./eggs/staff-grid/${this.fallbackUrl}`;
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

export default {
  StaffGridEggComponent,
};
