<template>
  <div>
    <!-- Wii Controller: visible on small screens, hidden on lg+ -->
    <WiiController class="block lg:hidden" :onButtonPress="handleButtonPress" />
    <!-- NES Controller: hidden on small screens, visible on lg+ -->
    <NESController class="hidden lg:block" :onButtonPress="handleButtonPress" />
  </div>
</template>

<script lang="ts" setup>
import WiiController from "./WiiController.vue";
import NESController from "./NESController.vue";
import type { ControllerButton } from "./types";

function handleButtonPress(button: ControllerButton) {
  // Skeleton: log the button pressed
  console.log("Button pressed:", button);
}
</script>
