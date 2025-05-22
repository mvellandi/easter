<template>
  <div
    :class="[
      'relative z-10 box-border border border-yellow-700',
      isVisible
        ? 'opacity-100 pointer-events-auto transition-all duration-300 ease-in-out'
        : 'opacity-0 pointer-events-none',
    ]"
  >
    <!-- Egg Modal Shell -->
    <slot />
    <!-- Frame-Bottom Gradient to suggest additional content on mobile if scrollbar is hidden -->
    <div
      class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent lg:h-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isVisible: boolean }>();
</script>

<style scoped></style>
