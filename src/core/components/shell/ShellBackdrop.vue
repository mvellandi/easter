<template>
  <div
    :class="[
      'fixed top-0 left-0 w-full h-full bg-black/70 transition-opacity duration-300',
      isVisible
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none',
    ]"
    @click="$emit('close')"
    @touchend="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
defineProps<{ isVisible: boolean }>();
</script>

<style scoped></style>
