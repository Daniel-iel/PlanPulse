import { localeInfo, messages, type Locale } from './i18n';

export function formatNum(n: number | null | undefined, digits: number, locale: Locale): string {
  if (n == null || Number.isNaN(n)) return '–';
  return Number(n).toLocaleString(localeInfo[locale].tag, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatRelativeTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  const t = messages[locale].app;
  if (diffSec < 10) return t.relativeNow;

  const formatter = new Intl.RelativeTimeFormat(localeInfo[locale].tag, {
    numeric: 'always',
    style: 'short',
  });
  if (diffSec < 60) return formatter.format(-diffSec, 'second');
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return formatter.format(-diffMin, 'minute');
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return formatter.format(-diffH, 'hour');
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return t.relativeYesterday;
  if (diffD < 7) return formatter.format(-diffD, 'day');
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat(localeInfo[locale].tag, {
    day: '2-digit',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  }).format(d);
}

export function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
