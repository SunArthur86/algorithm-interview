'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Question } from '@/lib/types';
import { useStore } from '@/lib/store';
import Markdown from './Markdown';
import FeynmanCard from './FeynmanCard';
import FirstPrincipleCard from './FirstPrincipleCard';

const VizPlayer = dynamic(() => import('./VizPlayer'), { ssr: false });

const DIFF_COLOR: Record<string, string> = {
  Easy: 'var(--diff-easy)',
  Medium: 'var(--diff-medium)',
  Hard: 'var(--diff-hard)',
};

export default function QuestionContent({ q }: { q: Question }) {
  const key = String(q.lcId);
  const viewed = useStore((s) => s.viewed.includes(key));
  const markViewed = useStore((s) => s.markViewed);
  const isFav = useStore((s) => s.isFavorite(key));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const rating = useStore((s) => s.ratings[key]);
  const setRating = useStore((s) => s.setRating);
  const note = useStore((s) => s.notes[key] || '');
  const setNote = useStore((s) => s.setNote);
  const logStudy = useStore((s) => s.logStudy);
  const [showViz, setShowViz] = useState(false);

  const markDone = () => {
    markViewed(key);
    logStudy('know', undefined);
  };

  return (
    <article>
      <header style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
              color: '#fff',
              background: DIFF_COLOR[q.difficulty] || 'var(--text-tertiary)',
            }}
          >
            {q.difficulty}
          </span>
          {q.hasViz && <span title="逐题动画">🎬</span>}
          {q.hasDiagram && <span title="SVG 图解">🖼️</span>}
          <a href={q.url} target="_blank" rel="noreferrer" style={{ fontSize: '13px' }}>
            力扣 #{q.lcId} ↗
          </a>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <button onClick={markDone} style={viewed ? { ...btn, background: 'var(--success)', color: '#fff', borderColor: 'var(--success)' } : btn}>
          {viewed ? '✓ 已掌握' : '标记掌握'}
        </button>
        <button onClick={() => toggleFav(key)} style={isFav ? { ...btn, background: 'var(--warning)', color: '#fff', borderColor: 'var(--warning)' } : btn}>
          {isFav ? '★ 已收藏' : '☆ 收藏'}
        </button>
        {q.hasViz && (
          <button onClick={() => setShowViz((v) => !v)} style={btn}>
            {showViz ? '隐藏动画' : '🎬 播放动画'}
          </button>
        )}
      </div>

      {showViz && q.hasViz && <VizPlayer lcId={q.lcId} />}

      <Markdown>{q.answer}</Markdown>

      <FeynmanCard feynman={q.feynman} />
      <FirstPrincipleCard fp={q.first_principle} />

      {/* 自评 */}
      <section style={{ marginTop: '16px', padding: '12px', background: 'var(--card-secondary)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>自评掌握度</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['know', 'fuzzy', 'dont'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRating(key, r);
                logStudy(r, rating);
              }}
              style={rating === r ? { ...btn, background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : btn}
            >
              {r === 'know' ? '✅ 会' : r === 'fuzzy' ? '🤔 模糊' : '❌ 不会'}
            </button>
          ))}
        </div>
      </section>

      {/* 笔记 */}
      <section style={{ marginTop: '12px' }}>
        <textarea
          placeholder="📝 写点笔记…"
          value={note}
          onChange={(e) => setNote(key, e.target.value)}
          style={{
            width: '100%',
            minHeight: '70px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg-soft)',
            color: 'var(--text)',
            fontFamily: 'inherit',
            fontSize: '13px',
            resize: 'vertical',
          }}
        />
      </section>
    </article>
  );
}

const btn: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-soft)',
  color: 'var(--text)',
  cursor: 'pointer',
  fontSize: '13px',
};
