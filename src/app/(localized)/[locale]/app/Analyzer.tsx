'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnalyzedPlan, HistoryEntry } from '@/lib/types';
import { analyzePlan } from '@/lib/analyze';
import { clearHistory, deleteHistoryEntry, loadHistory, saveToHistory } from '@/lib/storage';
import { isLocale, messages, type Locale } from '@/lib/i18n';
import Topbar from '@/components/Topbar';
import InputDrawer from '@/components/InputDrawer';
import EmptyState from '@/components/EmptyState';
import PlanCanvas from '@/components/PlanCanvas';
import Inspector from '@/components/Inspector';
import Diagnosis from '@/components/Diagnosis';
import HistoryModal from '@/components/HistoryModal';
import CompareModal from '@/components/CompareModal';

const LANGUAGE_SWITCH_KEY = 'ppulse:language-switch';

interface LanguageSwitchState {
  locale: Locale;
  rawInput: string;
  drawerOpen: boolean;
  hasPlan: boolean;
}

function isLanguageSwitchState(value: unknown): value is LanguageSwitchState {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'locale' in value &&
    typeof value.locale === 'string' &&
    isLocale(value.locale) &&
    'rawInput' in value &&
    typeof value.rawInput === 'string' &&
    'drawerOpen' in value &&
    typeof value.drawerOpen === 'boolean' &&
    'hasPlan' in value &&
    typeof value.hasPlan === 'boolean'
  );
}

export default function Analyzer({ locale }: { locale: Locale }) {
  const t = messages[locale].app;
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
  const previousLocale = useRef(locale);

  useEffect(() => {
    let restoreFailed = false;
    try {
      const pending = window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY);
      if (pending) {
        window.sessionStorage.removeItem(LANGUAGE_SWITCH_KEY);
        const parsed: unknown = JSON.parse(pending);
        if (!isLanguageSwitchState(parsed)) throw new Error('Saved locale switch state is malformed.');
        if (parsed.locale === locale) {
          setRawInput(parsed.rawInput);
          setDrawerOpen(parsed.drawerOpen);
          if (parsed.hasPlan && parsed.rawInput.trim()) {
            setPlan(analyzePlan(parsed.rawInput, locale));
          }
        }
      }
    } catch {
      restoreFailed = true;
    }
    try {
      setHistory(loadHistory(locale));
      setError(restoreFailed ? t.cannotPreservePlan : '');
    } catch {
      setHistory([]);
      setError(t.cannotLoadHistory);
    }
  }, [locale, t.cannotLoadHistory]);

  const handleSwitchLocale = useCallback((targetLocale: Locale) => {
    try {
      window.sessionStorage.setItem(
        LANGUAGE_SWITCH_KEY,
        JSON.stringify({
          locale: targetLocale,
          rawInput,
          drawerOpen,
          hasPlan: plan !== null,
        } satisfies LanguageSwitchState)
      );
    } catch {
      setError(t.cannotPreservePlan);
    }
  }, [drawerOpen, plan, rawInput, t.cannotPreservePlan]);

  useEffect(() => {
    if (previousLocale.current === locale) return;
    previousLocale.current = locale;
    if (!plan) return;
    try {
      setPlan(analyzePlan(plan.rawInput, locale));
      setError('');
    } catch {
      setError(t.cannotLoadHistory);
    }
  }, [locale, plan, t.cannotLoadHistory]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
      setError(t.pasteBeforeAnalyze);
      return;
    }

    let analyzed: AnalyzedPlan;
    try {
      analyzed = analyzePlan(raw, locale);
    } catch {
      setError(t.invalidPlan);
      return;
    }
    setPlan(analyzed);
    setSelectedId(null);
    setDrawerOpen(false);
    if (!skipSave) {
      try {
        const updated = saveToHistory(analyzed, locale);
        setHistory(updated);
      } catch {
        setError(t.cannotLoadHistory);
      }
    }
  }, [locale, rawInput, t.invalidPlan, t.pasteBeforeAnalyze]);

  const handleLoadFromHistory = useCallback((id: string) => {
    const entry = history.find((item) => item.id === id);
    if (!entry) return;
    setHistoryOpen(false);
    setCompareOpen(false);
    analyze(entry.rawInput, true);
  }, [history, analyze]);

  const handleToggleCompare = useCallback((id: string, checked: boolean) => {
    setCompareSelection((previous) => {
      const next = new Set(previous);
      if (checked) {
        if (next.size >= 2) return previous;
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm(t.cannotDeleteHistory)) return;
    try {
      setHistory(deleteHistoryEntry(id, locale));
    } catch {
      setError(t.cannotLoadHistory);
      return;
    }
    setCompareSelection((previous) => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  }, [locale, t.cannotDeleteHistory, t.cannotLoadHistory]);

  const handleClearAll = useCallback(() => {
    if (!history.length || !confirm(t.cannotClearHistory)) return;
    setHistory(clearHistory());
    setCompareSelection(new Set());
  }, [history.length, t.cannotClearHistory]);

  const handleCompare = useCallback(() => {
    if (compareSelection.size !== 2) return;
    const [idA, idB] = [...compareSelection];
    const entryA = history.find((item) => item.id === idA);
    const entryB = history.find((item) => item.id === idB);
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
        onToggleDrawer={() => setDrawerOpen((value) => !value)}
        locale={locale}
        onSwitchLocale={handleSwitchLocale}
      />
      <InputDrawer
        open={drawerOpen}
        onToggle={() => setDrawerOpen((value) => !value)}
        value={rawInput}
        onChange={setRawInput}
        onAnalyze={() => analyze()}
        error={error}
        locale={locale}
      />
      {!plan ? (
        <EmptyState locale={locale} />
      ) : (
        <div className="main-split">
          <PlanCanvas plan={plan} selectedId={selectedId} onSelect={setSelectedId} locale={locale} />
          <div className="sidebar">
            <div className="card">
              <div className="card-head-bar"><h2>{t.inspector}</h2></div>
              <Inspector plan={plan} selectedId={selectedId} locale={locale} />
            </div>
            <div className="card">
              <div className="card-head-bar">
                <h2>{t.diagnosis}</h2>
                <span className="badge-count">{plan.warnings.length}</span>
              </div>
              <Diagnosis plan={plan} onSelectNode={setSelectedId} locale={locale} />
            </div>
          </div>
        </div>
      )}
      <footer>{t.footer}</footer>
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
        locale={locale}
      />
      <CompareModal
        open={compareOpen}
        left={comparePair?.left ?? null}
        right={comparePair?.right ?? null}
        onClose={() => setCompareOpen(false)}
        onLoad={handleLoadFromHistory}
        locale={locale}
      />
    </div>
  );
}
