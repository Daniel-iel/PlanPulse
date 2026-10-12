import type { AnalyzedPlan, PlanNode, RawNode } from './types';

function nodeHasActual(n: RawNode): boolean {
  if (n.actualTotalTime != null) return true;
  return n.children.some(nodeHasActual);
}

/**
 * Walks the raw parsed tree and produces a PlanNode tree with ids, parent
 * links, depth, and timing-derived weights:
 *  - inclusiveWeight: time (ms) or cost spent in this node + all descendants
 *  - exclusiveWeight: time/cost spent in this node alone (inclusive minus
 *    the sum of children's inclusive time) — this is what "self time" means
 *    throughout the app.
 * Falls back to planner cost instead of actual time when the plan has no
 * ANALYZE data (hasActual === false).
 */
export function computeMetrics(
  root: RawNode | null,
  executionTimeMs: number | null
): Pick<AnalyzedPlan, 'root' | 'all' | 'byId' | 'total' | 'hasActual'> {
  let idCounter = 0;
  const all: PlanNode[] = [];
  const byId: Record<number, PlanNode> = {};
  const hasActual = root ? nodeHasActual(root) : false;

  function walk(raw: RawNode, depth: number, parentId: number | null): PlanNode {
    const id = idCounter++;
    const children: PlanNode[] = [];
    let childWeight = 0;
    for (const c of raw.children) {
      const childNode = walk(c, depth + 1, id);
      children.push(childNode);
      childWeight += hasActual
        ? (childNode.actualTotalTime || 0) * (childNode.actualLoops || 1)
        : childNode.totalCost || 0;
    }
    const selfWeight = hasActual
      ? (raw.actualTotalTime || 0) * (raw.actualLoops || 1)
      : raw.totalCost || 0;

    const node: PlanNode = {
      ...raw,
      children,
      id,
      parentId,
      depth,
      exclusiveWeight: Math.max(0, selfWeight - childWeight),
      inclusiveWeight: selfWeight,
      pctOfTotal: null, // filled in below once `total` is known
    };
    byId[id] = node;
    all.push(node);
    return node;
  }

  const finalRoot = root ? walk(root, 0, null) : null;
  const total = hasActual
    ? executionTimeMs ?? (finalRoot ? finalRoot.inclusiveWeight : null)
    : finalRoot
    ? finalRoot.totalCost
    : null;

  for (const n of all) {
    n.pctOfTotal = total && total > 0 ? (n.exclusiveWeight / total) * 100 : null;
  }

  return { root: finalRoot as PlanNode, all, byId, total, hasActual };
}
