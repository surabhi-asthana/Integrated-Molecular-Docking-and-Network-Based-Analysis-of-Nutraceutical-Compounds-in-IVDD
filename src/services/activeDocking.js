// Remembers which protein-compound pair is currently open on the Docking page,
// so DiscNet AI (floating chat and the AI Interpretation tab) knows what
// "this", "it" or "this docking" refers to.
import { useSyncExternalStore } from "react";

let active = null; // { protein: "TNFA", compound: "quercetin" } or null
const listeners = new Set();

export function setActiveDocking(next) {
  active = next;
  listeners.forEach((fn) => fn());
}

export function getActiveDocking() {
  return active;
}

export function useActiveDocking() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => active
  );
}
