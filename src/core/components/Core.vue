<template>
  <!-- Outer Container with centered content -->
  <div class="flex flex-col items-center justify-center h-full">
    <!-- 1. Backdrop -->
    <ShellBackdrop :isVisible="isVisible" />

    <!-- 2. Main Content Area -->
    <FixModalFrame
      v-if="activeModal?.type === 'egg'"
      :isVisible="isVisible && contentReady"
    >
      <FixModalShell>
        <component
          :is="activeModal.props?.component"
          v-bind="{ ...activeModal.props?.props, notifyContentReady } || {}"
        />
      </FixModalShell>
    </FixModalFrame>

    <!-- 3. Floating Elements -->
    <template v-if="activeModal?.type === 'controller'">
      <FloatModalFrame :isVisible="isVisible">
        <ControllerRemote />
      </FloatModalFrame>
    </template>

    <ErrorModal
      :show="reactiveState.errorModal.show"
      :message="reactiveState.errorModal.message"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, provide } from "vue";
import ErrorModal from "./error/ErrorModal.vue";
import ShellBackdrop from "./shell/ShellBackdrop.vue";
import FixModalFrame from "./shell/FixModalFrame.vue";
import FixModalShell from "./shell/FixModalShell.vue";
import FloatModalFrame from "./shell/FloatModalFrame.vue";
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

provide("closeModal", handleClose);
</script>

<style scoped></style>
