'use client';

import type { AnalyzedPlan } from '@/lib/types';
import { formatNum } from '@/lib/format';
import { bottleneckOf } from '@/lib/analyze';
import { messages, type Locale } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  plan: AnalyzedPlan | null;
  historyCount: number;
  onOpenHistory: () => void;
  onToggleDrawer: () => void;
  locale: Locale;
  onSwitchLocale: (locale: Locale) => void;
}

export default function Topbar({
  plan,
  historyCount,
  onOpenHistory,
  onToggleDrawer,
  locale,
  onSwitchLocale,
}: Props) {
  const t = messages[locale].app;
  const bottleneck = plan ? bottleneckOf(plan) : null;
  const wClass = !plan
    ? ''
    : plan.warnings.some((w) => w.severity === 'critical')
    ? 'hot'
    : plan.warnings.length
    ? 'warm'
    : 'cool';

  return (
    <div className="topbar">
      <div className="brand">
        PLAN<span className="slash">/</span>PULSE
      </div>
      {plan && (
        <div className="stat-chips">
          <span className="chip">
            {t.execution} <b>{plan.executionTime != null ? formatNum(plan.executionTime, 2, locale) + 'ms' : '–'}</b>
          </span>
          <span className="chip">
            {t.planning} <b>{plan.planningTime != null ? formatNum(plan.planningTime, 2, locale) + 'ms' : '–'}</b>
          </span>
          <span className="chip">
            {t.nodes} <b>{plan.all.length}</b>
          </span>
          <span className={`chip ${wClass}`}>
            {t.warnings} <b>{plan.warnings.length}</b>
          </span>
          {bottleneck && (
            <span className="chip">
              {t.bottleneck} <b>{bottleneck.nodeType}</b>
            </span>
          )}
        </div>
      )}
      <div className="topbar-actions">
        <button className="btn-ghost" onClick={onOpenHistory} aria-label={`${t.history} (${historyCount})`}>
          {t.history} <span className="badge-count">{historyCount}</span>
        </button>
        <button className="btn-ghost" onClick={onToggleDrawer}>
          {t.pastePlan}
        </button>
        <LanguageSwitcher locale={locale} targetPath="app" onSwitch={onSwitchLocale} />
      </div>
    </div>
  );
}
