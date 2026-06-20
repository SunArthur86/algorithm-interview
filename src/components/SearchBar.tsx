'use client';

import { useStore } from '@/lib/store';

interface Props {
  value: string;
  onChange: (v: string) => void;
  inputId?: string;
}

export default function SearchBar({ value, onChange, inputId }: Props) {
  const searchHistory = useStore((s) => s.searchHistory);
  const addSearchHistory = useStore((s) => s.addSearchHistory);

  return (
    <div style={{ marginBottom: '12px' }}>
      <input
        id={inputId}
        type="text"
        placeholder="🔍 搜索题号、标题或标签…（按 / 聚焦）"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => value.trim() && addSearchHistory(value)}
        style={{
          width: '100%',
          padding: '9px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--text)',
          fontSize: '14px',
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
      {searchHistory.length > 0 && !value && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', alignSelf: 'center' }}>最近：</span>
          {searchHistory.slice(0, 6).map((h) => (
            <button
              key={h}
              onClick={() => onChange(h)}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
