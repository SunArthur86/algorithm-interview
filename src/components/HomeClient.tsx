'use client';

import { useMemo, useState } from 'react';
import type { Question } from '@/lib/types';
import { APP_CONFIG } from '@/lib/config';
import { useStore } from '@/lib/store';
import CategoryTabs from './CategoryTabs';
import FilterBar, { type DifficultyFilter, type SortOrder } from './FilterBar';
import SearchBar from './SearchBar';
import DifficultyBars from './DifficultyBars';
import QuestionCard from './QuestionCard';
import QuestionModal from './QuestionModal';
import ProgressRing from './ProgressRing';

export default function HomeClient({ questions }: { questions: Question[] }) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const viewed = useStore((s) => s.viewed);
  const favorites = useStore((s) => s.favorites);

  const [cat, setCat] = useState('all');
  const [diff, setDiff] = useState<DifficultyFilter>('all');
  const [sort, setSort] = useState<SortOrder>('plan');
  const [onlyFav, setOnlyFav] = useState(false);
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 分类计数
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: questions.length };
    for (const q of questions) c[q.category] = (c[q.category] || 0) + 1;
    return c;
  }, [questions]);

  // 过滤 + 排序
  const filtered = useMemo(() => {
    let list = questions;
    if (cat !== 'all') list = list.filter((q) => q.category === cat);
    if (diff !== 'all') list = list.filter((q) => q.difficulty === diff);
    if (onlyFav) list = list.filter((q) => favorites.includes(String(q.lcId)));
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          String(q.lcId).includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    const sorted = [...list];
    if (sort === 'plan') sorted.sort((a, b) => a.planOrder - b.planOrder);
    else if (sort === 'default') sorted.sort((a, b) => a.lcId - b.lcId);
    else if (sort === 'easy-first')
      sorted.sort((a, b) => diffRank(a.difficulty) - diffRank(b.difficulty) || a.lcId - b.lcId);
    else if (sort === 'hard-first')
      sorted.sort((a, b) => diffRank(b.difficulty) - diffRank(a.difficulty) || a.lcId - b.lcId);
    return sorted;
  }, [questions, cat, diff, onlyFav, search, sort, favorites]);

  const diffCounts = useMemo(() => {
    const c = { Easy: 0, Medium: 0, Hard: 0 };
    for (const q of filtered) c[q.difficulty as 'Easy' | 'Medium' | 'Hard']++;
    return c;
  }, [filtered]);

  const viewedCount = useMemo(
    () => questions.filter((q) => viewed.includes(String(q.lcId))).length,
    [questions, viewed]
  );

  const openQ = openIndex !== null ? filtered[openIndex] : null;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
      {/* 顶栏 */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
          {APP_CONFIG.appIcon} {APP_CONFIG.appName}
        </h1>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{questions.length} 题</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/study-plan/" style={topLink}>📋 热题100</a>
          <a href="/columns/" style={topLink}>📚 专栏</a>
          <button onClick={toggleTheme} style={iconBtn}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* 概览 */}
      <section style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <ProgressRing value={viewedCount / questions.length} done={viewedCount} total={questions.length} size={88} />
        <DifficultyBars counts={diffCounts} />
      </section>

      <SearchBar value={search} onChange={setSearch} />
      <FilterBar
        difficulty={diff}
        onDifficulty={setDiff}
        sort={sort}
        onSort={setSort}
        onlyFav={onlyFav}
        onToggleFav={() => setOnlyFav((v) => !v)}
      />
      <CategoryTabs active={cat} counts={counts} onSelect={setCat} />

      {/* 题目网格 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '10px',
        }}
      >
        {filtered.map((q, i) => (
          <QuestionCard key={q.lcId} q={q} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px' }}>没有匹配的题目</p>
      )}

      <QuestionModal
        question={openQ || null}
        list={filtered}
        index={openIndex ?? -1}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />

      <footer style={{ marginTop: '40px', padding: '16px 0', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)' }}>
        <a href={APP_CONFIG.repoUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>{' '}
        · {APP_CONFIG.appVersion} · 快捷键：← → 切题，Esc 关闭
      </footer>
    </main>
  );
}

function diffRank(d: string): number {
  return d === 'Easy' ? 0 : d === 'Medium' ? 1 : 2;
}

const topLink: React.CSSProperties = {
  fontSize: '13px',
  padding: '5px 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--card)',
};

const iconBtn: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'var(--card)',
  borderRadius: 'var(--radius-sm)',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  fontSize: '15px',
};
