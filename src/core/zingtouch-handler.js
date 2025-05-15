import ZingTouch from "zingtouch";
import core from "./core.js";

const region = new ZingTouch.Region(document.body);

/**
 * Register a gesture for an egg using ZingTouch
 * @param {string} eggId - The ID of the egg
 * @param {string} gestureType - The gesture type ('tap', 'swipe', etc.)
 * @param {object} options - Options for the gesture (e.g., direction for swipe)
 */
export function registerEggGesture(eggId, gestureType, options = {}) {
  region.bind(document.body, gestureType, function (e) {
    if (gestureType === "swipe" && options.direction) {
      const direction = e.detail.data[0].currentDirection;
      // ZingTouch: 0 = right, 90 = down, 180 = left, 270 = up
      let match = false;
      if (options.direction === "up" && direction > 260 && direction < 280)
        match = true;
      if (options.direction === "down" && direction > 80 && direction < 100)
        match = true;
      if (options.direction === "left" && direction > 170 && direction < 190)
        match = true;
      if (options.direction === "right" && direction > -10 && direction < 10)
        match = true;
      if (match) core.showEgg(eggId, options);
    } else {
      core.showEgg(eggId, options);
    }
  });
}

// --- Sequence Support ---
let gestureHistory = [];
let gestureTimeout = null;
const SEQUENCE_TIMEOUT = 2000; // ms

/**
 * Register a sequence of swipe gestures for an egg
 * @param {string} eggId
 * @param {string[]} sequence - e.g. ['left', 'right', 'up']
 * @param {object} options
 */
export function registerEggSwipeSequence(eggId, sequence, options = {}) {
  region.bind(document.body, "swipe", function (e) {
    const direction = e.detail.data[0].currentDirection;
    let dir = null;
    if (direction > 170 && direction < 190) dir = "left";
    if (direction > -10 && direction < 10) dir = "right";
    if (direction > 260 && direction < 280) dir = "up";
    if (direction > 80 && direction < 100) dir = "down";
    if (!dir) return;

    // Reset timeout
    if (gestureTimeout) clearTimeout(gestureTimeout);
    gestureTimeout = setTimeout(() => {
      gestureHistory = [];
    }, SEQUENCE_TIMEOUT);

    gestureHistory.push(dir);
    if (gestureHistory.length > sequence.length) gestureHistory.shift();

    // Check for sequence match
    if (gestureHistory.join(",") === sequence.join(",")) {
      core.showEgg(eggId, options);
      gestureHistory = [];
      clearTimeout(gestureTimeout);
    }
  });
}

// --- Tap Sequence Support (per-egg state) ---
const tapState = {};
const TAP_SEQUENCE_TIMEOUT = 1200; // ms

/**
 * Register a sequence of tap gestures for an egg
 * @param {string} eggId
 * @param {number} count - Number of taps in sequence (e.g. 2 for double-tap)
 * @param {object} options
 */
export function registerEggTapSequence(eggId, count, options = {}) {
  tapState[eggId] = { tapCount: 0, tapTimeout: null };
  region.bind(document.body, "tap", function (e) {
    if (!tapState[eggId]) return;
    if (tapState[eggId].tapTimeout) clearTimeout(tapState[eggId].tapTimeout);
    tapState[eggId].tapCount++;
    console.log(`[${eggId}] Tap #${tapState[eggId].tapCount}`);
    tapState[eggId].tapTimeout = setTimeout(() => {
      tapState[eggId].tapCount = 0;
      console.log(`[${eggId}] Tap sequence reset (timeout)`);
    }, TAP_SEQUENCE_TIMEOUT);
    if (tapState[eggId].tapCount === count) {
      core.showEgg(eggId, options);
      tapState[eggId].tapCount = 0;
      clearTimeout(tapState[eggId].tapTimeout);
      console.log(`[${eggId}] Tap sequence matched!`);
    }
  });
}
