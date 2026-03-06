'use client';
/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { useTheme } from '../theme';
import { fmtCZK, fmtDate, getAllTenants } from '../helpers';
import { SectionTitle } from './shared';

export default function TenantsPage({ properties }) {
  const { T, s } = useTheme();
  const [search, setSearch] = useState('');
  const tenants = useMemo(() => getAllTenants(properties), [properties]);
  const filtered = tenants.filter(t =>
    !search || t.tenant.toLowerCase().includes(search.toLowerCase()) ||
    t.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <SectionTitle>Nájemníci</SectionTitle>
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Hledat nájemníka nebo nemovitost..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ ...s.input, maxWidth: 400 }} />
      </div>
      <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Nájemník</th><th style={s.th}>Nemovitost</th><th style={s.th}>Město</th>
              <th style={s.th}>Byt</th><th style={s.th}>Typ</th><th style={s.th}>Nájemné</th>
              <th style={s.th}>Kauce</th><th style={s.th}>Konec smlouvy</th><th style={s.th}>Stav</th>
            </tr></thead>
            <tbody>
              {filtered.map((t, i) => {
                const hasDebt = t.balance < 0;
                return (
                  <tr key={i}>
                    <td style={{ ...s.td, fontWeight: 600 }}>{t.tenant}</td>
                    <td style={{ ...s.td, color: T.textDim }}>{t.property}</td>
                    <td style={{ ...s.td, color: T.textDim }}>{t.city}</td>
                    <td style={s.td}>{t.id}</td>
                    <td style={s.td}>{t.type}</td>
                    <td style={s.td}>{fmtCZK(t.rent)}</td>
                    <td style={{ ...s.td, color: T.textDim }}>{fmtCZK(t.deposit)}</td>
                    <td style={s.td}>{fmtDate(t.contractEnd)}</td>
                    <td style={s.td}>
                      {hasDebt
                        ? <span style={s.badge(T.red)}>Dluh {fmtCZK(t.balance)}</span>
                        : <span style={s.badge(T.green)}>OK</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ color: T.textDim, fontSize: 13, marginTop: 10 }}>Celkem: {filtered.length} nájemníků</div>
    </div>
  );
}