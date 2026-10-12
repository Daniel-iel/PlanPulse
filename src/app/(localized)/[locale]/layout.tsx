import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../../globals.css';
import { isLocale, LOCALES, localeInfo, messages } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const { title, description } = messages[rawLocale].metadata;
  const tag = localeInfo[rawLocale].tag;
  return {
    title,
    description,
    keywords: [
      'PostgreSQL',
      'EXPLAIN ANALYZE',
      'query plan',
      'execution plan',
      'query optimization',
    ],
    openGraph: { title, description, locale: tag.replace('-', '_'), type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return (
    <html lang={localeInfo[rawLocale].tag}>
      <body>{children}</body>
    </html>
  );
}
