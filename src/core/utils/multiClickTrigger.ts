// Utility to detect N consecutive activations (click/tap/keyboard) on an element
// Resets if the sequence is broken for more than 1 second

interface RegisterMultiClickTriggerOptions {
  element: HTMLElement;
  count?: number;
  callback: (e: MouseEvent | TouchEvent | KeyboardEvent) => void;
  timeout?: number;
}

export function registerMultiClickTrigger({
  element,
  count = 5,
  callback,
  timeout = 1000, // ms
}: RegisterMultiClickTriggerOptions): () => void {
  let activationCount = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastActivationTime = 0;
  let lastEventType: string | null = null;
  const DEDUP_WINDOW = 150; // ms

  function reset() {
    activationCount = 0;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastActivationTime = 0;
    lastEventType = null;
  }

  function isDuplicateEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
    const now = Date.now();
    // If the same event type fires within the dedup window, ignore
    if (lastEventType && now - lastActivationTime < DEDUP_WINDOW) {
      // Special case: ignore click if it follows touchend or keydown
      if (
        (lastEventType === "touchend" && e.type === "click") ||
        (lastEventType === "keydown" && e.type === "click")
      ) {
        return true;
      }
      // Ignore repeated keydown, click, or touchend
      if (lastEventType === e.type) {
        return true;
      }
    }
    lastActivationTime = now;
    lastEventType = e.type;
    return false;
  }

  function handleActivation(e: MouseEvent | TouchEvent | KeyboardEvent) {
    // Only allow left click, touch, or keyboard activation (Enter/Space)
    if (
      e.type === "click" ||
      e.type === "touchend" ||
      (e.type === "keydown" && ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " "))
    ) {
      if (isDuplicateEvent(e)) return;
      activationCount++;
      if (activationCount >= count) {
        reset();
        callback(e);
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(reset, timeout);
    }
  }

  element.addEventListener("click", handleActivation);
  element.addEventListener("touchend", handleActivation);
  element.addEventListener("keydown", handleActivation);

  // Return a cleanup function
  return () => {
    element.removeEventListener("click", handleActivation);
    element.removeEventListener("touchend", handleActivation);
    element.removeEventListener("keydown", handleActivation);
    reset();
  };
}
