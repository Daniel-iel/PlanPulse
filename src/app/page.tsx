export const dynamic = 'force-static';

const steps = [
  {
    number: '01',
    title: 'Copie o EXPLAIN',
    description: 'Use o plano em texto ou FORMAT JSON, com ou sem ANALYZE.',
  },
  {
    number: '02',
    title: 'Encontre o gargalo',
    description: 'Veja o fluxo de execução, os tempos por nó e os avisos importantes.',
  },
  {
    number: '03',
    title: 'Compare resultados',
    description: 'Guarde execuções no navegador e compare o antes e depois da otimização.',
  },
];

export default function LandingPage() {
  return (
    <main className="landing">
      <header className="landing-header">
        <a className="landing-brand" href="/" aria-label="PLAN/PULSE — início">
          PLAN<span>/</span>PULSE
        </a>
        <nav className="landing-nav" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a className="landing-nav-cta" href="/app">Abrir analisador <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span /> PostgreSQL · QUERY PLAN ANALYZER</p>
          <h1 id="hero-title">Entenda o que está deixando sua query <span>lenta.</span></h1>
          <p className="landing-lead">
            Transforme a saída do EXPLAIN em um plano visual, descubra gargalos e compare execuções —
            sem instalar nada e sem enviar seus dados.
          </p>
          <div className="landing-actions">
            <a className="landing-button" href="/app">Analisar um query plan <span aria-hidden="true">→</span></a>
            <a className="landing-text-link" href="#como-funciona">Conheça a ferramenta</a>
          </div>
          <p className="landing-local-note"><span aria-hidden="true">●</span> Gratuito · 100% no navegador · Feito para PostgreSQL</p>
        </div>

        <div className="landing-preview" role="img" aria-label="Prévia de uma árvore de execução PostgreSQL com um gargalo em Seq Scan">
          <div className="preview-topbar">
            <span><i /> EXPLAIN ANALYZE</span>
            <span className="preview-status">ANÁLISE VISUAL</span>
          </div>
          <div className="preview-plan">
            <div className="preview-node preview-node-root">
              <span className="preview-node-label">Sort</span>
              <span className="preview-node-metric">32.4 ms <b>100%</b></span>
            </div>
            <div className="preview-connector" aria-hidden="true" />
            <div className="preview-node preview-node-warn">
              <span className="preview-node-label">Seq Scan <small aria-label="aviso">!</small></span>
              <span className="preview-node-metric">28.1 ms <b>87%</b></span>
            </div>
            <div className="preview-code">
              <span className="code-prompt">&gt;</span> gargalo identificado
              <span className="code-detail">Seq Scan em public.orders</span>
            </div>
          </div>
          <div className="preview-footer">
            <span>EXECUTION TIME <b>32.40 ms</b></span>
            <span>NODES <b>02</b></span>
            <span className="preview-warning">AVISOS <b>01</b></span>
          </div>
          <span className="preview-corner preview-corner-tl" aria-hidden="true" />
          <span className="preview-corner preview-corner-br" aria-hidden="true" />
        </div>
      </section>

      <section className="landing-proof" aria-label="Recursos principais">
        <p>UM JEITO MAIS CLARO DE LER</p>
        <div>
          <span><b>01</b> Plano visual interativo</span>
          <span><b>02</b> Diagnóstico automático</span>
          <span><b>03</b> Histórico local de execuções</span>
        </div>
      </section>

      <section className="landing-how" id="como-funciona" aria-labelledby="how-title">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">DO EXPLAIN À RESPOSTA</p>
          <h2 id="how-title">Otimize com mais contexto.</h2>
          <p>Uma leitura visual do plano de execução ajuda você a sair da estimativa e chegar à causa.</p>
        </div>
        <div className="landing-steps">
          {steps.map((step) => (
            <article className="landing-step" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-privacy" aria-labelledby="privacy-title">
        <div className="privacy-mark" aria-hidden="true"><span /></div>
        <div>
          <p className="landing-eyebrow">SEUS DADOS FICAM COM VOCÊ</p>
          <h2 id="privacy-title">Análise local, sem surpresas.</h2>
          <p>O PLAN/PULSE roda no seu navegador. Os planos e o histórico ficam no armazenamento local do dispositivo — nada é enviado para um servidor.</p>
        </div>
        <a className="landing-button landing-button-secondary" href="/app">Experimentar agora <span aria-hidden="true">→</span></a>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="/">PLAN<span>/</span>PULSE</a>
        <p>Um analisador visual de query plans para PostgreSQL.</p>
        <a href="/app">Abrir o analisador <span aria-hidden="true">↗</span></a>
      </footer>
    </main>
  );
}
