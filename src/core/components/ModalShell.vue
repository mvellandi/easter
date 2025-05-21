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
      v-if="activeModal?.type !== 'controller'"
      class="ee-modal"
      :class="{ 'ee-modal-visible': isVisible && contentReady }"
    >
      <div
        v-if="isVisible"
        class="ee-content bg-image-blue"
        :class="{ 'ee-content-visible': isVisible && contentReady }"
      >
        <!-- Use CoreDefaultCloseButton component -->
        <CoreDefaultCloseButton :show="isVisible" @closeClick="handleClose" />

        <!-- Slot for the default close button -->
        <slot name="close-button"></slot>

        <!-- Modal content based on type -->
        <template v-if="activeModal?.type === 'egg'">
          <component
            :is="activeModal.props?.component"
            v-bind="{ ...activeModal.props?.props, notifyContentReady } || {}"
          />
        </template>
      </div>
      <!-- Gradient for the bottom of the modal -->
      <div
        class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent lg:h-0"
      ></div>
    </div>

    <!-- 3. Floating Elements (if container is hidden) -->
    <slot name="floating-elements">
      <template v-if="activeModal?.type === 'controller'">
        <div
          class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div class="pointer-events-auto">
            <ControllerRemote />
          </div>
        </div>
        <CoreFloatingCloseButton
          class="ee-floating-close"
          :show="isVisible"
          @closeClick="handleClose"
        />
      </template>
    </slot>

    <ErrorModal
      :show="reactiveState.errorModal.show"
      :message="reactiveState.errorModal.message"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
// Assuming ErrorModal.ts is in the same directory as CoreModalShell.vue (src/core/components/)
// If ErrorModal.ts is in src/core/components/ and CoreModalShell.vue is also there, path is './ErrorModal.ts'
// From ee-core.js, it's imported as './components/ErrorModal.ts'.
// So, if CoreModalShell.vue is in src/core/components, this path should be correct.
import ErrorModal from "./ErrorModal.vue";
import CoreOverlay from "./CoreOverlay.vue"; // Import the new component
import CoreModalContent from "./CoreModalContent.vue"; // Import the new component
import CoreFloatingCloseButton from "./CoreFloatingCloseButton.vue"; // Import the new component
import CoreDefaultCloseButton from "./CoreDefaultCloseButton.vue"; // Import the new component
import ControllerRemote from "./ControllerRemote.vue";

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

const isVisible = computed(() => props.reactiveState.activeModal !== null);
const activeModal = computed(() => props.reactiveState.activeModal);

// Reset contentReady and start fallback timeout when modal changes
watch(
  () => activeModal.value?.type + ":" + (activeModal.value?.props?.id || ""),
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
  if (activeModal.value?.type === "egg" && activeModal.value?.props?.id) {
    props.coreInterface.requestClose(activeModal.value.props.id);
  } else if (activeModal.value?.type === "controller") {
    // For now, just clear the modal
    props.reactiveState.activeModal = null;
  } else {
    // No active modal found when trying to close
  }
};

const closeErrorModal = () => {
  props.reactiveState.errorModal.show = false;
};
</script>

<style scoped>
.controller-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 1.5rem;
  color: #fff;
  background: #222;
  border-radius: 8px;
}
</style>
