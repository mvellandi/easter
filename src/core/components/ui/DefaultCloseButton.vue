<template>
  <button
    v-if="show"
    class="ee-default-close"
    @click="handleClick"
    @touchend="handleClick"
    aria-label="Close Easter Egg"
  >
    <svg
      class="w-8 h-8"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 6 L18 18"></path>
      <path d="M18 6 L6 18"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeClick"]);

const handleClick = (event?: MouseEvent | TouchEvent): void => {
  emit("closeClick");
};
</script>

<!-- Styles are in CoreDefaultCloseButton.css -->
<style scoped>
.ee-default-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  color: var(--gray-400);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  pointer-events: auto;
}

.ee-default-close:hover {
  color: var(--gray-250);
  transform: scale(1.05);
}
</style>
