<template>
  <button
    v-if="show"
    class="floating-close"
    @click="handleClick"
    aria-label="Close Easter Egg"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const handleClick = () => {
  // This function is now empty as the emit is removed
};
</script>

<!-- Styles are in CoreFloatingCloseButton.css -->
<style scoped>
/* Component-specific adjustments if any, though most is in the .css file */
</style>
