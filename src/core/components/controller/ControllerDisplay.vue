<template>
  <div
    class="py-6 flex flex-col justify-between items-center gap-2 bg-gray-900 rounded-lg border-2 border-green-800 w-[120px] h-[540px] lg:flex-row lg:w-[940px] lg:h-[120px] lg:items-center lg:px-6 lg:py-0"
  >
    <div
      class="flex flex-col items-center justify-center gap-1.5 flex-1 lg:flex-row lg:h-[90px]"
    >
      <span
        v-for="(btn, idx) in pressedButtons"
        :key="idx"
        class="text-xl font-mono select-none text-green-600 rounded px-2 py-1 tracking-tight"
      >
        {{ btn.toUpperCase() }}
      </span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ControllerButton } from "../types";
const props = defineProps<{ pressedButtons: ControllerButton[] }>();
</script>
