'use client';

import type { AnalyzedPlan } from '@/lib/types';
import CopyButton from './CopyButton';

interface Props {
  plan: AnalyzedPlan;
  onSelectNode: (id: number) => void;
}

const SEV_LABEL: Record<string, string> = { critical: 'CRÍTICO', warning: 'ATENÇÃO', info: 'INFO' };

export default function Diagnosis({ plan, onSelectNode }: Props) {
  if (!plan.hasActual) {
    return (
      <div className="note">
        Este plano não tem tempos reais (rode com <strong>EXPLAIN ANALYZE</strong>) para liberar os
        diagnósticos — por enquanto só dá pra ver a estrutura e os custos estimados no diagrama.
      </div>
    );
  }

  if (!plan.warnings.length) {
    return <div className="note">Nenhum problema óbvio encontrado. O plano parece saudável.</div>;
  }

  return (
    <div className="diag-list">
      {plan.warnings.map((w, i) => (
        <div className="diag" key={i} onClick={() => onSelectNode(w.nodeId)}>
          <span className={`sev-pill sev-${w.severity}`}>{SEV_LABEL[w.severity]}</span>
          <div className="diag-body">
            <div className="diag-title">{w.title}</div>
            <div className="diag-text">{w.text}</div>
            {w.suggestion && (
              <div className="suggestion" onClick={(e) => e.stopPropagation()}>
                <code>{w.suggestion}</code>
                <CopyButton text={w.suggestion} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
