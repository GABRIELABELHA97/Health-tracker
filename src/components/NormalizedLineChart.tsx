interface Series {
  name: string;
  color: string;
  points: { date: string; value: number }[];
}

export default function NormalizedLineChart({ series }: { series: Series[] }) {
  const width = 640;
  const height = 160;
  const padding = 10;
  const allDates = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.date)))).sort();

  if (allDates.length < 2) {
    return <p className="muted">Dados insuficientes para o gráfico ainda.</p>;
  }

  const xFor = (date: string) => {
    const idx = allDates.indexOf(date);
    return padding + (idx / (allDates.length - 1)) * (width - padding * 2);
  };

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        {series.map((s) => {
          const peak = Math.max(...s.points.map((p) => p.value), 1e-9);
          const pts = s.points
            .filter((p) => p.value > 0 || s.points.length === 1)
            .map((p) => {
              const x = xFor(p.date);
              const y = height - padding - (p.value / peak) * (height - padding * 2);
              return `${x},${y}`;
            });
          if (pts.length === 0) return null;
          return (
            <g key={s.name}>
              <polyline points={pts.join(" ")} fill="none" stroke={s.color} strokeWidth={2} />
              {s.points.map((p) => {
                const x = xFor(p.date);
                const y = height - padding - (p.value / peak) * (height - padding * 2);
                return <circle key={p.date} cx={x} cy={y} r={3} fill={s.color} />;
              })}
            </g>
          );
        })}
      </svg>
      <div className="row-between muted" style={{ fontSize: "0.8rem" }}>
        <span>{allDates[0].slice(5)}</span>
        <span>{allDates[allDates.length - 1].slice(5)}</span>
      </div>
      <div className="row" style={{ marginTop: 6 }}>
        {series.map((s) => (
          <span key={s.name} className="row" style={{ gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: s.color, display: "inline-block" }} />
            <span className="muted">{s.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
