'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AnalyzedPlan, HistoryEntry } from '@/lib/types';
import { analyzePlan } from '@/lib/analyze';
import { loadHistory, saveToHistory, deleteHistoryEntry, clearHistory } from '@/lib/storage';
import Topbar from '@/components/Topbar';
import InputDrawer from '@/components/InputDrawer';
import EmptyState from '@/components/EmptyState';
import PlanCanvas from '@/components/PlanCanvas';
import Inspector from '@/components/Inspector';
import Diagnosis from '@/components/Diagnosis';
import HistoryModal from '@/components/HistoryModal';
import CompareModal from '@/components/CompareModal';

export default function Home() {
  const [rawInput, setRawInput] = useState('');
  const [plan, setPlan] = useState<AnalyzedPlan | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [error, setError] = useState('');

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [compareSelection, setCompareSelection] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePair, setComparePair] = useState<{ left: HistoryEntry; right: HistoryEntry } | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHistoryOpen(false);
        setCompareOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const analyze = useCallback((rawOverride?: string, skipSave = false) => {
    const raw = (rawOverride ?? rawInput).trim();
    if (rawOverride != null) setRawInput(rawOverride);
    setError('');
    if (!raw) {
      setError('Cole um plano antes de analisar.');
      return;
    }
    let analyzed: AnalyzedPlan;
    try {
      analyzed = analyzePlan(raw);
    } catch {
      setError('Não consegui interpretar esse plano. Verifique se é uma saída válida de EXPLAIN (texto ou FORMAT JSON).');
      return;
    }
    setPlan(analyzed);
    setSelectedId(null);
    setDrawerOpen(false);
    if (!skipSave) {
      const updated = saveToHistory(analyzed);
      setHistory(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawInput]);

  const handleLoadFromHistory = useCallback((id: string) => {
    const entry = history.find((e) => e.id === id);
    if (!entry) return;
    setHistoryOpen(false);
    setCompareOpen(false);
    analyze(entry.rawInput, true);
  }, [history, analyze]);

  const handleToggleCompare = useCallback((id: string, checked: boolean) => {
    setCompareSelection((prev) => {
      const next = new Set(prev);
      if (checked) {
        if (next.size >= 2) return prev; // ignore a 3rd selection
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm('Excluir este plano do histórico?')) return;
    setHistory(deleteHistoryEntry(id));
    setCompareSelection((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    if (!history.length) return;
    if (!confirm('Apagar todo o histórico salvo neste navegador?')) return;
    setHistory(clearHistory());
    setCompareSelection(new Set());
  }, [history.length]);

  const handleCompare = useCallback(() => {
    if (compareSelection.size !== 2) return;
    const [idA, idB] = [...compareSelection];
    const entryA = history.find((e) => e.id === idA);
    const entryB = history.find((e) => e.id === idB);
    if (!entryA || !entryB) return;
    const [left, right] =
      new Date(entryA.savedAt) <= new Date(entryB.savedAt) ? [entryA, entryB] : [entryB, entryA];
    setComparePair({ left, right });
    setHistoryOpen(false);
    setCompareOpen(true);
  }, [compareSelection, history]);

  return (
    <div className="app">
      <Topbar
        plan={plan}
        historyCount={history.length}
        onOpenHistory={() => setHistoryOpen(true)}
        onToggleDrawer={() => setDrawerOpen((v) => !v)}
      />

      <InputDrawer
        open={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        value={rawInput}
        onChange={setRawInput}
        onAnalyze={() => analyze()}
        error={error}
      />

      {!plan ? (
        <EmptyState />
      ) : (
        <div className="main-split">
          <PlanCanvas plan={plan} selectedId={selectedId} onSelect={setSelectedId} />

          <div className="sidebar">
            <div className="card">
              <div className="card-head-bar"><h2>Inspetor</h2></div>
              <Inspector plan={plan} selectedId={selectedId} />
            </div>
            <div className="card">
              <div className="card-head-bar">
                <h2>Diagnóstico</h2>
                <span className="badge-count">{plan.warnings.length}</span>
              </div>
              <Diagnosis plan={plan} onSelectNode={setSelectedId} />
            </div>
          </div>
        </div>
      )}

      <footer>PLAN/PULSE roda inteiramente no seu navegador — nenhum plano é enviado a lugar nenhum.</footer>

      <HistoryModal
        open={historyOpen}
        history={history}
        compareSelection={compareSelection}
        onClose={() => setHistoryOpen(false)}
        onToggleCompare={handleToggleCompare}
        onLoad={handleLoadFromHistory}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
        onCompare={handleCompare}
      />

      <CompareModal
        open={compareOpen}
        left={comparePair?.left ?? null}
        right={comparePair?.right ?? null}
        onClose={() => setCompareOpen(false)}
        onLoad={handleLoadFromHistory}
      />
    </div>
  );
}
