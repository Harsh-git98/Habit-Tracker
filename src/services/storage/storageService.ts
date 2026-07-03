import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readString(key: string) {
  return AsyncStorage.getItem(key);
}

export async function writeString(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

export async function readJSON<T>(key: string): Promise<T | null> {
  const raw = await readString(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJSON<T>(key: string, value: T) {
  await writeString(key, JSON.stringify(value));
}

export async function readList<T>(key: string): Promise<T[]> {
  const value = await readJSON<T[]>(key);
  return Array.isArray(value) ? value : [];
}

export async function writeList<T>(key: string, value: T[]) {
  await writeJSON(key, value);
}

export async function removeValue(key: string) {
  await AsyncStorage.removeItem(key);
}