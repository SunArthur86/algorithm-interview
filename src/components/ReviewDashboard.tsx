'use client';

import { useMemo, useState } from 'react';
import type { Question, Algorithm } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ALGO_LABELS } from '@/lib/config';
import { review, isDue, isMastered, previewInterval, formatInterval, getBoxLabel } from '@/lib/algorithms';

interface Props {
  questions: Question[];
  onClose: () => void;
}

const RATINGS: { q: number; label: string; emoji: string; color: string }[] = [
  { q: 0, label: '再来', emoji: '🔴', color: 'var(--danger)' },
  { q: 1, label: '困难', emoji: '🟠', color: 'var(--warning)' },
  { q: 2, label: '良好', emoji: '🟢', color: 'var(--success)' },
  { q: 3, label: '简单', emoji: '🔵', color: 'var(--primary)' },
];

export default function ReviewDashboard({ questions, onClose }: Props) {
  const reviewData = useStore((s) => s.reviewData);
  const ensureReview = useStore((s) => s.ensureReview);
  const upsertReview = useStore((s) => s.upsertReview);
  const reviewAlgorithm = useStore((s) => s.reviewAlgorithm);
  const setReviewAlgorithm = useStore((s) => s.setReviewAlgorithm);
  const dailyReviewLimit = useStore((s) => s.dailyReviewLimit);
  const setDailyReviewLimit = useStore((s) => s.setDailyReviewLimit);
  const dailyLog = useStore((s) => s.dailyLog);
  const resetReview = useStore((s) => s.resetReview);
  const autoEnroll = useStore((s) => s.autoEnroll);
  const toggleAutoEnroll = useStore((s) => s.toggleAutoEnroll);
  const setRating = useStore((s) => s.setRating);

  const byKey = useMemo(() => {
    const m = new Map<string, Question>();
    for (const q of questions) m.set(String(q.lcId), q);
    return m;
  }, [questions]);

  // 到期队列：已加入复习且 nextDate <= today；自动加入未复习题（若 autoEnroll）
  const queue = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const dueKeys = Object.entries(reviewData)
      .filter(([, it]) => it.nextDate <= today)
      .map(([k]) => k);
    // autoEnroll：补足到 dailyReviewLimit 的未复习题
    if (autoEnroll && dueKeys.length < dailyReviewLimit) {
      const reviewed = new Set(Object.keys(reviewData));
      const need = dailyReviewLimit - dueKeys.length;
      const candidates = questions
        .map((q) => String(q.lcId))
        .filter((k) => !reviewed.has(k))
        .slice(0, need);
      dueKeys.push(...candidates);
    }
    return dueKeys.slice(0, dailyReviewLimit).filter((k) => byKey.has(k));
  }, [reviewData, autoEnroll, dailyReviewLimit, questions, byKey]);

  const [cursor, setCursor] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const masteredCount = useMemo(
    () => Object.values(reviewData).filter(isMastered).length,
    [reviewData]
  );
  const totalEnrolled = Object.keys(reviewData).length;

  // 近 7 天学习统计
  const weekStats = useMemo(() => {
    const days: { date: string; label: string; count: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        date: iso,
        label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        count: dailyLog[iso]?.studied || 0,
      });
    }
    return days;
  }, [dailyLog]);
  const weekMax = Math.max(1, ...weekStats.map((d) => d.count));

  const currentKey = queue[cursor];
  const currentQ = currentKey ? byKey.get(currentKey) : null;
  const currentItem = currentKey ? ensureReview(currentKey) : null;

  const rate = (q: number) => {
    if (!currentKey || !currentItem) return;
    const updated = review(currentItem, q);
    upsertReview(currentKey, updated);
    // 联动掌握度自评
    const rating = q === 0 ? 'dont' : q === 1 ? 'fuzzy' : 'know';
    setRating(currentKey, rating);
    setShowAnswer(false);
    setCursor((c) => c + 1);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '30px 16px', overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)',
          maxWidth: 640, width: '100%', padding: '24px 28px', boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '19px', fontWeight: 700, margin: 0 }}>🔁 智能复习</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {ALGO_LABELS[reviewAlgorithm]} · 已加入 {totalEnrolled} · 已掌握 {masteredCount}
          </span>
          <button onClick={() => setSettingsOpen((v) => !v)} style={chipBtn}>⚙️ 设置</button>
        </div>

        {/* 近 7 天学习柱状图 */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '70px', marginBottom: '12px', padding: '0 4px' }}>
          {weekStats.map((d) => (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                title={`${d.date}: ${d.count} 题`}
                style={{
                  width: '100%',
                  maxWidth: 28,
                  height: Math.max(3, (d.count / weekMax) * 48),
                  background: d.count > 0 ? 'var(--primary)' : 'var(--border)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{d.label}</span>
            </div>
          ))}
        </div>

        {settingsOpen && (
          <section style={{ padding: '14px', background: 'var(--card-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>复习算法</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {(['sm2', 'leitner', 'ebbinghaus'] as Algorithm[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setReviewAlgorithm(a)}
                  style={reviewAlgorithm === a ? { ...chipBtn, background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : chipBtn}
                >
                  {ALGO_LABELS[a]}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '13px', marginBottom: '4px' }}>每日复习上限：{dailyReviewLimit}</div>
            <input
              type="range" min={5} max={100} value={dailyReviewLimit}
              onChange={(e) => setDailyReviewLimit(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '12px' }}
            />
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={autoEnroll} onChange={toggleAutoEnroll} style={{ accentColor: 'var(--primary)' }} />
              自动加入未复习的新题（凑满每日上限）
            </label>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => { if (confirm('确定清空所有复习数据？')) resetReview(); }} style={{ ...chipBtn, color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                清空复习数据
              </button>
            </div>
          </section>
        )}

        {queue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
            <p>今日复习已完成！</p>
            <p style={{ fontSize: '12px' }}>在题目页对题目自评后，它们会自动进入复习队列。</p>
          </div>
        ) : cursor >= queue.length ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
            <p>本批复习完成（{queue.length} 题）</p>
            <button onClick={() => { setCursor(0); setShowAnswer(false); }} style={chipBtn}>再过一遍</button>
          </div>
        ) : currentQ && currentItem ? (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
              第 {cursor + 1} / {queue.length} 题 · {getBoxLabel(currentItem)} · 已复习 {currentItem.reps} 次
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 10px' }}>
              #{currentQ.lcId} {currentQ.title}
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <a href={`/question/${currentQ.lcId}/`} target="_blank" rel="noreferrer" style={{ fontSize: '13px' }}>
                打开详情 ↗
              </a>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                {currentQ.difficulty} · {currentQ.tags.slice(0, 3).join(' / ')}
              </span>
            </div>

            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} style={{ ...chipBtn, width: '100%', padding: '10px', fontSize: '14px' }}>
                显示答案/解法
              </button>
            ) : (
              <>
                <div style={{ padding: '12px', background: 'var(--card-secondary)', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '14px', maxHeight: '300px', overflowY: 'auto' }}>
                  {currentQ.feynman?.essence && (
                    <p style={{ margin: '0 0 8px' }}>🎯 <strong>本质：</strong>{currentQ.feynman.essence}</p>
                  )}
                  <p style={{ margin: 0, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {currentQ.answer.slice(0, 500)}
                    {currentQ.answer.length > 500 ? '…' : ''}
                  </p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>自评掌握度（决定下次复习时间）</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {RATINGS.map((r) => (
                    <button
                      key={r.q}
                      onClick={() => rate(r.q)}
                      style={{
                        flex: 1, padding: '10px 4px', borderRadius: 'var(--radius-md)',
                        border: '1px solid ' + r.color, background: 'var(--card)', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{r.emoji}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: r.color }}>{r.label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        {formatInterval(previewInterval(currentItem, r.q))}后
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const closeBtn: React.CSSProperties = {
  position: 'absolute', top: '14px', right: '16px', border: 'none',
  background: 'var(--card-secondary)', width: '30px', height: '30px',
  borderRadius: '50%', cursor: 'pointer', fontSize: '16px', color: 'var(--text-secondary)',
};

const chipBtn: React.CSSProperties = {
  padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
  background: 'var(--card)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px',
};
