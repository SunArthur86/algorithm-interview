'use client';

import { useEffect } from 'react';
import type { Question } from '@/lib/types';
import QuestionContent from './QuestionContent';

interface Props {
  question: Question | null;
  list: Question[];
  index: number; // 当前题在 list 中的索引
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function QuestionModal({ question, list, index, onClose, onNavigate }: Props) {
  useEffect(() => {
    if (!question) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
      else if (e.key === 'ArrowRight' && index < list.length - 1) onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [question, index, list.length, onClose, onNavigate]);

  if (!question) return null;

  return (
    <div
      className="q-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="q-modal-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-soft)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '760px',
          width: '100%',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            border: 'none',
            background: 'var(--card-secondary)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', paddingRight: '40px' }}>
          {question.lcId}. {question.title}
        </h1>
        <QuestionContent q={question} />
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <button disabled={index === 0} onClick={() => onNavigate(index - 1)} style={navBtn(index === 0)}>
            ← 上一题
          </button>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
            {index + 1} / {list.length}
          </span>
          <button disabled={index === list.length - 1} onClick={() => onNavigate(index + 1)} style={navBtn(index === list.length - 1)}>
            下一题 →
          </button>
        </div>
      </div>
    </div>
  );
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: disabled ? 'transparent' : 'var(--card)',
    color: disabled ? 'var(--text-tertiary)' : 'var(--text)',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '13px',
  };
}
