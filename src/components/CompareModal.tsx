'use client';

import type { HistoryEntry } from '@/lib/types';
import { ptNum, formatRelativeTime } from '@/lib/format';

interface Props {
  open: boolean;
  left: HistoryEntry | null;
  right: HistoryEntry | null;
  onClose: () => void;
  onLoad: (id: string) => void;
}

function CompareRow({
  label,
  aVal,
  bVal,
  unit,
  lowerIsBetter,
}: {
  label: string;
  aVal: number | null;
  bVal: number | null;
  unit: string;
  lowerIsBetter: boolean | null;
}) {
  const aStr = aVal != null ? ptNum(aVal, unit === 'ms' ? 2 : 0) + unit : '–';
  const bStr = bVal != null ? ptNum(bVal, unit === 'ms' ? 2 : 0) + unit : '–';
  let delta: React.ReactNode = null;
  if (aVal != null && bVal != null && lowerIsBetter != null) {
    const diff = bVal - aVal;
    if (Math.abs(diff) > 0.0001) {
      const better = lowerIsBetter ? diff < 0 : diff > 0;
      const pct = aVal !== 0 ? Math.abs((diff / aVal) * 100) : null;
      delta = (
        <span className={`delta ${better ? 'delta-good' : 'delta-bad'}`}>
          {diff > 0 ? '▲' : '▼'} {pct != null ? pct.toFixed(1) + '%' : ptNum(Math.abs(diff), 2)}
        </span>
      );
    } else {
      delta = <span className="delta">—</span>;
    }
  }
  return (
    <div className="compare-row">
      <span className="cr-label">{label}</span>
      <span className="cr-a">{aStr}</span>
      <span className="cr-delta">{delta}</span>
      <span className="cr-b">{bStr}</span>
    </div>
  );
}

function warningKeyLabel(k: string) {
  const [title, ref] = k.split('|');
  return (
    <>
      {title} <span style={{ color: 'var(--fog-dim)' }}>({ref})</span>
    </>
  );
}

export default function CompareModal({ open, left, right, onClose, onLoad }: Props) {
  if (!open || !left || !right) return null;
  const a = left.summary;
  const b = right.summary;

  const setA = new Set(a.warningKeys);
  const setB = new Set(b.warningKeys);
  const resolved = a.warningKeys.filter((k) => !setB.has(k));
  const novos = b.warningKeys.filter((k) => !setA.has(k));

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box wide">
        <div className="modal-head">
          <h2>Comparação entre planos</h2>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="compare-heads">
          <div>
            <div className="compare-name">{left.label}</div>
            <div className="compare-date">{formatRelativeTime(left.savedAt)}</div>
          </div>
          <div>
            <div className="compare-name">{right.label}</div>
            <div className="compare-date">{formatRelativeTime(right.savedAt)}</div>
          </div>
        </div>

        <div className="compare-rows">
          <CompareRow label="Tempo de execução" aVal={a.executionTime} bVal={b.executionTime} unit="ms" lowerIsBetter />
          <CompareRow label="Tempo de planejamento" aVal={a.planningTime} bVal={b.planningTime} unit="ms" lowerIsBetter />
          <CompareRow label="Nós no plano" aVal={a.nodeCount} bVal={b.nodeCount} unit="" lowerIsBetter={null} />
          <CompareRow label="Avisos" aVal={a.warningsCount} bVal={b.warningsCount} unit="" lowerIsBetter />
          <CompareRow label="Críticos" aVal={a.criticalCount} bVal={b.criticalCount} unit="" lowerIsBetter />
        </div>

        {resolved.length || novos.length ? (
          <div className="compare-diff">
            <div>
              {resolved.length > 0 && (
                <>
                  <div className="diff-head" style={{ color: 'var(--cool)' }}>✓ RESOLVIDOS ({resolved.length})</div>
                  {resolved.map((k, i) => (
                    <div className="diff-item" key={i}>{warningKeyLabel(k)}</div>
                  ))}
                </>
              )}
            </div>
            <div>
              {novos.length > 0 && (
                <>
                  <div className="diff-head" style={{ color: 'var(--hot)' }}>⚠ NOVOS ({novos.length})</div>
                  {novos.map((k, i) => (
                    <div className="diff-item" key={i}>{warningKeyLabel(k)}</div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="note">Mesmos avisos nos dois planos.</div>
        )}

        <div className="compare-actions">
          <button className="btn-ghost" onClick={() => onLoad(left.id)}>Carregar &quot;{left.label}&quot;</button>
          <button className="btn-ghost" onClick={() => onLoad(right.id)}>Carregar &quot;{right.label}&quot;</button>
        </div>
      </div>
    </div>
  );
}
