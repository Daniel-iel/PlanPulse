'use client';

import type { HistoryEntry } from '@/lib/types';
import { ptNum, formatRelativeTime } from '@/lib/format';

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
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-head">
          <h2>Histórico de planos</h2>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="history-toolbar">
            <span className="insp-hint" style={{ fontSize: 11.5 }}>
              Salvo automaticamente neste navegador. Selecione até 2 para comparar.
            </span>
            <button className="btn-ghost" onClick={onClearAll}>Limpar tudo</button>
          </div>

          {!history.length ? (
            <div className="note" style={{ padding: '20px 0' }}>
              Nenhum plano salvo ainda. Toda vez que você analisar um plano, ele é guardado aqui
              automaticamente (só neste navegador).
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
                      checked={compareSelection.has(entry.id)}
                      onChange={(e) => onToggleCompare(entry.id, e.target.checked)}
                    />
                    <div className="hist-body" onClick={() => onLoad(entry.id)}>
                      <div className="hist-label">{entry.label}</div>
                      <div className="hist-meta">
                        {formatRelativeTime(entry.savedAt)} ·{' '}
                        {s.executionTime != null ? ptNum(s.executionTime, 2) + 'ms' : 'sem ANALYZE'} ·{' '}
                        <span className={`chip-inline ${wClass}`}>{s.warningsCount} avisos</span>
                      </div>
                    </div>
                    <button className="hist-del" title="Excluir" onClick={() => onDelete(entry.id)}>✕</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="compare-bar">
            <button className="btn-primary" disabled={compareSelection.size !== 2} onClick={onCompare}>
              Comparar selecionados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
