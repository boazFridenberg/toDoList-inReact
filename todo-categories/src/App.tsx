import { useEffect, useMemo, useState } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import CategoryFilter from './components/CategoryFilter';
import StatusFilter, { type Status } from './components/StatusFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type Todo = {
  id: string;
  text: string;
  category: string;
  completed: boolean;
};

const DEFAULT_CATEGORIES = ['Work', 'Study', 'Personal'];

const LS_KEYS = {
  todos: 'todos',
  categories: 'categories',
  filters: 'filters'
} as const;

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* empty */ }
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [{ filterCategory, filterStatus }, setFilters] = useState<{
    filterCategory: string; 
    filterStatus: Status;
  }>({ filterCategory: '', filterStatus: 'all' });

  useEffect(() => {
    setTodos(loadLS<Todo[]>(LS_KEYS.todos, []));
    setCategories(loadLS<string[]>(LS_KEYS.categories, DEFAULT_CATEGORIES));
    const savedFilters = loadLS<{ filterCategory: string; filterStatus: Status }>(
      LS_KEYS.filters,
      { filterCategory: '', filterStatus: 'all' }
    );
    setFilters(savedFilters);
  }, []);

  useEffect(() => saveLS(LS_KEYS.todos, todos), [todos]);
  useEffect(() => saveLS(LS_KEYS.categories, categories), [categories]);
  useEffect(() => saveLS(LS_KEYS.filters, { filterCategory, filterStatus }), [filterCategory, filterStatus]);

  function addTodo(text: string, category: string) {
    const next: Todo = { id: makeId(), text, category, completed: false };
    setTodos((prev) => [next, ...prev]);
    setCategories((prev) => (prev.includes(category) ? prev : [...prev, category]));
    toast.success('Task added');
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    toast.info('Task deleted');
  }

  function toggleCompleted(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function clearAll() {
    if (!confirm('Clear ALL tasks?')) return;
    setTodos([]);
    toast('All tasks cleared');
  }

  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      const categoryOk = !filterCategory || t.category === filterCategory;
      const statusOk =
        filterStatus === 'all' ||
        (filterStatus === 'completed' ? t.completed : !t.completed);
      return categoryOk && statusOk;
    });
  }, [todos, filterCategory, filterStatus]);

  return (
    <div className="container">
      <div className="header">
        <div className="title">To-Do List</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 14 }}>
        <AddTodoForm categories={categories} onAdd={addTodo} />
      </div>

      <div className="grid">
        <div className="controls">
          <CategoryFilter
            categories={categories}
            value={filterCategory}
            onChange={(v) => setFilters((f) => ({ ...f, filterCategory: v }))}
          />
          <StatusFilter
            value={filterStatus}
            onChange={(v) => setFilters((f) => ({ ...f, filterStatus: v }))}
          />
        </div>

        <div className="panel">
          <TodoList todos={filteredTodos} onToggle={toggleCompleted} onDelete={deleteTodo} />
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1400} closeOnClick pauseOnHover />
    </div>
  );
}
