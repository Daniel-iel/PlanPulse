'use client';

import type { AnalyzedPlan } from '@/lib/types';
import { formatNum } from '@/lib/format';
import CopyButton from './CopyButton';
import { messages, type Locale } from '@/lib/i18n';

interface Props {
  plan: AnalyzedPlan;
  selectedId: number | null;
  locale: Locale;
}

export default function Inspector({ plan, selectedId, locale }: Props) {
  const t = messages[locale].app;
  if (selectedId == null) {
    return (
      <div className="inspector-body">
        <p className="insp-hint">{t.inspectorHint}</p>
      </div>
    );
  }

  const n = plan.byId[selectedId];
  if (!n) {
    return (
      <div className="inspector-body">
        <p className="insp-hint">{t.nodeNotFound}</p>
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
        {n.relationName ? n.relationName + (n.alias ? ' ' + n.alias : '') : t.noRelation}
      </div>
      <div className="insp-metrics">
        <div className="row">
          <span>{t.estimatedCost}</span>
          <span>
            {formatNum(n.startupCost, 1, locale)} .. {formatNum(n.totalCost, 1, locale)}
          </span>
        </div>
        <div className="row">
          <span>{t.estimatedActualRows}</span>
          <span className={mismatch ? 'mismatch' : ''}>
            {formatNum(n.planRows, 0, locale)} → {n.actualRows != null ? formatNum(n.actualRows, 0, locale) : '–'}
          </span>
        </div>
        {n.actualTotalTime != null && (
          <div className="row">
            <span>{t.timePerLoop}</span>
            <span>
              {formatNum(n.actualStartupTime, 2, locale)} .. {formatNum(n.actualTotalTime, 2, locale)}ms
            </span>
          </div>
        )}
        {n.actualLoops != null && (
          <div className="row">
            <span>{t.loops}</span>
            <span>{n.actualLoops}</span>
          </div>
        )}
        {n.pctOfTotal != null && (
          <div className="row">
            <span>{t.selfTime}</span>
            <span>
              {formatNum(n.exclusiveWeight, 2, locale)}
              {plan.hasActual ? 'ms' : ''} ({formatNum(n.pctOfTotal, 1, locale)}%)
            </span>
          </div>
        )}
      </div>

      {n.filter && <div className="insp-detail"><span>{t.filter}</span>{n.filter}</div>}
      {n.indexCond && <div className="insp-detail"><span>{t.indexCondition}</span>{n.indexCond}</div>}
      {n.hashCond && <div className="insp-detail"><span>{t.hashCondition}</span>{n.hashCond}</div>}
      {n.sortKey && <div className="insp-detail"><span>{t.sortKey}</span>{n.sortKey}</div>}
      {n.sortMethod && (
        <div className="insp-detail">
          <span>{t.sortMethod}</span>
          {n.sortMethod} ({n.sortSpaceType || ''} {formatNum(n.sortSpaceUsed, 0, locale)}kB)
        </div>
      )}
      {n.rowsRemovedByFilter != null && n.rowsRemovedByFilter > 0 && (
        <div className="insp-detail"><span>{t.rowsRemoved}</span>{formatNum(n.rowsRemovedByFilter, 0, locale)}</div>
      )}
      {n.bufferHit != null && (
        <div className="insp-detail"><span>{t.buffers}</span>hit={n.bufferHit} read={n.bufferRead || 0}</div>
      )}

      {nodeWarnings.map((w, i) => (
        <div className="insp-warning" key={i}>
          <span className={`sev-pill sev-${w.severity}`}>
            {w.severity === 'critical' ? t.critical : w.severity === 'warning' ? t.warning : t.info}
          </span>
          <div className="diag-body">
            <div className="diag-title" style={{ fontSize: 12 }}>{w.title}</div>
            {w.suggestion && (
              <div className="suggestion">
                <code>{w.suggestion}</code>
                <CopyButton text={w.suggestion} locale={locale} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
