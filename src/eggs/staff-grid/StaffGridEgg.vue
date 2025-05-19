<template>
  <div class="flex flex-col gap-6 items-center">
    <h2 class="text-3xl">{{ title }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="member in info"
        :key="member.name"
        class="flex flex-col items-center max-w-[250px]"
      >
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

const props = defineProps<{
  title?: string;
  info?: StaffMember[];
  coreInterface?: { requestClose?: () => void };
  notifyContentReady?: () => void;
}>();

const fallbackUrl = "images/avatar.png";
const erroredImages = ref(new Set<string>());
const imageLoadCount = ref(0);

const totalImages = computed(() => props.info?.length ?? 0);

function getAssetUrl(member: StaffMember) {
  if (!member || !member.image || erroredImages.value.has(member.name)) {
    return `./eggs/staff-grid/${fallbackUrl}`;
  }
  return `./eggs/staff-grid/${member.image}`;
}

function handleImageLoad() {
  imageLoadCount.value++;
  if (imageLoadCount.value >= totalImages.value && props.notifyContentReady) {
    props.notifyContentReady();
  }
}

function handleImageError(member: StaffMember, event: Event) {
  erroredImages.value.add(member.name);
  imageLoadCount.value++;
  if (imageLoadCount.value >= totalImages.value && props.notifyContentReady) {
    props.notifyContentReady();
  }
  if (event && (event.target as HTMLImageElement)) {
    (event.target as HTMLImageElement).src = `./eggs/staff-grid/${fallbackUrl}`;
  }
}

function requestEggClose() {
  if (props.coreInterface?.requestClose) {
    props.coreInterface.requestClose();
  }
}

// If there are no images, notify content ready immediately
if (totalImages.value === 0 && props.notifyContentReady) {
  props.notifyContentReady();
}
</script>

<style scoped>
@import "./style.css";
</style>
