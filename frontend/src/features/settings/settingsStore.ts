import { useSyncExternalStore } from "react";

export type ReadingSize = "comfortable" | "large";

export interface Settings {
  readingSize: ReadingSize;
  narrationSpeed: number;
  jobNotifications: boolean;
  productNotifications: boolean;
}

const storageKey = "novel-studio-settings-demo-v1";

const defaults: Settings = {
  readingSize: "comfortable",
  narrationSpeed: 1,
  jobNotifications: true,
  productNotifications: false,
};

function load(): Settings {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(storageKey) ?? "null",
    );

    if (!parsed || typeof parsed !== "object") return defaults;

    const saved = parsed as Partial<Settings>;

    return {
      readingSize:
        saved.readingSize === "large" ? "large" : "comfortable",
      narrationSpeed: [0.8, 0.9, 1, 1.1, 1.2].includes(
        saved.narrationSpeed ?? NaN,
      )
        ? saved.narrationSpeed!
        : 1,
      jobNotifications:
        typeof saved.jobNotifications === "boolean"
          ? saved.jobNotifications
          : true,
      productNotifications:
        typeof saved.productNotifications === "boolean"
          ? saved.productNotifications
          : false,
    };
  } catch {
    return defaults;
  }
}

let settings = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return settings;
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function updateSettings(patch: Partial<Settings>) {
  const next = { ...settings, ...patch };

  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    throw new Error(
      "Could not save settings on this device. Check your browser storage.",
    );
  }

  settings = next;
  listeners.forEach((listener) => listener());
}