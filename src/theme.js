/* eslint-disable */

// ---------- THEME ----------
export const T = {
  bg: '#0f1117', sidebar: '#161821', card: '#1a1d2e', cardHover: '#222640',
  border: '#2d3148', accent: '#6366f1', accentHover: '#818cf8',
  text: '#e2e8f0', textDim: '#94a3b8', textMuted: '#64748b',
  green: '#22c55e', red: '#ef4444', orange: '#f97316', yellow: '#eab308',
  blue: '#3b82f6', purple: '#a855f7', cyan: '#06b6d4',
};

// ---------- GLOBAL CSS (injected) ----------
export const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }
  input, select { font-family: inherit; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn .3s ease; }
`;

// ---------- REUSABLE STYLES ----------
export const s = {
  card: {
    background: T.card, borderRadius: 12, border: `1px solid ${T.border}`,
    padding: 20, marginBottom: 16,
  },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  btn: (active) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? T.accent : T.card, color: T.text, fontSize: 13, fontWeight: 500,
    transition: 'all .2s',
  }),
  input: {
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
    padding: '10px 14px', color: T.text, fontSize: 14, width: '100%', outline: 'none',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${T.border}`,
    color: T.textDim, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  td: { padding: '10px 12px', borderBottom: `1px solid ${T.border}22` },
  badge: (color) => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
    background: color + '22', color: color, fontSize: 11, fontWeight: 600,
  }),
  tag: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: 6,
    background: color + '33', color: color, fontSize: 11, fontWeight: 600,
  }),
};

export const tooltipStyle = { backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12 };
