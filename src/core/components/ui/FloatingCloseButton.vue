<template>
  <button
    class="ee-floating-close"
    @click="handleClick"
    @touchend="handleClick"
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

<script setup lang="ts">
const emit = defineEmits(["close"]);

const handleClick = (event?: MouseEvent): void => {
  emit("close");
};
</script>

<style scoped>
.ee-floating-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}

.ee-floating-close:hover {
  background: white;
  transform: scale(1.1);
}

.ee-floating-close::before,
.ee-floating-close::after {
  content: "";
  position: absolute;
  width: 1rem;
  height: 2px;
  background: #333;
  transform-origin: center;
}

.ee-floating-close::before {
  transform: rotate(45deg);
}

.ee-floating-close::after {
  transform: rotate(-45deg);
}
</style>
