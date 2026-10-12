import type { AnalyzedPlan, HistoryEntry } from './types';
import { labelFor, summaryOf } from './analyze';
import { analyzePlan } from './analyze';
import type { Locale } from './i18n';

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

export function loadHistory(locale: Locale): HistoryEntry[] {
  const raw = safeGetItem(HISTORY_KEY);
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.map((value: unknown) => {
    if (
      typeof value !== 'object' ||
      value === null ||
      !('id' in value) ||
      typeof value.id !== 'string' ||
      !('savedAt' in value) ||
      typeof value.savedAt !== 'string' ||
      !('rawInput' in value) ||
      typeof value.rawInput !== 'string'
    ) {
      throw new Error('Saved history entry is malformed.');
    }
    const plan = analyzePlan(value.rawInput, locale);
    return {
      id: value.id,
      savedAt: value.savedAt,
      rawInput: value.rawInput,
      label: labelFor(plan, locale),
      format: plan.format,
      summary: summaryOf(plan),
    };
  });
}

function persist(list: HistoryEntry[]): boolean {
  return safeSetItem(HISTORY_KEY, JSON.stringify(list));
}

/** Prepends a new entry for this analyzed plan and persists the (capped) list. */
export function saveToHistory(plan: AnalyzedPlan, locale: Locale): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    label: labelFor(plan, locale),
    format: plan.format,
    rawInput: plan.rawInput,
    summary: summaryOf(plan),
  };
  let list = loadHistory(locale);
  list = [entry, ...list].slice(0, MAX_HISTORY);
  persist(list);
  return list;
}

export function deleteHistoryEntry(id: string, locale: Locale): HistoryEntry[] {
  const list = loadHistory(locale).filter((e) => e.id !== id);
  persist(list);
  return list;
}

export function clearHistory(): HistoryEntry[] {
  persist([]);
  return [];
}
