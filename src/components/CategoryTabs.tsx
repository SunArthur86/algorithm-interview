'use client';

import { APP_CONFIG } from '@/lib/config';

interface Props {
  active: string;
  counts: Record<string, number>;
  onSelect: (cat: string) => void;
}

export default function CategoryTabs({ active, counts, onSelect }: Props) {
  const cats = Object.entries(APP_CONFIG.categories);
  return (
    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '6px 0', paddingBottom: '10px' }}>
      {cats.map(([key, cfg]) => {
        const on = key === active;
        const n = counts[key] || 0;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid ' + (on ? cfg.color : 'var(--border)'),
              background: on ? cfg.color : 'var(--card)',
              color: on ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: on ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
            <span style={{ opacity: 0.7, fontSize: '11px' }}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}
