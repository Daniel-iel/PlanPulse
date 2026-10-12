'use client';

import { useEffect, useRef, useState } from 'react';
import type { PlanNode, Warning } from '@/lib/types';
import { formatNum } from '@/lib/format';
import { messages, type Locale } from '@/lib/i18n';

interface Props {
  node: PlanNode | null;
  warnings: Warning[];
  hasActual: boolean;
  x: number;
  y: number;
  locale: Locale;
}

export default function Tooltip({ node, warnings, hasActual, x, y, locale }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ left: x + 16, top: y + 16 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const maxX = window.innerWidth - el.offsetWidth - 12;
    const maxY = window.innerHeight - el.offsetHeight - 12;
    setPos({ left: Math.max(8, Math.min(x + 16, maxX)), top: Math.max(8, Math.min(y + 16, maxY)) });
  }, [x, y, node]);

  if (!node) return null;
  const t = messages[locale].app;

  return (
    <div className="tooltip" ref={ref} style={{ left: pos.left, top: pos.top }}>
      <div className="t-title">
        {node.nodeType}
        {node.relationName ? ` · ${node.relationName}` : ''}
      </div>
      {hasActual && node.pctOfTotal != null && (
        <div className="t-row">
          <span>{t.selfTime}</span>
          <b>
            {formatNum(node.exclusiveWeight, 2, locale)}ms ({formatNum(node.pctOfTotal, 1, locale)}%)
          </b>
        </div>
      )}
      {node.actualTotalTime != null && (
        <div className="t-row">
          <span>{t.timePerLoop}</span>
          <b>{formatNum(node.actualTotalTime, 2, locale)}ms</b>
        </div>
      )}
      <div className="t-row">
        <span>{t.estimatedCost}</span>
        <b>
          {formatNum(node.startupCost, 1, locale)} .. {formatNum(node.totalCost, 1, locale)}
        </b>
      </div>
      <div className="t-row">
        <span>{t.rows}</span>
        <b>
          {formatNum(node.planRows, 0, locale)}
          {node.actualRows != null ? ' → ' + formatNum(node.actualRows, 0, locale) : ''}
        </b>
      </div>
      {node.actualLoops != null && node.actualLoops > 1 && (
        <div className="t-row">
          <span>{t.loops}</span>
          <b>{node.actualLoops}</b>
        </div>
      )}
      {warnings.length > 0 ? (
        <div className="t-foot">⚠ {warnings.length} {warnings.length === 1 ? t.warningCountSingular : t.warningCountPlural} — {t.clickForDetails}</div>
      ) : (
        <div className="t-foot">{t.clickToHighlight}</div>
      )}
    </div>
  );
}
