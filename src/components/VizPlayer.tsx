'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    VizEngine?: any;
    VIZ_TRACES?: any;
  }
}

const BASE = process.env.NODE_ENV === 'production' ? '/algorithm-interview' : '';

const SCRIPTS = [
  '/legacy/viz-engine.js',
  '/legacy/viz-traces-01.js',
  '/legacy/viz-traces-02.js',
  '/legacy/viz-traces-03.js',
  '/legacy/viz-traces-04.js',
  '/legacy/viz-traces-05.js',
  '/legacy/viz-traces-06.js',
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('failed to load ' + src));
    document.body.appendChild(s);
  });
}

export default function VizPlayer({ lcId }: { lcId: number }) {
  const [ready, setReady] = useState(false);
  const [hasTrace, setHasTrace] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      for (const s of SCRIPTS) {
        try {
          await loadScript(BASE + s);
        } catch (e) {
          console.error(e);
        }
      }
      if (cancelled) return;
      if (window.VizEngine) {
        if (!window.VizEngine._initialized) {
          window.VizEngine.init();
          window.VizEngine._initialized = true;
        }
        setHasTrace(window.VizEngine.load(String(lcId)));
      }
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [lcId]);

  if (!ready) {
    return <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>加载动画引擎…</div>;
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <canvas
        id="viz-canvas"
        width={640}
        height={320}
        style={{ width: '100%', maxWidth: 640, background: 'var(--card-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button id="viz-step-back" style={btn}>◀</button>
        <button id="viz-play" style={{ ...btn, background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>▶ 播放</button>
        <button id="viz-step-fwd" style={btn}>▶|</button>
        <button id="viz-reset" style={btn}>↺</button>
        <input id="viz-speed" type="range" min={1} max={10} defaultValue={6} style={{ marginLeft: '6px', width: '100px' }} />
        <span id="viz-speed-val" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>6</span>
      </div>
      {!hasTrace && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
          此题暂无逐题动画
        </p>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-soft)',
  color: 'var(--text)',
  cursor: 'pointer',
  fontSize: '13px',
};
