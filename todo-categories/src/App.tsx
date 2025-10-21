import { useEffect, useState } from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import CategoryFilter from "./components/CategoryFilter";
import StatusFilter, { type Status } from "./components/StatusFilter";
import AuthForm from "./components/AuthForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Todo = { _id: string; title: string; category: string; completed: boolean };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status>("all");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:4000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then((data: Todo[]) => {
        setTodos(data);
        setCategories([...new Set(data.map(t => t.category))] as string[]);
      });
  }, [token]);

  async function addTodo(title: string, category: string) {
    const res = await fetch("http://localhost:4000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, category }),
    });
    const newTodo = await res.json();
    setTodos(prev => [newTodo, ...prev]);
  }

  async function toggleCompleted(id: string) {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const updated = await res.json();
    setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
  }

  async function deleteTodo(id: string) {
    await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(prev => prev.filter(t => t._id !== id));
  }

  if (!token) {
    return <AuthForm onAuth={setToken} />;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="title">To-Do List</div>
        <button onClick={() => { localStorage.removeItem("token"); setToken(null); }}>Logout</button>
      </div>

      <AddTodoForm categories={categories} onAdd={addTodo} />
      <div className="grid">
        <CategoryFilter categories={categories} value={filterCategory} onChange={setFilterCategory} />
        <StatusFilter value={filterStatus} onChange={setFilterStatus} />
      </div>

      <TodoList
        todos={todos.filter(t =>
          (!filterCategory || t.category === filterCategory) &&
          (filterStatus === "all" ||
            (filterStatus === "completed" ? t.completed : !t.completed))
        )}
        onToggle={toggleCompleted}
        onDelete={deleteTodo}
      />
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  );
}
