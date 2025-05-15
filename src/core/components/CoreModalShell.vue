<template>
  <div class="ee-container">
    <!-- 1. Overlay (if shown) -->
    <div
      class="ee-backdrop"
      :class="{ 'ee-backdrop-visible': isVisible }"
      @click="handleClose"
    >
      <!-- For content like an egg when container is hidden -->
    </div>

    <!-- 2. Main Content Area (renders .ee-content if container is not hidden) -->
    <div
      v-if="showContent"
      class="ee-content bg-image-blue p-8 border border-yellow-700"
      :class="{ 'ee-content-visible': isVisible }"
    >
      <!-- Use CoreDefaultCloseButton component -->
      <CoreDefaultCloseButton :show="isVisible" @closeClick="handleClose" />

      <!-- Slot for the default close button -->
      <slot name="close-button"></slot>

      <!-- Default slot for the egg component -->
      <component :is="activeEgg?.component" v-bind="activeEgg?.props || {}" />
    </div>

    <!-- 3. Floating Elements (if container is hidden) -->
    <slot name="floating-elements"></slot>

    <ErrorModal
      :show="reactiveState.errorModal.show"
      :message="reactiveState.errorModal.message"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
// Assuming ErrorModal.js is in the same directory as CoreModalShell.vue (src/core/components/)
// If ErrorModal.js is in src/core/components/ and CoreModalShell.vue is also there, path is './ErrorModal.js'
// From ee-core.js, it's imported as './components/ErrorModal.js'.
// So, if CoreModalShell.vue is in src/core/components, this path should be correct.
import { ErrorModalComponent as ErrorModal } from "./ErrorModal.js";
import CoreOverlay from "./CoreOverlay.vue"; // Import the new component
import CoreModalContent from "./CoreModalContent.vue"; // Import the new component
import CoreFloatingCloseButton from "./CoreFloatingCloseButton.vue"; // Import the new component
import CoreDefaultCloseButton from "./CoreDefaultCloseButton.vue"; // Import the new component

const props = defineProps({
  reactiveState: {
    type: Object,
    required: true,
  },
  coreInterface: {
    type: Object,
    required: true,
  },
});

const isVisible = computed(() => props.reactiveState.activeEgg !== null);
const activeEgg = computed(() => props.reactiveState.activeEgg);
// Only show content if activeEgg and its component are set
const showContent = computed(() => {
  return !!(activeEgg.value && activeEgg.value.component);
});

const handleClose = () => {
  console.log("CoreModalShell: Close button clicked");
  console.log("Active egg:", activeEgg.value);
  console.log("Core interface:", props.coreInterface);

  if (activeEgg.value?.id) {
    console.log("Calling requestClose with egg ID:", activeEgg.value.id);
    props.coreInterface.requestClose(activeEgg.value.id);
  } else {
    console.warn("No active egg ID found when trying to close");
  }
};

const closeErrorModal = () => {
  // Directly mutate the reactive state passed as a prop.
  // This is generally okay in Vue 3 if the source is a reactive object.
  props.reactiveState.errorModal.show = false;
};
</script>

<style scoped>
/* All specific component styles (like .floating-close and .no-overlay-content) have been moved to their respective .css files or are part of their components. */
/* This block should ideally be empty now, or only contain styles truly unique to the shell IF any remain. */
/* .no-overlay-content was part of .ee-content logic, so it's in CoreModalContent.css */
</style>
