import { flushSync } from "react-dom";

export function startViewTransition(callback: () => void) {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  return document.startViewTransition(() => flushSync(() => callback()));
}
