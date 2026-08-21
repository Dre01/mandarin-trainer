export function ProgressBar({ value, label }: { value: number; label: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap">
      <div className="progress-meta"><span>{label}</span><strong>{Math.round(safe)}%</strong></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${safe}%` }} /></div>
    </div>
  );
}
