'use client';

import type { HistoryEntry } from '@/lib/types';
import { formatNum, formatRelativeTime } from '@/lib/format';
import { messages, type Locale } from '@/lib/i18n';

interface Props {
  open: boolean;
  history: HistoryEntry[];
  compareSelection: Set<string>;
  onClose: () => void;
  onToggleCompare: (id: string, checked: boolean) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onCompare: () => void;
  locale: Locale;
}

export default function HistoryModal({
  open,
  history,
  compareSelection,
  onClose,
  onToggleCompare,
  onLoad,
  onDelete,
  onClearAll,
  onCompare,
  locale,
}: Props) {
  if (!open) return null;
  const t = messages[locale].app;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-head">
          <h2>{t.historyTitle}</h2>
          <button className="btn-ghost" onClick={onClose} aria-label={t.close}>✕</button>
        </div>
        <div className="modal-body">
          <div className="history-toolbar">
            <span className="insp-hint" style={{ fontSize: 11.5 }}>
              {t.historyDescription}
            </span>
            <button className="btn-ghost" onClick={onClearAll}>{t.clearAll}</button>
          </div>

          {!history.length ? (
            <div className="note" style={{ padding: '20px 0' }}>
              {t.noHistory}
            </div>
          ) : (
            <div className="history-list">
              {history.map((entry) => {
                const s = entry.summary;
                const wClass = s.criticalCount > 0 ? 'hot' : s.warningsCount > 0 ? 'warm' : 'cool';
                return (
                  <div className="history-row" key={entry.id}>
                    <input
                      type="checkbox"
                      className="hist-check"
                      aria-label={`${t.selectForCompare}: ${entry.label}`}
                      checked={compareSelection.has(entry.id)}
                      onChange={(e) => onToggleCompare(entry.id, e.target.checked)}
                    />
                    <div className="hist-body" onClick={() => onLoad(entry.id)}>
                      <div className="hist-label">{entry.label}</div>
                      <div className="hist-meta">
                        {formatRelativeTime(entry.savedAt, locale)} ·{' '}
                        {s.executionTime != null ? formatNum(s.executionTime, 2, locale) + 'ms' : t.noAnalyze} ·{' '}
                        <span className={`chip-inline ${wClass}`}>{s.warningsCount} {t.savedWarnings}</span>
                      </div>
                    </div>
                    <button className="hist-del" title={t.delete} aria-label={t.delete} onClick={() => onDelete(entry.id)}>✕</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="compare-bar">
            <button className="btn-primary" disabled={compareSelection.size !== 2} onClick={onCompare}>
              {t.compareSelected}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
