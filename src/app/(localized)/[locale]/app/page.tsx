import { notFound } from 'next/navigation';
import Analyzer from './Analyzer';
import { isLocale } from '@/lib/i18n';

export default async function AnalyzerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <Analyzer locale={rawLocale} />;
}
