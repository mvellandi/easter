<template>
  <div
    :class="[
      'fixed top-0 left-0 w-full h-full bg-black/70 transition-opacity duration-300',
      isVisible
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none',
    ]"
    @click="closeModal"
    @touchend="closeModal"
  ></div>
</template>

<script setup lang="ts">
import { inject } from "vue";
const props = defineProps<{ isVisible: boolean }>();
const closeModal = inject("closeModal") as () => void;
</script>

<style scoped></style>
