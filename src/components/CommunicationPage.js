/* eslint-disable */
import React from 'react';
import { T, s } from '../theme';
import { SectionTitle } from './shared';

export default function CommunicationPage() {
  return (
    <div className="fade-in">
      <SectionTitle>Komunikace</SectionTitle>
      <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>{'\u2709'}</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Komunikační modul</div>
        <div style={{ color: T.textDim, maxWidth: 400, margin: '0 auto', lineHeight: '1.6' }}>
          Zde bude modul pro komunikaci s nájemníky, vlastníky a dodavateli.
          Notifikace, hromadné zprávy, historie komunikace.
        </div>
        <div style={{ marginTop: 24 }}>
          <button style={{ ...s.btn(true), padding: '12px 24px', opacity: 0.5, cursor: 'default' }}>Připravujeme...</button>
        </div>
      </div>
    </div>
  );
}
