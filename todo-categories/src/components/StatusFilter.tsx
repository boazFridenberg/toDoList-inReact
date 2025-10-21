export type Status = 'all' | 'completed' | 'pending';

type Props = {
  value: Status;
  onChange: (status: Status) => void;
};

export default function StatusFilter({ value, onChange }: Props) {
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Filter by Status</div>
      <select
        aria-label="Select status"
        value={value}
        onChange={(e) => onChange(e.target.value as Status)}
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}
