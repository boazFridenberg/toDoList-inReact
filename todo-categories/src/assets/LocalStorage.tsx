export type Todo = {
  id: string;
  text: string;
  category: string;
  completed: boolean;
};

export const DEFAULT_CATEGORIES = ['Work', 'Study', 'Personal'];

export const LS_KEYS = {
  todos: 'todos',
  categories: 'categories',
  filters: 'filters',
} as const;

export function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
