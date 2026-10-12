'use client';

import { useState } from 'react';
import { EXAMPLE_TEXT, EXAMPLE_JSON } from '@/lib/examples';

interface Props {
  open: boolean;
  onToggle: () => void;
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  error: string;
}

export default function InputDrawer({ open, onToggle, value, onChange, onAnalyze, error }: Props) {
  return (
    <details className="input-drawer" open={open}>
      <summary className="drawer-summary" onClick={(e) => { e.preventDefault(); onToggle(); }}>
        <span className={`chev ${open ? 'open' : ''}`}>▸</span> Cole o EXPLAIN aqui (texto ou JSON)
      </summary>
      <div className="drawer-body">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole aqui o resultado de EXPLAIN ANALYZE..."
          spellCheck={false}
        />
        <div className="btn-row">
          <button className="btn-primary" onClick={onAnalyze}>
            Analisar plano
          </button>
          <button className="btn-ghost" onClick={() => onChange(EXAMPLE_TEXT)}>
            Exemplo (texto)
          </button>
          <button className="btn-ghost" onClick={() => onChange(EXAMPLE_JSON)}>
            Exemplo (JSON)
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>
    </details>
  );
}
