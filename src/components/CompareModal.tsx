'use client';

import type { HistoryEntry } from '@/lib/types';
import { formatNum, formatRelativeTime } from '@/lib/format';
import { messages, warningTitle, type Locale, type WarningCode } from '@/lib/i18n';

function CompareRow({
  label,
  aVal,
  bVal,
  unit,
  lowerIsBetter,
  locale,
}: {
  label: string;
  aVal: number | null;
  bVal: number | null;
  unit: string;
  lowerIsBetter: boolean | null;
  locale: Locale;
}) {
  const aStr = aVal != null ? formatNum(aVal, unit === 'ms' ? 2 : 0, locale) + unit : '–';
  const bStr = bVal != null ? formatNum(bVal, unit === 'ms' ? 2 : 0, locale) + unit : '–';
  let delta: React.ReactNode = null;
  if (aVal != null && bVal != null && lowerIsBetter != null) {
    const diff = bVal - aVal;
    if (Math.abs(diff) > 0.0001) {
      const better = lowerIsBetter ? diff < 0 : diff > 0;
      const pct = aVal !== 0 ? Math.abs((diff / aVal) * 100) : null;
      delta = (
        <span className={`delta ${better ? 'delta-good' : 'delta-bad'}`}>
          {diff > 0 ? '▲' : '▼'} {pct != null ? formatNum(pct, 1, locale) + '%' : formatNum(Math.abs(diff), 2, locale)}
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

function warningKeyLabel(k: string, locale: Locale) {
  const [code, ref] = k.split('|');
  const title = code && isWarningCode(code) ? warningTitle(code, locale) : code;
  return (
    <>
      {title} <span style={{ color: 'var(--fog-dim)' }}>({ref})</span>
    </>
  );
}

function isWarningCode(value: string): value is WarningCode {
  return [
    'bottleneck',
    'seq-scan',
    'row-estimate',
    'disk-sort',
    'hash-batches',
    'many-loops',
    'disk-read',
  ].includes(value);
}

interface CompareProps {
  open: boolean;
  left: HistoryEntry | null;
  right: HistoryEntry | null;
  onClose: () => void;
  onLoad: (id: string) => void;
  locale: Locale;
}

export default function CompareModal({ open, left, right, onClose, onLoad, locale }: CompareProps) {
  if (!open || !left || !right) return null;
  const t = messages[locale].app;
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
          <h2>{t.compareTitle}</h2>
          <button className="btn-ghost" onClick={onClose} aria-label={t.close}>✕</button>
        </div>

        <div className="compare-heads">
          <div>
            <div className="compare-name">{left.label}</div>
            <div className="compare-date">{formatRelativeTime(left.savedAt, locale)}</div>
          </div>
          <div>
            <div className="compare-name">{right.label}</div>
            <div className="compare-date">{formatRelativeTime(right.savedAt, locale)}</div>
          </div>
        </div>

        <div className="compare-rows">
          <CompareRow label={t.executionTimeLabel} aVal={a.executionTime} bVal={b.executionTime} unit="ms" lowerIsBetter locale={locale} />
          <CompareRow label={t.planningTimeLabel} aVal={a.planningTime} bVal={b.planningTime} unit="ms" lowerIsBetter locale={locale} />
          <CompareRow label={t.nodesInPlan} aVal={a.nodeCount} bVal={b.nodeCount} unit="" lowerIsBetter={null} locale={locale} />
          <CompareRow label={t.warnings} aVal={a.warningsCount} bVal={b.warningsCount} unit="" lowerIsBetter locale={locale} />
          <CompareRow label={t.criticalIssues} aVal={a.criticalCount} bVal={b.criticalCount} unit="" lowerIsBetter locale={locale} />
        </div>

        {resolved.length || novos.length ? (
          <div className="compare-diff">
            <div>
              {resolved.length > 0 && (
                <>
                  <div className="diff-head" style={{ color: 'var(--cool)' }}>✓ {t.resolved} ({resolved.length})</div>
                  {resolved.map((k, i) => (
                    <div className="diff-item" key={i}>{warningKeyLabel(k, locale)}</div>
                  ))}
                </>
              )}
            </div>
            <div>
              {novos.length > 0 && (
                <>
                  <div className="diff-head" style={{ color: 'var(--hot)' }}>⚠ {t.newWarnings} ({novos.length})</div>
                  {novos.map((k, i) => (
                    <div className="diff-item" key={i}>{warningKeyLabel(k, locale)}</div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="note">{t.sameWarnings}</div>
        )}

        <div className="compare-actions">
          <button className="btn-ghost" onClick={() => onLoad(left.id)}>{t.loadPlan} &quot;{left.label}&quot;</button>
          <button className="btn-ghost" onClick={() => onLoad(right.id)}>{t.loadPlan} &quot;{right.label}&quot;</button>
        </div>
      </div>
    </div>
  );
}
