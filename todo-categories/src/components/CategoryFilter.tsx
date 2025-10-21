type Props = {
  categories: string[];
  value: string; // '' means "All"
  onChange: (category: string) => void;
};

export default function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Filter by Category</div>
      <select
        aria-label="Select category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
