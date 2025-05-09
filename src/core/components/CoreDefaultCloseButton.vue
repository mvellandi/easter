<template>
  <button
    v-if="show"
    class="ee-close-button"
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
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeClick"]);

const handleClick = () => {
  emit("closeClick");
};
</script>

<!-- Styles are in CoreDefaultCloseButton.css -->
<style scoped>
/* Component-specific adjustments if any */
</style>
