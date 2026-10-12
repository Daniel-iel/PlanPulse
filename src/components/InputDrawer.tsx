'use client';

import { useState } from 'react';
import { EXAMPLE_TEXT, EXAMPLE_JSON } from '@/lib/examples';
import { messages, type Locale } from '@/lib/i18n';

interface Props {
  open: boolean;
  onToggle: () => void;
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  error: string;
  locale: Locale;
}

export default function InputDrawer({ open, onToggle, value, onChange, onAnalyze, error, locale }: Props) {
  const t = messages[locale].app;
  return (
    <details className="input-drawer" open={open}>
      <summary className="drawer-summary" onClick={(e) => { e.preventDefault(); onToggle(); }}>
        <span className={`chev ${open ? 'open' : ''}`}>▸</span> {t.inputSummary}
      </summary>
      <div className="drawer-body">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.inputPlaceholder}
          spellCheck={false}
        />
        <div className="btn-row">
          <button className="btn-primary" onClick={onAnalyze}>
            {t.analyze}
          </button>
          <button className="btn-ghost" onClick={() => onChange(EXAMPLE_TEXT)}>
            {t.exampleText}
          </button>
          <button className="btn-ghost" onClick={() => onChange(EXAMPLE_JSON)}>
            {t.exampleJson}
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>
    </details>
  );
}
