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

<style scoped></style>
