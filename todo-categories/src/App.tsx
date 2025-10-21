import { useEffect, useMemo, useState } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import CategoryFilter from './components/CategoryFilter';
import StatusFilter, { type Status } from './components/StatusFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type Todo = {
  _id: string;
  title: string;
  category: string;
  completed: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [{ filterCategory, filterStatus }, setFilters] = useState({
    filterCategory: '',
    filterStatus: 'all' as Status,
  });

  const API = "http://localhost:5000/api/todos";

  useEffect(() => {
    (async () => {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
      const uniqueCategories = [...new Set(data.map((t: Todo) => t.category))] as string[];
      setCategories(uniqueCategories);
    })();
  }, []);

  async function addTodo(text: string, category: string) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category })
    });
    const newTodo = await res.json();
    setTodos(prev => [newTodo, ...prev]);
    setCategories(prev => prev.includes(category) ? prev : [...prev, category]);
    toast.success('Task added');
  }

  async function deleteTodo(id: string) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos(prev => prev.filter(t => t._id !== id));
    toast.info('Task deleted');
  }

  async function toggleCompleted(id: string) {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    const res = await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed })
    });
    const updated = await res.json();
    setTodos(prev => prev.map(t => t._id === id ? updated : t));
  }

  async function clearAll() {
    if (!confirm('Clear ALL tasks?')) return;
    await Promise.all(todos.map(t => fetch(`${API}/${t._id}`, { method: "DELETE" })));
    setTodos([]);
    toast('All tasks cleared');
  }

  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
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
            onChange={(v) => setFilters((f) => ({ ...f, filterCategory: v }))} />
          <StatusFilter
            value={filterStatus}
            onChange={(v) => setFilters((f) => ({ ...f, filterStatus: v }))} />
        </div>

        <div className="panel">
          <TodoList todos={filteredTodos} onToggle={toggleCompleted} onDelete={deleteTodo} />
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1400} closeOnClick pauseOnHover />
    </div>
  );
}
