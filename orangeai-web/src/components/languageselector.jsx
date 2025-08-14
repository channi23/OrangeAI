export default function LanguageSelector({ label, options = [], value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-white/70">{label}</label>
      <select className="select" value={value} onChange={(e) => onChange?.(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}