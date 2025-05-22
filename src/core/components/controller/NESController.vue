<template>
  <div
    class="relative flex justify-between items-center select-none bg-gray-50 rounded-xl p-6 border-4 border-gray-400 w-[500px] gap-6"
  >
    <!-- D-pad -->
    <ControllerDPad :onDirection="onButtonPress" size="w-30 h-30" class="" />

    <!-- Start Button -->
    <div class="pt-14">
      <ControllerButton
        label="START"
        color="bg-gray-400"
        :onPress="() => onButtonPress('start')"
        shape="pill"
        textColor="text-gray-900"
        size="w-20 h-8"
      />
    </div>

    <div class="flex items-center gap-4 pt-14">
      <!-- A Button -->
      <ControllerButton
        label="A"
        color="bg-red-500"
        shape="round"
        size="w-16 h-16"
        :onPress="() => onButtonPress('a')"
      />

      <!-- B Button -->
      <ControllerButton
        label="B"
        color="bg-yellow-400"
        shape="round"
        size="w-16 h-16"
        :onPress="() => onButtonPress('b')"
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
