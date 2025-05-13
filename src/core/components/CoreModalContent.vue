<template>
  <div
    v-if="show"
    class=""
    :class="{ 'no-overlay-content': applyNoOverlayEffect }"
  >
    <slot name="closeButton"></slot>
    <!-- Slot for the default close button -->
    <slot></slot>
    <!-- Default slot for the egg component -->
  </div>
</template>

<script setup></script>

<!-- Styles for .ee-content and .no-overlay-content are now in CoreModalContent.css -->
<style scoped>
/* Add any additional, component-specific scoped styles here if needed later */
</style>
