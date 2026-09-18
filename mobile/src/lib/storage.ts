import { isRunningInExpoGo } from 'expo';

export interface KeyValueStore {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  contains(key: string): boolean;
}

// Expo Go doesn't ship react-native-mmkv's native NitroModules, and importing it there
// throws — so Expo Go gets an in-memory store (nothing persists across app restarts).
function createMemoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    getString: (key) => map.get(key),
    set: (key, value) => {
      map.set(key, value);
    },
    remove: (key) => {
      map.delete(key);
    },
    contains: (key) => map.has(key),
  };
}

export const storage: KeyValueStore = isRunningInExpoGo()
  ? createMemoryStore()
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('react-native-mmkv') as typeof import('react-native-mmkv')).createMMKV({ id: 'hidayah-storage' });

export function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = storage.getString(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  storage.set(key, JSON.stringify(value));
}
