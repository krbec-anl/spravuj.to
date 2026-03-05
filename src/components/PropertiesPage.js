/* eslint-disable */
import React, { useState } from 'react';
import { useTheme } from '../theme';
import ICONS from '../icons';
import { fmtCZK } from '../helpers';
import { SectionTitle } from './shared';

export default function PropertiesPage({ properties, onOpenProfile, onAddProperty }) {
  const { T, s } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', address: '', city: '', ownership: 'own', owner: '' });

  const handleAdd = () => {
    if (!addForm.name.trim() || !addForm.address.trim() || !addForm.city.trim()) return;
    if (addForm.ownership === 'foreign' && !addForm.owner.trim()) return;
    const newProp = {
      id: Date.now(),
      name: addForm.name.trim(),
      city: addForm.city.trim(),
      address: addForm.address.trim(),
      ownership: addForm.ownership,
      owner: addForm.ownership === 'foreign' ? addForm.owner.trim() : null,
      totalUnits: 0,
      monthlyIncome: 0,
      units: [],
    };
    onAddProperty(newProp);
    setAddForm({ name: '', address: '', city: '', ownership: 'own', owner: '' });
    setShowAdd(false);
    onOpenProfile(newProp.id);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle>Nemovitosti</SectionTitle>
        <button onClick={() => setShowAdd(true)} style={{
          ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', fontSize: 14,
        }}>
          {ICONS.plus} Přidat nemovitost
        </button>
      </div>

      {/* Add property modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ ...s.card, maxWidth: 500, width: '100%', border: `1px solid ${T.accent}44`, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: T.text }}>Nová nemovitost</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Název *</label>
                <input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="např. Tyršova 1872" style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Adresa *</label>
                <input value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} placeholder="např. Tyršova 1872, Žatec" style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Město *</label>
                <input value={addForm.city} onChange={e => setAddForm({ ...addForm, city: e.target.value })} placeholder="např. Žatec" style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Vlastnictví *</label>
                <select value={addForm.ownership} onChange={e => setAddForm({ ...addForm, ownership: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="own">Vlastní</option>
                  <option value="foreign">Cizí</option>
                </select>
              </div>
              {addForm.ownership === 'foreign' && (
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Vlastník (jméno) *</label>
                  <input value={addForm.owner} onChange={e => setAddForm({ ...addForm, owner: e.target.value })} placeholder="např. Ing. Novák" style={s.input} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ ...s.btn(false), padding: '10px 20px' }}>Zrušit</button>
              <button onClick={handleAdd} style={{
                ...s.btn(true), padding: '10px 20px',
                opacity: addForm.name.trim() && addForm.address.trim() && addForm.city.trim() && (addForm.ownership === 'own' || addForm.owner.trim()) ? 1 : 0.5,
              }}>Vytvořit</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {properties.map(p => {
          const occ = p.units.filter(u => u.status === 'occupied').length;
          return (
            <div key={p.id} onClick={() => onOpenProfile(p.id)}
              style={{ ...s.card, cursor: 'pointer', transition: 'all .2s', borderColor: T.border }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: T.textDim, fontSize: 13 }}>{p.city}</div>
                </div>
                <span style={s.badge(p.ownership === 'own' ? T.green : T.purple)}>
                  {p.ownership === 'own' ? 'Vlastní' : 'Cizí'}
                </span>
              </div>
              {p.ownership === 'foreign' && <div style={{ color: T.textDim, fontSize: 12, marginBottom: 8 }}>Vlastník: {p.owner}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 4 }}>
                <div><div style={{ fontSize: 11, color: T.textMuted }}>Bytů</div><div style={{ fontWeight: 600 }}>{occ}/{p.totalUnits}</div></div>
                <div><div style={{ fontSize: 11, color: T.textMuted }}>Obsazenost</div><div style={{ fontWeight: 600, color: T.green }}>{((occ / p.totalUnits) * 100).toFixed(0)}%</div></div>
                <div><div style={{ fontSize: 11, color: T.textMuted }}>Příjem/měs</div><div style={{ fontWeight: 600, color: T.cyan }}>{fmtCZK(p.monthlyIncome)}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
