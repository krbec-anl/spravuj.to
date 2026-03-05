/* eslint-disable */
import React from 'react';
import { useTheme } from '../theme';
import { SectionTitle } from './shared';

export default function CommunicationPage() {
  const { T, s } = useTheme();
  return (
    <div className="fade-in">
      <SectionTitle>Komunikace</SectionTitle>
      <div style={{ ...s.card, padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>{'\u2709'}</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Komunikační modul</div>
        <div style={{ color: T.textDim, maxWidth: 400, margin: '0 auto', lineHeight: '1.7', fontSize: 15 }}>
          Zde bude modul pro komunikaci s nájemníky, vlastníky a dodavateli.
          Notifikace, hromadné zprávy, historie komunikace.
        </div>
        <div style={{ marginTop: 28 }}>
          <button style={{ ...s.btn(true), padding: '12px 28px', fontSize: 15, opacity: 0.5, cursor: 'default' }}>Připravujeme...</button>
        </div>
      </div>
    </div>
  );
}
