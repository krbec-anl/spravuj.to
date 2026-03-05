/* eslint-disable */
import { useState, useRef } from 'react';
import { useTheme } from '../theme';
import ICONS from '../icons';
import { fmtCZK, fmtDate } from '../helpers';
import { MAINTENANCE, REV_TYPES, DOC_CATEGORIES } from '../data/mockData';
import { StatCard, SectionTitle, SubTitle } from './shared';

export default function PropertyProfilePage({ propertyId, properties, onBack, documents, onAddDoc, onDeleteDoc, onUpdateProperty, onDeleteProperty }) {
  const { T, s, isDark } = useTheme();
  const p = properties.find(x => x.id === propertyId);
  const [tab, setTab] = useState('overview');
  const [docFilter, setDocFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'revize', revisionType: '' });
  const fileInputRef = useRef(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', address: '', city: '', ownership: 'own', owner: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [addUnitForm, setAddUnitForm] = useState({ id: '', type: '', area: '', rent: '' });
  const [editUnit, setEditUnit] = useState(null);
  const [editUnitForm, setEditUnitForm] = useState({});
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [tenantForm, setTenantForm] = useState({ tenant: '', deposit: '', contractEnd: '' });
  const [confirmDeleteUnit, setConfirmDeleteUnit] = useState(false);

  if (!p) return <div style={{ color: T.textDim }}>Nemovitost nenalezena.</div>;

  const occ = p.units.filter(u => u.status === 'occupied').length;
  const income = p.units.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0);
  const debtors = p.units.filter(u => u.balance < 0);
  const totalDebt = debtors.reduce((a, u) => a + u.balance, 0);
  const propDocs = documents.filter(d => d.propertyId === propertyId);
  const filteredDocs = propDocs.filter(d => docFilter === 'all' || d.category === docFilter);
  const propMaintenance = MAINTENANCE.filter(m => m.property.includes(p.name.split(' ')[0]));

  const tabs = [
    { id: 'overview', label: 'Přehled', icon: 'info' },
    { id: 'units', label: 'Jednotky', icon: 'units' },
    { id: 'documents', label: `Dokumenty (${propDocs.length})`, icon: 'doc' },
    { id: 'revisions', label: 'Revize', icon: 'shield' },
    { id: 'maintenance', label: 'Údržba', icon: 'wrench' },
  ];

  const handleUpload = () => {
    if (!uploadForm.name.trim()) return;
    onAddDoc({
      id: Date.now(),
      propertyId,
      name: uploadForm.name,
      category: uploadForm.category,
      revisionType: uploadForm.category === 'revize' ? uploadForm.revisionType : null,
      date: new Date().toISOString().split('T')[0],
      size: '— KB',
    });
    setUploadForm({ name: '', category: 'revize', revisionType: '' });
    setShowUpload(false);
  };

  const openEditModal = () => {
    setEditForm({ name: p.name, address: p.address, city: p.city, ownership: p.ownership, owner: p.owner || '' });
    setShowEdit(true);
    setConfirmDelete(false);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editForm.address.trim() || !editForm.city.trim()) return;
    if (editForm.ownership === 'foreign' && !editForm.owner.trim()) return;
    onUpdateProperty({
      ...p,
      name: editForm.name.trim(),
      address: editForm.address.trim(),
      city: editForm.city.trim(),
      ownership: editForm.ownership,
      owner: editForm.ownership === 'foreign' ? editForm.owner.trim() : null,
    });
    setShowEdit(false);
  };

  const handleAddUnit = () => {
    if (!addUnitForm.id.trim() || !addUnitForm.type.trim() || !addUnitForm.area || !addUnitForm.rent) return;
    const newUnits = [...p.units, {
      id: addUnitForm.id.trim(),
      type: addUnitForm.type.trim(),
      area: Number(addUnitForm.area),
      rent: Number(addUnitForm.rent),
      tenant: null, status: 'vacant', contractEnd: null, deposit: 0, balance: 0,
    }];
    onUpdateProperty({ ...p, units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setAddUnitForm({ id: '', type: '', area: '', rent: '' });
    setShowAddUnit(false);
  };

  const openUnitEdit = (u) => {
    setEditUnit(u.id);
    setEditUnitForm({ id: u.id, type: u.type, area: u.area, rent: u.rent });
    setShowTenantForm(false);
    setTenantForm({ tenant: '', deposit: '', contractEnd: '' });
    setConfirmDeleteUnit(false);
  };

  const handleUnitEditSave = () => {
    if (!editUnitForm.id || !editUnitForm.type || !editUnitForm.area || !editUnitForm.rent) return;
    const newUnits = p.units.map(u => u.id === editUnit ? {
      ...u, id: editUnitForm.id, type: editUnitForm.type, area: Number(editUnitForm.area), rent: Number(editUnitForm.rent),
    } : u);
    onUpdateProperty({ ...p, units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setEditUnit(null);
  };

  const handleDeleteUnit = () => {
    const newUnits = p.units.filter(u => u.id !== editUnit);
    onUpdateProperty({ ...p, units: newUnits, totalUnits: newUnits.length, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setEditUnit(null);
  };

  const handleAssignTenant = () => {
    if (!tenantForm.tenant.trim() || !tenantForm.deposit || !tenantForm.contractEnd) return;
    const newUnits = p.units.map(u => u.id === editUnit ? {
      ...u, tenant: tenantForm.tenant.trim(), status: 'occupied',
      deposit: Number(tenantForm.deposit), contractEnd: tenantForm.contractEnd, balance: 0,
    } : u);
    onUpdateProperty({ ...p, units: newUnits, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setEditUnit(null);
  };

  const handleEvictTenant = () => {
    const newUnits = p.units.map(u => u.id === editUnit ? {
      ...u, tenant: null, status: 'vacant', deposit: 0, contractEnd: null, balance: 0,
    } : u);
    onUpdateProperty({ ...p, units: newUnits, monthlyIncome: newUnits.filter(u => u.status === 'occupied').reduce((a, u) => a + u.rent, 0) });
    setEditUnit(null);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <button onClick={onBack} style={{
        ...s.btn(false), marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
        background: 'transparent', padding: '8px 12px',
      }}
        onMouseEnter={e => e.currentTarget.style.background = T.card}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {ICONS.arrowLeft} Zpět na nemovitosti
      </button>

      <div style={{
        ...s.card, padding: 24, marginBottom: 20,
        background: `linear-gradient(135deg, ${T.card} 0%, ${T.accent}11 100%)`,
        borderLeft: `4px solid ${T.accent}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: T.text, margin: 0 }}>{p.name}</h1>
              <button onClick={openEditModal} style={{
                background: T.accent + '22', color: T.accent, border: 'none',
                borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                transition: 'all .15s',
              }} title="Upravit nemovitost"
                onMouseEnter={e => { e.currentTarget.style.background = T.accent + '44'; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.accent + '22'; }}
              >{ICONS.edit}</button>
              <span style={s.badge(p.ownership === 'own' ? T.green : T.purple)}>
                {p.ownership === 'own' ? 'Vlastní' : `Cizí — ${p.owner}`}
              </span>
            </div>
            <div style={{ color: T.textDim, fontSize: 14 }}>{p.address}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Jednotky</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{occ}/{p.totalUnits}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Příjem/měs</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.green }}>{fmtCZK(income)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Dokumenty</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.cyan }}>{propDocs.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${T.border}`,
        paddingBottom: 0, overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', border: 'none', cursor: 'pointer',
            background: 'transparent',
            color: tab === t.id ? T.accent : T.textDim,
            fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
            transition: 'all .15s', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = T.textDim; }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{ICONS[t.icon]}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {tab === 'overview' && (
        <div>
          <div style={s.grid4}>
            <StatCard label="Obsazenost" value={`${((occ / p.totalUnits) * 100).toFixed(0)}%`} sub={`${occ} z ${p.totalUnits} obsazeno`} color={T.green} />
            <StatCard label="Měsíční příjem" value={fmtCZK(income)} color={T.cyan} />
            <StatCard label="Dokumenty" value={propDocs.length} sub={`${propDocs.filter(d => d.category === 'revize').length} revizí`} color={T.blue} />
            <StatCard label="Dluhy" value={totalDebt < 0 ? fmtCZK(totalDebt) : 'Žádné'} color={totalDebt < 0 ? T.red : T.green} />
          </div>

          <div style={s.grid2}>
            <div style={s.card}>
              <SubTitle>Informace o nemovitosti</SubTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Adresa', p.address],
                  ['Město', p.city],
                  ['Vlastnictví', p.ownership === 'own' ? 'Vlastní' : `Cizí (${p.owner})`],
                  ['Počet jednotek', p.totalUnits],
                  ['Obsazené', occ],
                  ['Volné', p.totalUnits - occ],
                ].map(([label, value], i) => (
                  <div key={i} style={{ padding: '8px 12px', background: T.bg, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {debtors.length > 0 && (
              <div style={s.card}>
                <SubTitle>Dlužníci</SubTitle>
                <div style={{ background: T.red + '11', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.red, marginBottom: 8 }}>
                    Celkem: {fmtCZK(totalDebt)}
                  </div>
                  {debtors.map((u, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                      borderTop: i > 0 ? `1px solid ${T.red}22` : 'none',
                    }}>
                      <span style={{ color: T.text, fontSize: 13 }}>{u.tenant} <span style={{ color: T.textMuted }}>(byt {u.id})</span></span>
                      <span style={{ color: T.red, fontWeight: 600, fontSize: 13 }}>{fmtCZK(u.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debtors.length === 0 && (
              <div style={s.card}>
                <SubTitle>Poslední dokumenty</SubTitle>
                {propDocs.slice(0, 5).map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                    borderBottom: `1px solid ${T.border}22`,
                  }}>
                    <span style={{ color: T.accent, display: 'flex' }}>{ICONS.doc}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{fmtDate(doc.date)} · {doc.size}</div>
                    </div>
                  </div>
                ))}
                {propDocs.length === 0 && (
                  <div style={{ color: T.textMuted, fontSize: 13, padding: 16, textAlign: 'center' }}>Žádné dokumenty</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Units */}
      {tab === 'units' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => { setShowAddUnit(true); setAddUnitForm({ id: '', type: '', area: '', rent: '' }); }} style={{
              ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            }}>
              {ICONS.plus} Přidat jednotku
            </button>
          </div>
          <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead><tr>
                  <th style={s.th}>Byt</th><th style={s.th}>Typ</th><th style={s.th}>m²</th>
                  <th style={s.th}>Nájemník</th><th style={s.th}>Nájemné</th><th style={s.th}>Kauce</th>
                  <th style={s.th}>Konec smlouvy</th><th style={s.th}>Stav</th><th style={s.th}>Saldo</th>
                </tr></thead>
                <tbody>
                  {p.units.map(u => (
                    <tr key={u.id} onClick={() => openUnitEdit(u)} style={{
                      background: u.status === 'vacant' ? T.red + '08' : 'transparent',
                      cursor: 'pointer', transition: 'background .15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.accent + '0d'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = u.status === 'vacant' ? T.red + '08' : 'transparent'; }}
                    >
                      <td style={{ ...s.td, fontWeight: 600 }}>{u.id}</td>
                      <td style={s.td}>{u.type}</td>
                      <td style={s.td}>{u.area}</td>
                      <td style={s.td}>{u.tenant || <span style={{ color: T.textMuted, fontStyle: 'italic' }}>Neobsazeno</span>}</td>
                      <td style={s.td}>{fmtCZK(u.rent)}</td>
                      <td style={{ ...s.td, color: T.textDim }}>{u.deposit ? fmtCZK(u.deposit) : '—'}</td>
                      <td style={s.td}>{fmtDate(u.contractEnd)}</td>
                      <td style={s.td}>
                        <span style={s.badge(u.status === 'occupied' ? T.green : T.red)}>
                          {u.status === 'occupied' ? 'Obsazeno' : 'Volný'}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: u.balance < 0 ? T.red : T.green, fontWeight: 600 }}>
                        {u.balance < 0 ? fmtCZK(u.balance) : 'OK'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {p.units.length === 0 && (
            <div style={{ ...s.card, padding: 40, textAlign: 'center', marginTop: 8 }}>
              <div style={{ color: T.textMuted, fontSize: 14 }}>Žádné jednotky. Přidejte první jednotku.</div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Documents */}
      {tab === 'documents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.entries(DOC_CATEGORIES).map(([key, label]) => (
                <button key={key} onClick={() => setDocFilter(key)} style={{
                  ...s.btn(docFilter === key), fontSize: 12, padding: '6px 12px',
                }}>
                  {label}
                  {key !== 'all' && ` (${propDocs.filter(d => d.category === key).length})`}
                </button>
              ))}
            </div>
            <button onClick={() => setShowUpload(!showUpload)} style={{
              ...s.btn(true), display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            }}>
              {ICONS.upload} Nahrát dokument
            </button>
          </div>

          {/* Upload form */}
          {showUpload && (
            <div style={{ ...s.card, marginBottom: 16, border: `1px solid ${T.accent}44` }}>
              <SubTitle>Nahrát nový dokument</SubTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Název dokumentu</label>
                  <input
                    value={uploadForm.name}
                    onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                    placeholder="např. Revizní zpráva - Komín 2026.pdf"
                    style={s.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Kategorie</label>
                  <select
                    value={uploadForm.category}
                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                    style={{ ...s.input, cursor: 'pointer' }}
                  >
                    {Object.entries(DOC_CATEGORIES).filter(([k]) => k !== 'all').map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                {uploadForm.category === 'revize' && (
                  <div>
                    <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Typ revize</label>
                    <select
                      value={uploadForm.revisionType}
                      onChange={e => setUploadForm({ ...uploadForm, revisionType: e.target.value })}
                      style={{ ...s.input, cursor: 'pointer' }}
                    >
                      <option value="">Vyberte typ...</option>
                      {REV_TYPES.map(rt => (
                        <option key={rt.name} value={rt.name}>{rt.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => fileInputRef.current?.click()} style={{
                  ...s.btn(false), display: 'flex', alignItems: 'center', gap: 6,
                  border: `1px dashed ${T.border}`,
                }}>
                  {ICONS.folder} Vybrat soubor
                </button>
                <input ref={fileInputRef} type="file" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && !uploadForm.name) {
                      setUploadForm(prev => ({ ...prev, name: file.name }));
                    }
                  }}
                />
                <button onClick={handleUpload} style={{
                  ...s.btn(true), padding: '8px 20px',
                  opacity: uploadForm.name.trim() ? 1 : 0.5,
                }}>
                  Nahrát
                </button>
                <button onClick={() => setShowUpload(false)} style={{
                  ...s.btn(false), padding: '8px 16px',
                }}>
                  Zrušit
                </button>
              </div>
            </div>
          )}

          {/* Document list */}
          {filteredDocs.length > 0 ? (
            <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
              <table style={s.table}>
                <thead><tr>
                  <th style={s.th}>Dokument</th>
                  <th style={s.th}>Kategorie</th>
                  <th style={s.th}>Typ revize</th>
                  <th style={s.th}>Datum</th>
                  <th style={s.th}>Velikost</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Akce</th>
                </tr></thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: T.accent, display: 'flex', flexShrink: 0 }}>{ICONS.doc}</span>
                          <span style={{ fontWeight: 500 }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={s.tag(
                          doc.category === 'revize' ? T.orange :
                          doc.category === 'smlouvy' ? T.blue :
                          doc.category === 'pojisteni' ? T.purple :
                          doc.category === 'technicke' ? T.cyan : T.textDim
                        )}>
                          {DOC_CATEGORIES[doc.category] || doc.category}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: doc.revisionType ? T.text : T.textMuted }}>
                        {doc.revisionType || '—'}
                      </td>
                      <td style={s.td}>{fmtDate(doc.date)}</td>
                      <td style={{ ...s.td, color: T.textDim }}>{doc.size}</td>
                      <td style={{ ...s.td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button style={{
                            background: T.accent + '22', color: T.accent, border: 'none',
                            borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          }} title="Zobrazit">
                            {ICONS.eye}
                          </button>
                          <button style={{
                            background: T.green + '22', color: T.green, border: 'none',
                            borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          }} title="Stáhnout">
                            {ICONS.download}
                          </button>
                          <button onClick={() => onDeleteDoc(doc.id)} style={{
                            background: T.red + '22', color: T.red, border: 'none',
                            borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          }} title="Smazat">
                            {ICONS.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
              <div style={{ color: T.accent, display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.4 }}>{ICONS.folder}</div>
              <div style={{ color: T.textDim, fontSize: 14 }}>
                {docFilter === 'all' ? 'Žádné dokumenty. Nahrajte první dokument.' : `Žádné dokumenty v kategorii "${DOC_CATEGORIES[docFilter]}".`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Revisions */}
      {tab === 'revisions' && (
        <div>
          <div style={{ ...s.card, marginBottom: 16 }}>
            <SubTitle>Revize a dokumenty</SubTitle>
            <div style={{ color: T.textDim, fontSize: 13, marginBottom: 16, marginTop: -8 }}>
              Přehled všech revizí s možností nahrát a prohlížet dokumenty
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REV_TYPES.map(rt => {
                const revDocs = propDocs.filter(d => d.revisionType === rt.name);
                return (
                  <div key={rt.name} style={{
                    background: T.bg, borderRadius: 10, padding: 14,
                    border: `1px solid ${T.border}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: T.accent, display: 'flex' }}>{ICONS.shield}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{rt.name}</div>
                          <div style={{ fontSize: 11, color: T.textMuted }}>
                            {rt.period && `Perioda: ${rt.period}`}
                            {rt.period && rt.supplier && ' · '}
                            {rt.supplier && `Dodavatel: ${rt.supplier}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={s.tag(revDocs.length > 0 ? T.green : T.textMuted)}>
                          {revDocs.length > 0 ? `${revDocs.length} dok.` : 'Žádné dok.'}
                        </span>
                        <button onClick={() => {
                          setTab('documents');
                          setDocFilter('revize');
                          setShowUpload(true);
                          setUploadForm({ name: '', category: 'revize', revisionType: rt.name });
                        }} style={{
                          ...s.btn(false), fontSize: 11, padding: '4px 10px',
                          display: 'flex', alignItems: 'center', gap: 4,
                          border: `1px solid ${T.border}`,
                        }}>
                          {ICONS.plus} Nahrát
                        </button>
                      </div>
                    </div>
                    {revDocs.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                        {revDocs.map(doc => (
                          <div key={doc.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '4px 0', gap: 8,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: T.accent, display: 'flex' }}>{ICONS.doc}</span>
                              <span style={{ fontSize: 12, fontWeight: 500 }}>{doc.name}</span>
                              <span style={{ fontSize: 11, color: T.textMuted }}>{fmtDate(doc.date)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button style={{
                                background: T.accent + '22', color: T.accent, border: 'none',
                                borderRadius: 4, padding: '3px 6px', cursor: 'pointer', display: 'flex',
                              }} title="Zobrazit">{ICONS.eye}</button>
                              <button style={{
                                background: T.green + '22', color: T.green, border: 'none',
                                borderRadius: 4, padding: '3px 6px', cursor: 'pointer', display: 'flex',
                              }} title="Stáhnout">{ICONS.download}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Maintenance */}
      {tab === 'maintenance' && (
        <div>
          {propMaintenance.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {propMaintenance.map(t => {
                const prioColor = { high: T.red, medium: T.orange, low: T.blue };
                const prioLabel = { high: 'Vysoká', medium: 'Střední', low: 'Nízká' };
                const statusColor = { new: T.yellow, in_progress: T.cyan, resolved: T.green };
                const statusLabel = { new: 'Nový', in_progress: 'Řeší se', resolved: 'Vyřešeno' };
                return (
                  <div key={t.id} style={{ ...s.card, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>#{t.id}</span>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{t.title}</span>
                        </div>
                        <div style={{ color: T.textDim, fontSize: 12, marginBottom: 8 }}>
                          Byt {t.unit} &middot; {fmtDate(t.created)}
                        </div>
                        <div style={{ color: T.textDim, fontSize: 13, lineHeight: '1.5' }}>{t.desc}</div>
                        {t.assignee && <div style={{ marginTop: 8, fontSize: 12, color: T.textDim }}>Přiřazeno: <span style={{ color: T.text }}>{t.assignee}</span></div>}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={s.badge(prioColor[t.priority])}>{prioLabel[t.priority]}</span>
                        <span style={s.badge(statusColor[t.status])}>{statusLabel[t.status]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
              <div style={{ color: T.textDim, fontSize: 14 }}>Žádné tikety údržby pro tuto nemovitost.</div>
            </div>
          )}
        </div>
      )}

      {/* ===== MODAL: Edit property ===== */}
      {showEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowEdit(false); }}>
          <div style={{ ...s.card, maxWidth: 500, width: '100%', border: `1px solid ${T.accent}44`, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: T.text }}>Upravit nemovitost</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Název *</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Adresa *</label>
                <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Město *</label>
                <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Vlastnictví *</label>
                <select value={editForm.ownership} onChange={e => setEditForm({ ...editForm, ownership: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="own">Vlastní</option>
                  <option value="foreign">Cizí</option>
                </select>
              </div>
              {editForm.ownership === 'foreign' && (
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Vlastník (jméno) *</label>
                  <input value={editForm.owner} onChange={e => setEditForm({ ...editForm, owner: e.target.value })} style={s.input} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <div>
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)} style={{
                    ...s.btn(false), color: T.red, padding: '10px 16px', border: `1px solid ${T.red}44`,
                  }}>
                    {ICONS.trash} Smazat nemovitost
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: T.red, fontWeight: 600 }}>Opravdu smazat? Smažou se i všechny jednotky.</span>
                    <button onClick={() => onDeleteProperty(p.id)} style={{
                      ...s.btn(false), color: '#fff', background: T.red, padding: '8px 16px',
                    }}>Ano, smazat</button>
                    <button onClick={() => setConfirmDelete(false)} style={{ ...s.btn(false), padding: '8px 12px' }}>Ne</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowEdit(false)} style={{ ...s.btn(false), padding: '10px 20px' }}>Zrušit</button>
                <button onClick={handleEditSave} style={{ ...s.btn(true), padding: '10px 20px' }}>Uložit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Add unit ===== */}
      {showAddUnit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddUnit(false); }}>
          <div style={{ ...s.card, maxWidth: 460, width: '100%', border: `1px solid ${T.accent}44`, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: T.text }}>Nová jednotka</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Označení bytu *</label>
                <input value={addUnitForm.id} onChange={e => setAddUnitForm({ ...addUnitForm, id: e.target.value })} placeholder='např. "1A", "2B"' style={s.input} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Typ *</label>
                <input value={addUnitForm.type} onChange={e => setAddUnitForm({ ...addUnitForm, type: e.target.value })} placeholder='např. "2+1", "3+kk"' style={s.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Plocha (m²) *</label>
                  <input type="number" value={addUnitForm.area} onChange={e => setAddUnitForm({ ...addUnitForm, area: e.target.value })} placeholder="55" style={s.input} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Měsíční nájem (Kč) *</label>
                  <input type="number" value={addUnitForm.rent} onChange={e => setAddUnitForm({ ...addUnitForm, rent: e.target.value })} placeholder="7500" style={s.input} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddUnit(false)} style={{ ...s.btn(false), padding: '10px 20px' }}>Zrušit</button>
              <button onClick={handleAddUnit} style={{
                ...s.btn(true), padding: '10px 20px',
                opacity: addUnitForm.id && addUnitForm.type && addUnitForm.area && addUnitForm.rent ? 1 : 0.5,
              }}>Vytvořit</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Edit unit ===== */}
      {editUnit && (() => {
        const u = p.units.find(x => x.id === editUnit);
        if (!u) return null;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={e => { if (e.target === e.currentTarget) setEditUnit(null); }}>
            <div style={{ ...s.card, maxWidth: 520, width: '100%', border: `1px solid ${T.accent}44`, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: T.text }}>
                Jednotka {u.id} — {u.status === 'occupied' ? u.tenant : 'Volný'}
              </h3>

              {/* Info section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informace o jednotce</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Označení</label>
                    <input value={editUnitForm.id || ''} onChange={e => setEditUnitForm({ ...editUnitForm, id: e.target.value })} style={s.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Typ</label>
                    <input value={editUnitForm.type || ''} onChange={e => setEditUnitForm({ ...editUnitForm, type: e.target.value })} style={s.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Plocha (m²)</label>
                    <input type="number" value={editUnitForm.area || ''} onChange={e => setEditUnitForm({ ...editUnitForm, area: e.target.value })} style={s.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Nájem (Kč)</label>
                    <input type="number" value={editUnitForm.rent || ''} onChange={e => setEditUnitForm({ ...editUnitForm, rent: e.target.value })} style={s.input} />
                  </div>
                </div>
                <button onClick={handleUnitEditSave} style={{ ...s.btn(true), marginTop: 12, padding: '8px 16px' }}>Uložit změny</button>
              </div>

              {/* Tenant section */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nájemník</div>
                {u.status === 'occupied' ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Jméno</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{u.tenant}</div>
                      </div>
                      <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Kauce</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtCZK(u.deposit)}</div>
                      </div>
                      <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Konec smlouvy</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtDate(u.contractEnd)}</div>
                      </div>
                      <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Saldo</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: u.balance < 0 ? T.red : T.green }}>
                          {u.balance < 0 ? fmtCZK(u.balance) : 'OK'}
                        </div>
                      </div>
                    </div>
                    <button onClick={handleEvictTenant} style={{
                      ...s.btn(false), color: T.orange, border: `1px solid ${T.orange}44`, padding: '8px 16px',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      Vystěhovat nájemníka
                    </button>
                  </div>
                ) : (
                  <div>
                    {!showTenantForm ? (
                      <button onClick={() => setShowTenantForm(true)} style={{
                        ...s.btn(true), padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {ICONS.plus} Nasadit nájemníka
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Jméno nájemníka *</label>
                          <input value={tenantForm.tenant} onChange={e => setTenantForm({ ...tenantForm, tenant: e.target.value })} placeholder="Jan Novák" style={s.input} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Kauce (Kč) *</label>
                            <input type="number" value={tenantForm.deposit} onChange={e => setTenantForm({ ...tenantForm, deposit: e.target.value })} placeholder="15000" style={s.input} />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: T.textMuted, display: 'block', marginBottom: 4 }}>Konec smlouvy *</label>
                            <input type="date" value={tenantForm.contractEnd} onChange={e => setTenantForm({ ...tenantForm, contractEnd: e.target.value })} style={s.input} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={handleAssignTenant} style={{
                            ...s.btn(true), padding: '8px 16px',
                            opacity: tenantForm.tenant.trim() && tenantForm.deposit && tenantForm.contractEnd ? 1 : 0.5,
                          }}>Nasadit</button>
                          <button onClick={() => setShowTenantForm(false)} style={{ ...s.btn(false), padding: '8px 16px' }}>Zrušit</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delete unit */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!confirmDeleteUnit ? (
                  <button onClick={() => setConfirmDeleteUnit(true)} style={{
                    ...s.btn(false), color: T.red, border: `1px solid ${T.red}44`, padding: '8px 16px',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {ICONS.trash} Smazat jednotku
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: T.red, fontWeight: 600 }}>Opravdu smazat jednotku?</span>
                    <button onClick={handleDeleteUnit} style={{ ...s.btn(false), color: '#fff', background: T.red, padding: '8px 16px' }}>Ano</button>
                    <button onClick={() => setConfirmDeleteUnit(false)} style={{ ...s.btn(false), padding: '8px 12px' }}>Ne</button>
                  </div>
                )}
                <button onClick={() => setEditUnit(null)} style={{ ...s.btn(false), padding: '10px 20px' }}>Zavřít</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
