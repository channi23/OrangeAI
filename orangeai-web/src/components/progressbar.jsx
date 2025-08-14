export default function ProgressBar({ label, value = 0 }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-white/70 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-white/70" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}