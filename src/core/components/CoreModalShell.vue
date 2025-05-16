<template>
  <div class="ee-container">
    <!-- 1. Overlay (if shown) -->
    <div
      class="ee-backdrop"
      :class="{ 'ee-backdrop-visible': isVisible }"
      @click="handleClose"
      @touchend="handleClose"
    >
      <!-- For content like an egg when container is hidden -->
    </div>

    <!-- 2. Main Content Area (renders .ee-content if container is not hidden) -->
    <div
      v-if="isVisible"
      class="ee-content bg-image-blue"
      :class="{ 'ee-content-visible': isVisible && contentReady }"
    >
      <!-- Use CoreDefaultCloseButton component -->
      <CoreDefaultCloseButton :show="isVisible" @closeClick="handleClose" />

      <!-- Slot for the default close button -->
      <slot name="close-button"></slot>

      <!-- Default slot for the egg component -->
      <component
        :is="activeEgg?.component"
        v-bind="{ ...activeEgg?.props, notifyContentReady } || {}"
      />
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
import { computed, ref, watch } from "vue";
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

const contentReady = ref(false);
let readyTimeout = null;

const isVisible = computed(() => props.reactiveState.activeEgg !== null);
const activeEgg = computed(() => props.reactiveState.activeEgg);

// Reset contentReady and start fallback timeout when egg changes
watch(
  () => activeEgg.value?.id,
  () => {
    contentReady.value = false;
    if (readyTimeout) clearTimeout(readyTimeout);
    // Start fallback timer (e.g., 300ms)
    readyTimeout = setTimeout(() => {
      contentReady.value = true;
    }, 200);
  }
);

const notifyContentReady = () => {
  if (readyTimeout) clearTimeout(readyTimeout);
  contentReady.value = true;
};

const handleClose = () => {
  console.log("Backdrop or close button clicked/tapped");
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

<style scoped></style>
