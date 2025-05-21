<template>
  <div class="flex flex-col items-center justify-center h-full">
    <!-- 1. Backdrop -->
    <ShellBackdrop :isVisible="isVisible" @close="handleClose" />

    <!-- 2. Main Content Area -->
    <EggModalShell
      v-if="activeModal?.type === 'egg'"
      :visible="isVisible && contentReady"
    >
      <EggModalContent
        :isVisible="isVisible"
        :contentReady="contentReady"
        :notifyContentReady="notifyContentReady"
        @close="handleClose"
      >
        <slot name="close-button"></slot>
        <component
          :is="activeModal.props?.component"
          v-bind="{ ...activeModal.props?.props, notifyContentReady } || {}"
        />
      </EggModalContent>
    </EggModalShell>

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
import ShellBackdrop from "./shell/ShellBackdrop.vue";
import EggModalShell from "./shell/EggModalShell.vue";
import EggModalContent from "./shell/EggModalContent.vue";
import FloatingCloseButton from "./ui/FloatingCloseButton.vue";
import DefaultCloseButton from "./ui/DefaultCloseButton.vue";
import ControllerRemote from "./controller/ControllerRemote.vue";

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

<style scoped></style>
