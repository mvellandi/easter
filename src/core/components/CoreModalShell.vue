<template>
  <div class="ee-container">
    <!-- 1. Overlay (if shown) -->
    <div
      v-if="
        reactiveState.activeEggComponent &&
        !reactiveState.activeEgg?.uiOptions?.hideCoreOverlay
      "
      class="ee-backdrop"
      @click="handleBackdropClick"
    >
      <!-- Egg content within backdrop if container is hidden (and overlay is shown) -->
      <template v-if="reactiveState.activeEgg?.uiOptions?.hideCoreContainer">
        <component
          :is="reactiveState.activeEggComponent"
          v-bind="reactiveState.activeEgg?.props"
          :coreInterface="props.coreInterface"
        />
      </template>
    </div>

    <!-- 2. Main Content Area (renders .ee-content if container is not hidden) -->
    <div
      v-if="
        reactiveState.activeEggComponent &&
        !reactiveState.activeEgg?.uiOptions?.hideCoreContainer
      "
      class="ee-content"
      :class="{
        'no-overlay-content':
          reactiveState.activeEgg?.uiOptions?.hideCoreOverlay,
      }"
    >
      <!-- Default Close Button (inside .ee-content) -->
      <button
        v-if="!reactiveState.activeEgg?.uiOptions?.prefersCustomClose"
        class="ee-close-button"
        @click="closeActiveEgg"
        aria-label="Close Easter Egg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <component
        :is="reactiveState.activeEggComponent"
        v-bind="reactiveState.activeEgg?.props"
        :coreInterface="props.coreInterface"
      />
    </div>

    <!-- 3. Floating Elements (if container is hidden) -->
    <template
      v-if="
        reactiveState.activeEggComponent &&
        reactiveState.activeEgg?.uiOptions?.hideCoreContainer
      "
    >
      <!-- Floating Close Button (fixed to viewport) -->
      <button
        v-if="!reactiveState.activeEgg?.uiOptions?.prefersCustomClose"
        class="floating-close"
        @click="closeActiveEgg"
        aria-label="Close Easter Egg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
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

const handleBackdropClick = (event) => {
  // Only close if the click is directly on the backdrop, not on its children
  if (event.target === event.currentTarget) {
    props.onUnmountRequest();
  }
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
/* All styles previously here (for .floating-close and .no-overlay-content) have been moved to CoreModalShell.css */
/* This block is now empty. */
</style>
