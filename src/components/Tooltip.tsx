'use client';

import { useEffect, useRef, useState } from 'react';
import type { PlanNode, Warning } from '@/lib/types';
import { ptNum } from '@/lib/format';

interface Props {
  node: PlanNode | null;
  warnings: Warning[];
  hasActual: boolean;
  x: number;
  y: number;
}

export default function Tooltip({ node, warnings, hasActual, x, y }: Props) {
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

  return (
    <div className="tooltip" ref={ref} style={{ left: pos.left, top: pos.top }}>
      <div className="t-title">
        {node.nodeType}
        {node.relationName ? ` · ${node.relationName}` : ''}
      </div>
      {hasActual && node.pctOfTotal != null && (
        <div className="t-row">
          <span>tempo próprio</span>
          <b>
            {ptNum(node.exclusiveWeight, 2)}ms ({ptNum(node.pctOfTotal, 1)}%)
          </b>
        </div>
      )}
      {node.actualTotalTime != null && (
        <div className="t-row">
          <span>tempo total (por loop)</span>
          <b>{ptNum(node.actualTotalTime, 2)}ms</b>
        </div>
      )}
      <div className="t-row">
        <span>custo</span>
        <b>
          {ptNum(node.startupCost, 1)} .. {ptNum(node.totalCost, 1)}
        </b>
      </div>
      <div className="t-row">
        <span>linhas</span>
        <b>
          {ptNum(node.planRows, 0)}
          {node.actualRows != null ? ' → ' + ptNum(node.actualRows, 0) : ''}
        </b>
      </div>
      {node.actualLoops != null && node.actualLoops > 1 && (
        <div className="t-row">
          <span>loops</span>
          <b>{node.actualLoops}</b>
        </div>
      )}
      {warnings.length > 0 ? (
        <div className="t-foot">
          ⚠ {warnings.length} aviso{warnings.length > 1 ? 's' : ''} — clique para detalhes
        </div>
      ) : (
        <div className="t-foot">clique para detalhes e realçar o caminho</div>
      )}
    </div>
  );
}
