export const LOCALES = ['en', 'pt', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const localeInfo: Record<Locale, { tag: string; name: string }> = {
  en: { tag: 'en-US', name: 'English' },
  pt: { tag: 'pt-BR', name: 'Português' },
  es: { tag: 'es-ES', name: 'Español' },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const messages = {
  en: {
    metadata: {
      title: 'PLAN/PULSE — PostgreSQL Query Plan Analyzer',
      description:
        'Understand PostgreSQL EXPLAIN plans with interactive visualization, automatic bottleneck diagnosis, and execution comparisons. Free and private in your browser.',
    },
    language: 'Language',
    languageName: 'English',
    landing: {
      home: 'PLAN/PULSE — home',
      nav: 'Main navigation',
      howLink: 'How it works',
      openAnalyzer: 'Open analyzer',
      eyebrow: 'POSTGRESQL · QUERY PLAN ANALYZER',
      heroBefore: 'See what is slowing your query ',
      heroHighlight: 'down.',
      lead: 'Turn EXPLAIN output into a visual plan, find bottlenecks, and compare runs — without installing anything or sending your data.',
      analyze: 'Analyze a query plan',
      toolLink: 'Explore the tool',
      privacyNote: 'Free · 100% in your browser · Built for PostgreSQL',
      preview: 'Preview of a PostgreSQL execution tree with a Seq Scan bottleneck',
      visualAnalysis: 'VISUAL ANALYSIS',
      bottleneckFound: 'bottleneck found',
      executionTime: 'EXECUTION TIME',
      nodes: 'NODES',
      warnings: 'WARNINGS',
      proofLabel: 'A CLEARER WAY TO READ',
      proof: ['Interactive visual plan', 'Automatic diagnosis', 'Local run history'],
      howEyebrow: 'FROM EXPLAIN TO ANSWERS',
      howTitle: 'Optimize with more context.',
      howDescription: 'A visual view of the execution plan helps you move from an estimate to the root cause.',
      steps: [
        { title: 'Copy EXPLAIN', description: 'Use a text plan or FORMAT JSON, with or without ANALYZE.' },
        { title: 'Find the bottleneck', description: 'See the execution flow, per-node timings, and important warnings.' },
        { title: 'Compare results', description: 'Save runs in your browser and compare before and after optimization.' },
      ],
      privacyEyebrow: 'YOUR DATA STAYS WITH YOU',
      privacyTitle: 'Local analysis, no surprises.',
      privacyDescription:
        'PLAN/PULSE runs in your browser. Plans and history stay in this device’s local storage — nothing is sent to a server.',
      tryNow: 'Try it now',
      footerDescription: 'A visual query plan analyzer for PostgreSQL.',
    },
    app: {
      execution: 'exec',
      planning: 'planning',
      nodes: 'nodes',
      warnings: 'warnings',
      bottleneck: 'bottleneck',
      history: 'History',
      pastePlan: 'Paste plan',
      inputSummary: 'Paste EXPLAIN here (text or JSON)',
      inputPlaceholder: 'Paste the EXPLAIN ANALYZE output here...',
      analyze: 'Analyze plan',
      exampleText: 'Text example',
      exampleJson: 'JSON example',
      emptyState: 'No plan analyzed yet. Paste an EXPLAIN above and click “Analyze plan”.',
      inspector: 'Inspector',
      diagnosis: 'Diagnosis',
      footer: 'PLAN/PULSE runs entirely in your browser — no plan is sent anywhere.',
      pasteBeforeAnalyze: 'Paste a plan before analyzing.',
      invalidPlan: 'Could not interpret this plan. Check that it is valid EXPLAIN output (text or FORMAT JSON).',
      cannotLoadHistory: 'Could not load saved history. Check that the stored EXPLAIN plans are valid.',
      cannotPreservePlan: 'Could not preserve the current plan while changing languages.',
      cannotDeleteHistory: 'Delete this plan from history?',
      cannotClearHistory: 'Delete all history saved in this browser?',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      fitScreen: 'Fit to screen',
      canvasHint: 'drag to pan · scroll to zoom · click a card to see its path',
      rows: 'rows',
      indexScan: 'index scan',
      estimatedCost: 'estimated cost',
      estimatedActualRows: 'est. → actual rows',
      timePerLoop: 'time (per loop)',
      loops: 'loops',
      selfTime: 'self time',
      noRelation: '(no associated relation)',
      inspectorHint: 'Click a diagram card to see node details.',
      nodeNotFound: 'Node not found.',
      filter: 'Filter',
      indexCondition: 'Index Cond',
      hashCondition: 'Hash Cond',
      sortKey: 'Sort Key',
      sortMethod: 'Sort Method',
      rowsRemoved: 'Rows Removed',
      buffers: 'Buffers',
      critical: 'CRITICAL',
      warning: 'WARNING',
      info: 'INFO',
      copy: 'Copy',
      copied: 'Copied!',
      noActual:
        'This plan has no actual timings (run with EXPLAIN ANALYZE) to enable diagnostics — for now, only the structure and estimated costs are shown.',
      noIssues: 'No obvious issues found. The plan looks healthy.',
      historyTitle: 'Plan history',
      historyDescription: 'Saved automatically in this browser. Select up to 2 to compare.',
      clearAll: 'Clear all',
      noHistory:
        'No saved plans yet. Each analyzed plan is saved here automatically (only in this browser).',
      compareSelected: 'Compare selected',
      compareTitle: 'Plan comparison',
      executionTimeLabel: 'Execution time',
      planningTimeLabel: 'Planning time',
      nodesInPlan: 'Plan nodes',
      criticalIssues: 'Critical',
      resolved: 'RESOLVED',
      newWarnings: 'NEW',
      sameWarnings: 'The two plans have the same warnings.',
      loadPlan: 'Load',
      delete: 'Delete',
      savedWarnings: 'warnings',
      noAnalyze: 'no ANALYZE',
      warningCountSingular: 'warning',
      warningCountPlural: 'warnings',
      clickForDetails: 'click for details',
      clickToHighlight: 'click for details and highlight the path',
      relativeNow: 'just now',
      relativeYesterday: 'yesterday',
      severityCritical: 'CRITICAL',
      severityWarning: 'WARNING',
      severityInfo: 'INFO',
      close: 'Close',
      selectForCompare: 'Select plan to compare',
      planName: 'Plan',
      costLabel: 'cost',
    },
    warning: {
      bottleneck: (node: string, relation: string, pct: string, time: string) =>
        `"${node}"${relation ? ` on "${relation}"` : ''} accounts for ${pct}% of total execution time (${time}ms exclusive).`,
      seqScan: (removed: string, relation: string, kept: string) =>
        `${removed} rows were discarded by the filter on "${relation}" — only ${kept} were needed.`,
      estimate: (planned: string, node: string, actual: string) =>
        `The planner estimated ${planned} rows for "${node}", but found ${actual}. Stale statistics can lead to poor plans.`,
      diskSort: (node: string, space: string) =>
        `"${node}" needed ${space}kB on disk to sort — much slower than sorting in memory.`,
      hashBatches: (node: string, batches: number) =>
        `"${node}" used ${batches} batches — the hash table did not fit entirely in memory.`,
      loops: (node: string, loops: string) =>
        `"${node}" ran ${loops} times (inside a Nested Loop). Even a small per-run cost can add up.`,
      diskRead: (node: string, read: number, hit: number) =>
        `"${node}" read ${read} blocks from disk versus ${hit} from cache.`,
      bottleneckTitle: 'Execution bottleneck',
      seqScanTitle: 'Seq Scan filtering many rows',
      estimateTitle: 'Row estimate mismatch',
      diskSortTitle: 'Sort spilled to disk',
      hashBatchesTitle: 'Hash Join split into batches',
      loopsTitle: 'Node executed many times',
      diskReadTitle: 'Significant disk reads',
      createIndex: (relation: string, columns: string) => `CREATE INDEX ON ${relation} (${columns});`,
      analyze: (relation: string) => `ANALYZE ${relation};`,
      increaseWorkMem: 'Consider increasing work_mem for this session/query.',
      increaseWorkMemShort: 'Consider increasing work_mem.',
    },
  },
  pt: {
    metadata: {
      title: 'PLAN/PULSE — Analisador de planos de consulta PostgreSQL',
      description:
        'Entenda planos EXPLAIN do PostgreSQL com visualização interativa, diagnóstico automático de gargalos e comparação de execuções. Grátis e privado no navegador.',
    },
    language: 'Idioma',
    languageName: 'Português',
    landing: {
      home: 'PLAN/PULSE — início',
      nav: 'Navegação principal',
      howLink: 'Como funciona',
      openAnalyzer: 'Abrir analisador',
      eyebrow: 'POSTGRESQL · QUERY PLAN ANALYZER',
      heroBefore: 'Entenda o que está deixando sua query ',
      heroHighlight: 'lenta.',
      lead: 'Transforme a saída do EXPLAIN em um plano visual, descubra gargalos e compare execuções — sem instalar nada e sem enviar seus dados.',
      analyze: 'Analisar um query plan',
      toolLink: 'Conheça a ferramenta',
      privacyNote: 'Gratuito · 100% no navegador · Feito para PostgreSQL',
      preview: 'Prévia de uma árvore de execução PostgreSQL com um gargalo em Seq Scan',
      visualAnalysis: 'ANÁLISE VISUAL',
      bottleneckFound: 'gargalo identificado',
      executionTime: 'TEMPO DE EXECUÇÃO',
      nodes: 'NÓS',
      warnings: 'AVISOS',
      proofLabel: 'UM JEITO MAIS CLARO DE LER',
      proof: ['Plano visual interativo', 'Diagnóstico automático', 'Histórico local de execuções'],
      howEyebrow: 'DO EXPLAIN À RESPOSTA',
      howTitle: 'Otimize com mais contexto.',
      howDescription: 'Uma leitura visual do plano de execução ajuda você a sair da estimativa e chegar à causa.',
      steps: [
        { title: 'Copie o EXPLAIN', description: 'Use o plano em texto ou FORMAT JSON, com ou sem ANALYZE.' },
        { title: 'Encontre o gargalo', description: 'Veja o fluxo de execução, os tempos por nó e os avisos importantes.' },
        { title: 'Compare resultados', description: 'Guarde execuções no navegador e compare o antes e depois da otimização.' },
      ],
      privacyEyebrow: 'SEUS DADOS FICAM COM VOCÊ',
      privacyTitle: 'Análise local, sem surpresas.',
      privacyDescription:
        'O PLAN/PULSE roda no seu navegador. Os planos e o histórico ficam no armazenamento local do dispositivo — nada é enviado para um servidor.',
      tryNow: 'Experimentar agora',
      footerDescription: 'Um analisador visual de query plans para PostgreSQL.',
    },
    app: {
      execution: 'exec',
      planning: 'planej.',
      nodes: 'nós',
      warnings: 'avisos',
      bottleneck: 'gargalo',
      history: 'Histórico',
      pastePlan: 'Colar plano',
      inputSummary: 'Cole o EXPLAIN aqui (texto ou JSON)',
      inputPlaceholder: 'Cole aqui o resultado de EXPLAIN ANALYZE...',
      analyze: 'Analisar plano',
      exampleText: 'Exemplo (texto)',
      exampleJson: 'Exemplo (JSON)',
      emptyState: 'Nenhum plano analisado ainda. Cole um EXPLAIN acima e clique em “Analisar plano”.',
      inspector: 'Inspetor',
      diagnosis: 'Diagnóstico',
      footer: 'PLAN/PULSE roda inteiramente no seu navegador — nenhum plano é enviado a lugar nenhum.',
      pasteBeforeAnalyze: 'Cole um plano antes de analisar.',
      invalidPlan: 'Não consegui interpretar esse plano. Verifique se é uma saída válida de EXPLAIN (texto ou FORMAT JSON).',
      cannotLoadHistory: 'Não foi possível carregar o histórico salvo. Verifique se os planos EXPLAIN armazenados são válidos.',
      cannotPreservePlan: 'Não foi possível manter o plano atual ao trocar de idioma.',
      cannotDeleteHistory: 'Excluir este plano do histórico?',
      cannotClearHistory: 'Apagar todo o histórico salvo neste navegador?',
      zoomIn: 'Aumentar zoom',
      zoomOut: 'Diminuir zoom',
      fitScreen: 'Ajustar à tela',
      canvasHint: 'arraste para navegar · role para zoom · clique num card para ver o caminho',
      rows: 'linhas',
      indexScan: 'index scan',
      estimatedCost: 'custo estimado',
      estimatedActualRows: 'linhas est. → real',
      timePerLoop: 'tempo (por loop)',
      loops: 'loops',
      selfTime: 'tempo próprio',
      noRelation: '(sem relação associada)',
      inspectorHint: 'Clique em um card do diagrama para ver os detalhes do nó.',
      nodeNotFound: 'Nó não encontrado.',
      filter: 'Filter',
      indexCondition: 'Index Cond',
      hashCondition: 'Hash Cond',
      sortKey: 'Sort Key',
      sortMethod: 'Sort Method',
      rowsRemoved: 'Rows Removed',
      buffers: 'Buffers',
      critical: 'CRÍTICO',
      warning: 'ATENÇÃO',
      info: 'INFO',
      copy: 'Copiar',
      copied: 'Copiado!',
      noActual:
        'Este plano não tem tempos reais (rode com EXPLAIN ANALYZE) para liberar os diagnósticos — por enquanto só dá pra ver a estrutura e os custos estimados no diagrama.',
      noIssues: 'Nenhum problema óbvio encontrado. O plano parece saudável.',
      historyTitle: 'Histórico de planos',
      historyDescription: 'Salvo automaticamente neste navegador. Selecione até 2 para comparar.',
      clearAll: 'Limpar tudo',
      noHistory:
        'Nenhum plano salvo ainda. Toda vez que você analisar um plano, ele é guardado aqui automaticamente (só neste navegador).',
      compareSelected: 'Comparar selecionados',
      compareTitle: 'Comparação entre planos',
      executionTimeLabel: 'Tempo de execução',
      planningTimeLabel: 'Tempo de planejamento',
      nodesInPlan: 'Nós no plano',
      criticalIssues: 'Críticos',
      resolved: 'RESOLVIDOS',
      newWarnings: 'NOVOS',
      sameWarnings: 'Mesmos avisos nos dois planos.',
      loadPlan: 'Carregar',
      delete: 'Excluir',
      savedWarnings: 'avisos',
      noAnalyze: 'sem ANALYZE',
      warningCountSingular: 'aviso',
      warningCountPlural: 'avisos',
      clickForDetails: 'clique para detalhes',
      clickToHighlight: 'clique para detalhes e realçar o caminho',
      relativeNow: 'agora mesmo',
      relativeYesterday: 'ontem',
      severityCritical: 'CRÍTICO',
      severityWarning: 'ATENÇÃO',
      severityInfo: 'INFO',
      close: 'Fechar',
      selectForCompare: 'Selecionar plano para comparar',
      planName: 'Plano',
      costLabel: 'custo',
    },
    warning: {
      bottleneck: (node: string, relation: string, pct: string, time: string) =>
        `"${node}"${relation ? ` em "${relation}"` : ''} concentra ${pct}% do tempo total de execução (${time}ms exclusivos).`,
      seqScan: (removed: string, relation: string, kept: string) =>
        `${removed} linhas foram descartadas pelo filtro em "${relation}" — só ${kept} eram necessárias.`,
      estimate: (planned: string, node: string, actual: string) =>
        `O planner estimou ${planned} linhas para "${node}", mas encontrou ${actual}. Estatísticas desatualizadas podem levar a planos ruins.`,
      diskSort: (node: string, space: string) =>
        `"${node}" precisou de ${space}kB em disco para ordenar — bem mais lento que ordenar em memória.`,
      hashBatches: (node: string, batches: number) =>
        `"${node}" usou ${batches} batches — a tabela hash não coube inteira em memória.`,
      loops: (node: string, loops: string) =>
        `"${node}" rodou ${loops} vezes (dentro de um Nested Loop). Um custo pequeno por execução pode somar bastante.`,
      diskRead: (node: string, read: number, hit: number) =>
        `"${node}" leu ${read} blocos do disco contra ${hit} vindos do cache.`,
      bottleneckTitle: 'Gargalo de execução',
      seqScanTitle: 'Seq Scan varrendo muitas linhas',
      estimateTitle: 'Estimativa de linhas desalinhada',
      diskSortTitle: 'Sort estourou para disco',
      hashBatchesTitle: 'Hash Join dividiu em batches',
      loopsTitle: 'Nó executado muitas vezes',
      diskReadTitle: 'Leitura de disco significativa',
      createIndex: (relation: string, columns: string) => `CREATE INDEX ON ${relation} (${columns});`,
      analyze: (relation: string) => `ANALYZE ${relation};`,
      increaseWorkMem: 'Considere aumentar work_mem para esta sessão/query.',
      increaseWorkMemShort: 'Considere aumentar work_mem.',
    },
  },
  es: {
    metadata: {
      title: 'PLAN/PULSE — Analizador de planes de consulta PostgreSQL',
      description:
        'Comprende los planes EXPLAIN de PostgreSQL con visualización interactiva, diagnóstico automático de cuellos de botella y comparación de ejecuciones. Gratis y privado en tu navegador.',
    },
    language: 'Idioma',
    languageName: 'Español',
    landing: {
      home: 'PLAN/PULSE — inicio',
      nav: 'Navegación principal',
      howLink: 'Cómo funciona',
      openAnalyzer: 'Abrir analizador',
      eyebrow: 'POSTGRESQL · QUERY PLAN ANALYZER',
      heroBefore: 'Descubre qué está ralentizando tu query ',
      heroHighlight: 'ahora.',
      lead: 'Convierte la salida de EXPLAIN en un plan visual, encuentra cuellos de botella y compara ejecuciones, sin instalar nada ni enviar tus datos.',
      analyze: 'Analizar un query plan',
      toolLink: 'Conoce la herramienta',
      privacyNote: 'Gratis · 100 % en el navegador · Hecho para PostgreSQL',
      preview: 'Vista previa de un árbol de ejecución PostgreSQL con un cuello de botella Seq Scan',
      visualAnalysis: 'ANÁLISIS VISUAL',
      bottleneckFound: 'cuello de botella detectado',
      executionTime: 'TIEMPO DE EJECUCIÓN',
      nodes: 'NODOS',
      warnings: 'AVISOS',
      proofLabel: 'UNA FORMA MÁS CLARA DE LEER',
      proof: ['Plan visual interactivo', 'Diagnóstico automático', 'Historial local de ejecuciones'],
      howEyebrow: 'DE EXPLAIN A LA RESPUESTA',
      howTitle: 'Optimiza con más contexto.',
      howDescription: 'Una vista visual del plan de ejecución te ayuda a pasar de la estimación a la causa.',
      steps: [
        { title: 'Copia EXPLAIN', description: 'Usa un plan de texto o FORMAT JSON, con o sin ANALYZE.' },
        { title: 'Encuentra el cuello de botella', description: 'Consulta el flujo de ejecución, los tiempos por nodo y los avisos importantes.' },
        { title: 'Compara resultados', description: 'Guarda ejecuciones en el navegador y compara el antes y el después de optimizar.' },
      ],
      privacyEyebrow: 'TUS DATOS SE QUEDAN CONTIGO',
      privacyTitle: 'Análisis local, sin sorpresas.',
      privacyDescription:
        'PLAN/PULSE funciona en tu navegador. Los planes y el historial se guardan en el almacenamiento local del dispositivo; no se envía nada a un servidor.',
      tryNow: 'Pruébalo ahora',
      footerDescription: 'Un analizador visual de query plans para PostgreSQL.',
    },
    app: {
      execution: 'ejec.',
      planning: 'planif.',
      nodes: 'nodos',
      warnings: 'avisos',
      bottleneck: 'cuello',
      history: 'Historial',
      pastePlan: 'Pegar plan',
      inputSummary: 'Pega aquí EXPLAIN (texto o JSON)',
      inputPlaceholder: 'Pega aquí el resultado de EXPLAIN ANALYZE...',
      analyze: 'Analizar plan',
      exampleText: 'Ejemplo (texto)',
      exampleJson: 'Ejemplo (JSON)',
      emptyState: 'Aún no se ha analizado ningún plan. Pega un EXPLAIN arriba y pulsa «Analizar plan».',
      inspector: 'Inspector',
      diagnosis: 'Diagnóstico',
      footer: 'PLAN/PULSE funciona íntegramente en tu navegador: no se envía ningún plan.',
      pasteBeforeAnalyze: 'Pega un plan antes de analizarlo.',
      invalidPlan: 'No se ha podido interpretar este plan. Comprueba que sea una salida EXPLAIN válida (texto o FORMAT JSON).',
      cannotLoadHistory: 'No se ha podido cargar el historial guardado. Comprueba que los planes EXPLAIN almacenados sean válidos.',
      cannotPreservePlan: 'No se ha podido conservar el plan actual al cambiar de idioma.',
      cannotDeleteHistory: '¿Eliminar este plan del historial?',
      cannotClearHistory: '¿Eliminar todo el historial guardado en este navegador?',
      zoomIn: 'Ampliar zoom',
      zoomOut: 'Reducir zoom',
      fitScreen: 'Ajustar a la pantalla',
      canvasHint: 'arrastra para moverte · desplázate para ampliar · pulsa una tarjeta para ver la ruta',
      rows: 'filas',
      indexScan: 'index scan',
      estimatedCost: 'coste estimado',
      estimatedActualRows: 'filas est. → reales',
      timePerLoop: 'tiempo (por ciclo)',
      loops: 'ciclos',
      selfTime: 'tiempo propio',
      noRelation: '(sin relación asociada)',
      inspectorHint: 'Pulsa una tarjeta del diagrama para ver los detalles del nodo.',
      nodeNotFound: 'No se ha encontrado el nodo.',
      filter: 'Filter',
      indexCondition: 'Index Cond',
      hashCondition: 'Hash Cond',
      sortKey: 'Sort Key',
      sortMethod: 'Sort Method',
      rowsRemoved: 'Rows Removed',
      buffers: 'Buffers',
      critical: 'CRÍTICO',
      warning: 'AVISO',
      info: 'INFO',
      copy: 'Copiar',
      copied: '¡Copiado!',
      noActual:
        'Este plan no contiene tiempos reales (ejecútalo con EXPLAIN ANALYZE) para habilitar los diagnósticos. Por ahora solo se muestran la estructura y los costes estimados.',
      noIssues: 'No se han encontrado problemas evidentes. El plan parece correcto.',
      historyTitle: 'Historial de planes',
      historyDescription: 'Se guarda automáticamente en este navegador. Selecciona hasta 2 para comparar.',
      clearAll: 'Borrar todo',
      noHistory:
        'Aún no hay planes guardados. Cada plan analizado se guarda aquí automáticamente (solo en este navegador).',
      compareSelected: 'Comparar seleccionados',
      compareTitle: 'Comparación de planes',
      executionTimeLabel: 'Tiempo de ejecución',
      planningTimeLabel: 'Tiempo de planificación',
      nodesInPlan: 'Nodos del plan',
      criticalIssues: 'Críticos',
      resolved: 'RESUELTOS',
      newWarnings: 'NUEVOS',
      sameWarnings: 'Los dos planes tienen los mismos avisos.',
      loadPlan: 'Cargar',
      delete: 'Eliminar',
      savedWarnings: 'avisos',
      noAnalyze: 'sin ANALYZE',
      warningCountSingular: 'aviso',
      warningCountPlural: 'avisos',
      clickForDetails: 'pulsa para ver los detalles',
      clickToHighlight: 'pulsa para ver los detalles y resaltar la ruta',
      relativeNow: 'ahora mismo',
      relativeYesterday: 'ayer',
      severityCritical: 'CRÍTICO',
      severityWarning: 'AVISO',
      severityInfo: 'INFO',
      close: 'Cerrar',
      selectForCompare: 'Seleccionar plan para comparar',
      planName: 'Plan',
      costLabel: 'coste',
    },
    warning: {
      bottleneck: (node: string, relation: string, pct: string, time: string) =>
        `"${node}"${relation ? ` en "${relation}"` : ''} concentra el ${pct} % del tiempo total de ejecución (${time} ms exclusivos).`,
      seqScan: (removed: string, relation: string, kept: string) =>
        `El filtro descartó ${removed} filas en "${relation}"; solo se necesitaban ${kept}.`,
      estimate: (planned: string, node: string, actual: string) =>
        `El planificador estimó ${planned} filas para "${node}", pero encontró ${actual}. Las estadísticas desactualizadas pueden generar planes deficientes.`,
      diskSort: (node: string, space: string) =>
        `"${node}" necesitó ${space} kB en disco para ordenar, mucho más lento que ordenar en memoria.`,
      hashBatches: (node: string, batches: number) =>
        `"${node}" utilizó ${batches} lotes: la tabla hash no cabía entera en memoria.`,
      loops: (node: string, loops: string) =>
        `"${node}" se ejecutó ${loops} veces (dentro de un Nested Loop). Un coste pequeño por ejecución puede acumularse.`,
      diskRead: (node: string, read: number, hit: number) =>
        `"${node}" leyó ${read} bloques del disco frente a ${hit} del caché.`,
      bottleneckTitle: 'Cuello de botella de ejecución',
      seqScanTitle: 'Seq Scan filtra muchas filas',
      estimateTitle: 'Estimación de filas desajustada',
      diskSortTitle: 'Sort desbordado al disco',
      hashBatchesTitle: 'Hash Join dividido en lotes',
      loopsTitle: 'Nodo ejecutado muchas veces',
      diskReadTitle: 'Lectura significativa del disco',
      createIndex: (relation: string, columns: string) => `CREATE INDEX ON ${relation} (${columns});`,
      analyze: (relation: string) => `ANALYZE ${relation};`,
      increaseWorkMem: 'Plantéate aumentar work_mem para esta sesión o consulta.',
      increaseWorkMemShort: 'Plantéate aumentar work_mem.',
    },
  },
} satisfies Record<
  Locale,
  {
    metadata: { title: string; description: string };
    language: string;
    languageName: string;
    landing: {
      home: string;
      nav: string;
      howLink: string;
      openAnalyzer: string;
      eyebrow: string;
      heroBefore: string;
      heroHighlight: string;
      lead: string;
      analyze: string;
      toolLink: string;
      privacyNote: string;
      preview: string;
      visualAnalysis: string;
      bottleneckFound: string;
      executionTime: string;
      nodes: string;
      warnings: string;
      proofLabel: string;
      proof: string[];
      howEyebrow: string;
      howTitle: string;
      howDescription: string;
      steps: { title: string; description: string }[];
      privacyEyebrow: string;
      privacyTitle: string;
      privacyDescription: string;
      tryNow: string;
      footerDescription: string;
    };
    app: Record<string, string>;
    warning: {
      bottleneck: (node: string, relation: string, pct: string, time: string) => string;
      seqScan: (removed: string, relation: string, kept: string) => string;
      estimate: (planned: string, node: string, actual: string) => string;
      diskSort: (node: string, space: string) => string;
      hashBatches: (node: string, batches: number) => string;
      loops: (node: string, loops: string) => string;
      diskRead: (node: string, read: number, hit: number) => string;
      bottleneckTitle: string;
      seqScanTitle: string;
      estimateTitle: string;
      diskSortTitle: string;
      hashBatchesTitle: string;
      loopsTitle: string;
      diskReadTitle: string;
      createIndex: (relation: string, columns: string) => string;
      analyze: (relation: string) => string;
      increaseWorkMem: string;
      increaseWorkMemShort: string;
    };
  }
>;

export type WarningCode =
  | 'bottleneck'
  | 'seq-scan'
  | 'row-estimate'
  | 'disk-sort'
  | 'hash-batches'
  | 'many-loops'
  | 'disk-read';

export function warningTitle(code: WarningCode, locale: Locale): string {
  const warning = messages[locale].warning;
  switch (code) {
    case 'bottleneck':
      return warning.bottleneckTitle;
    case 'seq-scan':
      return warning.seqScanTitle;
    case 'row-estimate':
      return warning.estimateTitle;
    case 'disk-sort':
      return warning.diskSortTitle;
    case 'hash-batches':
      return warning.hashBatchesTitle;
    case 'many-loops':
      return warning.loopsTitle;
    case 'disk-read':
      return warning.diskReadTitle;
  }
}
