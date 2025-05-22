<template>
  <div :class="[size]">
    <div class="grid grid-cols-3 grid-rows-3 w-full h-full">
      <!-- Empty cell -->
      <div></div>
      <!-- Up -->
      <button
        aria-label="Up"
        class="flex items-center justify-center w-full h-full bg-gray-700 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        @click="() => onDirection('up')"
      >
        <svg
          class="w-6 h-6 text-gray-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <!-- Empty cell -->
      <div></div>
      <!-- Left -->
      <button
        aria-label="Left"
        class="flex items-center justify-center w-full h-full bg-gray-700 rounded-tl-lg rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        style="grid-row: 2; grid-column: 1"
        @click="() => onDirection('left')"
      >
        <svg
          class="w-6 h-6 text-gray-200 transform -rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <!-- Center -->
      <div class="w-full h-full bg-gray-700"></div>
      <!-- Right -->
      <button
        aria-label="Right"
        class="flex items-center justify-center w-full h-full bg-gray-700 rounded-tr-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        style="grid-row: 2; grid-column: 3"
        @click="() => onDirection('right')"
      >
        <svg
          class="w-6 h-6 text-gray-200 transform rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <div></div>
      <!-- Down -->
      <button
        aria-label="Down"
        class="flex items-center justify-center w-full h-full bg-gray-700 rounded-bl-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        @click="() => onDirection('down')"
      >
        <svg
          class="w-6 h-6 text-gray-200 transform rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <!-- Empty cell -->
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ControllerButton } from "../../components/types";
const props = defineProps<{
  onDirection: (
    dir: Exclude<ControllerButton, "a" | "b" | "start" | "select">
  ) => void;
  /**
   * Tailwind width/height classes, e.g. 'w-24 h-24 md:w-32 md:h-32'.
   * Default: 'w-24 h-24'
   */
  size?: string;
}>();
const onDirection = props.onDirection;
const size = props.size ?? "w-24 h-24";
</script>
