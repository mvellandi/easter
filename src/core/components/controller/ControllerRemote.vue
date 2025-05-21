<template>
  <div
    :class="[
      'flex w-full h-full items-center justify-center gap-6',
      isLargeScreen ? 'flex-col' : 'flex-row',
    ]"
  >
    <!-- Display and Reset Button -->
    <ControllerDisplay :pressedButtons="pressedButtons" class="flex-1">
      <ControllerButton
        label="RESET"
        color="bg-blue-400"
        shape="pill"
        size="w-22 h-8"
        class=""
        :onPress="resetDisplay"
      />
    </ControllerDisplay>
    <!-- Wii Controller: visible on small screens, hidden on lg+ -->
    <div :class="[shake ? 'animate-shakeHorizontal' : '', 'flex-1']">
      <WiiController v-if="!isLargeScreen" :onButtonPress="handleButtonPress" />
      <!-- NES Controller: hidden on small screens, visible on lg+ -->
      <NESController v-else :onButtonPress="handleButtonPress" />
    </div>
    <!-- Success image overlay -->
    <div
      v-if="successImage"
      class="absolute inset-0 flex items-center justify-center bg-black/80 z-50"
    >
      <img
        :src="successImage"
        alt="Success"
        class="w-full h-auto max-w-full lg:max-h-[700px] lg:w-auto rounded-lg shadow-lg"
        style="object-fit: contain"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import WiiController from "./WiiController.vue";
import NESController from "./NESController.vue";
import ControllerDisplay from "./ControllerDisplay.vue";
import ControllerDPad from "./ControllerDPad.vue";
import ControllerButton from "./ControllerButton.vue";
import type { ControllerButton as ButtonType } from "../types";
import successImageUrl from "/assets/img/contra.webp";
const pressedButtons = ref<ButtonType[]>([]);
const shake = ref(false);
const successImage = ref<string | null>(null);

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
      successImage.value = successImageUrl;
      setTimeout(() => (successImage.value = null), 4000);
      pressedButtons.value = [];
    } else {
      shake.value = true;
      setTimeout(() => (shake.value = false), 1000);
    }
  }
}

function resetDisplay() {
  pressedButtons.value = [];
  successImage.value = null;
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
