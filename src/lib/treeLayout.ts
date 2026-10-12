import type { PlanNode } from './types';

export const CARD_W = 234;
export const CARD_H = 128;
export const HGAP = 40;
export const VGAP = 90;

export interface LayoutResult {
  positions: Map<number, { x: number; y: number }>;
  width: number;
  height: number;
}

/**
 * Classic centered tree layout: each node's children are packed left-to-right
 * under it, and the node itself is centered over its children's combined
 * width (or just CARD_W for leaves).
 */
export function computeLayout(root: PlanNode | null): LayoutResult {
  const positions = new Map<number, { x: number; y: number }>();
  if (!root) return { positions, width: 0, height: 0 };

  function subtreeWidth(node: PlanNode): number {
    if (!node.children.length) return CARD_W;
    const sum =
      node.children.reduce((s, c) => s + subtreeWidth(c), 0) + HGAP * (node.children.length - 1);
    return Math.max(CARD_W, sum);
  }

  function place(node: PlanNode, x: number, depth: number) {
    positions.set(node.id, { x, y: depth * (CARD_H + VGAP) });
    if (!node.children.length) return;
    const widths = node.children.map(subtreeWidth);
    const totalW = widths.reduce((a, b) => a + b, 0) + HGAP * (node.children.length - 1);
    let cursor = x + CARD_W / 2 - totalW / 2;
    node.children.forEach((c, i) => {
      place(c, cursor, depth + 1);
      cursor += widths[i] + HGAP;
    });
  }

  place(root, 0, 0);

  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  positions.forEach((p) => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x + CARD_W);
    maxY = Math.max(maxY, p.y + CARD_H);
  });
  if (minX !== 0) {
    positions.forEach((p, id) => positions.set(id, { x: p.x - minX, y: p.y }));
    maxX -= minX;
  }

  return { positions, width: maxX, height: maxY };
}

const GRAD_STOPS: { p: number; c: [number, number, number] }[] = [
  { p: 0, c: [56, 217, 168] },
  { p: 15, c: [245, 166, 35] },
  { p: 40, c: [255, 92, 114] },
];

/** Maps a 0–100 "% of total time" value onto the cool→warm→hot gradient. */
export function colorForPct(pct: number | null): string {
  if (pct == null) return 'rgb(82,96,120)';
  const p = Math.max(0, Math.min(100, pct));
  let lo = GRAD_STOPS[0];
  let hi = GRAD_STOPS[GRAD_STOPS.length - 1];
  for (let i = 0; i < GRAD_STOPS.length - 1; i++) {
    if (p >= GRAD_STOPS[i].p && p <= GRAD_STOPS[i + 1].p) {
      lo = GRAD_STOPS[i];
      hi = GRAD_STOPS[i + 1];
      break;
    }
  }
  const span = hi.p - lo.p || 1;
  const t = Math.max(0, Math.min(1, (p - lo.p) / span));
  const rgb = lo.c.map((v, i) => Math.round(v + (hi.c[i] - v) * t));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

/**
 * PCB-trace-style connector: a vertical run out of the parent, a chamfered
 * 45° turn onto a horizontal run, and a chamfered turn back to vertical into
 * the child — instead of a smooth bezier. Falls back to a straight vertical
 * line when the child sits directly under the parent.
 */
export function elbowPath(x1: number, y1: number, x2: number, y2: number, chamfer = 10): string {
  if (Math.abs(x2 - x1) < 0.5) return `M ${x1},${y1} L ${x2},${y2}`;
  const midY = (y1 + y2) / 2;
  const dir = x2 > x1 ? 1 : -1;
  const c = Math.min(chamfer, Math.abs(x2 - x1) / 2, Math.abs(midY - y1));
  return [
    `M ${x1},${y1}`,
    `L ${x1},${midY - c}`,
    `L ${x1 + c * dir},${midY}`,
    `L ${x2 - c * dir},${midY}`,
    `L ${x2},${midY + c}`,
    `L ${x2},${y2}`,
  ].join(' ');
}
