'use client';
/* eslint-disable */
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../theme';
import { fmtCZK } from '../helpers';
import { FINANCE_MONTHLY } from '../data/mockData';
import { StatCard, SectionTitle, SubTitle } from './shared';

export default function FinancePage({ properties }) {
  const { T, s } = useTheme();

  const totalIncome = FINANCE_MONTHLY[FINANCE_MONTHLY.length - 1].income;
  const totalExpenses = FINANCE_MONTHLY[FINANCE_MONTHLY.length - 1].expenses;
  const net = totalIncome - totalExpenses;

  const mgmtFees = properties.filter(p => p.ownership === 'foreign');
  const totalMgmt = mgmtFees.reduce((a, p) => a + Math.round(p.monthlyIncome * 0.1), 0);

  const debtors = [];
  properties.forEach(p => p.units.forEach(u => {
    if (u.balance < 0) debtors.push({ tenant: u.tenant, property: p.name, unit: u.id, amount: u.balance });
  }));
  const totalDebt = debtors.reduce((a, d) => a + d.amount, 0);

  return (
    <div className="fade-in">
      <SectionTitle>Finance</SectionTitle>
      <div style={s.grid4}>
        <StatCard label="Příjmy (únor)" value={fmtCZK(totalIncome)} color={T.green} />
        <StatCard label="Výdaje (únor)" value={fmtCZK(totalExpenses)} color={T.red} />
        <StatCard label="Čistý zisk" value={fmtCZK(net)} color={T.cyan} />
        <StatCard label="Správcovské popl." value={fmtCZK(totalMgmt)} sub="10% z cizích nemovitostí" color={T.purple} />
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <SubTitle>Vývoj příjmů a výdajů</SubTitle>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={FINANCE_MONTHLY} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.red} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: 12 }} axisLine={{ stroke: T.border }} />
              <YAxis tick={{ fill: T.textDim, fontSize: 12 }} axisLine={{ stroke: T.border }} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={s.tooltip} formatter={(v) => fmtCZK(v)} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="income" name="Příjmy" stroke={T.green} fillOpacity={1} fill="url(#gInc)" />
              <Area type="monotone" dataKey="expenses" name="Výdaje" stroke={T.red} fillOpacity={1} fill="url(#gExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <SubTitle>Správcovské poplatky</SubTitle>
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Nemovitost</th><th style={s.th}>Vlastník</th><th style={{ ...s.th, textAlign: 'right' }}>Příjem</th><th style={{ ...s.th, textAlign: 'right' }}>Poplatek (10%)</th>
            </tr></thead>
            <tbody>
              {mgmtFees.map(p => (
                <tr key={p.id}>
                  <td style={s.td}>{p.name}, {p.city}</td>
                  <td style={{ ...s.td, color: T.textDim }}>{p.owner}</td>
                  <td style={{ ...s.td, textAlign: 'right' }}>{fmtCZK(p.monthlyIncome)}</td>
                  <td style={{ ...s.td, textAlign: 'right', color: T.purple, fontWeight: 600 }}>{fmtCZK(Math.round(p.monthlyIncome * 0.1))}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ ...s.td, fontWeight: 700, textAlign: 'right' }}>Celkem</td>
                <td style={{ ...s.td, textAlign: 'right', color: T.purple, fontWeight: 700 }}>{fmtCZK(totalMgmt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={s.card}>
        <SubTitle>Dlužníci — celkem {fmtCZK(totalDebt)}</SubTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Nájemník</th><th style={s.th}>Nemovitost</th><th style={s.th}>Byt</th><th style={{ ...s.th, textAlign: 'right' }}>Dluh</th>
            </tr></thead>
            <tbody>
              {debtors.sort((a, b) => a.amount - b.amount).map((d, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{d.tenant}</td>
                  <td style={{ ...s.td, color: T.textDim }}>{d.property}</td>
                  <td style={s.td}>{d.unit}</td>
                  <td style={{ ...s.td, textAlign: 'right', color: T.red, fontWeight: 700 }}>{fmtCZK(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
