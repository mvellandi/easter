<template>
  <div v-if="show" class="ee-error-modal">
    <div class="ee-error-content z-30">
      <h3>Oops! Something went wrong</h3>
      <p>{{ message }}</p>
      <p class="ee-error-note">
        Don't worry, our team has been notified and we're working on it.
      </p>
      <button @click="emit('close')" class="ee-error-close">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.ee-error-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  max-width: 90vw;
  width: 400px;
}

.ee-error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.ee-error-close {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.ee-error-close:hover {
  background: #b91c1c;
}
</style>
