<template>
  <div class="ee-container">
    <!-- 1. Backdrop -->
    <div
      :class="[
        'fixed top-0 left-0 w-full h-full bg-black/70 transition-opacity duration-300',
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      ]"
      @click="handleClose"
      @touchend="handleClose"
    ></div>

    <!-- 2. Main Content Area -->
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
        <!-- Use DefaultCloseButton component -->
        <DefaultCloseButton :show="isVisible" @closeClick="handleClose" />

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

    <!-- 3. Floating Elements -->
    <slot name="floating-elements">
      <template v-if="activeModal?.type === 'controller'">
        <!-- Center contents -->
        <div
          class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div class="pointer-events-auto">
            <ControllerRemote />
          </div>
        </div>
        <FloatingCloseButton
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
import ErrorModal from "./error/ErrorModal.vue";
// import ShellModalContent from "./shell/ShellModalContent.vue"; // Removed unused import
import FloatingCloseButton from "./ui/FloatingCloseButton.vue";
import DefaultCloseButton from "./ui/DefaultCloseButton.vue";
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
.ee-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
