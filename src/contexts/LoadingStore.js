// Simple global loading store usable without React context
// Allows non-React modules (like api.js) to toggle a shared loading state

let isLoading = false;
const subscribers = new Set();
let pendingCount = 0; // ref count for overlapping operations

export const subscribeToLoading = (listener) => {
  subscribers.add(listener);
  // Immediately inform initial state
  listener(isLoading);
  return () => subscribers.delete(listener);
};

const notify = () => {
  for (const listener of subscribers) {
    try {
      listener(isLoading);
    } catch (_) {
      // ignore subscriber errors
    }
  }
};

export const startLoading = () => {
  pendingCount += 1;
  if (!isLoading) {
    isLoading = true;
    notify();
  }
};

export const stopLoading = () => {
  pendingCount = Math.max(0, pendingCount - 1);
  if (pendingCount === 0 && isLoading) {
    isLoading = false;
    notify();
  }
};

export const withLoading = async (fn) => {
  startLoading();
  try {
    return await fn();
  } finally {
    stopLoading();
  }
};

export const getLoadingState = () => isLoading;

export default {
  subscribeToLoading,
  startLoading,
  stopLoading,
  withLoading,
  getLoadingState,
};


