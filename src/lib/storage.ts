import type { AnalyzedPlan, HistoryEntry } from './types';
import { labelFor, summaryOf } from './analyze';

const HISTORY_KEY = 'ppulse:history';
const MAX_HISTORY = 25;

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function loadHistory(): HistoryEntry[] {
  const raw = safeGetItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list: HistoryEntry[]): boolean {
  return safeSetItem(HISTORY_KEY, JSON.stringify(list));
}

/** Prepends a new entry for this analyzed plan and persists the (capped) list. */
export function saveToHistory(plan: AnalyzedPlan): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    label: labelFor(plan),
    format: plan.format,
    rawInput: plan.rawInput,
    summary: summaryOf(plan),
  };
  let list = loadHistory();
  list = [entry, ...list].slice(0, MAX_HISTORY);
  persist(list);
  return list;
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  const list = loadHistory().filter((e) => e.id !== id);
  persist(list);
  return list;
}

export function clearHistory(): HistoryEntry[] {
  persist([]);
  return [];
}
