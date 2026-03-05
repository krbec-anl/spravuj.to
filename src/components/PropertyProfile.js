/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme';
import ICONS from '../icons';
import { fmtCZK, fmtDate } from '../helpers';
import { MAINTENANCE } from '../data/mockData';

const OBL_CATEGORIES = [
  { value: 'revize', label: 'Revize' },
  { value: 'smlouva', label: 'Smlouva' },
  { value: 'povoleni', label: 'Povolení' },
  { value: 'pojistka', label: 'Pojistka' },
  { value: 'hygiena', label: 'Hygiena' },
  { value: 'jine', label: 'Jiné' },
];

function getCatLabel(val) {
  return OBL_CATEGORIES.find(c => c.value === val)?.label || val;
}

const priorityLabels = { high: 'Vysoká', medium: 'Střední', low: 'Nízká' };
const statusLabels = { new: 'Nový', in_progress: 'Řeší se', resolved: 'Vyřešeno' };

export default function PropertyProfile({ property, isOpen, onClose, onUpdateProperty }) {
  const { T, s, isDark } = useTheme();

  const [tab, setTab] = useState('overview');
  const [oblFilter, setOblFilter] = useState('all');
  const [showAddObl, setShowAddObl] = useState(false);
  const [addOblForm, setAddOblForm] = useState({ name: '', category: 'revize', expiryDate: '', documentName: '' });
  const [editOblId, setEditOblId] = useState(null);
  const [editOblForm, setEditOblForm] = useState({});
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [addUnitForm, setAddUnitForm] = useState({ id: '', type: '', area: '', rent: '' });
  const [editUnitId, setEditUnitId] = useState(null);
  const [editUnitForm, setEditUnitForm] = useState({});
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [addTicketForm, setAddTicketForm] = useState({ title: '', priority: 'medium', desc: '', unit: '' });
  const [localTickets, setLocalTickets] = useState([]);

  // Theme-dependent colors
  const priorityColors = { high: T.red, medium: T.orange, low: T.green };
  const statusColors = { new: T.blue, in_progress: T.orange, resolved: T.green };

  function getOblStatus(expiryDate) {
    if (!expiryDate) return { label: 'Chybí', color: T.red };
    const diff = Math.floor((new Date(expiryDate) - new Date()) / 864e5);
    if (diff < 0) return { label: 'Expirováno', color: T.red };
    if (diff <= 30) return { label: 'Vyprší brzy', color: T.orange };
    return { label: 'Platné', color: T.green };
  }

  useEffect(() => {
    setTab('overview');
    setOblFilter('all');
    setShowAddObl(false);
    setEditOblId(null);
    setShowAddUnit(false);
    setEditUnitId(null);
    setShowAddTicket(false);
    setLocalTickets([]);
  }, [property?.id]);

  if (!property || !isOpen) return null;

  const p = property;
  const units = p.units || [];
  const obligations = p.obligations || [];
  const occ = units.filter(u => u.status === 'occupied').length;
  const totalUnits = units.length;
  const occPercent = totalUnits ? Math.round((occ / totalUnits) * 100) : 0;
  const income = units.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0);

  const tickets = MAINTENANCE.filter(m => {
    if (!p.name) return false;
    const mProp = m.property.toLowerCase();
    const pName = p.name.toLowerCase().split(' ')[0];
    return pName.length > 2 && mProp.includes(pName);
  });
  const allTickets = [...tickets, ...localTickets];
  const openTickets = allTickets.filter(t => t.status !== 'resolved').length;

  const filteredObls = oblFilter === 'all' ? obligations : obligations.filter(o => o.category === oblFilter);
  const recentDocs = obligations
    .filter(o => o.documentName)
    .sort((a, b) => new Date(b.expiryDate || 0) - new Date(a.expiryDate || 0))
    .slice(0, 3);

  const debtors = units.filter(u => u.balance < 0);
  const totalDebt = debtors.reduce((a, u) => a + Math.abs(u.balance), 0);

  const update = (changes) => {
    if (onUpdateProperty) onUpdateProperty({ ...p, ...changes });
  };

  // Obligation CRUD
  const handleAddObl = () => {
    if (!addOblForm.name.trim()) return;
    update({ obligations: [...obligations, { id: Date.now(), name: addOblForm.name.trim(), category: addOblForm.category, expiryDate: addOblForm.expiryDate || null, documentName: addOblForm.documentName.trim() || null }] });
    setAddOblForm({ name: '', category: 'revize', expiryDate: '', documentName: '' });
    setShowAddObl(false);
  };
  const startEditObl = (o) => { setEditOblId(o.id); setEditOblForm({ ...o }); };
  const saveEditObl = () => { update({ obligations: obligations.map(o => o.id === editOblId ? { ...editOblForm } : o) }); setEditOblId(null); };
  const deleteObl = (id) => update({ obligations: obligations.filter(o => o.id !== id) });

  // Unit CRUD
  const handleAddUnit = () => {
    if (!addUnitForm.id.trim() || !addUnitForm.type.trim()) return;
    const nu = { id: addUnitForm.id.trim(), type: addUnitForm.type.trim(), area: parseInt(addUnitForm.area) || 0, rent: parseInt(addUnitForm.rent) || 0, tenant: null, status: 'vacant', contractEnd: null, deposit: 0, balance: 0 };
    const newUnits = [...units, nu];
    update({ units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setAddUnitForm({ id: '', type: '', area: '', rent: '' });
    setShowAddUnit(false);
  };
  const startEditUnit = (u) => { setEditUnitId(u.id); setEditUnitForm({ ...u, area: String(u.area), rent: String(u.rent) }); };
  const saveEditUnit = () => {
    const newUnits = units.map(u => u.id === editUnitId ? { ...u, ...editUnitForm, area: parseInt(editUnitForm.area) || 0, rent: parseInt(editUnitForm.rent) || 0 } : u);
    update({ units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setEditUnitId(null);
  };
  const deleteUnit = (uid) => {
    const newUnits = units.filter(u => u.id !== uid);
    update({ units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
  };

  // Maintenance
  const handleAddTicket = () => {
    if (!addTicketForm.title.trim()) return;
    setLocalTickets(prev => [...prev, { id: Date.now(), property: p.address || p.name, unit: addTicketForm.unit, title: addTicketForm.title.trim(), priority: addTicketForm.priority, status: 'new', created: new Date().toISOString().split('T')[0], assignee: null, desc: addTicketForm.desc }]);
    setAddTicketForm({ title: '', priority: 'medium', desc: '', unit: '' });
    setShowAddTicket(false);
  };

  const tabItems = [
    { id: 'overview', label: 'Přehled' },
    { id: 'units', label: 'Jednotky' },
    { id: 'obligations', label: 'Povinnosti & Dokumenty' },
    { id: 'maintenance', label: 'Údržba' },
  ];

  const lbl = { fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 };
  const inp = { ...s.input, colorScheme: isDark ? 'dark' : 'light' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'auto' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        transition: 'all .3s ease',
      }} />

      {/* Panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '75vw', maxWidth: '100vw', minWidth: 420,
        background: T.bg,
        borderLeft: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: isDark ? '-8px 0 32px rgba(0,0,0,0.5)' : '-4px 0 24px rgba(0,0,0,0.12)',
        animation: 'slideInRight .3s ease',
      }}>

        {/* ===== HEADER ===== */}
        <div style={{ padding: '24px 28px 20px', borderBottom: `1px solid ${T.border}`, background: T.sidebar }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px' }}>{p.name}</div>
              {(p.address || p.city) && (
                <div style={{ fontSize: 14, color: T.textDim }}>{p.address || p.city}</div>
              )}
            </div>
            <button onClick={onClose} style={{
              background: isDark ? T.card : '#fff', border: `1px solid ${T.border}`, color: T.textDim,
              fontSize: 18, cursor: 'pointer', padding: '8px 12px', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textDim; e.currentTarget.style.borderColor = T.border; }}
            >{'\u2715'}</button>
          </div>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Jednotek', value: totalUnits, color: T.accent },
              { label: 'Obsazenost', value: occPercent + '%', color: occPercent > 80 ? T.green : occPercent > 50 ? T.orange : T.red },
              { label: 'Měs. příjem', value: fmtCZK(income), color: T.cyan },
              { label: 'Otevř. tikety', value: openTickets, color: openTickets > 0 ? T.orange : T.green },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 500 }}>{stat.label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.sidebar, padding: '0 28px' }}>
          {tabItems.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '14px 22px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              color: tab === t.id ? T.accent : T.textDim,
              fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
              borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = T.textDim; }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== CONTENT ===== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* ---------- OVERVIEW ---------- */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Základní informace</div>
                {[
                  ['Vlastnictví', p.ownership === 'own' ? 'Vlastní' : 'Cizí'],
                  p.owner && ['Vlastník', p.owner],
                  p.address && ['Adresa', p.address],
                  p.city && ['Město', p.city],
                ].filter(Boolean).map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}22` }}>
                    <span style={{ color: T.textMuted, fontSize: 14 }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Finanční přehled</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}22` }}>
                  <span style={{ color: T.textMuted, fontSize: 14 }}>Měsíční příjem</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>{fmtCZK(income)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}22` }}>
                  <span style={{ color: T.textMuted, fontSize: 14 }}>Dlužníci</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: debtors.length > 0 ? T.red : T.green }}>{debtors.length}</span>
                </div>
                {totalDebt > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}22` }}>
                    <span style={{ color: T.textMuted, fontSize: 14 }}>Celkový dluh</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.red }}>{fmtCZK(totalDebt)}</span>
                  </div>
                )}
                {debtors.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
                    <span style={{ color: T.textDim }}>{d.tenant} (byt {d.id})</span>
                    <span style={{ color: T.red, fontWeight: 500 }}>{fmtCZK(Math.abs(d.balance))}</span>
                  </div>
                ))}
              </div>

              {recentDocs.length > 0 && (
                <div style={{ ...s.card, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Poslední dokumenty</div>
                  {recentDocs.map((doc, i) => {
                    const st = getOblStatus(doc.expiryDate);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < recentDocs.length - 1 ? `1px solid ${T.border}22` : 'none' }}>
                        <span style={{ color: T.accent, display: 'flex', flexShrink: 0 }}>{ICONS.doc}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.documentName}</div>
                          <div style={{ fontSize: 12, color: T.textMuted }}>{getCatLabel(doc.category)} &middot; {doc.name}</div>
                        </div>
                        {doc.expiryDate && <span style={s.tag(st.color)}>{st.label}</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {units.length === 0 && obligations.length === 0 && (
                <div style={{ ...s.card, gridColumn: '1 / -1', textAlign: 'center', color: T.textMuted, padding: 48 }}>
                  Pro tento objekt zatím nejsou k dispozici podrobné údaje.
                </div>
              )}
            </div>
          )}

          {/* ---------- UNITS ---------- */}
          {tab === 'units' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Jednotky ({totalUnits})</div>
                <button onClick={() => setShowAddUnit(true)} style={{ ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  {ICONS.plus} Přidat jednotku
                </button>
              </div>

              {showAddUnit && (
                <div style={{ ...s.card, border: `1px solid ${T.accent}33`, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Nová jednotka</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div><label style={lbl}>Označení *</label><input value={addUnitForm.id} onChange={e => setAddUnitForm({ ...addUnitForm, id: e.target.value })} placeholder="4A" style={inp} /></div>
                    <div><label style={lbl}>Typ *</label><input value={addUnitForm.type} onChange={e => setAddUnitForm({ ...addUnitForm, type: e.target.value })} placeholder="2+1" style={inp} /></div>
                    <div><label style={lbl}>Plocha m2</label><input type="number" value={addUnitForm.area} onChange={e => setAddUnitForm({ ...addUnitForm, area: e.target.value })} placeholder="55" style={inp} /></div>
                    <div><label style={lbl}>Nájem Kč</label><input type="number" value={addUnitForm.rent} onChange={e => setAddUnitForm({ ...addUnitForm, rent: e.target.value })} placeholder="7500" style={inp} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAddUnit(false)} style={{ ...s.btn(false), fontSize: 13 }}>Zrušit</button>
                    <button onClick={handleAddUnit} style={{ ...s.btn(true), fontSize: 13, opacity: addUnitForm.id.trim() && addUnitForm.type.trim() ? 1 : 0.5 }}>Přidat</button>
                  </div>
                </div>
              )}

              {units.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', color: T.textMuted, padding: 48 }}>Žádné jednotky. Přidejte první jednotku tlačítkem výše.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                  {units.map(u => {
                    const isEditing = editUnitId === u.id;
                    return (
                      <div key={u.id} style={{ ...s.card, padding: 20, marginBottom: 0 }}>
                        {isEditing ? (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                              <div><label style={lbl}>Typ</label><input value={editUnitForm.type || ''} onChange={e => setEditUnitForm({ ...editUnitForm, type: e.target.value })} style={inp} /></div>
                              <div><label style={lbl}>Plocha m2</label><input type="number" value={editUnitForm.area || ''} onChange={e => setEditUnitForm({ ...editUnitForm, area: e.target.value })} style={inp} /></div>
                              <div><label style={lbl}>Nájem Kč</label><input type="number" value={editUnitForm.rent || ''} onChange={e => setEditUnitForm({ ...editUnitForm, rent: e.target.value })} style={inp} /></div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button onClick={() => setEditUnitId(null)} style={{ ...s.btn(false), fontSize: 12 }}>Zrušit</button>
                              <button onClick={saveEditUnit} style={{ ...s.btn(true), fontSize: 12 }}>Uložit</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                              <div>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>Byt {u.id}</div>
                                <div style={{ fontSize: 13, color: T.textDim }}>{u.type} &middot; {u.area} m2</div>
                              </div>
                              <span style={s.badge(u.status === 'occupied' ? T.green : T.orange)}>
                                {u.status === 'occupied' ? 'Obsazeno' : 'Volný'}
                              </span>
                            </div>
                            <div style={{ fontSize: 14, marginBottom: 6 }}>
                              <span style={{ color: T.textMuted }}>Nájemník: </span>
                              <span style={{ fontWeight: 500 }}>{u.tenant || 'Volný'}</span>
                            </div>
                            <div style={{ fontSize: 14, marginBottom: 6 }}>
                              <span style={{ color: T.textMuted }}>Nájem: </span>
                              <span style={{ fontWeight: 600, color: T.cyan }}>{fmtCZK(u.rent)}</span>
                            </div>
                            {u.contractEnd && (
                              <div style={{ fontSize: 13, marginBottom: 6 }}>
                                <span style={{ color: T.textMuted }}>Konec smlouvy: </span><span>{fmtDate(u.contractEnd)}</span>
                              </div>
                            )}
                            {u.balance < 0 && (
                              <div style={{ fontSize: 13, color: T.red, fontWeight: 500 }}>Dluh: {fmtCZK(Math.abs(u.balance))}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8, marginTop: 12, borderTop: `1px solid ${T.border}22`, paddingTop: 12 }}>
                              <button onClick={() => startEditUnit(u)} style={{ background: T.accent + '18', color: T.accent, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {ICONS.edit} Upravit
                              </button>
                              <button onClick={() => deleteUnit(u.id)} style={{ background: T.red + '12', color: T.red, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {ICONS.trash} Smazat
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------- OBLIGATIONS ---------- */}
          {tab === 'obligations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Povinnosti ({obligations.length})</div>
                <button onClick={() => setShowAddObl(true)} style={{ ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  {ICONS.plus} Přidat povinnost
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <button onClick={() => setOblFilter('all')} style={s.btn(oblFilter === 'all')}>Vše</button>
                {OBL_CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setOblFilter(c.value)} style={s.btn(oblFilter === c.value)}>{c.label}</button>
                ))}
              </div>

              {showAddObl && (
                <div style={{ ...s.card, border: `1px solid ${T.accent}33`, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Nová povinnost</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
                    <div><label style={lbl}>Název *</label><input value={addOblForm.name} onChange={e => setAddOblForm({ ...addOblForm, name: e.target.value })} placeholder="např. Revize komínu" style={inp} autoFocus /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div><label style={lbl}>Kategorie</label><select value={addOblForm.category} onChange={e => setAddOblForm({ ...addOblForm, category: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>{OBL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                      <div><label style={lbl}>Datum expirace</label><input type="date" value={addOblForm.expiryDate} onChange={e => setAddOblForm({ ...addOblForm, expiryDate: e.target.value })} style={inp} /></div>
                    </div>
                    <div><label style={lbl}>Název dokumentu</label><input value={addOblForm.documentName} onChange={e => setAddOblForm({ ...addOblForm, documentName: e.target.value })} placeholder="např. Revize komín 2025.pdf" style={inp} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAddObl(false)} style={{ ...s.btn(false), fontSize: 13 }}>Zrušit</button>
                    <button onClick={handleAddObl} style={{ ...s.btn(true), fontSize: 13, opacity: addOblForm.name.trim() ? 1 : 0.5 }}>Přidat</button>
                  </div>
                </div>
              )}

              {filteredObls.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', color: T.textMuted, padding: 48 }}>
                  {obligations.length === 0 ? 'Žádné povinnosti. Přidejte první tlačítkem výše.' : 'Žádné povinnosti v této kategorii.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredObls.map(obl => {
                    const st = getOblStatus(obl.expiryDate);
                    const isEditing = editOblId === obl.id;

                    if (isEditing) {
                      return (
                        <div key={obl.id} style={{ ...s.card, border: `1px solid ${T.accent}33`, marginBottom: 0, padding: 20 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
                            <div><label style={lbl}>Název</label><input value={editOblForm.name || ''} onChange={e => setEditOblForm({ ...editOblForm, name: e.target.value })} style={inp} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div><label style={lbl}>Kategorie</label><select value={editOblForm.category || 'jine'} onChange={e => setEditOblForm({ ...editOblForm, category: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>{OBL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                              <div><label style={lbl}>Datum expirace</label><input type="date" value={editOblForm.expiryDate || ''} onChange={e => setEditOblForm({ ...editOblForm, expiryDate: e.target.value })} style={inp} /></div>
                            </div>
                            <div><label style={lbl}>Název dokumentu</label><input value={editOblForm.documentName || ''} onChange={e => setEditOblForm({ ...editOblForm, documentName: e.target.value })} style={inp} /></div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditOblId(null)} style={{ ...s.btn(false), fontSize: 13 }}>Zrušit</button>
                            <button onClick={saveEditObl} style={{ ...s.btn(true), fontSize: 13 }}>Uložit</button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={obl.id} style={{ ...s.card, marginBottom: 0, padding: 20, borderLeft: `4px solid ${st.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 15, fontWeight: 600 }}>{obl.name}</span>
                              <span style={s.tag(st.color)}>{st.label}</span>
                              <span style={{ ...s.tag(T.textMuted), fontSize: 11 }}>{getCatLabel(obl.category)}</span>
                            </div>
                            {obl.expiryDate && <div style={{ fontSize: 13, color: T.textDim, marginBottom: 4 }}>Expirace: {fmtDate(obl.expiryDate)}</div>}
                            {obl.documentName ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.accent }}>{ICONS.doc} {obl.documentName}</div>
                            ) : (
                              <div style={{ fontSize: 13, color: T.red, fontStyle: 'italic' }}>Dokument chybí</div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => startEditObl(obl)} style={{ background: T.accent + '18', color: T.accent, border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }} title="Upravit">{ICONS.edit}</button>
                            <button onClick={() => deleteObl(obl.id)} style={{ background: T.red + '12', color: T.red, border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }} title="Smazat">{ICONS.trash}</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------- MAINTENANCE ---------- */}
          {tab === 'maintenance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Tikety údržby ({allTickets.length})</div>
                <button onClick={() => setShowAddTicket(true)} style={{ ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  {ICONS.plus} Nový tiket
                </button>
              </div>

              {showAddTicket && (
                <div style={{ ...s.card, border: `1px solid ${T.accent}33`, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Nový tiket</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
                    <div><label style={lbl}>Název *</label><input value={addTicketForm.title} onChange={e => setAddTicketForm({ ...addTicketForm, title: e.target.value })} placeholder="např. Prasklá trubka v koupelně" style={inp} autoFocus /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div><label style={lbl}>Priorita</label><select value={addTicketForm.priority} onChange={e => setAddTicketForm({ ...addTicketForm, priority: e.target.value })} style={{ ...inp, cursor: 'pointer' }}><option value="low">Nízká</option><option value="medium">Střední</option><option value="high">Vysoká</option></select></div>
                      <div><label style={lbl}>Jednotka</label><input value={addTicketForm.unit} onChange={e => setAddTicketForm({ ...addTicketForm, unit: e.target.value })} placeholder="např. 2A" style={inp} /></div>
                    </div>
                    <div><label style={lbl}>Popis</label><textarea value={addTicketForm.desc} onChange={e => setAddTicketForm({ ...addTicketForm, desc: e.target.value })} placeholder="Podrobný popis problému..." style={{ ...inp, minHeight: 60, resize: 'vertical' }} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAddTicket(false)} style={{ ...s.btn(false), fontSize: 13 }}>Zrušit</button>
                    <button onClick={handleAddTicket} style={{ ...s.btn(true), fontSize: 13, opacity: addTicketForm.title.trim() ? 1 : 0.5 }}>Vytvořit</button>
                  </div>
                </div>
              )}

              {allTickets.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', color: T.textMuted, padding: 48 }}>Žádné tikety údržby pro tuto nemovitost.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allTickets.map(t => (
                    <div key={t.id} style={{ ...s.card, marginBottom: 0, padding: 20, borderLeft: `4px solid ${priorityColors[t.priority] || T.textMuted}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 15, fontWeight: 600 }}>{t.title}</span>
                            <span style={s.tag(statusColors[t.status] || T.textMuted)}>{statusLabels[t.status] || t.status}</span>
                            <span style={s.tag(priorityColors[t.priority] || T.textMuted)}>{priorityLabels[t.priority] || t.priority}</span>
                          </div>
                          {t.unit && <div style={{ fontSize: 13, color: T.textDim, marginBottom: 4 }}>Jednotka: {t.unit}</div>}
                          {t.desc && <div style={{ fontSize: 13, color: T.textDim, marginBottom: 4, lineHeight: '1.5' }}>{t.desc}</div>}
                          <div style={{ fontSize: 12, color: T.textMuted, display: 'flex', gap: 14 }}>
                            <span>Vytvořeno: {fmtDate(t.created)}</span>
                            {t.assignee && <span>Přiřazeno: {t.assignee}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
