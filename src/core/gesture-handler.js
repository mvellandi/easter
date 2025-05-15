// Gesture Handler for Easter Egg System
// Supports: double-tap, long-press, swipe (left/right/up/down)

const gestureRegistry = [];
const gestureHistory = [];
const GESTURE_HISTORY_LIMIT = 10;

// Gesture detection state
let lastTap = 0;
let tapTimeout = null;
let longPressTimeout = null;
let startX = 0;
let startY = 0;
let isPointerDown = false;
let pointerDownTime = 0;

const DOUBLE_TAP_DELAY = 300; // ms
const LONG_PRESS_DELAY = 500; // ms
const SWIPE_THRESHOLD = 50; // px

function registerGesture(eggId, gesture, callback) {
  // gesture can be a string (single gesture) or array (sequence)
  if (typeof gesture === "string") {
    gestureRegistry.push({ eggId, sequence: [gesture], callback });
  } else if (Array.isArray(gesture)) {
    gestureRegistry.push({ eggId, sequence: gesture, callback });
  }
}

function triggerGesture(gesture) {
  // Add gesture to history
  gestureHistory.push(gesture);
  if (gestureHistory.length > GESTURE_HISTORY_LIMIT) {
    gestureHistory.shift();
  }

  // Check all registered sequences
  gestureRegistry.forEach(({ eggId, sequence, callback }) => {
    if (sequenceMatches(sequence, gestureHistory)) {
      callback(eggId);
      // Optionally clear history after match
      gestureHistory.length = 0;
    }
  });
}

function sequenceMatches(sequence, history) {
  if (sequence.length > history.length) return false;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[sequence.length - 1 - i] !== history[history.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function onPointerDown(e) {
  isPointerDown = true;
  pointerDownTime = Date.now();
  startX = e.clientX;
  startY = e.clientY;

  // Long press
  longPressTimeout = setTimeout(() => {
    triggerGesture("long-press");
    isPointerDown = false;
  }, LONG_PRESS_DELAY);
}

function onPointerUp(e) {
  clearTimeout(longPressTimeout);
  if (!isPointerDown) return;
  isPointerDown = false;

  const now = Date.now();
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  // Double-tap
  if (now - lastTap < DOUBLE_TAP_DELAY) {
    triggerGesture("double-tap");
    lastTap = 0;
    clearTimeout(tapTimeout);
    return;
  }
  lastTap = now;
  tapTimeout = setTimeout(() => {
    lastTap = 0;
  }, DOUBLE_TAP_DELAY);

  // Swipe
  if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) triggerGesture("swipe-right");
      else triggerGesture("swipe-left");
    } else {
      if (dy > 0) triggerGesture("swipe-down");
      else triggerGesture("swipe-up");
    }
  }
}

function onPointerMove(e) {
  // Optionally, could cancel long-press if moved too far
  if (!isPointerDown) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    clearTimeout(longPressTimeout);
  }
}

function setupGestureListeners() {
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
}

function removeGestureListeners() {
  window.removeEventListener("pointerdown", onPointerDown);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointermove", onPointerMove);
}

export default {
  registerGesture,
  setupGestureListeners,
  removeGestureListeners,
};
