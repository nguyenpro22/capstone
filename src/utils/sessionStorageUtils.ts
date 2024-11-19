type SessionStorageKey = string;

const isWindow = typeof window !== "undefined";

// Get the value associated with a key from sessionStorage
export function getFromSessionStorage<T>(key: SessionStorageKey): T | null {
  const item = isWindow && sessionStorage.getItem(key);

  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(
        `Error parsing sessionStorage item with key '${key}':`,
        error
      );
    }
  }

  return null;
}

// Set a value associated with a key in sessionStorage
export function setToSessionStorage(
  key: SessionStorageKey,
  value: unknown
): void {
  try {
    const serializedValue = JSON.stringify(value);
    if (isWindow) {
      sessionStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error(
      `Error setting sessionStorage item with key '${key}':`,
      error
    );
  }
}

// Remove a value associated with a key from sessionStorage
export function removeFromSessionStorage(key: SessionStorageKey): void {
  if (isWindow) {
    sessionStorage.removeItem(key);
  }
}

// Clear all values from sessionStorage
export function clearSessionStorage(): void {
  if (isWindow) {
    sessionStorage.clear();
  }
}
