<template>
  <div class="ee-container">
    <!-- 1. Overlay (if shown) -->
    <CoreOverlay
      :show="
        !!(
          reactiveState.activeEggComponent &&
          !reactiveState.activeEgg?.uiOptions?.hideCoreOverlay
        )
      "
      @backdropClick="handleBackdropClick"
    >
      <!-- Egg content within backdrop if container is hidden (and overlay is shown) -->
      <template
        v-if="
          reactiveState.activeEgg?.uiOptions?.hideCoreContainer &&
          !reactiveState.activeEgg?.uiOptions?.hideCoreOverlay
        "
      >
        <component
          :is="reactiveState.activeEggComponent"
          v-bind="reactiveState.activeEgg?.props"
          :coreInterface="props.coreInterface"
        />
      </template>
    </CoreOverlay>

    <!-- 2. Main Content Area (renders .ee-content if container is not hidden) -->
    <CoreModalContent
      :show="
        !!(
          reactiveState.activeEggComponent &&
          !reactiveState.activeEgg?.uiOptions?.hideCoreContainer
        )
      "
      :applyNoOverlayEffect="
        reactiveState.activeEgg?.uiOptions?.hideCoreOverlay === true
      "
    >
      <template #closeButton>
        <CoreDefaultCloseButton
          :show="!reactiveState.activeEgg?.uiOptions?.prefersCustomClose"
          @closeClick="closeActiveEgg"
        />
      </template>
      <template #default>
        <component
          :is="reactiveState.activeEggComponent"
          v-bind="reactiveState.activeEgg?.props"
          :coreInterface="props.coreInterface"
        />
      </template>
    </CoreModalContent>

    <!-- 3. Floating Elements (if container is hidden) -->
    <template
      v-if="
        reactiveState.activeEggComponent &&
        reactiveState.activeEgg?.uiOptions?.hideCoreContainer
      "
    >
      <!-- Floating Close Button (fixed to viewport) -->
      <CoreFloatingCloseButton
        :show="!reactiveState.activeEgg?.uiOptions?.prefersCustomClose"
        @closeClick="closeActiveEgg"
      />
      <!-- Egg component rendered "bare" if container AND overlay are hidden -->
      <component
        v-if="reactiveState.activeEgg?.uiOptions?.hideCoreOverlay"
        :is="reactiveState.activeEggComponent"
        v-bind="reactiveState.activeEgg?.props"
        :coreInterface="props.coreInterface"
      />
    </template>

    <ErrorModal
      :show="reactiveState.errorModal.show"
      :message="reactiveState.errorModal.message"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
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
  // This prop will be the 'unmount' method from the EasterEggCore instance
  onUnmountRequest: {
    type: Function,
    required: true,
  },
  coreInterface: {
    type: Object,
    required: true,
  },
});

const handleBackdropClick = () => {
  // The CoreOverlay component has already confirmed it was a direct click on the backdrop.
  // No need to check event.target here.
  console.log(
    "CoreModalShell: Valid backdrop click received, requesting unmount."
  );
  props.onUnmountRequest();
};

const closeErrorModal = () => {
  // Directly mutate the reactive state passed as a prop.
  // This is generally okay in Vue 3 if the source is a reactive object.
  props.reactiveState.errorModal.show = false;
};

const closeActiveEgg = () => {
  console.log("[CoreModalShell.vue] closeActiveEgg method called."); // Test log
  console.log("CoreModalShell: Close button clicked, requesting unmount.");
  props.onUnmountRequest();
};
</script>

<style scoped>
/* All specific component styles (like .floating-close and .no-overlay-content) have been moved to their respective .css files or are part of their components. */
/* This block should ideally be empty now, or only contain styles truly unique to the shell IF any remain. */
/* .no-overlay-content was part of .ee-content logic, so it's in CoreModalContent.css */
</style>
