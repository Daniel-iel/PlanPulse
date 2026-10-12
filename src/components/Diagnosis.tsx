'use client';

import type { AnalyzedPlan } from '@/lib/types';
import CopyButton from './CopyButton';
import { messages, type Locale } from '@/lib/i18n';

interface Props {
  plan: AnalyzedPlan;
  onSelectNode: (id: number) => void;
  locale: Locale;
}

export default function Diagnosis({ plan, onSelectNode, locale }: Props) {
  const t = messages[locale].app;
  if (!plan.hasActual) {
    return (
      <div className="note">
        {t.noActual}
      </div>
    );
  }

  if (!plan.warnings.length) {
    return <div className="note">{t.noIssues}</div>;
  }

  return (
    <div className="diag-list">
      {plan.warnings.map((w, i) => (
        <div className="diag" key={i} onClick={() => onSelectNode(w.nodeId)}>
          <span className={`sev-pill sev-${w.severity}`}>
            {w.severity === 'critical' ? t.severityCritical : w.severity === 'warning' ? t.severityWarning : t.severityInfo}
          </span>
          <div className="diag-body">
            <div className="diag-title">{w.title}</div>
            <div className="diag-text">{w.text}</div>
            {w.suggestion && (
              <div className="suggestion" onClick={(e) => e.stopPropagation()}>
                <code>{w.suggestion}</code>
                <CopyButton text={w.suggestion} locale={locale} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
