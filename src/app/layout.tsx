import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PLAN/PULSE — Analisador visual de query plans PostgreSQL',
  description:
    'Entenda planos EXPLAIN do PostgreSQL com uma visualização interativa, diagnóstico automático de gargalos e comparação de execuções. Grátis e direto no navegador.',
  keywords: [
    'PostgreSQL',
    'EXPLAIN ANALYZE',
    'query plan',
    'plano de execução',
    'otimização de queries',
  ],
  openGraph: {
    title: 'PLAN/PULSE — Analisador visual de query plans PostgreSQL',
    description:
      'Visualize planos EXPLAIN, encontre gargalos e compare execuções PostgreSQL sem enviar seus dados.',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PLAN/PULSE — Analisador visual de query plans PostgreSQL',
    description:
      'Visualize planos EXPLAIN, encontre gargalos e compare execuções PostgreSQL sem enviar seus dados.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
