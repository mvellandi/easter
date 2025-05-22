<template>
  <div
    :class="[
      'z-10',
      isVisible
        ? 'opacity-100 pointer-events-auto transition-all duration-300 ease-in-out'
        : 'opacity-0 pointer-events-none',
    ]"
  >
    <slot />
    <DefaultCloseButton @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import DefaultCloseButton from "../ui/DefaultCloseButton.vue";
const props = defineProps<{ isVisible: boolean }>();
const closeModal = inject("closeModal") as () => void;
</script>

<style scoped></style>
