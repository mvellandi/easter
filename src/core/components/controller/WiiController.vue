<template>
  <div
    class="relative flex flex-col items-center select-none bg-gray-50 rounded-xl p-3 py-6 border-4 border-gray-400"
  >
    <!-- D-pad -->
    <ControllerDPad
      :onDirection="onButtonPress"
      size="w-30 h-30"
      class="mb-6"
    />

    <div class="flex flex-col items-center gap-6">
      <!-- A Button -->
      <ControllerButton
        label="A"
        color="bg-red-500"
        shape="round"
        size="w-15 h-15"
        :onPress="() => onButtonPress('a')"
      />

      <!-- B Button -->
      <ControllerButton
        label="B"
        color="bg-yellow-400"
        shape="round"
        size="w-15 h-15"
        :onPress="() => onButtonPress('b')"
      />

      <!-- Start Button -->
      <ControllerButton
        label="START"
        color="bg-gray-400"
        :onPress="() => onButtonPress('start')"
        shape="pill"
        textColor="text-gray-900"
        size="w-22 h-10"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ControllerButton as ButtonType,
  ButtonPressHandler,
} from "./types";
import ControllerDPad from "./ControllerDPad.vue";
import ControllerButton from "./ControllerButton.vue";
const props = defineProps<{ onButtonPress: ButtonPressHandler }>();
const onButtonPress = props.onButtonPress;
</script>
