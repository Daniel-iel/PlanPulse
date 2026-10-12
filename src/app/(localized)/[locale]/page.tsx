import LanguageSwitcher from '@/components/LanguageSwitcher';
import { formatNum } from '@/lib/format';
import { isLocale, messages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const t = messages[locale].landing;

  return (
    <main className="landing">
      <header className="landing-header">
        <a className="landing-brand" href={`/${locale}`} aria-label={t.home}>
          PLAN<span>/</span>PULSE
        </a>
        <nav className="landing-nav" aria-label={t.nav}>
          <a href="#how-it-works">{t.howLink}</a>
          <a className="landing-nav-cta" href={`/${locale}/app`}>
            {t.openAnalyzer} <span aria-hidden="true">↗</span>
          </a>
          <LanguageSwitcher locale={locale} targetPath="home" />
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span /> {t.eyebrow}</p>
          <h1 id="hero-title">{t.heroBefore}<span>{t.heroHighlight}</span></h1>
          <p className="landing-lead">{t.lead}</p>
          <div className="landing-actions">
            <a className="landing-button" href={`/${locale}/app`}>
              {t.analyze} <span aria-hidden="true">→</span>
            </a>
            <a className="landing-text-link" href="#how-it-works">{t.toolLink}</a>
          </div>
          <p className="landing-local-note"><span aria-hidden="true">●</span> {t.privacyNote}</p>
        </div>

        <div className="landing-preview" role="img" aria-label={t.preview}>
          <div className="preview-topbar">
            <span><i /> EXPLAIN ANALYZE</span>
            <span className="preview-status">{t.visualAnalysis}</span>
          </div>
          <div className="preview-plan">
            <div className="preview-node preview-node-root">
              <span className="preview-node-label">Sort</span>
              <span className="preview-node-metric">{formatNum(32.4, 1, locale)} ms <b>100%</b></span>
            </div>
            <div className="preview-connector" aria-hidden="true" />
            <div className="preview-node preview-node-warn">
              <span className="preview-node-label">Seq Scan <small aria-label={messages[locale].app.warning}>!</small></span>
              <span className="preview-node-metric">{formatNum(28.1, 1, locale)} ms <b>87%</b></span>
            </div>
            <div className="preview-code">
              <span className="code-prompt">&gt;</span> {t.bottleneckFound}
              <span className="code-detail">Seq Scan on public.orders</span>
            </div>
          </div>
          <div className="preview-footer">
            <span>{t.executionTime} <b>{formatNum(32.4, 2, locale)} ms</b></span>
            <span>{t.nodes} <b>02</b></span>
            <span className="preview-warning">{t.warnings} <b>01</b></span>
          </div>
          <span className="preview-corner preview-corner-tl" aria-hidden="true" />
          <span className="preview-corner preview-corner-br" aria-hidden="true" />
        </div>
      </section>

      <section className="landing-proof" aria-label={t.proofLabel}>
        <p>{t.proofLabel}</p>
        <div>
          {t.proof.map((feature, index) => (
            <span key={feature}><b>0{index + 1}</b> {feature}</span>
          ))}
        </div>
      </section>

      <section className="landing-how" id="how-it-works" aria-labelledby="how-title">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">{t.howEyebrow}</p>
          <h2 id="how-title">{t.howTitle}</h2>
          <p>{t.howDescription}</p>
        </div>
        <div className="landing-steps">
          {t.steps.map((step, index) => (
            <article className="landing-step" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-privacy" aria-labelledby="privacy-title">
        <div className="privacy-mark" aria-hidden="true"><span /></div>
        <div>
          <p className="landing-eyebrow">{t.privacyEyebrow}</p>
          <h2 id="privacy-title">{t.privacyTitle}</h2>
          <p>{t.privacyDescription}</p>
        </div>
        <a className="landing-button landing-button-secondary" href={`/${locale}/app`}>
          {t.tryNow} <span aria-hidden="true">→</span>
        </a>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href={`/${locale}`}>PLAN<span>/</span>PULSE</a>
        <p>{t.footerDescription}</p>
        <a href={`/${locale}/app`}>{t.openAnalyzer} <span aria-hidden="true">↗</span></a>
      </footer>
    </main>
  );
}
