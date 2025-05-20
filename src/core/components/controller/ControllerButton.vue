<template>
  <button
    :aria-label="label + ' button'"
    :class="[
      'shadow leading-0 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center justify-center',
      shape === 'pill'
        ? `rounded-full ${color} ${textColor} text-base font-semibold`
        : `rounded-full ${color} text-2xl font-bold ${textColor}`,
      size,
    ]"
    @click="onPress"
  >
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  color: string; // e.g., 'bg-red-500' or 'bg-yellow-400'
  onPress: () => void;
  shape?: "round" | "pill";
  textColor?: string; // e.g., 'text-white' or 'text-gray-900'
  /**
   * Tailwind width/height classes, e.g. 'w-16 h-16'.
   * Default: '' (no override)
   */
  size?: string;
}>();
const shape = props.shape ?? "round";
const textColor = props.textColor ?? "text-white";
const size = props.size ?? "";
</script>
