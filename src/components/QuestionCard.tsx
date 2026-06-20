'use client';

import type { Question } from '@/lib/types';
import { useStore } from '@/lib/store';

const DIFF_COLOR: Record<string, string> = {
  Easy: 'var(--diff-easy)',
  Medium: 'var(--diff-medium)',
  Hard: 'var(--diff-hard)',
};

interface Props {
  q: Question;
  onOpen: (q: Question) => void;
}

export default function QuestionCard({ q, onOpen }: Props) {
  const key = String(q.lcId);
  const viewed = useStore((s) => s.viewed.includes(key));
  const isFav = useStore((s) => s.favorites.includes(key));
  const planDone = useStore((s) => !!s.planProgress[key]);

  return (
    <div
      onClick={() => onOpen(q)}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.15s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
          #{q.lcId}
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: '4px',
            color: '#fff',
            background: DIFF_COLOR[q.difficulty] || 'var(--text-tertiary)',
          }}
        >
          {q.difficulty}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '13px', display: 'flex', gap: '4px' }}>
          {viewed && <span title="已掌握">✅</span>}
          {planDone && <span title="计划完成">📋</span>}
          {isFav && <span title="已收藏">⭐</span>}
          {q.hasViz && <span title="逐题动画">🎬</span>}
          {q.hasDiagram && <span title="SVG 图解">🖼️</span>}
        </span>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>{q.title}</div>
      {q.tags.length > 0 && (
        <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {q.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'var(--card-secondary)',
                color: 'var(--text-tertiary)',
                border: '1px solid var(--border)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
