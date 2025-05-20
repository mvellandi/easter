<template>
  <div
    :class="[
      'flex w-full h-full items-center justify-center gap-6',
      isLargeScreen ? 'flex-col' : 'flex-row',
    ]"
  >
    <!-- Display and Reset Button -->
    <Display :pressedButtons="pressedButtons" class="flex-1">
      <ControllerButton
        label="RESET"
        color="bg-blue-400"
        shape="pill"
        size="w-22 h-8"
        class=""
        :onPress="resetDisplay"
      />
    </Display>
    <!-- Wii Controller: visible on small screens, hidden on lg+ -->
    <div :class="[shake ? 'animate-shakeHorizontal' : '', 'flex-1']">
      <WiiController v-if="!isLargeScreen" :onButtonPress="handleButtonPress" />
      <!-- NES Controller: hidden on small screens, visible on lg+ -->
      <NESController v-else :onButtonPress="handleButtonPress" />
    </div>
    <!-- Success message -->
    <div
      v-if="successMessage"
      class="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg text-xl z-50"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import WiiController from "./WiiController.vue";
import NESController from "./NESController.vue";
import Display from "./controller/Display.vue";
import ControllerButton from "./controller/ControllerButton.vue";
import type { ControllerButton as ButtonType } from "./types";

const pressedButtons = ref<ButtonType[]>([]);
const shake = ref(false);
const successMessage = ref("");

// Example valid sequence
const validSequences: ButtonType[][] = [
  ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"],
];

function handleButtonPress(button: ButtonType) {
  if (button !== "start") {
    if (pressedButtons.value.length < 10) {
      pressedButtons.value = [...pressedButtons.value, button];
    }
    // else: do nothing, memory is full
  } else {
    // Check for valid sequence
    const match = validSequences.some(
      (seq) =>
        seq.length === pressedButtons.value.length &&
        seq.every((val, idx) => val === pressedButtons.value[idx])
    );
    if (match) {
      successMessage.value = "okay";
      setTimeout(() => (successMessage.value = ""), 2000);
      pressedButtons.value = [];
    } else {
      shake.value = true;
      setTimeout(() => (shake.value = false), 1000);
    }
  }
}

function resetDisplay() {
  pressedButtons.value = [];
  successMessage.value = "";
  shake.value = false;
}

// Responsive check for lg breakpoint
const isLargeScreen = ref(false);
function checkScreen() {
  isLargeScreen.value = window.matchMedia("(min-width: 1024px)").matches;
}
onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});
</script>
