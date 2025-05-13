<template>
  <button
    v-if="show"
    class="ee-close-button"
    @click="handleClick"
    aria-label="Close Easter Egg"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 6 L26 26"></path>
      <path d="M26 6 L6 26"></path>
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

const emit = defineEmits(["closeClick"]);

const handleClick = () => {
  emit("closeClick");
};
</script>

<!-- Styles are in CoreDefaultCloseButton.css -->
<style scoped>
/* Component-specific adjustments if any */
</style>
