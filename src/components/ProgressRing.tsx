'use client';

interface Props {
  value: number; // 0..1
  total?: number;
  done?: number;
  size?: number;
  label?: string;
  color?: string;
}

export default function ProgressRing({
  value,
  total,
  done,
  size = 120,
  label,
  color = 'var(--primary)',
}: Props) {
  const pct = Math.max(0, Math.min(1, value));
  const pctNum = Math.round(pct * 100);
  const stroke = Math.max(6, size * 0.07);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color: 'var(--text)' }}>{pctNum}%</span>
        {typeof done === 'number' && typeof total === 'number' && (
          <span style={{ fontSize: size * 0.1, color: 'var(--text-tertiary)' }}>
            {done}/{total}
          </span>
        )}
        {label && (
          <span style={{ fontSize: size * 0.09, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</span>
        )}
      </div>
    </div>
  );
}
