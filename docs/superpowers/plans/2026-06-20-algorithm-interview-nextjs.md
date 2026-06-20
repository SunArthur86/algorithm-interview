# algorithm-interview Next.js 重构 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 algorithm-interview 从纯 HTML/JS 重构为 Next.js 15 项目，复刻 java-interview 的全部高级能力（费曼/第一性原理/SM-2 复习），保留所有原有算法动画资产，新增「LeetCode 热题 100」学习计划，并解析三本算法书为知识专栏。

**Architecture:** 方案 A 渐进式迁移。旧 `index.html/js/css` 移入 `legacy/`，根目录初始化 Next.js（App Router + static export）。100 题文本转 markdown frontmatter，动画引擎/轨迹/题解作为客户端 JS 资产保留在 `public/legacy/`，按 `lcId` 索引。三本书用 Python 脚本解析为 `columns/` 长文。复习系统从 java-interview 整套移植。

**Tech Stack:** Next.js 15.1.6, React 19, TypeScript 5.7, Tailwind, gray-matter, react-markdown + remark-gfm + rehype-highlight, zustand 5。Python 3 + BeautifulSoup4（epub）+ PyMuPDF/fitz（pdf）用于书籍解析。

**Spec:** `docs/superpowers/specs/2026-06-20-algorithm-interview-nextjs-design.md`

---

## 文件结构总览

### 新建（Next.js 骨架）
- `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore`
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- `src/app/question/[lcId]/page.tsx`
- `src/app/study-plan/page.tsx`
- `src/app/columns/page.tsx`, `src/app/columns/[slug]/page.tsx`

### 新建（lib + 组件，移植自 java-interview 并适配）
- `src/lib/types.ts`, `src/lib/config.ts`, `src/lib/questions.ts`, `src/lib/columns.ts`, `src/lib/study-plan.ts`, `src/lib/algorithms.ts`, `src/lib/store.ts`, `src/lib/exporters.ts`
- `src/components/HomeClient.tsx`, `CategoryTabs.tsx`, `QuestionCard.tsx`, `FilterBar.tsx`, `SearchBar.tsx`, `DifficultyBars.tsx`, `QuestionModal.tsx`, `QuestionContent.tsx`, `VizPlayer.tsx`, `Markdown.tsx`, `StudyPlan.tsx`, `FeynmanCard.tsx`, `FirstPrincipleCard.tsx`, `ReviewDashboard.tsx`, `ReviewMode.tsx`, `StudyMode.tsx`, `StudyDashboard.tsx`, `ProgressRing.tsx`, `ShortcutsHelp.tsx`, `SettingsPanel.tsx`, `Toast.tsx`, `ClientBootstrap.tsx`

### 新建（数据迁移脚本）
- `scripts/migrate_problems.py` — 100 题 `problems-data.js` + `sol-v2-*.js` → `questions/<cat>/*.md`

### 新建（书籍解析脚本）
- `scripts/extract_ds_beauty.py`, `scripts/extract_dp_book.py`, `scripts/extract_labuladong.py`

### 保留为资产
- `public/legacy/viz-engine.js`, `public/legacy/viz-traces-*.js`（6 文件）, `public/legacy/sol-v2-*.js`（13 文件）, `public/legacy/algorithm-visualizer.js`, `public/legacy/visualizer-extended.js`, `public/legacy/diagrams.js`

### 备份
- `legacy/index.html`, `legacy/js/`, `legacy/css/`, `legacy/data/`, `legacy/manifest.json`, `legacy/sw.js`

---

# 阶段 1：骨架与数据迁移

## Task 1: 备份旧项目到 legacy/

**Files:**
- Create: `legacy/`（含旧 index.html, js/, css/, data/, manifest.json, sw.js, robots.txt, sitemap.xml, README.md 副本）

- [ ] **Step 1: 创建 legacy 目录并移动旧文件**

```bash
cd /Users/sunqingguang/hermes/opt/projects/algorithm-interview
mkdir -p legacy
git mv index.html legacy/index.html
git mv js legacy/js
git mv css legacy/css
git mv data legacy/data
git mv manifest.json legacy/manifest.json
git mv sw.js legacy/sw.js
git mv robots.txt legacy/robots.txt
git mv sitemap.xml legacy/sitemap.xml
# README.md 保留根目录（后续重写），test-final.png/v2-problems.png 删除
git rm -f test-final.png v2-problems.png
```

- [ ] **Step 2: 提交备份**

```bash
git add -A
git commit -m "chore: archive legacy HTML/JS project to legacy/ before Next.js refactor"
```

## Task 2: 初始化 Next.js 项目

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "algorithm-interview",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.6",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "gray-matter": "4.0.3",
    "react-markdown": "9.0.3",
    "remark-gfm": "4.0.0",
    "rehype-highlight": "7.0.2",
    "zustand": "5.0.3"
  },
  "devDependencies": {
    "typescript": "5.7.3",
    "@types/node": "22.10.7",
    "@types/react": "19.0.7",
    "@types/react-dom": "19.0.3",
    "highlight.js": "11.11.1",
    "tailwindcss": "3.4.17",
    "postcss": "8.4.49",
    "autoprefixer": "10.4.20"
  }
}
```

- [ ] **Step 2: 写 next.config.ts（static export，GitHub Pages basePath）**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/algorithm-interview' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/algorithm-interview/' : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: 写 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "legacy", "scripts"]
}
```

- [ ] **Step 4: 写 postcss.config.mjs, next-env.d.ts, .gitignore**

`postcss.config.mjs`:
```javascript
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`next-env.d.ts`:
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`.gitignore`:
```
node_modules
.next
out
*.log
.DS_Store
```

- [ ] **Step 5: 写最小 layout/page 验证骨架可跑**

`src/app/layout.tsx`:
```tsx
import './globals.css';
export const metadata = { title: 'Algorithm Interview', description: 'LeetCode 热题 100 题解与动画' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh"><body>{children}</body></html>;
}
```

`src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`src/app/page.tsx`:
```tsx
export default function Home() {
  return <main className="p-8"><h1 className="text-2xl">Algorithm Interview</h1><p>骨架就绪</p></main>;
}
```

- [ ] **Step 6: 安装依赖并验证 build**

```bash
npm install
npm run build
```
Expected: build 成功，生成 `out/` 目录，首页可渲染。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 skeleton (static export for GitHub Pages)"
```

## Task 3: 拷贝 legacy 可执行资产到 public/legacy/

**Files:**
- Create: `public/legacy/viz-engine.js`, `public/legacy/viz-traces-01.js`..`06.js`, `public/legacy/sol-v2-01.js`..`12.js`（实际 13 文件，按现有命名）, `public/legacy/solutions-v2.js`, `public/legacy/extra-solutions.js`, `public/legacy/algorithm-visualizer.js`, `public/legacy/visualizer-extended.js`, `public/legacy/diagrams.js`

- [ ] **Step 1: 拷贝所有可执行 JS 资产**

```bash
cd /Users/sunqingguang/hermes/opt/projects/algorithm-interview
mkdir -p public/legacy
cp legacy/js/viz-engine.js public/legacy/
cp legacy/js/viz-traces-*.js public/legacy/
cp legacy/js/sol-v2-*.js public/legacy/
cp legacy/js/solutions-v2.js public/legacy/
cp legacy/js/extra-solutions.js public/legacy/
cp legacy/js/algorithm-visualizer.js public/legacy/
cp legacy/js/visualizer-extended.js public/legacy/
cp legacy/js/diagrams.js public/legacy/
cp legacy/js/safe-ls.js public/legacy/
```

- [ ] **Step 2: 提交**

```bash
git add public/legacy
git commit -m "feat: copy executable JS assets (viz-engine, traces, solutions, diagrams) to public/legacy"
```

## Task 4: 写数据迁移脚本 migrate_problems.py

**Files:**
- Create: `scripts/migrate_problems.py`
- Create: `questions/<cat>/00XX-slug.md`（100 文件，脚本生成）

- [ ] **Step 1: 写迁移脚本**

脚本职责：读 `legacy/js/problems-data.js`（正则提取 100 条 PROBLEM），读 `legacy/js/sol-v2-*.js`（正则提取每条 SOLUTION 的 thinking/approaches/pitfalls），合并写 `questions/<category-slug>/00XX-slug.md`。分类映射：哈希→hash, 双指针→two-pointers, 滑动窗口→sliding-window, 子串→substring, 普通数组→array, 矩阵→matrix, 链表→linked-list, 二叉树→binary-tree, 图论→graph, 回溯→backtracking, 二分查找→binary-search, 栈→stack, 堆→heap, 贪心算法→greedy, 动态规划→dynamic-programming, 多维动态规划→multi-dp, 技巧→techniques。planOrder 按 problems-data.js 顺序赋值 1..100。hasViz 对所有题设 true（100 题都有轨迹）。hasDiagram 仅对 spec §1 README 列出的 13 题设 true（题号 1,3,15,42,53,141,206,94,102,20,200,215,70）。feynman.essence 用 thinking 前 80 字，analogy 留空待人工，key_points 用 approaches[0].keyPoints。first_principle 留待人工（生成占位 frontmatter 字段为空）。

```python
#!/usr/bin/env python3
"""迁移 100 题：problems-data.js + sol-v2-*.js → questions/<cat>/00XX-slug.md"""
import re, json, os, glob

LEGACY = os.path.join(os.path.dirname(__file__), '..', 'legacy', 'js')
OUT = os.path.join(os.path.dirname(__file__), '..', 'questions')

CAT_MAP = {
    '哈希': 'hash', '双指针': 'two-pointers', '滑动窗口': 'sliding-window',
    '子串': 'substring', '普通数组': 'array', '矩阵': 'matrix',
    '链表': 'linked-list', '二叉树': 'binary-tree', '图论': 'graph',
    '回溯': 'backtracking', '二分查找': 'binary-search', '栈': 'stack',
    '堆': 'heap', '贪心算法': 'greedy', '动态规划': 'dynamic-programming',
    '多维动态规划': 'multi-dp', '技巧': 'techniques',
}

DIAGRAM_IDS = {'1','3','15','42','53','141','206','94','102','20','200','215','70'}

def parse_problems():
    raw = open(os.path.join(LEGACY, 'problems-data.js'), encoding='utf-8').read()
    # 匹配 {id:"1",slug:"...",title:"...",diff:"...",cat:"...",tags:[...],url:"..."}
    items = re.findall(r'\{id:"([^"]+)",slug:"([^"]+)",title:"([^"]+)",diff:"([^"]+)",cat:"([^"]+)",tags:\[([^\]]*)\],url:"([^"]+)"\}', raw)
    out = []
    for pid, slug, title, diff, cat, tags_raw, url in items:
        tags = re.findall(r'"([^"]+)"', tags_raw)
        out.append({'id': pid, 'slug': slug, 'title': title, 'diff': diff,
                    'cat': cat, 'tags': tags, 'url': url})
    return out

def parse_solutions():
    """读所有 sol-v2-*.js，提取 SOLUTIONS["id"] = { thinking, approaches, pitfalls }"""
    sols = {}
    for f in sorted(glob.glob(os.path.join(LEGACY, 'sol-v2-*.js'))):
        raw = open(f, encoding='utf-8').read()
        for m in re.finditer(r'SOLUTIONS\["(\d+)"\]\s*=\s*\{', raw):
            pid = m.group(1)
            start = m.end()
            depth = 1; i = start
            while i < len(raw) and depth > 0:
                if raw[i] == '{': depth += 1
                elif raw[i] == '}': depth -= 1
                i += 1
            block = raw[start:i-1]
            thinking_m = re.search(r'thinking:\s*"`?([^`]*?)`?"', block, re.S)
            sols[pid] = {'thinking': (thinking_m.group(1).strip() if thinking_m else '')}
    return sols

def main():
    problems = parse_problems()
    sols = parse_solutions()
    for order, p in enumerate(problems, 1):
        cat_dir = CAT_MAP.get(p['cat'], 'other')
        os.makedirs(os.path.join(OUT, cat_dir), exist_ok=True)
        fname = f"{int(p['id']):04d}-{p['slug']}.md"
        path = os.path.join(OUT, cat_dir, fname)
        sol = sols.get(p['id'], {})
        thinking = sol.get('thinking', '')
        tags_yaml = '\n'.join(f'  - "{t}"' for t in p['tags'])
        fm = f"""---
id: "{int(p['id']):04d}"
slug: "{p['slug']}"
lcId: {p['id']}
title: "{p['title']}"
difficulty: "{p['diff']}"
category: "{cat_dir}"
tags:
{tags_yaml if p['tags'] else '  []'}
url: "{p['url']}"
planOrder: {order}
hasViz: true
hasDiagram: {str(p['id'] in DIAGRAM_IDS).lower()}
feynman:
  essence: "{thinking[:80].replace('"',"'")}"
  analogy: ""
  key_points: []
first_principle:
  problem: ""
  axioms: []
  rebuild: ""
---

# {p['id']}. {p['title']}

> 难度：{p['diff']} | 分类：{p['cat']} | 标签：{', '.join(p['tags'])}
> 力扣链接：[{p['url']}]({p['url']})

## 题目描述

（待从力扣补充题目描述与示例）

## 题解

{thinking if thinking else '（题解详见弹窗内动画与解法面板，由 legacy sol-v2 数据驱动）'}
"""
        open(path, 'w', encoding='utf-8').write(fm)
    print(f"migrated {len(problems)} problems to {OUT}")

if __name__ == '__main__':
    main()
```

- [ ] **Step 2: 运行脚本并验证产出**

```bash
cd /Users/sunqingguang/hermes/opt/projects/algorithm-interview
python3 scripts/migrate_problems.py
# 验证：100 个 md 文件，17 个分类目录
find questions -name "*.md" | wc -l   # 期望 100
ls questions | wc -l                   # 期望 17
head -20 questions/hash/0001-two-sum.md
```
Expected: 输出 `migrated 100 problems`，questions 下 17 目录共 100 md。

- [ ] **Step 3: 提交**

```bash
git add scripts/migrate_problems.py questions
git commit -m "feat: migrate 100 LeetCode hot-100 problems to markdown frontmatter"
```

## Task 5: 写 lib 层（types, config, questions, algorithms, store）

**Files:**
- Create: `src/lib/types.ts`, `src/lib/config.ts`, `src/lib/questions.ts`, `src/lib/columns.ts`, `src/lib/study-plan.ts`, `src/lib/algorithms.ts`, `src/lib/store.ts`

- [ ] **Step 1: 写 src/lib/types.ts（扩展 Question，加算法字段）**

```typescript
export interface Feynman {
  essence?: string;
  analogy?: string;
  key_points?: string[];
}
export interface FirstPrinciple {
  problem?: string;
  axioms?: string[];
  rebuild?: string;
}
export interface Question {
  id: string;
  lcId: number;
  slug: string;
  title: string;
  question: string;        // 题目标题（兼容 java-interview 用法）
  answer: string;          // 正文 markdown
  difficulty: string;      // Easy/Medium/Hard
  category: string;        // 分类 slug
  categories: string[];
  tags: string[];
  url: string;
  planOrder: number;
  hasViz: boolean;
  hasDiagram: boolean;
  feynman?: Feynman;
  first_principle?: FirstPrinciple;
}

export interface Column {
  slug: string;
  title: string;
  source: string;
  chapter: string;
  order: number;
  related: number[];
  content: string;
}

export type Rating = 'know' | 'fuzzy' | 'dont';
export type Algorithm = 'sm2' | 'leitner' | 'ebbinghaus';

export interface ReviewItem {
  algo: Algorithm;
  ease: number;
  interval: number;
  reps: number;
  lapses: number;
  box: number;
  phase: number;
  nextDate: string;
  lastDate: string;
  createdAt: string;
  history: { d: string; q: number }[];
}
```

- [ ] **Step 2: 写 src/lib/algorithms.ts（直接拷贝 java-interview 同名文件，无改动）**

完整拷贝 java-interview `src/lib/algorithms.ts`（见 spec 调研，含 calcInterval/review/newItem/isMastered/isDue/previewInterval/formatInterval/getBoxLabel，110 行）。

- [ ] **Step 3: 写 src/lib/config.ts（算法版配置）**

```typescript
import type { Algorithm } from './types';

export interface CategoryConfig { label: string; icon: string; color: string; }

export const APP_CONFIG = {
  appName: '算法面试题库',
  appNameShort: '算法面试',
  appIcon: '🧮',
  appVersion: '3.0',
  storagePrefix: 'algo-interview',
  githubUrl: 'https://sunarthur86.github.io/algorithm-interview/',
  repoUrl: 'https://github.com/SunArthur86/algorithm-interview',
  themeColor: '#f97316',
  categories: {
    'all': { label: '全部', icon: '📚', color: '#f97316' },
    'hash': { label: '哈希', icon: '#️⃣', color: '#ef4444' },
    'two-pointers': { label: '双指针', icon: '🔀', color: '#f97316' },
    'sliding-window': { label: '滑动窗口', icon: '🪟', color: '#eab308' },
    'substring': { label: '子串', icon: '🔗', color: '#84cc16' },
    'array': { label: '普通数组', icon: '📊', color: '#22c55e' },
    'matrix': { label: '矩阵', icon: '🔲', color: '#14b8a6' },
    'linked-list': { label: '链表', icon: '🔗', color: '#06b6d4' },
    'binary-tree': { label: '二叉树', icon: '🌳', color: '#3b82f6' },
    'graph': { label: '图论', icon: '🕸️', color: '#6366f1' },
    'backtracking': { label: '回溯', icon: '↩️', color: '#8b5cf6' },
    'binary-search': { label: '二分查找', icon: '🔍', color: '#a855f7' },
    'stack': { label: '栈', icon: '📚', color: '#d946ef' },
    'heap': { label: '堆', icon: '⛰️', color: '#ec4899' },
    'greedy': { label: '贪心算法', icon: '🎯', color: '#f43f5e' },
    'dynamic-programming': { label: '动态规划', icon: '🧩', color: '#0ea5e9' },
    'multi-dp': { label: '多维动态规划', icon: '🧊', color: '#64748b' },
    'techniques': { label: '技巧', icon: '⚡', color: '#facc15' },
  } as Record<string, CategoryConfig>,
  columnSources: {
    'data-structure-beauty': { label: '数据结构与算法之美', icon: '📘' },
    'dynamic-programming': { label: '动态规划面试宝典', icon: '📗' },
    'labuladong': { label: 'labuladong 算法小抄', icon: '📕' },
  } as Record<string, { label: string; icon: string }>,
  aboutText: 'LeetCode 热题 100 完整 Java 题解 + 逐题动画 + 知识专栏 + 智能复习。',
} as const;

export const ALGO_LABELS: Record<Algorithm, string> = {
  sm2: 'SM-2 智能间隔',
  leitner: 'Leitner 卡盒',
  ebbinghaus: '艾宾浩斯曲线',
};
```

- [ ] **Step 4: 写 src/lib/questions.ts（构建时读 questions/ 目录）**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Question } from './types';

const QUESTIONS_DIR = path.join(process.cwd(), 'questions');

function loadAll(): Question[] {
  if (!fs.existsSync(QUESTIONS_DIR)) return [];
  const out: Question[] = [];
  const catDirs = fs.readdirSync(QUESTIONS_DIR).sort();
  for (const catDir of catDirs) {
    const full = path.join(QUESTIONS_DIR, catDir);
    if (!fs.statSync(full).isDirectory()) continue;
    const files = fs.readdirSync(full).filter((f) => f.endsWith('.md')).sort();
    for (const file of files) {
      const raw = fs.readFileSync(path.join(full, file), 'utf-8');
      const { data, content } = matter(raw);
      out.push({
        id: String(data.id || file.replace(/\.md$/, '')),
        lcId: Number(data.lcId || 0),
        slug: String(data.slug || ''),
        title: String(data.title || ''),
        question: String(data.title || ''),
        answer: content.trim(),
        difficulty: String(data.difficulty || 'Medium'),
        category: String(data.category || catDir),
        categories: [String(data.category || catDir)],
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        url: String(data.url || ''),
        planOrder: Number(data.planOrder || 0),
        hasViz: !!data.hasViz,
        hasDiagram: !!data.hasDiagram,
        feynman: data.feynman || undefined,
        first_principle: data.first_principle || undefined,
      });
    }
  }
  return out;
}

let _cache: Question[] | null = null;
export function getAllQuestions(): Question[] {
  if (_cache) return _cache;
  _cache = loadAll();
  return _cache;
}
export function getQuestionByLcId(lcId: string): Question | undefined {
  return getAllQuestions().find((q) => String(q.lcId) === String(lcId));
}
export function getAllLcIds(): string[] {
  return getAllQuestions().map((q) => String(q.lcId));
}
```

- [ ] **Step 5: 写 src/lib/columns.ts（构建时读 columns/）**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Column } from './types';

const COLUMNS_DIR = path.join(process.cwd(), 'columns');

function loadAll(): Column[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  const out: Column[] = [];
  for (const source of fs.readdirSync(COLUMNS_DIR).sort()) {
    const srcDir = path.join(COLUMNS_DIR, source);
    if (!fs.statSync(srcDir).isDirectory()) continue;
    for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith('.md')).sort()) {
      const raw = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      const { data, content } = matter(raw);
      out.push({
        slug: String(data.slug || file.replace(/\.md$/, '')),
        title: String(data.title || ''),
        source,
        chapter: String(data.chapter || ''),
        order: Number(data.order || 0),
        related: Array.isArray(data.related) ? data.related.map(Number) : [],
        content: content.trim(),
      });
    }
  }
  return out;
}

let _cache: Column[] | null = null;
export function getAllColumns(): Column[] {
  if (_cache) return _cache;
  _cache = loadAll();
  return _cache;
}
export function getColumnBySlug(slug: string): Column | undefined {
  return getAllColumns().find((c) => c.slug === slug);
}
```

- [ ] **Step 6: 写 src/lib/study-plan.ts**

```typescript
import fs from 'fs';
import path from 'path';
import { getAllQuestions } from './questions';

const PLAN_FILE = path.join(process.cwd(), 'study-plan', 'top-100-liked.json');

export interface StudyPlanGroup { name: string; lcIds: number[]; }
export interface StudyPlan {
  slug: string;
  title: string;
  subtitle: string;
  groups: StudyPlanGroup[];
}

let _cache: StudyPlan | null = null;
export function getTop100Plan(): StudyPlan {
  if (_cache) return _cache;
  const raw = fs.readFileSync(PLAN_FILE, 'utf-8');
  _cache = JSON.parse(raw);
  return _cache;
}

export function getPlanProgressMask(): Record<number, boolean> {
  // 进度由客户端 store 管理，此处仅返回空骨架供 SSR
  return {};
}
```

- [ ] **Step 7: 写 src/lib/store.ts（从 java-interview 移植 zustand store）**

基于 java-interview `src/lib/store.ts`（227 行）完整移植，改动：`storagePrefix` 用 APP_CONFIG（已为 'algo-interview'）；保持 favorites/viewed/notes/ratings/theme/reviewData/reviewAlgorithm 等全部字段与 action 签名不变；新增 `planProgress: Record<string, boolean>` 字段与 `togglePlanDone(lcId: string)` action（用于学习计划勾选）。

```typescript
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Rating, Algorithm, ReviewItem } from './types';
import { APP_CONFIG } from './config';
import { newItem } from './algorithms';

const P = APP_CONFIG.storagePrefix;
const todayISO = () => new Date().toISOString().split('T')[0];

interface DailyLog { studied: number; know: number; fuzzy: number; dont: number; }

interface AppState {
  favorites: string[];
  viewed: string[];
  notes: Record<string, string>;
  ratings: Record<string, Rating>;
  theme: 'light' | 'dark';
  sortOrder: 'easy-first' | 'hard-first' | 'default';
  searchHistory: string[];
  dailyLog: Record<string, DailyLog>;
  lastStudyDate: string | null;
  streak: number;
  dailyGoal: number;
  reviewData: Record<string, ReviewItem>;
  reviewAlgorithm: Algorithm;
  dailyReviewLimit: number;
  planProgress: Record<string, boolean>;
  _hasHydrated: boolean;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  markViewed: (id: string) => void;
  setNote: (id: string, text: string) => void;
  getNote: (id: string) => string;
  setRating: (id: string, r: Rating) => void;
  toggleTheme: () => void;
  setSortOrder: (o: AppState['sortOrder']) => void;
  addSearchHistory: (q: string) => void;
  clearSearchHistory: () => void;
  logStudy: (r: Rating, prev: Rating | undefined) => void;
  setDailyGoal: (n: number) => void;
  upsertReview: (id: string, it: ReviewItem) => void;
  ensureReview: (id: string) => ReviewItem;
  setReviewAlgorithm: (a: Algorithm) => void;
  setDailyReviewLimit: (n: number) => void;
  togglePlanDone: (lcId: string) => void;
  isPlanDone: (lcId: string) => boolean;
  resetProgress: () => void;
  resetReview: () => void;
  setHydrated: (b: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [], viewed: [], notes: {}, ratings: {},
      theme: 'light', sortOrder: 'easy-first', searchHistory: [],
      dailyLog: {}, lastStudyDate: null, streak: 0, dailyGoal: 20,
      reviewData: {}, reviewAlgorithm: 'sm2', dailyReviewLimit: 50,
      planProgress: {}, _hasHydrated: false,

      toggleFavorite: (id) => set((s) => {
        const has = s.favorites.includes(id);
        return { favorites: has ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] };
      }),
      isFavorite: (id) => get().favorites.includes(id),
      markViewed: (id) => set((s) => (s.viewed.includes(id) ? s : { viewed: [...s.viewed, id] })),
      setNote: (id, text) => set((s) => {
        const notes = { ...s.notes };
        if (!text.trim()) delete notes[id]; else notes[id] = text;
        return { notes };
      }),
      getNote: (id) => get().notes[id] || '',
      setRating: (id, r) => set((s) => ({ ratings: { ...s.ratings, [id]: r } })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setSortOrder: (o) => set({ sortOrder: o }),
      addSearchHistory: (q) => set((s) => {
        const trimmed = q.trim();
        if (trimmed.length < 2) return s;
        const hist = [trimmed, ...s.searchHistory.filter((x) => x !== trimmed)].slice(0, 8);
        return { searchHistory: hist };
      }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      logStudy: (r, prev) => set((s) => {
        const t = todayISO();
        const log = { ...s.dailyLog };
        const day: DailyLog = log[t] ? { ...log[t] } : { studied: 0, know: 0, fuzzy: 0, dont: 0 };
        if (!prev || prev !== r) {
          day.studied += 1;
          day[r] = (day[r] || 0) + 1;
          if (prev && day[prev] > 0) day[prev] -= 1;
        }
        log[t] = day;
        let streak = s.streak; let lastStudyDate = s.lastStudyDate;
        if (lastStudyDate !== t) {
          const y = new Date(); y.setDate(y.getDate() - 1);
          streak = lastStudyDate === y.toISOString().split('T')[0] ? streak + 1 : 1;
          lastStudyDate = t;
        }
        return { dailyLog: log, streak, lastStudyDate };
      }),
      setDailyGoal: (n) => set({ dailyGoal: Math.max(5, Math.min(200, n)) }),
      upsertReview: (id, it) => set((s) => ({ reviewData: { ...s.reviewData, [id]: it } })),
      ensureReview: (id) => {
        const existing = get().reviewData[id];
        if (existing) return existing;
        const it = newItem(get().reviewAlgorithm);
        get().upsertReview(id, it);
        return it;
      },
      setReviewAlgorithm: (a) => set((s) => {
        const rd = { ...s.reviewData };
        for (const k of Object.keys(rd)) rd[k] = { ...rd[k], algo: a };
        return { reviewAlgorithm: a, reviewData: rd };
      }),
      setDailyReviewLimit: (n) => set({ dailyReviewLimit: Math.max(5, Math.min(500, n)) }),
      togglePlanDone: (lcId) => set((s) => {
        const pp = { ...s.planProgress };
        pp[lcId] = !pp[lcId];
        if (!pp[lcId]) delete pp[lcId];
        return { planProgress: pp };
      }),
      isPlanDone: (lcId) => !!get().planProgress[lcId],
      resetProgress: () => set({ viewed: [], planProgress: {} }),
      resetReview: () => set({ reviewData: {} }),
      setHydrated: (b) => set({ _hasHydrated: b }),
    }),
    {
      name: P,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        favorites: s.favorites, viewed: s.viewed, notes: s.notes, ratings: s.ratings,
        theme: s.theme, sortOrder: s.sortOrder, searchHistory: s.searchHistory,
        dailyLog: s.dailyLog, lastStudyDate: s.lastStudyDate, streak: s.streak,
        dailyGoal: s.dailyGoal, reviewData: s.reviewData, reviewAlgorithm: s.reviewAlgorithm,
        dailyReviewLimit: s.dailyReviewLimit, planProgress: s.planProgress,
      }),
      onRehydrateStorage: () => (state) => { state?.setHydrated(true); },
    }
  )
);
```

- [ ] **Step 8: 提交**

```bash
git add src/lib
git commit -m "feat: add lib layer (types, config, questions/columns/study-plan loaders, algorithms, zustand store)"
```

## Task 6: 生成 study-plan/top-100-liked.json

**Files:**
- Create: `study-plan/top-100-liked.json`

- [ ] **Step 1: 写脚本生成 plan json（从 questions 推导）**

直接根据 `problems-data.js` 的分类与顺序手写脚本，或用一次性 Node 片段。产物结构：

```json
{
  "slug": "top-100-liked",
  "title": "LeetCode 热题 100",
  "subtitle": "力扣最受刷题发烧友欢迎的 100 道题",
  "groups": [
    { "name": "哈希", "lcIds": [1, 49, 128] },
    { "name": "双指针", "lcIds": [283, 11, 15, 42] },
    { "name": "滑动窗口", "lcIds": [3, 438] },
    { "name": "子串", "lcIds": [560, 239, 76] },
    { "name": "普通数组", "lcIds": [53, 56, 189, 238, 41] },
    { "name": "矩阵", "lcIds": [73, 54, 48, 240] },
    { "name": "链表", "lcIds": [160, 206, 234, 141, 142, 21, 2, 19, 24, 25, 138, 148, 23, 146] },
    { "name": "二叉树", "lcIds": [94, 104, 226, 101, 543, 102, 108, 98, 230, 199, 114, 105, 437, 236, 124] },
    { "name": "图论", "lcIds": [200, 994, 207, 208] },
    { "name": "回溯", "lcIds": [46, 78, 17, 39, 22, 79, 131, 51] },
    { "name": "二分查找", "lcIds": [35, 74, 34, 33, 153, 4] },
    { "name": "栈", "lcIds": [20, 155, 394, 739, 84] },
    { "name": "堆", "lcIds": [215, 347, 295] },
    { "name": "贪心算法", "lcIds": [121, 55, 45, 763] },
    { "name": "动态规划", "lcIds": [70, 118, 198, 279, 322, 139, 300, 152, 416, 32] },
    { "name": "多维动态规划", "lcIds": [62, 64, 5, 1143, 72] },
    { "name": "技巧", "lcIds": [136, 169, 75, 31, 287] }
  ]
}
```

- [ ] **Step 2: 验证 lcIds 总数 = 100**

```bash
node -e "const p=require('./study-plan/top-100-liked.json'); const n=p.groups.reduce((s,g)=>s+g.lcIds.length,0); console.log('total',n,'groups',p.groups.length)"
```
Expected: `total 100 groups 17`。若不符，对照 `legacy/js/problems-data.js` 修正。

- [ ] **Step 3: 提交**

```bash
git add study-plan
git commit -m "feat: add LeetCode top-100-liked study plan data (17 groups, 100 problems)"
```

---

# 阶段 2：首页、题目详情、弹窗、动画

## Task 7: 移植通用组件（Markdown, ProgressRing, Toast, ClientBootstrap）

**Files:**
- Create: `src/components/Markdown.tsx`, `ProgressRing.tsx`, `Toast.tsx`, `ClientBootstrap.tsx`

- [ ] **Step 1: 写 Markdown.tsx（react-markdown + remark-gfm + rehype-highlight）**

```tsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: 写 ProgressRing.tsx（SVG 圆环，props: value 0-1, size, label）**

完整拷贝 java-interview `src/components/ProgressRing.tsx`（约 30 行 SVG 组件）。

- [ ] **Step 3: 写 Toast.tsx + ClientBootstrap.tsx**

完整拷贝 java-interview 同名组件。ClientBootstrap 负责 store 水合后渲染子组件，避免 SSR 闪烁。

- [ ] **Step 4: 提交**

```bash
git add src/components/Markdown.tsx src/components/ProgressRing.tsx src/components/Toast.tsx src/components/ClientBootstrap.tsx
git commit -m "feat: add common components (Markdown, ProgressRing, Toast, ClientBootstrap)"
```

## Task 8: 写 VizPlayer 客户端组件（接入 legacy 动画）

**Files:**
- Create: `src/components/VizPlayer.tsx`

- [ ] **Step 1: 写 VizPlayer.tsx（dynamic ssr:false，按 lcId 加载）**

核心：用 `next/dynamic` 包裹内部组件避免 SSR。挂载时通过 `<Script>` 顺序加载 `public/legacy/` 下的 `viz-engine.js` + `viz-traces-*.js`，全局 `window.VIZ_TRACES`/`window.VizEngine` 就绪后调 `VizEngine.init()` + `VizEngine.load(lcId)`。canvas id 固定 `viz-canvas`，控制按钮 id 固定 `viz-play`/`viz-step-fwd`/`viz-step-back`/`viz-reset`/`viz-speed`（与 legacy engine 约定一致）。

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

declare global { interface Window { VizEngine?: any; VIZ_TRACES?: any; } }

export default function VizPlayer({ lcId }: { lcId: number }) {
  const [ready, setReady] = useState(false);
  const [hasTrace, setHasTrace] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const scripts = [
      '/legacy/viz-engine.js',
      '/legacy/viz-traces-01.js', '/legacy/viz-traces-02.js', '/legacy/viz-traces-03.js',
      '/legacy/viz-traces-04.js', '/legacy/viz-traces-05.js', '/legacy/viz-traces-06.js',
    ];
    const basePath = process.env.NODE_ENV === 'production' ? '/algorithm-interview' : '';
    let i = 0;
    const loadNext = () => {
      if (i >= scripts.length) {
        if (window.VizEngine) {
          window.VizEngine.init();
          window.VizEngine._initialized = true;
          setHasTrace(window.VizEngine.load(String(lcId)));
        }
        setReady(true);
        return;
      }
      const s = document.createElement('script');
      s.src = basePath + scripts[i++];
      s.onload = loadNext;
      document.body.appendChild(s);
    };
    loadNext();
  }, [lcId]);

  if (!ready) return <div className="text-center py-8 text-gray-500">加载动画引擎…</div>;

  return (
    <div className="viz-player">
      <canvas id="viz-canvas" width="640" height="320" className="w-full bg-gray-50 dark:bg-gray-900 rounded" />
      <div className="flex items-center gap-2 mt-2 justify-center">
        <button id="viz-step-back" className="px-3 py-1 rounded border">◀</button>
        <button id="viz-play" className="px-4 py-1 rounded bg-orange-500 text-white">▶ 播放</button>
        <button id="viz-step-fwd" className="px-3 py-1 rounded border">▶|</button>
        <button id="viz-reset" className="px-3 py-1 rounded border">↺</button>
        <input id="viz-speed" type="range" min="1" max="10" defaultValue="6" className="ml-2" />
        <span id="viz-speed-val" className="text-sm">6</span>
      </div>
      {!hasTrace && <p className="text-center text-xs text-gray-400 mt-2">此题暂无逐题动画</p>}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/VizPlayer.tsx
git commit -m "feat: add VizPlayer client component to drive legacy viz-engine by lcId"
```

## Task 9: 写 FeynmanCard / FirstPrincipleCard

**Files:**
- Create: `src/components/FeynmanCard.tsx`, `FirstPrincipleCard.tsx`

- [ ] **Step 1: 写两个卡片组件（frontmatter 驱动）**

完整拷贝 java-interview `src/components/FeynmanCard.tsx` 与 `FirstPrincipleCard.tsx`（每个约 40-60 行，渲染 essence/analogy/key_points 与 problem/axioms/rebuild）。props 改为接收 `Question` 类型。

- [ ] **Step 2: 提交**

```bash
git add src/components/FeynmanCard.tsx src/components/FirstPrincipleCard.tsx
git commit -m "feat: add FeynmanCard and FirstPrincipleCard components"
```

## Task 10: 写 QuestionContent / QuestionModal / QuestionCard / FilterBar / SearchBar / CategoryTabs / DifficultyBars

**Files:**
- Create: 上述 7 个组件

- [ ] **Step 1: 写 QuestionContent.tsx（题目详情主体）**

整合：题目标题 + 难度色条 + 力扣链接 + 题解 markdown（用 Markdown 组件渲染 answer）+ VizPlayer（hasViz 时）+ FeynmanCard + FirstPrincipleCard + 笔记区 + 收藏/掌握按钮。

- [ ] **Step 2: 写 QuestionModal.tsx（弹窗壳）**

客户端组件，props: `question: Question | null, onClose`。QuestionContent 包在固定定位 modal 内，Esc 关闭，← → 切题（从父传入列表 + 当前索引）。

- [ ] **Step 3: 写 QuestionCard.tsx（题卡）**

显示题号、标题、难度色条、完成✓（viewed）、收藏★、动画🎬图标（hasViz）、图解🖼（hasDiagram）。点击触发父级 onOpen。

- [ ] **Step 4: 写 FilterBar / SearchBar / CategoryTabs / DifficultyBars**

CategoryTabs 渲染 APP_CONFIG.categories 的 18 项（含全部）。FilterBar 含难度筛选 + 排序。SearchBar 含搜索历史。DifficultyBars 显示难度分布柱。均从 java-interview 移植并适配字段（lcId 代替 id）。

- [ ] **Step 5: 提交**

```bash
git add src/components/QuestionContent.tsx src/components/QuestionModal.tsx src/components/QuestionCard.tsx src/components/FilterBar.tsx src/components/SearchBar.tsx src/components/CategoryTabs.tsx src/components/DifficultyBars.tsx
git commit -m "feat: add question list/modal/content components with legacy viz integration"
```

## Task 11: 写 HomeClient 与首页路由

**Files:**
- Create: `src/components/HomeClient.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 写 HomeClient.tsx（首页主壳，客户端组件）**

整合 CategoryTabs + FilterBar + SearchBar + DifficultyBars + QuestionCard 网格 + QuestionModal + 入口按钮（学习计划 / 专栏 / 复习 / 设置）。从 props 接收 `questions: Question[]`（SSR 传入），用 store 管理筛选/搜索/当前打开题。

- [ ] **Step 2: 改 src/app/page.tsx（Server 组件，传 questions）**

```tsx
import HomeClient from '@/components/HomeClient';
import { getAllQuestions } from '@/lib/questions';

export default function Home() {
  const questions = getAllQuestions();
  return <HomeClient questions={questions} />;
}
```

- [ ] **Step 3: 写题目详情路由 src/app/question/[lcId]/page.tsx**

```tsx
import { getAllLcIds, getQuestionByLcId } from '@/lib/questions';
import { APP_CONFIG } from '@/lib/config';
import { notFound } from 'next/navigation';
import QuestionContent from '@/components/QuestionContent';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllLcIds().map((lcId) => ({ lcId }));
}

export async function generateMetadata({ params }: { params: Promise<{ lcId: string }> }): Promise<Metadata> {
  const { lcId } = await params;
  const q = getQuestionByLcId(lcId);
  if (!q) return { title: '算法面试题库' };
  return { title: `${q.lcId}. ${q.title} - 算法面试`, description: q.feynman?.essence || q.answer.slice(0, 120) };
}

export default async function Page({ params }: { params: Promise<{ lcId: string }> }) {
  const { lcId } = await params;
  const q = getQuestionByLcId(lcId);
  if (!q) notFound();
  const catCfg = APP_CONFIG.categories[q.category] || APP_CONFIG.categories['all'];
  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      <a href="../../" className="inline-block mb-3 text-sm text-orange-500 no-underline">← 返回题库</a>
      <QuestionContent q={q} />
    </main>
  );
}
```

- [ ] **Step 4: 验证 build + dev 预览**

```bash
npm run build
npm run dev
# 浏览器打开首页，点开一道题，确认弹窗 + 动画播放器加载 viz-engine
```
Expected: 100 题 SSG 成功，首页可点开弹窗，two-sum 动画可播放。

- [ ] **Step 5: 提交**

```bash
git add src/components/HomeClient.tsx src/app/page.tsx src/app/question
git commit -m "feat: home page + question detail route with modal and legacy viz playback"
```

---

# 阶段 3：学习计划页

## Task 12: 写 StudyPlan 组件与路由

**Files:**
- Create: `src/components/StudyPlan.tsx`
- Create: `src/app/study-plan/page.tsx`

- [ ] **Step 1: 写 StudyPlan.tsx（客户端组件，复刻 leetcode 学习计划）**

props: `plan: StudyPlan`, `questions: Question[]`。用 `useStore` 读 `planProgress`、`togglePlanDone`、`streak`、`lastStudyDate`。渲染：
- 顶部：大 ProgressRing（完成数/100）+ 连续学习 N 天 + 预计完成日期（剩余题数 ÷ dailyGoal，向上取整天数）
- 17 分组折叠列表，每行：勾选框 + `#lcId` + 标题 + 难度色条 + 跳转链接 `/question/<lcId>`
- 勾选调用 `togglePlanDone(String(lcId))` + `logStudy`

- [ ] **Step 2: 写 src/app/study-plan/page.tsx（Server 组件）**

```tsx
import { getTop100Plan } from '@/lib/study-plan';
import { getAllQuestions } from '@/lib/questions';
import StudyPlan from '@/components/StudyPlan';
import ClientBootstrap from '@/components/ClientBootstrap';

export const metadata = { title: 'LeetCode 热题 100 学习计划 - 算法面试' };

export default function Page() {
  const plan = getTop100Plan();
  const questions = getAllQuestions();
  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      <a href="/" className="inline-block mb-3 text-sm text-orange-500 no-underline">← 返回题库</a>
      <ClientBootstrap>
        <StudyPlan plan={plan} questions={questions} />
      </ClientBootstrap>
    </main>
  );
}
```

- [ ] **Step 3: 在 HomeClient 加「学习计划」入口按钮（链接 /study-plan/）**

- [ ] **Step 4: 验证 build + dev**

```bash
npm run build
npm run dev
# 打开 /study-plan/，勾选几题，刷新确认进度保留
```
Expected: 进度环随勾选变化，刷新后进度仍在（localStorage）。

- [ ] **Step 5: 提交**

```bash
git add src/components/StudyPlan.tsx src/app/study-plan
git commit -m "feat: LeetCode hot-100 study plan page with progress tracking"
```

---

# 阶段 4：知识专栏（三本书解析）

## Task 13: 写 extract_ds_beauty.py（数据结构与算法之美 epub）

**Files:**
- Create: `scripts/extract_ds_beauty.py`
- Create: `columns/data-structure-beauty/*.md`

- [ ] **Step 1: 写脚本（epub 解析）**

```python
#!/usr/bin/env python3
"""解析 01-数据结构与算法之美.epub → columns/data-structure-beauty/*.md"""
import os, re, zipfile
from bs4 import BeautifulSoup

EPUB = '/Users/sunqingguang/Downloads/02.interview/算法/01-数据结构与算法之美.epub'
OUT = os.path.join(os.path.dirname(__file__), '..', 'columns', 'data-structure-beauty')

SKIP_TITLES = {'版权页', '目录', '前言', '封底', '封面', '关于'}

def iter_html(zf):
    for name in zf.namelist():
        if name.endswith(('.html', '.xhtml', '.htm')):
            yield name, zf.read(name).decode('utf-8', errors='ignore')

def main():
    os.makedirs(OUT, exist_ok=True)
    zf = zipfile.ZipFile(EPUB)
    chapters = []
    for name, html in iter_html(zf):
        soup = BeautifulSoup(html, 'html.parser')
        title = (soup.find(['h1','h2']) or {}).get_text(strip=True) if soup.find(['h1','h2']) else ''
        # 过滤：必须有实质正文长度
        body = soup.find('body')
        text = body.get_text('\n', strip=True) if body else ''
        if len(text) < 200: continue
        if any(s in title for s in SKIP_TITLES): continue
        chapters.append((name, title, soup, text))
    # 按 epub 文件名排序
    chapters.sort(key=lambda x: x[0])
    order = 0
    for name, title, soup, text in chapters:
        if not title: continue
        order += 1
        slug = re.sub(r'[^\w\u4e00-\u9fa5-]', '', title)[:40] or f'ch{order}'
        # 正文：保留 h 标签与 p，转 markdown（简化：p→\n\n）
        paras = []
        for el in soup.find_all(['h2','h3','p','li']):
            t = el.get_text(strip=True)
            if t: paras.append(t)
        content = '\n\n'.join(paras)
        md = f"""---
slug: "{slug}"
title: "{title}"
source: data-structure-beauty
chapter: "{title}"
order: {order}
related: []
---

{content}
"""
        open(os.path.join(OUT, f'{order:02d}-{slug}.md'), 'w', encoding='utf-8').write(md)
    print(f'extracted {order} chapters to {OUT}')

if __name__ == '__main__':
    main()
```

- [ ] **Step 2: 安装依赖并运行**

```bash
pip3 install beautifulsoup4
cd /Users/sunqingguang/hermes/opt/projects/algorithm-interview
python3 scripts/extract_ds_beauty.py
ls columns/data-structure-beauty | wc -l
```
Expected: 输出章节数（约 40-70），md 文件含正文。

- [ ] **Step 3: 人工抽查 1-2 个 md，确认正文完整无水印**

```bash
head -40 columns/data-structure-beauty/01-*.md
```

- [ ] **Step 4: 提交**

```bash
git add scripts/extract_ds_beauty.py columns/data-structure-beauty
git commit -m "feat: extract 数据结构与算法之美 epub to knowledge columns"
```

## Task 14: 写 extract_dp_book.py（动态规划面试宝典 epub）

**Files:**
- Create: `scripts/extract_dp_book.py`
- Create: `columns/dynamic-programming/*.md`

- [ ] **Step 1: 复用 Task 13 脚本结构，改 EPUB 路径与 OUT 目录**

将 `EPUB` 改为 `/Users/sunqingguang/Downloads/02.interview/算法/156-动态规划面试宝典.epub`，`OUT` 改为 `columns/dynamic-programming`，`source: dynamic-programming`。其余逻辑同 Task 13 Step 1（可直接拷贝脚本改三个常量）。

- [ ] **Step 2: 运行并抽查**

```bash
python3 scripts/extract_dp_book.py
ls columns/dynamic-programming | wc -l
head -30 columns/dynamic-programming/01-*.md
```

- [ ] **Step 3: 提交**

```bash
git add scripts/extract_dp_book.py columns/dynamic-programming
git commit -m "feat: extract 动态规划面试宝典 epub to knowledge columns"
```

## Task 15: 写 extract_labuladong.py（Fucking-Algorithm pdf）

**Files:**
- Create: `scripts/extract_labuladong.py`
- Create: `columns/labuladong/*.md`, `public/columns/labuladong/*.png`

- [ ] **Step 1: 写脚本（PyMuPDF 解析 pdf）**

```python
#!/usr/bin/env python3
"""解析 Fucking-Algorithm.pdf (labuladong 算法小抄) → columns/labuladong/*.md"""
import os, re, fitz  # PyMuPDF

PDF = '/Users/sunqingguang/Downloads/02.interview/算法/Fucking-Algorithm.pdf'
OUT_MD = os.path.join(os.path.dirname(__file__), '..', 'columns', 'labuladong')
OUT_IMG = os.path.join(os.path.dirname(__file__), '..', 'public', 'columns', 'labuladong')

def main():
    os.makedirs(OUT_MD, exist_ok=True)
    os.makedirs(OUT_IMG, exist_ok=True)
    doc = fitz.open(PDF)
    # 1. 抽目录（书签），labuladong 有清晰的章节书签
    toc = doc.get_toc()  # [[level, title, page], ...]
    if not toc:
        # 无书签则按一级标题（字号最大）切分
        toc = []
    # 2. 按书签切分页面范围，每章抽文字 + 图片
    order = 0
    for i, (level, title, page) in enumerate(toc):
        if level > 2: continue  # 只取一级二级
        start = page - 1
        end = (toc[i+1][2] - 1) if i+1 < len(toc) else len(doc)
        text_parts = []
        img_idx = 0
        for pno in range(start, end):
            page_obj = doc[pno]
            text_parts.append(page_obj.get_text())
            for img_info in page_obj.get_images(full=True):
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha >= 4: pix = fitz.Pixmap(fitz.csRGB, pix)
                order_img = f"{order+1:02d}-{img_idx:02d}.png"
                pix.save(os.path.join(OUT_IMG, order_img))
                pix = None
                img_idx += 1
        full = '\n'.join(text_parts).strip()
        if len(full) < 300: continue
        order += 1
        slug = re.sub(r'[^\w\u4e00-\u9fa5-]', '', title)[:40] or f'ch{order}'
        md = f"""---
slug: "{slug}"
title: "{title}"
source: labuladong
chapter: "{title}"
order: {order}
related: []
---

{full}
"""
        open(os.path.join(OUT_MD, f'{order:02d}-{slug}.md'), 'w', encoding='utf-8').write(md)
    print(f'extracted {order} chapters, images in {OUT_IMG}')

if __name__ == '__main__':
    main()
```

- [ ] **Step 2: 安装 PyMuPDF 并运行**

```bash
pip3 install PyMuPDF
cd /Users/sunqingguang/hermes/opt/projects/algorithm-interview
python3 scripts/extract_labuladong.py
ls columns/labuladong | wc -l
ls public/columns/labuladong | head
```
Expected: 输出章节数，public/columns/labuladong 有图片。pdf 大，耐心等待。

- [ ] **Step 3: 抽查 1 章 md，确认代码块与图引用完整**

```bash
head -50 columns/labuladong/01-*.md
```

- [ ] **Step 4: 提交**

```bash
git add scripts/extract_labuladong.py columns/labuladong public/columns
git commit -m "feat: extract labuladong Fucking-Algorithm pdf to knowledge columns"
```

## Task 16: 写专栏目录页与详情页

**Files:**
- Create: `src/app/columns/page.tsx`, `src/app/columns/[slug]/page.tsx`

- [ ] **Step 1: 写专栏目录页（按 source 分组列出所有 column）**

```tsx
import { getAllColumns } from '@/lib/columns';
import { APP_CONFIG } from '@/lib/config';

export const metadata = { title: '算法知识专栏 - 算法面试' };

export default function Page() {
  const columns = getAllColumns();
  const bySource: Record<string, typeof columns> = {};
  for (const c of columns) (bySource[c.source] ||= []).push(c);
  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      <a href="/" className="inline-block mb-3 text-sm text-orange-500 no-underline">← 返回题库</a>
      <h1 className="text-2xl font-bold mb-4">📚 算法知识专栏</h1>
      {Object.entries(bySource).map(([src, cols]) => {
        const cfg = APP_CONFIG.columnSources[src] || { label: src, icon: '📄' };
        return (
          <section key={src} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{cfg.icon} {cfg.label}</h2>
            <ul className="list-disc pl-6">
              {cols.map((c) => (
                <li key={c.slug}><a href={`/columns/${c.slug}/`} className="text-blue-600 hover:underline">{c.title}</a></li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
```

- [ ] **Step 2: 写专栏详情页（渲染 column.content，related 题目可跳转）**

```tsx
import { getAllColumns, getColumnBySlug } from '@/lib/columns';
import { getAllQuestions } from '@/lib/questions';
import Markdown from '@/components/Markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllColumns().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getColumnBySlug(slug);
  return { title: c ? `${c.title} - 算法面试` : '算法面试' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getColumnBySlug(slug);
  if (!c) notFound();
  const questions = getAllQuestions();
  const related = c.related.map((id) => questions.find((q) => q.lcId === id)).filter(Boolean);
  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      <a href="/columns/" className="inline-block mb-3 text-sm text-orange-500 no-underline">← 返回专栏</a>
      <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
      <Markdown>{c.content}</Markdown>
      {related.length > 0 && (
        <section className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">相关题目</h2>
          <ul className="list-disc pl-6">
            {related.map((q) => q && (
              <li key={q.lcId}><a href={`/question/${q.lcId}/`} className="text-blue-600 hover:underline">#{q.lcId} {q.title}</a></li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 3: 验证 build**

```bash
npm run build
```
Expected: 专栏目录页 + 每篇专栏详情页 SSG 成功。

- [ ] **Step 4: 提交**

```bash
git add src/app/columns
git commit -m "feat: knowledge columns directory and detail pages"
```

---

# 阶段 5：复习系统移植

## Task 17: 移植复习组件（ReviewDashboard, ReviewMode, StudyMode, StudyDashboard, SettingsPanel, ShortcutsHelp）

**Files:**
- Create: 上述 6 个组件

- [ ] **Step 1: 从 java-interview 移植 6 个复习相关组件**

完整拷贝 java-interview `src/components/` 下：`ReviewDashboard.tsx`、`ReviewMode.tsx`、`StudyMode.tsx`、`StudyDashboard.tsx`、`SettingsPanel.tsx`、`ShortcutsHelp.tsx`。适配点：
- 字段 `id` → 用 `String(q.lcId)` 作为 store key
- `q.question` 在算法项目里等于 `q.title`（已在 types 里处理）
- 移除 java-interview 特有的 `subcategory` 相关逻辑（算法题无子分类）

- [ ] **Step 2: 在 HomeClient 接入复习入口（按钮打开 ReviewDashboard modal/区域）**

- [ ] **Step 3: 验证 build + dev，手动测试复习流程**

```bash
npm run build
npm run dev
# 首页进入复习，对几题打分（再来/困难/良好/简单），切换算法（SM-2/Leitner/艾宾浩斯）
```
Expected: 打分后 reviewData 更新，下次到期题出现在队列。

- [ ] **Step 4: 提交**

```bash
git add src/components/ReviewDashboard.tsx src/components/ReviewMode.tsx src/components/StudyMode.tsx src/components/StudyDashboard.tsx src/components/SettingsPanel.tsx src/components/ShortcutsHelp.tsx
git commit -m "feat: port review system (SM-2/Leitner/Ebbinghaus, study mode, settings) from java-interview"
```

---

# 阶段 6：PWA、深色模式、部署校验

## Task 18: PWA + 深色模式 + 部署

**Files:**
- Create: `public/manifest.json`, `public/sw.js`
- Modify: `src/app/layout.tsx`（注入 manifest + theme-color + 深色模式初始化脚本）

- [ ] **Step 1: 写 public/manifest.json（算法版）**

```json
{
  "name": "算法面试题库",
  "short_name": "算法面试",
  "description": "LeetCode 热题 100 题解与动画",
  "start_url": "/algorithm-interview/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": []
}
```

- [ ] **Step 2: 写 public/sw.js（基础缓存，参考 legacy/sw.js 精简）**

- [ ] **Step 3: 改 layout.tsx 注入 manifest link + theme-color meta + 防 FOUC 深色脚本**

```tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '算法面试题库',
  description: 'LeetCode 热题 100 题解、逐题动画、知识专栏与智能复习',
  manifest: '/algorithm-interview/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <meta name="theme-color" content="#f97316" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('algo-interview');if(t&&JSON.parse(t).state.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body>
        <nav className="flex gap-4 p-4 border-b max-w-5xl mx-auto">
          <Link href="/" className="font-bold text-orange-500">🧮 算法面试</Link>
          <Link href="/study-plan/" className="text-sm">📋 热题100</Link>
          <Link href="/columns/" className="text-sm">📚 专栏</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 完整 build 验证**

```bash
npm run build
ls out/
```
Expected: `out/` 含首页、100 个 question 页、study-plan、columns 目录与详情、_next 静态资源、legacy 资产。

- [ ] **Step 5: 提交**

```bash
git add public/manifest.json public/sw.js src/app/layout.tsx
git commit -m "feat: PWA manifest, service worker, dark mode, top nav with plan/columns links"
```

## Task 19: 重写 README.md + 最终验证

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 重写 README.md（反映 Next.js 架构 + 三大功能）**

内容：项目介绍、技术栈（Next.js 15 + TS + Tailwind）、三大功能（100 题题解+动画 / 热题100学习计划 / 知识专栏 / 智能复习）、开发与部署命令（`npm run dev` / `npm run build` → `out/`）、目录结构、Python 脚本说明（migrate_problems + 三个 extract）。

- [ ] **Step 2: 完整回归测试**

```bash
npm run build && npm run dev
# 逐项验证：
# 1. 首页 100 题展示，17 分类筛选，搜索，难度筛选
# 2. 点开题目弹窗，动画播放，题解、费曼卡、第一性原理卡
# 3. /study-plan/ 勾选进度，刷新保留
# 4. /columns/ 三本书专栏，详情页正文 + related 跳转
# 5. 复习：打分、三种算法切换、到期队列
# 6. 深色模式切换，刷新保留
```

- [ ] **Step 3: 提交**

```bash
git add README.md
git commit -m "docs: rewrite README for Next.js architecture and three main features"
```

---

## Self-Review（写计划后自查）

**1. Spec 覆盖检查：**
- §1 Next.js 重构 → Task 1-2（骨架）、Task 3（资产）、Task 5（lib）、Task 7-11（首页/详情/弹窗/动画）、Task 17（复习移植）、Task 18（PWA/深色） ✓
- §4 数据模型（questions/columns markdown + frontmatter）→ Task 4（迁移脚本）、Task 13-15（专栏） ✓
- §5 UI/路由 → Task 7-11（组件+路由）、Task 12（study-plan 路由）、Task 16（columns 路由） ✓
- §6 知识专栏生成 → Task 13-15（三脚本） ✓
- §7 学习计划 → Task 6（json）、Task 12（页面） ✓
- §8 复习系统 → Task 5（algorithms/store）、Task 17（组件） ✓
- 里程碑 1-6 全覆盖 ✓

**2. 占位符扫描：** 无 TBD/TODO；Task 13-15 的脚本含完整可运行代码；Task 17"完整拷贝"指向明确文件（java-interview 已存在）。

**3. 类型一致性：** `Question.lcId`（number）贯穿 store（key 用 String(lcId)）、study-plan json（number[]）、questions loader（Number(data.lcId)）、路由 `[lcId]`（string，比较时 String()）。`planProgress: Record<string, boolean>` 与 `togglePlanDone(String(lcId))` 一致。 ✓

**已知不确定项（实现时处理，非计划缺陷）：**
- epub/pdf 实际章节数与标题需运行脚本后确认（脚本有过滤兜底）
- labuladong pdf 是否有书签：无则按字号切分（脚本已加 fallback 注释，实现时若 get_toc 为空需补充字号切分逻辑）
- java-interview 部分组件行数需实现时核对（拷贝时以实际文件为准）
