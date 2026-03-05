/* eslint-disable */
import React from 'react';
import { useTheme } from '../theme';

export function StatCard({ label, value, sub, color }) {
  const { T, s } = useTheme();
  return (
    <div style={{ ...s.card, borderLeft: `4px solid ${color || T.accent}` }}>
      <div style={{ color: T.textDim, fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: color || T.text, letterSpacing: '-0.5px' }}>{value}</div>
      {sub && <div style={{ color: T.textDim, fontSize: 13, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children }) {
  const { T } = useTheme();
  return <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: T.text, letterSpacing: '-0.3px' }}>{children}</h2>;
}

export function SubTitle({ children, style: st }) {
  const { T } = useTheme();
  return <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14, color: T.textDim, ...st }}>{children}</h3>;
}
