import { useSyncExternalStore, useCallback } from "react";

function readFromStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return initialValue;
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const listeners = new Map<string, Set<() => void>>();

function subscribeForKey(key: string, onStoreChange: () => void): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(onStoreChange);
  return () => {
    listeners.get(key)?.delete(onStoreChange);
  };
}

function notifyKey(key: string): void {
  listeners.get(key)?.forEach((cb) => cb());
}

function subscribe(key: string, onStoreChange: () => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === key) onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  const unsubKey = subscribeForKey(key, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    unsubKey();
  };
}

function getSnapshot<T>(key: string, initialValue: T): T {
  return readFromStorage(key, initialValue);
}

/**
 * Реактивная подписка на значение в localStorage через useSyncExternalStore.
 * Обновляется без перезагрузки: при setValue (та же вкладка) и при изменении в другой вкладке (storage).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const state = useSyncExternalStore(
    (onStoreChange) => subscribe(key, onStoreChange),
    () => getSnapshot(key, initialValue),
    () => initialValue,
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const next =
        typeof value === "function"
          ? (value as (prev: T) => T)(readFromStorage(key, initialValue))
          : value;
      writeToStorage(key, next);
      notifyKey(key);
    },
    [key, initialValue],
  );

  return [state, setValue];
}
