/* eslint-disable */
import React from 'react';
import { T, s } from '../theme';

export function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ ...s.card, borderLeft: `4px solid ${color || T.accent}` }}>
      <div style={{ color: T.textDim, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || T.text }}>{value}</div>
      {sub && <div style={{ color: T.textDim, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: T.text }}>{children}</h2>;
}

export function SubTitle({ children, style: st }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: T.textDim, ...st }}>{children}</h3>;
}
