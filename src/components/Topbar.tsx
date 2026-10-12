'use client';

import type { AnalyzedPlan } from '@/lib/types';
import { ptNum } from '@/lib/format';
import { bottleneckOf } from '@/lib/analyze';

interface Props {
  plan: AnalyzedPlan | null;
  historyCount: number;
  onOpenHistory: () => void;
  onToggleDrawer: () => void;
}

export default function Topbar({ plan, historyCount, onOpenHistory, onToggleDrawer }: Props) {
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
            exec <b>{plan.executionTime != null ? ptNum(plan.executionTime, 2) + 'ms' : '–'}</b>
          </span>
          <span className="chip">
            planej. <b>{plan.planningTime != null ? ptNum(plan.planningTime, 2) + 'ms' : '–'}</b>
          </span>
          <span className="chip">
            nós <b>{plan.all.length}</b>
          </span>
          <span className={`chip ${wClass}`}>
            avisos <b>{plan.warnings.length}</b>
          </span>
          {bottleneck && (
            <span className="chip">
              gargalo <b>{bottleneck.nodeType}</b>
            </span>
          )}
        </div>
      )}
      <div className="topbar-actions">
        <button className="btn-ghost" onClick={onOpenHistory}>
          Histórico <span className="badge-count">{historyCount}</span>
        </button>
        <button className="btn-ghost" onClick={onToggleDrawer}>
          Colar plano
        </button>
      </div>
    </div>
  );
}
