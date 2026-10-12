'use client';

import type { PlanNode, Warning } from '@/lib/types';
import { ptNum } from '@/lib/format';
import { colorForPct, CARD_W, CARD_H } from '@/lib/treeLayout';

interface Props {
  node: PlanNode;
  x: number;
  y: number;
  hasActual: boolean;
  isPathActive: boolean;
  isDimmed: boolean;
  warnings: Warning[];
  onClick: () => void;
  onHover: (e: React.MouseEvent, node: PlanNode, warnings: Warning[]) => void;
  onMove: (e: React.MouseEvent) => void;
  onLeave: () => void;
}

function severityRank(sev: Warning['severity']) {
  return sev === 'critical' ? 0 : sev === 'warning' ? 1 : 2;
}

export default function PlanCard({
  node,
  x,
  y,
  hasActual,
  isPathActive,
  isDimmed,
  warnings,
  onClick,
  onHover,
  onMove,
  onLeave,
}: Props) {
  const color = colorForPct(node.pctOfTotal);
  const ratio =
    node.planRows && node.actualRows != null && node.planRows > 0 ? node.actualRows / node.planRows : null;
  const mismatch = ratio != null && (ratio > 10 || ratio < 0.1);
  const worstSev = warnings.length
    ? warnings.slice().sort((a, b) => severityRank(a.severity) - severityRank(b.severity))[0].severity
    : null;
  const badgeColor =
    worstSev === 'critical' ? 'var(--hot)' : worstSev === 'warning' ? 'var(--warm)' : 'var(--cool)';
  const timeLabel = hasActual
    ? node.exclusiveWeight != null
      ? ptNum(node.exclusiveWeight, node.exclusiveWeight < 10 ? 2 : 1) + 'ms'
      : '–'
    : ptNum(node.totalCost, 0);

  let classes = 'plan-card';
  if (isPathActive) classes += ' path-active';
  if (isDimmed) classes += ' dimmed';

  return (
    <div
      className={classes}
      style={{
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        animationDelay: `${node.depth * 60}ms`,
      }}
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onMouseEnter={(e) => onHover(e, node, warnings)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="card-accent" style={{ background: color }} />
      <div className="card-head">
        <span className="card-type">{node.nodeType}</span>
        {worstSev && <span className="warn-badge" style={{ background: badgeColor }}>!</span>}
      </div>
      <div className="card-rel">
        {node.relationName
          ? node.relationName + (node.alias ? ' ' + node.alias : '')
          : node.indexCond
          ? 'index scan'
          : '—'}
      </div>
      <div className="card-metric">
        <span className="metric-value" style={{ color }}>
          {timeLabel}
        </span>
        {node.pctOfTotal != null && <span className="metric-pct">{ptNum(node.pctOfTotal, 1)}%</span>}
      </div>
      <div className="card-bar">
        <div className="card-bar-fill" style={{ width: `${Math.max(2, node.pctOfTotal || 0)}%`, background: color }} />
      </div>
      <div className="card-tags">
        <span className={`tag ${mismatch ? 'mismatch' : ''}`}>
          rows {ptNum(node.planRows, 0)}
          {node.actualRows != null ? '→' + ptNum(node.actualRows, 0) : ''}
        </span>
        {node.actualLoops && node.actualLoops > 1 && <span className="tag">×{node.actualLoops}</span>}
      </div>
    </div>
  );
}
