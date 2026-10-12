import type { PlanNode, Warning } from './types';
import { ptNum } from './format';

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
  return `${w.title}|${node.relationName || node.nodeType}`;
}

export function generateWarnings(all: PlanNode[], hasActual: boolean): Warning[] {
  const warnings: Warning[] = [];
  if (!hasActual) return warnings;

  for (const n of all) {
    if (n.pctOfTotal != null && n.pctOfTotal >= 30) {
      warnings.push({
        severity: 'critical',
        nodeId: n.id,
        title: 'Gargalo de execução',
        text: `"${n.nodeType}"${n.relationName ? ` em "${n.relationName}"` : ''} concentra ${ptNum(
          n.pctOfTotal,
          1
        )}% do tempo total de execução (${ptNum(n.exclusiveWeight, 2)}ms exclusivos).`,
      });
    }

    if (/^Seq Scan/i.test(n.nodeType) && n.rowsRemovedByFilter) {
      const kept = n.actualRows || 0;
      if (n.rowsRemovedByFilter > 1000 && n.rowsRemovedByFilter > kept * 5) {
        const cols = extractColumns(n.filter);
        const suggestion = cols.length
          ? `CREATE INDEX ON ${n.relationName || 'tabela'} (${cols.join(', ')});`
          : null;
        warnings.push({
          severity: n.rowsRemovedByFilter > 20000 ? 'critical' : 'warning',
          nodeId: n.id,
          title: 'Seq Scan varrendo muitas linhas',
          text: `${ptNum(n.rowsRemovedByFilter, 0)} linhas foram descartadas pelo filtro em "${
            n.relationName || n.nodeType
          }" — só ${ptNum(kept, 0)} eram necessárias.`,
          suggestion,
        });
      }
    }

    if (n.planRows && n.actualRows != null && n.planRows > 0) {
      const ratio = n.actualRows / n.planRows;
      if ((ratio > 10 || ratio < 0.1) && (n.actualRows > 50 || n.planRows > 50)) {
        warnings.push({
          severity: 'warning',
          nodeId: n.id,
          title: 'Estimativa de linhas desalinhada',
          text: `O planner estimou ${ptNum(n.planRows, 0)} linhas para "${n.nodeType}", mas encontrou ${ptNum(
            n.actualRows,
            0
          )}. Estatísticas desatualizadas podem levar a planos ruins.`,
          suggestion: n.relationName ? `ANALYZE ${n.relationName};` : null,
        });
      }
    }

    if (n.sortSpaceType && n.sortSpaceType.toLowerCase() === 'disk') {
      warnings.push({
        severity: 'critical',
        nodeId: n.id,
        title: 'Sort estourou para disco',
        text: `"${n.nodeType}" precisou de ${n.sortSpaceUsed}kB em disco para ordenar — bem mais lento que ordenar em memória.`,
        suggestion: 'Considere aumentar work_mem para esta sessão/query.',
      });
    }

    if (n.hashBatches && n.hashBatches > 1) {
      warnings.push({
        severity: 'warning',
        nodeId: n.id,
        title: 'Hash Join dividiu em batches',
        text: `"${n.nodeType}" usou ${n.hashBatches} batches — a tabela hash não coube inteira em memória.`,
        suggestion: 'Considere aumentar work_mem.',
      });
    }

    if (n.actualLoops && n.actualLoops > 1000) {
      warnings.push({
        severity: n.actualLoops > 10000 ? 'critical' : 'warning',
        nodeId: n.id,
        title: 'Nó executado muitas vezes',
        text: `"${n.nodeType}" rodou ${ptNum(
          n.actualLoops,
          0
        )} vezes (dentro de um Nested Loop). Um custo pequeno por execução pode somar bastante.`,
      });
    }

    if (n.bufferRead && n.bufferHit != null && n.bufferRead > n.bufferHit && n.bufferRead > 10) {
      warnings.push({
        severity: 'info',
        nodeId: n.id,
        title: 'Leitura de disco significativa',
        text: `"${n.nodeType}" leu ${n.bufferRead} blocos do disco contra ${n.bufferHit} vindos do cache.`,
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
