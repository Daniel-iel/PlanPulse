'use client';

import { useState } from 'react';
import { messages, type Locale } from '@/lib/i18n';

export default function CopyButton({ text, locale }: { text: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const t = messages[locale].app;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <button className="copy-btn" onClick={handleClick}>
      {copied ? t.copied : t.copy}
    </button>
  );
}
