/* eslint-disable */
import React from 'react';
import { T, s } from '../theme';
import { fmtCZK } from '../helpers';
import { SectionTitle } from './shared';

export default function OwnerPortalPage({ properties }) {
  const foreign = properties.filter(p => p.ownership === 'foreign');

  return (
    <div className="fade-in">
      <SectionTitle>Portál vlastníků</SectionTitle>
      <div style={{ color: T.textDim, fontSize: 13, marginBottom: 20, marginTop: -12 }}>Přehled nemovitostí ve správě pro cizí vlastníky</div>

      {foreign.map(p => {
        const occ = p.units.filter(u => u.status === 'occupied').length;
        const income = p.units.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0);
        const fee = Math.round(income * 0.1);
        const debtors = p.units.filter(u => u.balance < 0);
        const totalDebt = debtors.reduce((a, u) => a + u.balance, 0);

        return (
          <div key={p.id} style={{ ...s.card, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: T.textDim, fontSize: 13 }}>{p.address}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: T.textMuted }}>Vlastník</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.purple }}>{p.owner}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
              <div style={{ background: T.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.textMuted }}>Obsazenost</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.green }}>{occ}/{p.totalUnits}</div>
              </div>
              <div style={{ background: T.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.textMuted }}>Příjem/měs</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.cyan }}>{fmtCZK(income)}</div>
              </div>
              <div style={{ background: T.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.textMuted }}>Správcovský popl.</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.purple }}>{fmtCZK(fee)}</div>
              </div>
              <div style={{ background: T.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.textMuted }}>Čistý výnos</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{fmtCZK(income - fee)}</div>
              </div>
            </div>

            {debtors.length > 0 && (
              <div style={{ background: T.red + '11', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.red, marginBottom: 6 }}>Dlužníci ({fmtCZK(totalDebt)})</div>
                {debtors.map((u, i) => (
                  <div key={i} style={{ fontSize: 12, color: T.textDim, display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span>{u.tenant} (byt {u.id})</span>
                    <span style={{ color: T.red, fontWeight: 600 }}>{fmtCZK(u.balance)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...s.table, fontSize: 12 }}>
                <thead><tr>
                  <th style={s.th}>Byt</th><th style={s.th}>Typ</th><th style={s.th}>Nájemník</th>
                  <th style={s.th}>Nájemné</th><th style={s.th}>Stav</th>
                </tr></thead>
                <tbody>
                  {p.units.map(u => (
                    <tr key={u.id}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{u.id}</td>
                      <td style={s.td}>{u.type}</td>
                      <td style={s.td}>{u.tenant || <span style={{ color: T.textMuted, fontStyle: 'italic' }}>Neobsazeno</span>}</td>
                      <td style={s.td}>{fmtCZK(u.rent)}</td>
                      <td style={s.td}>
                        <span style={s.badge(u.status === 'occupied' ? T.green : T.red)}>
                          {u.status === 'occupied' ? 'Obsazeno' : 'Volný'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
