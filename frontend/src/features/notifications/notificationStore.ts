import { useSyncExternalStore } from "react";

export type NotificationType = "chapter" | "translation";

export interface StudioNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  read: boolean;
}

const storageKey = "novel-studio-notifications-demo-v1";

function load(): StudioNotification[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(storageKey) ?? "null",
    );

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is StudioNotification =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          (item.type === "chapter" ||
            item.type === "translation") &&
          typeof item.title === "string" &&
          typeof item.description === "string" &&
          typeof item.href === "string" &&
          item.href.startsWith("/books/") &&
          typeof item.createdAt === "string" &&
          typeof item.read === "boolean",
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

let notifications = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return notifications;
}

function save(next: StudioNotification[]) {
  notifications = next;

  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    notifications = next;
  }

  listeners.forEach((listener) => listener());
}

export function useNotifications() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
}

export function addNotification(
  item: Pick<
    StudioNotification,
    "type" | "title" | "description" | "href"
  >,
) {
  save(
    [
      {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...notifications,
    ].slice(0, 50),
  );
}

export function markNotificationRead(id: string) {
  if (
    !notifications.some(
      (item) => item.id === id && !item.read,
    )
  ) {
    return;
  }

  save(
    notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    ),
  );
}

export function markAllNotificationsRead() {
  if (!notifications.some((item) => !item.read)) return;

  save(
    notifications.map((item) => ({
      ...item,
      read: true,
    })),
  );
}