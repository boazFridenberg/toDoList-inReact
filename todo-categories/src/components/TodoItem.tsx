import type { CSSProperties } from 'react';

export type Todo = {
  id: string;
  text: string;
  category: string;
  completed: boolean;
};

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function colorFromCategory(category: string): CSSProperties {
  // Stable pastel color based on category string
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return {
    backgroundColor: `hsl(${hue}, 70%, 85%)`,
    color: `hsl(${hue}, 40%, 20%)`,
  };
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="item">
      <input
        className="checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.text}`}
      />
      <div className="text">
        <span className={`task ${todo.completed ? 'done' : ''}`}>{todo.text}</span>
        <small style={{ opacity: .7 }}>Category: {todo.category}</small>
      </div>
      <span className="badge" style={colorFromCategory(todo.category)}>{todo.category}</span>
      <button className="danger" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.text}`}>
        Delete
      </button>
    </li>
  );
}
