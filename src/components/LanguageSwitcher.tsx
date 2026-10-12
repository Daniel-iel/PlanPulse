'use client';

import { LOCALES, localeInfo, messages, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher({
  locale,
  targetPath,
  onSwitch,
}: {
  locale: Locale;
  targetPath: 'home' | 'app';
  onSwitch?: (locale: Locale) => void;
}) {
  const suffix = targetPath === 'app' ? '/app' : '';

  return (
    <nav className="language-switcher" aria-label={messages[locale].language}>
      <span>{messages[locale].language}:</span>
      {LOCALES.map((option) => (
        <a
          key={option}
          href={`/${option}${suffix}`}
          aria-current={option === locale ? 'page' : undefined}
          onClick={() => {
            if (option !== locale) onSwitch?.(option);
          }}
        >
          {localeInfo[option].name}
        </a>
      ))}
    </nav>
  );
}
