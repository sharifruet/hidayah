import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'hidayah-storage' });

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
