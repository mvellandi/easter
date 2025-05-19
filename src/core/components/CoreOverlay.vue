<template>
  <div v-if="show" class="ee-backdrop" @click="handleClick">
    <slot></slot>
    <!-- For content like an egg when container is hidden -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["backdropClick"]);

const handleClick = (event: MouseEvent): void => {
  // Only emit if the click is directly on the backdrop, not on slotted children
  if (event.target === event.currentTarget) {
    emit("backdropClick");
  }
};
</script>

<!-- Styles for .ee-backdrop are now in CoreOverlay.css and injected globally by ee-core.js -->
<style scoped>
/* Add any additional, component-specific scoped styles here if needed later */
</style>
