<template>
  <div class="flex flex-col gap-6 items-center">
    <h2 class="text-3xl">{{ title }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="member in info"
        :key="member.name"
        class="flex flex-col items-center gap-0.5 max-w-[250px]"
      >
        <img
          :src="getAssetUrl(member)"
          :alt="member.name"
          @load="handleImageLoad"
          @error="(event: Event) => handleImageError(member, event)"
          class="inline-block rounded-full max-w-[100px] mb-1.5"
        />
        <h3 class="text-center text-xl leading-5">{{ member.name }}</h3>
        <p class="text-center text-md leading-5">{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { StaffMember } from "./StaffMember";

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
    return `./eggs/staff-grid-generic/${fallbackUrl}`;
  }
  return `./eggs/staff-grid-generic/${member.image}`;
}

function handleImageLoad(event?: Event): void {
  imageLoadCount.value++;
  if (imageLoadCount.value >= totalImages.value && props.notifyContentReady) {
    props.notifyContentReady();
  }
}

function handleImageError(member: StaffMember, event: Event): void {
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

<style scoped></style>
