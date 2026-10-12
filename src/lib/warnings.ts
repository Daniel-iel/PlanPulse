import type { PlanNode, Warning } from './types';
import { formatNum } from './format';
import { messages, type Locale } from './i18n';

export function extractColumns(condText: string | null): string[] {
  if (!condText) return [];
  const re = /([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|<=|>=|<|>|LIKE)/gi;
  const cols = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(condText))) cols.add(m[1]);
  return [...cols];
}

/** `title|relationOrNodeType` — used both for display and for diffing two runs. */
export function warningKey(w: Warning, node: PlanNode): string {
  return `${w.code}|${node.relationName || node.nodeType}`;
}

export function generateWarnings(all: PlanNode[], hasActual: boolean, locale: Locale): Warning[] {
  const warnings: Warning[] = [];
  if (!hasActual) return warnings;
  const t = messages[locale].warning;

  for (const n of all) {
    if (n.pctOfTotal != null && n.pctOfTotal >= 30) {
      warnings.push({
        code: 'bottleneck',
        severity: 'critical',
        nodeId: n.id,
        title: t.bottleneckTitle,
        text: t.bottleneck(
          n.nodeType,
          n.relationName || '',
          formatNum(n.pctOfTotal, 1, locale),
          formatNum(n.exclusiveWeight, 2, locale)
        ),
      });
    }

    if (/^Seq Scan/i.test(n.nodeType) && n.rowsRemovedByFilter) {
      const kept = n.actualRows || 0;
      if (n.rowsRemovedByFilter > 1000 && n.rowsRemovedByFilter > kept * 5) {
        const cols = extractColumns(n.filter);
        const suggestion = cols.length
          ? t.createIndex(n.relationName || (locale === 'en' ? 'table' : locale === 'pt' ? 'tabela' : 'tabla'), cols.join(', '))
          : null;
        warnings.push({
          code: 'seq-scan',
          severity: n.rowsRemovedByFilter > 20000 ? 'critical' : 'warning',
          nodeId: n.id,
          title: t.seqScanTitle,
          text: t.seqScan(
            formatNum(n.rowsRemovedByFilter, 0, locale),
            n.relationName || n.nodeType,
            formatNum(kept, 0, locale)
          ),
          suggestion,
        });
      }
    }

    if (n.planRows && n.actualRows != null && n.planRows > 0) {
      const ratio = n.actualRows / n.planRows;
      if ((ratio > 10 || ratio < 0.1) && (n.actualRows > 50 || n.planRows > 50)) {
        warnings.push({
          code: 'row-estimate',
          severity: 'warning',
          nodeId: n.id,
          title: t.estimateTitle,
          text: t.estimate(
            formatNum(n.planRows, 0, locale),
            n.nodeType,
            formatNum(n.actualRows, 0, locale)
          ),
          suggestion: n.relationName ? t.analyze(n.relationName) : null,
        });
      }
    }

    if (n.sortSpaceType && n.sortSpaceType.toLowerCase() === 'disk') {
      warnings.push({
        code: 'disk-sort',
        severity: 'critical',
        nodeId: n.id,
        title: t.diskSortTitle,
        text: t.diskSort(n.nodeType, formatNum(n.sortSpaceUsed, 0, locale)),
        suggestion: t.increaseWorkMem,
      });
    }

    if (n.hashBatches && n.hashBatches > 1) {
      warnings.push({
        code: 'hash-batches',
        severity: 'warning',
        nodeId: n.id,
        title: t.hashBatchesTitle,
        text: t.hashBatches(n.nodeType, n.hashBatches),
        suggestion: t.increaseWorkMemShort,
      });
    }

    if (n.actualLoops && n.actualLoops > 1000) {
      warnings.push({
        code: 'many-loops',
        severity: n.actualLoops > 10000 ? 'critical' : 'warning',
        nodeId: n.id,
        title: t.loopsTitle,
        text: t.loops(n.nodeType, formatNum(n.actualLoops, 0, locale)),
      });
    }

    if (n.bufferRead && n.bufferHit != null && n.bufferRead > n.bufferHit && n.bufferRead > 10) {
      warnings.push({
        code: 'disk-read',
        severity: 'info',
        nodeId: n.id,
        title: t.diskReadTitle,
        text: t.diskRead(n.nodeType, n.bufferRead, n.bufferHit),
      });
    }
  }

  const rank: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  const byId = new Map(all.map((n) => [n.id, n]));
  warnings.sort((a, b) => {
    const r = rank[a.severity] - rank[b.severity];
    if (r !== 0) return r;
    const pa = byId.get(a.nodeId)?.pctOfTotal || 0;
    const pb = byId.get(b.nodeId)?.pctOfTotal || 0;
    return pb - pa;
  });
  return warnings;
}
