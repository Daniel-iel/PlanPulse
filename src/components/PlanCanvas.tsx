'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AnalyzedPlan, PlanNode, Warning } from '@/lib/types';
import { computeLayout, CARD_W, CARD_H, elbowPath } from '@/lib/treeLayout';
import { ptNum } from '@/lib/format';
import { usePanZoom } from '@/hooks/usePanZoom';
import PlanCard from './PlanCard';
import Tooltip from './Tooltip';

interface Props {
  plan: AnalyzedPlan;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function PlanCanvas({ plan, selectedId, onSelect }: Props) {
  const { positions, width, height } = useMemo(() => computeLayout(plan.root), [plan.root]);
  const { viewportRef, transform, zoomBy, fitToScreen, onPointerDownBackground, onPointerMoveBackground, onPointerUpBackground } =
    usePanZoom({ width, height });

  const [hover, setHover] = useState<{ node: PlanNode; warnings: Warning[]; x: number; y: number } | null>(null);

  const warningsByNode = useMemo(() => {
    const map = new Map<number, Warning[]>();
    for (const w of plan.warnings) {
      const list = map.get(w.nodeId) || [];
      list.push(w);
      map.set(w.nodeId, list);
    }
    return map;
  }, [plan.warnings]);

  const pathIds = useMemo(() => {
    if (selectedId == null) return null;
    const ids = new Set<number>();
    let cur: PlanNode | undefined = plan.byId[selectedId];
    while (cur) {
      ids.add(cur.id);
      cur = cur.parentId != null ? plan.byId[cur.parentId] : undefined;
    }
    return ids;
  }, [selectedId, plan.byId]);

  // Fit to screen whenever a new plan is loaded (layout size changes).
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => fitToScreen());
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.root, width, height]);

  useEffect(() => {
    const onResize = () => fitToScreen();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitToScreen]);

  const nodesWithParent = plan.all.filter((n) => n.parentId != null);

  return (
    <div className="canvas-card">
      <div
        ref={viewportRef}
        className="viewport"
        onPointerDown={onPointerDownBackground}
        onPointerMove={onPointerMoveBackground}
        onPointerUp={() => onPointerUpBackground(() => onSelect(null))}
      >
        <div
          className="world"
          style={{
            width,
            height,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          <svg className="edges-svg" width={width} height={height}>
            {nodesWithParent.map((node) => {
              const parent = plan.byId[node.parentId as number];
              const p1 = positions.get(parent.id)!;
              const p2 = positions.get(node.id)!;
              const x1 = p1.x + CARD_W / 2;
              const y1 = p1.y + CARD_H;
              const x2 = p2.x + CARD_W / 2;
              const y2 = p2.y;
              const midY = (y1 + y2) / 2;
              const active = pathIds ? pathIds.has(node.id) && pathIds.has(parent.id) : false;
              const dimmed = pathIds ? !active : false;
              const label = plan.hasActual && node.actualRows != null ? `${ptNum(node.actualRows, 0)} rows` : null;
              const textW = label ? Math.max(46, label.length * 6.2) : 0;
              const d = elbowPath(x1, y1, x2, y2);
              return (
                <g key={node.id}>
                  <path d={d} className={`edge-path ${active ? 'edge-active' : ''} ${dimmed ? 'edge-dimmed' : ''}`} />
                  <circle cx={x1} cy={y1} r={2.5} className={`edge-via ${active ? 'edge-active' : ''} ${dimmed ? 'edge-dimmed' : ''}`} />
                  <circle cx={x2} cy={y2} r={2.5} className={`edge-via ${active ? 'edge-active' : ''} ${dimmed ? 'edge-dimmed' : ''}`} />
                  {active && (
                    <circle r={2.5} className="signal-dot" style={{ offsetPath: `path('${d}')` } as React.CSSProperties} />
                  )}
                  {label && (
                    <g className={`edge-label ${dimmed ? 'edge-dimmed' : ''}`}>
                      <rect x={(x1 + x2) / 2 - textW / 2} y={midY - 9} width={textW} height={18} rx={3} />
                      <text x={(x1 + x2) / 2} y={midY + 4} textAnchor="middle">
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="cards-layer">
            {plan.all.map((node) => {
              const pos = positions.get(node.id)!;
              const warnings = warningsByNode.get(node.id) || [];
              const isPathActive = pathIds ? pathIds.has(node.id) : false;
              const isDimmed = pathIds ? !pathIds.has(node.id) : false;
              return (
                <PlanCard
                  key={node.id}
                  node={node}
                  x={pos.x}
                  y={pos.y}
                  hasActual={plan.hasActual}
                  isPathActive={isPathActive}
                  isDimmed={isDimmed}
                  warnings={warnings}
                  onClick={() => onSelect(node.id)}
                  onHover={(e, n, w) => setHover({ node: n, warnings: w, x: e.clientX, y: e.clientY })}
                  onMove={(e) => setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))}
                  onLeave={() => setHover(null)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="canvas-toolbar">
        <button onClick={() => zoomBy(1.2)} title="Aumentar zoom">+</button>
        <button onClick={() => zoomBy(0.83)} title="Diminuir zoom">–</button>
        <button onClick={fitToScreen} title="Ajustar à tela">⤢</button>
      </div>
      <div className="canvas-hint">
        <span>arraste para navegar · role para zoom · clique num card para ver o caminho</span>
        <span className="legend-bar" />
      </div>

      {hover && (
        <Tooltip node={hover.node} warnings={hover.warnings} hasActual={plan.hasActual} x={hover.x} y={hover.y} />
      )}
    </div>
  );
}
