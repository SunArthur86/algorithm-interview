'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/lib/types';
import { APP_CONFIG } from '@/lib/config';
import { useStore } from '@/lib/store';
import CategoryTabs from './CategoryTabs';
import FilterBar, { type DifficultyFilter, type SortOrder } from './FilterBar';
import SearchBar from './SearchBar';
import DifficultyBars from './DifficultyBars';
import QuestionCard from './QuestionCard';
import QuestionModal from './QuestionModal';
import ReviewDashboard from './ReviewDashboard';
import ProgressRing from './ProgressRing';

export default function HomeClient({ questions }: { questions: Question[] }) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const viewed = useStore((s) => s.viewed);
  const favorites = useStore((s) => s.favorites);

  // 同步深色模式 class 到 <html>（持久化）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [cat, setCat] = useState('all');
  const [diff, setDiff] = useState<DifficultyFilter>('all');
  const [sort, setSort] = useState<SortOrder>('plan');
  const [onlyFav, setOnlyFav] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // 分类计数
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: questions.length };
    for (const q of questions) c[q.category] = (c[q.category] || 0) + 1;
    return c;
  }, [questions]);

  // 所有标签（按出现频次排序，取前 24）
  const allTags = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of questions) for (const t of q.tags) m[t] = (m[t] || 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 24).map((x) => x[0]);
  }, [questions]);

  // `/` 聚焦搜索框
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        document.getElementById('home-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 过滤 + 排序
  const filtered = useMemo(() => {
    let list = questions;
    if (cat !== 'all') list = list.filter((q) => q.category === cat);
    if (diff !== 'all') list = list.filter((q) => q.difficulty === diff);
    if (onlyFav) list = list.filter((q) => favorites.includes(String(q.lcId)));
    if (activeTag) list = list.filter((q) => q.tags.includes(activeTag));
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
  }, [questions, cat, diff, onlyFav, search, sort, favorites, activeTag]);

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
        <div className="top-nav" style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/study-plan/" style={topLink}>📋 热题100</Link>
          <Link href="/columns/" style={topLink}>📚 专栏</Link>
          <button onClick={() => setReviewOpen(true)} style={topLink} aria-label="打开复习面板">🔁 复习</button>
          <button onClick={toggleTheme} style={iconBtn} aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* 概览 */}
      <section style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <ProgressRing value={viewedCount / questions.length} done={viewedCount} total={questions.length} size={88} />
        <DifficultyBars counts={diffCounts} />
      </section>

      <SearchBar value={search} onChange={setSearch} inputId="home-search" />
      <FilterBar
        difficulty={diff}
        onDifficulty={setDiff}
        sort={sort}
        onSort={setSort}
        onlyFav={onlyFav}
        onToggleFav={() => setOnlyFav((v) => !v)}
      />
      <CategoryTabs active={cat} counts={counts} onSelect={setCat} />

      {/* 标签云 */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
              style={{
                fontSize: '11px',
                padding: '2px 9px',
                borderRadius: '999px',
                border: '1px solid ' + (activeTag === t ? 'var(--primary)' : 'var(--border)'),
                background: activeTag === t ? 'var(--primary-soft)' : 'var(--card)',
                color: activeTag === t ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
          {activeTag && (
            <button onClick={() => setActiveTag(null)} style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕ 清除标签
            </button>
          )}
        </div>
      )}

      {/* 题目网格 */}
      <div
        className="q-grid"
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

      {reviewOpen && <ReviewDashboard questions={questions} onClose={() => setReviewOpen(false)} />}

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
