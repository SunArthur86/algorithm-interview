'use client';

export type DifficultyFilter = 'all' | 'Easy' | 'Medium' | 'Hard';
export type SortOrder = 'default' | 'easy-first' | 'hard-first' | 'plan';

interface Props {
  difficulty: DifficultyFilter;
  onDifficulty: (d: DifficultyFilter) => void;
  sort: SortOrder;
  onSort: (s: SortOrder) => void;
  onlyFav: boolean;
  onToggleFav: () => void;
}

const DIFFS: DifficultyFilter[] = ['all', 'Easy', 'Medium', 'Hard'];
const SORTS: { key: SortOrder; label: string }[] = [
  { key: 'plan', label: '计划顺序' },
  { key: 'default', label: '题号' },
  { key: 'easy-first', label: '易→难' },
  { key: 'hard-first', label: '难→易' },
];

export default function FilterBar({ difficulty, onDifficulty, sort, onSort, onlyFav, onToggleFav }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {DIFFS.map((d) => (
          <button
            key={d}
            onClick={() => onDifficulty(d)}
            style={pill(difficulty === d)}
          >
            {d === 'all' ? '全部难度' : d}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortOrder)}
        style={{
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--text)',
          fontSize: '13px',
        }}
      >
        {SORTS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
      <button onClick={onToggleFav} style={pill(onlyFav)}>
        {onlyFav ? '★ 仅收藏' : '☆ 收藏'}
      </button>
    </div>
  );
}

function pill(on: boolean): React.CSSProperties {
  return {
    padding: '5px 12px',
    borderRadius: '999px',
    border: '1px solid ' + (on ? 'var(--primary)' : 'var(--border)'),
    background: on ? 'var(--primary-soft)' : 'var(--card)',
    color: on ? 'var(--primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
  };
}
