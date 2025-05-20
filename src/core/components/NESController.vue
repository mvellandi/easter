<template>
  <div class="flex flex-row items-center">
    <!-- SVG placeholder for NES controller body -->
    <svg width="200" height="60" class="mr-2">
      <rect
        width="200"
        height="60"
        rx="10"
        fill="currentColor"
        class="text-gray-400"
      />
    </svg>
    <!-- Buttons -->
    <button class="mr-1" @click="() => onButtonPress('up')">Up</button>
    <button class="mr-1" @click="() => onButtonPress('down')">Down</button>
    <button class="mr-1" @click="() => onButtonPress('left')">Left</button>
    <button class="mr-1" @click="() => onButtonPress('right')">Right</button>
    <button class="mr-1" @click="() => onButtonPress('a')">A</button>
    <button class="mr-1" @click="() => onButtonPress('b')">B</button>
    <button class="mr-1" @click="() => onButtonPress('start')">Start</button>
    <button class="mr-1" @click="() => onButtonPress('select')">Select</button>
  </div>
</template>

<script lang="ts" setup>
import type { ControllerButton, ButtonPressHandler } from "./types";
const props = defineProps<{ onButtonPress: ButtonPressHandler }>();
const onButtonPress = props.onButtonPress;
</script>
