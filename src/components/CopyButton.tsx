'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

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
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
}
