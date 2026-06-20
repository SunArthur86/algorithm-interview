import { getAllLcIds, getQuestionByLcId } from '@/lib/questions';
import { APP_CONFIG } from '@/lib/config';
import { notFound } from 'next/navigation';
import QuestionContent from '@/components/QuestionContent';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllLcIds().map((lcId) => ({ lcId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lcId: string }>;
}): Promise<Metadata> {
  const { lcId } = await params;
  const q = getQuestionByLcId(lcId);
  if (!q) return { title: '算法面试题库' };
  return {
    title: `${q.lcId}. ${q.title} - 算法面试`,
    description: q.feynman?.essence || q.answer.slice(0, 120).replace(/[#*>`]/g, ''),
  };
}

export default async function Page({ params }: { params: Promise<{ lcId: string }> }) {
  const { lcId } = await params;
  const q = getQuestionByLcId(lcId);
  if (!q) notFound();
  const catCfg = APP_CONFIG.categories[q.category] || APP_CONFIG.categories['all'];
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '16px', minHeight: '100vh' }}>
      <a
        href="../../"
        style={{ display: 'inline-block', marginBottom: '12px', fontSize: '13px' }}
      >
        ← 返回题库
      </a>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
        <span style={{ marginRight: '6px' }}>{catCfg.icon}</span>
        {q.lcId}. {q.title}
      </h1>
      <QuestionContent q={q} />
    </main>
  );
}
