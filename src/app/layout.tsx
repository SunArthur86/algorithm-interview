import './globals.css';
import type { Metadata, Viewport } from 'next';

const BASE = process.env.NODE_ENV === 'production' ? '/algorithm-interview' : '';

export const metadata: Metadata = {
  title: '算法面试题库',
  description: 'LeetCode 热题 100 完整 Java 题解、逐题动画、知识专栏与智能间隔复习。',
  keywords: ['LeetCode', '热题100', '算法面试', 'Java题解', '数据结构', '动态规划', '面试刷题'],
  manifest: `${BASE}/manifest.json`,
  applicationName: '算法面试',
  appleWebApp: { capable: true, title: '算法面试', statusBarStyle: 'default' },
  openGraph: {
    title: '算法面试题库',
    description: 'LeetCode 热题 100 完整 Java 题解、逐题动画、知识专栏与智能复习',
    type: 'website',
    locale: 'zh_CN',
    siteName: '算法面试题库',
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
};

// 防 FOUC：在 store 水合前根据 localStorage 应用深色模式
const themeBootstrap = `
try {
  var raw = localStorage.getItem('algo-interview');
  var theme = 'light';
  if (raw) { var p = JSON.parse(raw); theme = (p.state && p.state.theme) || 'light'; }
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} catch (e) {}
`;

const swRegister = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('${BASE}/sw.js').catch(function () {});
  });
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: swRegister }} />
      </body>
    </html>
  );
}
