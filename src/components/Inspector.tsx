'use client';

import type { AnalyzedPlan } from '@/lib/types';
import { ptNum } from '@/lib/format';
import CopyButton from './CopyButton';

interface Props {
  plan: AnalyzedPlan;
  selectedId: number | null;
}

export default function Inspector({ plan, selectedId }: Props) {
  if (selectedId == null) {
    return (
      <div className="inspector-body">
        <p className="insp-hint">Clique em um card do diagrama para ver os detalhes do nó.</p>
      </div>
    );
  }

  const n = plan.byId[selectedId];
  if (!n) {
    return (
      <div className="inspector-body">
        <p className="insp-hint">Nó não encontrado.</p>
      </div>
    );
  }

  const ratio = n.planRows && n.actualRows != null && n.planRows > 0 ? n.actualRows / n.planRows : null;
  const mismatch = ratio != null && (ratio > 10 || ratio < 0.1);
  const nodeWarnings = plan.warnings.filter((w) => w.nodeId === n.id);

  return (
    <div className="inspector-body">
      <div className="insp-title">{n.nodeType}</div>
      <div className="insp-sub">
        {n.relationName ? n.relationName + (n.alias ? ' ' + n.alias : '') : '(sem relação associada)'}
      </div>
      <div className="insp-metrics">
        <div className="row">
          <span>custo estimado</span>
          <span>
            {ptNum(n.startupCost, 1)} .. {ptNum(n.totalCost, 1)}
          </span>
        </div>
        <div className="row">
          <span>linhas est. → real</span>
          <span className={mismatch ? 'mismatch' : ''}>
            {ptNum(n.planRows, 0)} → {n.actualRows != null ? ptNum(n.actualRows, 0) : '–'}
          </span>
        </div>
        {n.actualTotalTime != null && (
          <div className="row">
            <span>tempo (por loop)</span>
            <span>
              {ptNum(n.actualStartupTime, 2)} .. {ptNum(n.actualTotalTime, 2)}ms
            </span>
          </div>
        )}
        {n.actualLoops != null && (
          <div className="row">
            <span>loops</span>
            <span>{n.actualLoops}</span>
          </div>
        )}
        {n.pctOfTotal != null && (
          <div className="row">
            <span>tempo próprio</span>
            <span>
              {ptNum(n.exclusiveWeight, 2)}
              {plan.hasActual ? 'ms' : ''} ({ptNum(n.pctOfTotal, 1)}%)
            </span>
          </div>
        )}
      </div>

      {n.filter && <div className="insp-detail"><span>Filter</span>{n.filter}</div>}
      {n.indexCond && <div className="insp-detail"><span>Index Cond</span>{n.indexCond}</div>}
      {n.hashCond && <div className="insp-detail"><span>Hash Cond</span>{n.hashCond}</div>}
      {n.sortKey && <div className="insp-detail"><span>Sort Key</span>{n.sortKey}</div>}
      {n.sortMethod && (
        <div className="insp-detail">
          <span>Sort Method</span>
          {n.sortMethod} ({n.sortSpaceType || ''} {n.sortSpaceUsed || ''}kB)
        </div>
      )}
      {n.rowsRemovedByFilter != null && n.rowsRemovedByFilter > 0 && (
        <div className="insp-detail"><span>Rows Removed</span>{ptNum(n.rowsRemovedByFilter, 0)}</div>
      )}
      {n.bufferHit != null && (
        <div className="insp-detail"><span>Buffers</span>hit={n.bufferHit} read={n.bufferRead || 0}</div>
      )}

      {nodeWarnings.map((w, i) => (
        <div className="insp-warning" key={i}>
          <span className={`sev-pill sev-${w.severity}`}>
            {w.severity === 'critical' ? 'CRÍTICO' : w.severity === 'warning' ? 'ATENÇÃO' : 'INFO'}
          </span>
          <div className="diag-body">
            <div className="diag-title" style={{ fontSize: 12 }}>{w.title}</div>
            {w.suggestion && (
              <div className="suggestion">
                <code>{w.suggestion}</code>
                <CopyButton text={w.suggestion} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
