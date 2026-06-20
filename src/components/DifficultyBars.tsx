'use client';

interface Props {
  counts: { Easy: number; Medium: number; Hard: number };
}

export default function DifficultyBars({ counts }: Props) {
  const total = counts.Easy + counts.Medium + counts.Hard || 1;
  const bars = [
    { label: 'Easy', n: counts.Easy, color: 'var(--diff-easy)' },
    { label: 'Medium', n: counts.Medium, color: 'var(--diff-medium)' },
    { label: 'Hard', n: counts.Hard, color: 'var(--diff-hard)' },
  ];
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
      {bars.map((b) => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: b.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
          <strong style={{ color: 'var(--text)' }}>{b.n}</strong>
          <span style={{ color: 'var(--text-tertiary)' }}>{Math.round((b.n / total) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}
