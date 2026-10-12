import { parsePlan } from './parser';
import { computeMetrics } from './metrics';
import { generateWarnings, warningKey } from './warnings';
import { formatNum } from './format';
import { messages, type Locale } from './i18n';
import type { AnalyzedPlan } from './types';

/** Parse → compute metrics → generate warnings, in one call. Throws on unparsable input. */
export function analyzePlan(raw: string, locale: Locale): AnalyzedPlan {
  const { parsed, format } = parsePlan(raw);
  const { root, all, byId, total, hasActual } = computeMetrics(parsed.root, parsed.executionTime);
  const warnings = generateWarnings(all, hasActual, locale);
  return {
    root,
    all,
    byId,
    total,
    hasActual,
    warnings,
    format,
    planningTime: parsed.planningTime,
    executionTime: parsed.executionTime,
    rawInput: raw,
  };
}

export function bottleneckOf(plan: AnalyzedPlan) {
  return plan.all.slice().sort((a, b) => b.exclusiveWeight - a.exclusiveWeight)[0] ?? null;
}

export function labelFor(plan: AnalyzedPlan, locale: Locale): string {
  const b = bottleneckOf(plan);
  const timeLabel =
    plan.hasActual && plan.executionTime != null
      ? `${formatNum(plan.executionTime, 2, locale)}ms`
      : b
      ? `${messages[locale].app.costLabel} ${formatNum(b.totalCost, 0, locale)}`
      : '';
  return `${b ? b.nodeType : messages[locale].app.planName}${timeLabel ? ' · ' + timeLabel : ''}`;
}

export function summaryOf(plan: AnalyzedPlan) {
  const b = bottleneckOf(plan);
  return {
    executionTime: plan.executionTime,
    planningTime: plan.planningTime,
    nodeCount: plan.all.length,
    warningsCount: plan.warnings.length,
    criticalCount: plan.warnings.filter((w) => w.severity === 'critical').length,
    hasActual: plan.hasActual,
    bottleneckLabel: b ? b.nodeType + (b.relationName ? ` (${b.relationName})` : '') : null,
    bottleneckPct: b ? b.pctOfTotal : null,
    warningKeys: plan.warnings.map((w) => warningKey(w, plan.byId[w.nodeId])),
  };
}
