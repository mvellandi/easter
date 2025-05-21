<template>
  <div
    :class="[
      'box-border, relative',
      visible &&
        'border border-yellow-700 transition-all duration-300 ease-in-out',
    ]"
  >
    <slot />
    <!-- Gradient for the bottom of the modal -->
    <div
      class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent lg:h-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>();
</script>

<style scoped></style>
