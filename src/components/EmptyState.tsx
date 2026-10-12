import { messages, type Locale } from '@/lib/i18n';

export default function EmptyState({ locale }: { locale: Locale }) {
  return (
    <div className="empty">
      <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,15 L120,15" stroke="#5B7570" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p>{messages[locale].app.emptyState}</p>
    </div>
  );
}
