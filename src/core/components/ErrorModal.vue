<template>
  <div v-if="show" class="ee-error-modal">
    <div class="ee-error-content">
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
import { defineProps, defineEmits } from "vue";

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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
}
.ee-error-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.ee-error-content h3 {
  margin: 0 0 15px 0;
  color: #e74c3c;
  font-size: 24px;
}
.ee-error-content p {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}
.ee-error-note {
  font-size: 14px;
  color: #666;
  font-style: italic;
}
.ee-error-close {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}
.ee-error-close:hover {
  background: #2980b9;
}
</style>
