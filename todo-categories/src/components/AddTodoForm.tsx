import { useEffect, useState } from 'react';

type Props = {
  categories: string[];
  onAdd: (text: string, category: string) => void;
};

export default function AddTodoForm({ categories, onAdd }: Props) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(categories[0] ?? 'work');

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.includes(category)) setCategory(categories[0]);
  }, [categories, category]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    const c = category.trim();
    if (!t || !c) return;
    onAdd(t, c);
    setText('');
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        placeholder="Task name…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Task name"
      />
      <input
        list="category-options"
        placeholder="Category… (e.g., Work)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      />
      <datalist id="category-options">
        {categories.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
      <button className="primary" type="submit">Add</button>
    </form>
  );
}
