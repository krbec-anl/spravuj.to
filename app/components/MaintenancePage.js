'use client';
/* eslint-disable */
import React, { useState } from 'react';
import { useTheme } from '../theme';
import { fmtDate } from '../helpers';
import { MAINTENANCE } from '../data/mockData';
import { SectionTitle } from './shared';

export default function MaintenancePage() {
  const { T, s } = useTheme();
  const [filter, setFilter] = useState('all');
  const filtered = MAINTENANCE.filter(t => filter === 'all' || t.status === filter);

  const prioColor = { high: T.red, medium: T.orange, low: T.blue };
  const prioLabel = { high: 'Vysoká', medium: 'Střední', low: 'Nízká' };
  const statusColor = { new: T.yellow, in_progress: T.cyan, resolved: T.green };
  const statusLabel = { new: 'Nový', in_progress: 'Řeší se', resolved: 'Vyřešeno' };

  return (
    <div className="fade-in">
      <SectionTitle>Údržba — ticketing</SectionTitle>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['all', 'Vše'], ['new', 'Nové'], ['in_progress', 'Řeší se'], ['resolved', 'Vyřešené']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={s.btn(filter === k)}>{l} {k !== 'all' && `(${MAINTENANCE.filter(t => t.status === k).length})`}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ ...s.card, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>#{t.id}</span>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{t.title}</span>
                </div>
                <div style={{ color: T.textDim, fontSize: 13, marginBottom: 10 }}>
                  {t.property} &middot; Byt {t.unit} &middot; {fmtDate(t.created)}
                </div>
                <div style={{ color: T.textDim, fontSize: 14, lineHeight: '1.6' }}>{t.desc}</div>
                {t.assignee && <div style={{ marginTop: 10, fontSize: 13, color: T.textDim }}>Přiřazeno: <span style={{ color: T.text, fontWeight: 500 }}>{t.assignee}</span></div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={s.badge(prioColor[t.priority])}>{prioLabel[t.priority]}</span>
                <span style={s.badge(statusColor[t.status])}>{statusLabel[t.status]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}