import type { ParsedPlan, RawNode } from './types';

export function blankRawNode(): RawNode {
  return {
    nodeType: '?',
    relationName: null,
    alias: null,
    indexName: null,
    joinType: null,
    startupCost: null,
    totalCost: null,
    planRows: null,
    planWidth: null,
    actualStartupTime: null,
    actualTotalTime: null,
    actualRows: null,
    actualLoops: null,
    neverExecuted: false,
    filter: null,
    rowsRemovedByFilter: null,
    indexCond: null,
    hashCond: null,
    sortKey: null,
    sortMethod: null,
    sortSpaceUsed: null,
    sortSpaceType: null,
    bufferHit: null,
    bufferRead: null,
    hashBatches: null,
    children: [],
  };
}

function numOrNull(v: unknown): number | null {
  return v === undefined || v === null ? null : Number(v);
}

// ---------------------------------------------------------------------------
// EXPLAIN (FORMAT JSON)
// ---------------------------------------------------------------------------

function jsonToRawNode(j: Record<string, any>): RawNode {
  const n = blankRawNode();
  n.nodeType = j['Node Type'] || '?';
  n.relationName = j['Relation Name'] || null;
  n.alias = j['Alias'] || null;
  n.indexName = j['Index Name'] || null;
  n.joinType = j['Join Type'] || null;
  n.startupCost = numOrNull(j['Startup Cost']);
  n.totalCost = numOrNull(j['Total Cost']);
  n.planRows = numOrNull(j['Plan Rows']);
  n.planWidth = numOrNull(j['Plan Width']);
  n.actualStartupTime = numOrNull(j['Actual Startup Time']);
  n.actualTotalTime = numOrNull(j['Actual Total Time']);
  n.actualRows = numOrNull(j['Actual Rows']);
  n.actualLoops = numOrNull(j['Actual Loops']);
  n.neverExecuted = n.actualLoops === 0;
  n.filter = j['Filter'] || null;
  n.rowsRemovedByFilter = numOrNull(j['Rows Removed by Filter']);
  n.indexCond = j['Index Cond'] || null;
  n.hashCond = j['Hash Cond'] || j['Join Filter'] || null;
  n.sortKey = Array.isArray(j['Sort Key']) ? j['Sort Key'].join(', ') : j['Sort Key'] || null;
  n.sortMethod = j['Sort Method'] || null;
  n.sortSpaceUsed = numOrNull(j['Sort Space Used']);
  n.sortSpaceType = j['Sort Space Type'] || null;
  n.bufferHit = numOrNull(j['Shared Hit Blocks']);
  n.bufferRead = numOrNull(j['Shared Read Blocks']);
  n.hashBatches = numOrNull(j['Hash Batches']);
  n.children = (j['Plans'] || []).map(jsonToRawNode);
  return n;
}

export function parseJsonPlan(raw: string): ParsedPlan {
  let obj = JSON.parse(raw);
  if (Array.isArray(obj)) obj = obj[0];
  if (!obj) throw new Error('vazio');
  const rootJson = obj['Plan'] || obj;
  if (!rootJson['Node Type']) throw new Error('sem Node Type');
  return {
    root: jsonToRawNode(rootJson),
    planningTime: numOrNull(obj['Planning Time']),
    executionTime: numOrNull(obj['Execution Time']),
  };
}

// ---------------------------------------------------------------------------
// EXPLAIN text output
// ---------------------------------------------------------------------------

const NODE_LINE_RE =
  /^(\s*)(->\s*)?(.+?)\s*\(cost=([\d.]+)\.\.([\d.]+)\s+rows=(\d+)\s+width=(\d+)\)(?:\s*\(actual time=([\d.]+)\.\.([\d.]+)\s+rows=(\d+)\s+loops=(\d+)\)|\s*\(never executed\))?\s*$/;

export function parseTextPlan(raw: string): ParsedPlan {
  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  const virtualRoot: RawNode = { ...blankRawNode(), nodeType: '__root__' };
  const stack: { indent: number; node: RawNode }[] = [{ indent: -1, node: virtualRoot }];
  let planningTime: number | null = null;
  let executionTime: number | null = null;
  let lastNode: RawNode | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    const m = line.match(NODE_LINE_RE);
    if (m) {
      const [, lead, arrow, typeTextRaw, sc, tc, pr, pw, ast, att, ar, al] = m;
      const indent = arrow ? line.indexOf('->') : lead.length;
      let typeText = typeTextRaw.trim();
      let relationName: string | null = null;
      let alias: string | null = null;
      let indexName: string | null = null;

      const usingMatch = typeText.match(/^(.*?)\s+using\s+(\S+)\s+on\s+(\S+)(?:\s+(\S+))?$/i);
      const onMatch = typeText.match(/^(.*?)\s+on\s+(\S+)(?:\s+(\S+))?$/i);
      if (usingMatch) {
        typeText = usingMatch[1];
        indexName = usingMatch[2];
        relationName = usingMatch[3];
        alias = usingMatch[4] || null;
      } else if (onMatch) {
        typeText = onMatch[1];
        relationName = onMatch[2];
        alias = onMatch[3] || null;
      }

      const node = blankRawNode();
      node.nodeType = typeText;
      node.relationName = relationName;
      node.alias = alias;
      node.indexName = indexName;
      node.startupCost = parseFloat(sc);
      node.totalCost = parseFloat(tc);
      node.planRows = parseInt(pr, 10);
      node.planWidth = parseInt(pw, 10);
      node.actualStartupTime = ast !== undefined ? parseFloat(ast) : null;
      node.actualTotalTime = att !== undefined ? parseFloat(att) : null;
      node.actualRows = ar !== undefined ? parseInt(ar, 10) : null;
      node.actualLoops = al !== undefined ? parseInt(al, 10) : null;
      node.neverExecuted = /never executed/.test(line);

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      stack[stack.length - 1].node.children.push(node);
      stack.push({ indent, node });
      lastNode = node;
      continue;
    }

    const t = line.trim();
    let pm: RegExpMatchArray | null;
    if ((pm = t.match(/^Planning Time:\s*([\d.]+)\s*ms/i))) {
      planningTime = parseFloat(pm[1]);
      continue;
    }
    if ((pm = t.match(/^Execution Time:\s*([\d.]+)\s*ms/i))) {
      executionTime = parseFloat(pm[1]);
      continue;
    }
    if (!lastNode) continue;
    if ((pm = t.match(/^Filter:\s*(.+)$/i))) {
      lastNode.filter = pm[1];
      continue;
    }
    if ((pm = t.match(/^Rows Removed by Filter:\s*(\d+)/i))) {
      lastNode.rowsRemovedByFilter = parseInt(pm[1], 10);
      continue;
    }
    if ((pm = t.match(/^Index Cond:\s*(.+)$/i))) {
      lastNode.indexCond = pm[1];
      continue;
    }
    if ((pm = t.match(/^Hash Cond:\s*(.+)$/i))) {
      lastNode.hashCond = pm[1];
      continue;
    }
    if ((pm = t.match(/^Sort Key:\s*(.+)$/i))) {
      lastNode.sortKey = pm[1];
      continue;
    }
    if ((pm = t.match(/^Sort Method:\s*(.+?)\s+(Memory|Disk):\s*(\d+)kB/i))) {
      lastNode.sortMethod = pm[1];
      lastNode.sortSpaceType = pm[2];
      lastNode.sortSpaceUsed = parseInt(pm[3], 10);
      continue;
    }
    if ((pm = t.match(/Buffers:.*?shared hit=(\d+)(?:.*?read=(\d+))?/i))) {
      lastNode.bufferHit = parseInt(pm[1], 10);
      lastNode.bufferRead = pm[2] ? parseInt(pm[2], 10) : 0;
      continue;
    }
    if ((pm = t.match(/Batches:\s*(\d+)/i))) {
      lastNode.hashBatches = parseInt(pm[1], 10);
      continue;
    }
  }

  if (!virtualRoot.children.length) throw new Error('nenhum nó encontrado');
  return { root: virtualRoot.children[0], planningTime, executionTime };
}

/** Tries JSON first, falls back to the text parser. Throws if neither works. */
export function parsePlan(raw: string): { parsed: ParsedPlan; format: 'TEXTO' | 'JSON' } {
  try {
    return { parsed: parseJsonPlan(raw), format: 'JSON' };
  } catch {
    return { parsed: parseTextPlan(raw), format: 'TEXTO' };
  }
}
