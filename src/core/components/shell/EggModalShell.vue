<template>
  <div
    :class="[
      'ee-content bg-image-blue',
      isVisible && contentReady && 'ee-content-visible',
    ]"
  >
    <DefaultCloseButton :show="isVisible" @closeClick="$emit('close')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import DefaultCloseButton from "../ui/DefaultCloseButton.vue";
const props = defineProps<{
  isVisible: boolean;
  contentReady: boolean;
  notifyContentReady: () => void;
}>();
</script>

<style scoped>
.ee-content {
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  padding: 2rem;
  width: 100%;
  max-width: 80vw;
  min-height: auto;
  max-height: calc(100vh - 10rem); /* leave room for padding */

  @media (min-width: 640px) {
    max-width: 80vw;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
  }

  @media (min-width: 768px) {
    max-width: 80vw;
  }

  @media (min-width: 1024px) {
    max-width: 70vw;
  }
}

.ee-content.ee-content-visible {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
</style>
