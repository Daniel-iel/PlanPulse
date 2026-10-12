// Shape produced directly by the parsers (text EXPLAIN output or FORMAT JSON),
// before metrics (self-time, % of total, ids) have been computed.
export interface RawNode {
  nodeType: string;
  relationName: string | null;
  alias: string | null;
  indexName: string | null;
  joinType: string | null;
  startupCost: number | null;
  totalCost: number | null;
  planRows: number | null;
  planWidth: number | null;
  actualStartupTime: number | null;
  actualTotalTime: number | null;
  actualRows: number | null;
  actualLoops: number | null;
  neverExecuted: boolean;
  filter: string | null;
  rowsRemovedByFilter: number | null;
  indexCond: string | null;
  hashCond: string | null;
  sortKey: string | null;
  sortMethod: string | null;
  sortSpaceUsed: number | null;
  sortSpaceType: string | null;
  bufferHit: number | null;
  bufferRead: number | null;
  hashBatches: number | null;
  children: RawNode[];
}

// Same node, after computeMetrics() has walked the tree and filled in
// identity + timing-derived fields.
export interface PlanNode extends Omit<RawNode, 'children'> {
  id: number;
  parentId: number | null;
  depth: number;
  /** ms (or cost units, when there's no ANALYZE data) spent in this node itself */
  exclusiveWeight: number;
  /** ms (or cost units) spent in this node + all descendants */
  inclusiveWeight: number;
  /** exclusiveWeight as a % of the whole plan's execution time/cost */
  pctOfTotal: number | null;
  children: PlanNode[];
}

export interface ParsedPlan {
  root: RawNode;
  planningTime: number | null;
  executionTime: number | null;
}

export type Severity = 'critical' | 'warning' | 'info';

export interface Warning {
  severity: Severity;
  nodeId: number;
  title: string;
  text: string;
  suggestion?: string | null;
}

export interface AnalyzedPlan {
  root: PlanNode;
  all: PlanNode[];
  byId: Record<number, PlanNode>;
  total: number | null;
  hasActual: boolean;
  warnings: Warning[];
  format: 'TEXTO' | 'JSON';
  planningTime: number | null;
  executionTime: number | null;
  rawInput: string;
}

export interface HistorySummary {
  executionTime: number | null;
  planningTime: number | null;
  nodeCount: number;
  warningsCount: number;
  criticalCount: number;
  hasActual: boolean;
  bottleneckLabel: string | null;
  bottleneckPct: number | null;
  /** `${title}|${relationOrNodeType}` keys, used to diff two runs' warning sets */
  warningKeys: string[];
}

export interface HistoryEntry {
  id: string;
  savedAt: string;
  label: string;
  format: string;
  rawInput: string;
  summary: HistorySummary;
}
