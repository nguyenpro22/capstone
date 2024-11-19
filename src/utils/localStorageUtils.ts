type LocalStorageKey = string;

const isWindow = typeof window !== "undefined";
// Get the value associated with a key from localStorage
export function getFromLocalStorage<T>(key: LocalStorageKey): T | null {
  const item = isWindow && localStorage.getItem(key);

  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(
        `Error parsing localStorage item with key '${key}':`,
        error
      );
    }
  }

  return null;
}

// Set a value associated with a key in localStorage
export function setToLocalStorage(key: LocalStorageKey, value: unknown): void {
  try {
    const serializedValue = JSON.stringify(value);
    if (isWindow) {
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error(`Error setting localStorage item with key '${key}':`, error);
  }
}

// Remove a value associated with a key from localStorage
export function removeFromLocalStorage(key: LocalStorageKey): void {
  if (isWindow) {
    localStorage.removeItem(key);
  }
}

// Clear all values from localStorage
export function clearLocalStorage(): void {
  if (isWindow) {
    localStorage.clear();
  }
}
