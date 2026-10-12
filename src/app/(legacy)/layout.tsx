import type { ReactNode } from 'react';
import '../globals.css';

export default function LegacyLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
