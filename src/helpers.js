/* eslint-disable */
import { STATUS_COLORS } from './theme';

export function fmt(n) { return n.toLocaleString('cs-CZ'); }
export function fmtCZK(n) { return n.toLocaleString('cs-CZ') + ' Kč'; }

export function getRevColor(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((new Date(dateStr) - new Date()) / 864e5);
  if (diff < 0) return STATUS_COLORS.red;
  if (diff <= 30) return STATUS_COLORS.orange;
  if (diff <= 90) return STATUS_COLORS.yellow;
  return STATUS_COLORS.green;
}

export function getRevLabel(dateStr) {
  if (!dateStr) return 'N/A';
  const diff = Math.floor((new Date(dateStr) - new Date()) / 864e5);
  if (diff < 0) return `${Math.abs(diff)}d po termínu`;
  if (diff === 0) return 'Dnes!';
  return `za ${diff}d`;
}

export function fmtDate(d) {
  if (!d) return '—';
  const p = d.split('-');
  return `${p[2]}.${p[1]}.${p[0]}`;
}

export function getAllTenants(properties) {
  const list = [];
  properties.forEach(p => {
    p.units.forEach(u => {
      if (u.tenant) {
        list.push({ ...u, property: p.name, city: p.city, propertyId: p.id });
      }
    });
  });
  return list;
}
