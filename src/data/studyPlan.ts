export interface StudyPlanItem {
  tema: string;
  duracaoMin: number;
  estimado: boolean;
  modulo: string;
  comoFazer?: string;
}

export interface StudyPlanDay {
  date: string; // YYYY-MM-DD
  semana: string;
  itens: StudyPlanItem[];
}

/**
 * Cronograma "Tabela Hora a Hora" (plano v5, vigente) do vault Pós Psiquiatria,
 * importado em 07/08/2026. Cobre 29/07 a 26/08/2026. Peça para eu atualizar este
 * arquivo sempre que o cronograma do vault mudar de versão.
 */
export const STUDY_PLAN: StudyPlanDay[] = [
  {
    date: "2026-07-29",
    semana: "Semana 1 — Nivelamento: ética e legislação",
    itens: [{ tema: "Lei 10.216", duracaoMin: 6, estimado: false, modulo: "Nivelamento" }],
  },
  {
    date: "2026-07-30",
    semana: "Semana 1 — Nivelamento: ética e legislação",
    itens: [{ tema: "Modalidades de internação psiquiátrica", duracaoMin: 13, estimado: false, modulo: "Nivelamento" }],
  },
  {
    date: "2026-07-31",
    semana: "Semana 1 — Nivelamento: ética e legislação",
    itens: [
      { tema: "CEM — Fundamentos da Responsabilidade Clínica (arts. 1, 11, 20, 22, 31)", duracaoMin: 11, estimado: false, modulo: "Nivelamento" },
      { tema: "CEM — Prontuário e sigilo (arts. 36, 73, 87, 88, 89, 92)", duracaoMin: 12, estimado: false, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-01",
    semana: "Semana 1 — Nivelamento: ética e legislação (sábado, recuperação)",
    itens: [
      { tema: "Recuperação: Modalidades de internação + CEM Responsabilidade Clínica + CEM Prontuário e sigilo", duracaoMin: 36, estimado: false, modulo: "Nivelamento", comoFazer: "Sábado é recuperação, não conteúdo novo." },
    ],
  },
  {
    date: "2026-08-02",
    semana: "Semana 1 — encerramento",
    itens: [
      { tema: "Tipos de receituário", duracaoMin: 14, estimado: true, modulo: "Nivelamento" },
      { tema: "Revisão rápida dos 4 temas de Transtornos Depressivos já feitos", duracaoMin: 40, estimado: false, modulo: "Transtornos Depressivos" },
    ],
  },
  {
    date: "2026-08-03",
    semana: "Semana 2 — Nivelamento: psicofarmacologia por classe",
    itens: [
      { tema: "Princípios básicos da psicofarmacologia (revisão D+7)", duracaoMin: 14, estimado: false, modulo: "Nivelamento" },
      { tema: "Principais classes de psicofármacos (revisão — confirmar conclusão na Afya)", duracaoMin: 14, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-04",
    semana: "Semana 2 — Nivelamento: psicofarmacologia por classe",
    itens: [{ tema: "Antidepressivos (revisão — versão 'Direto ao ponto')", duracaoMin: 13, estimado: false, modulo: "Nivelamento" }],
  },
  {
    date: "2026-08-05",
    semana: "Semana 2 — Nivelamento: psicofarmacologia por classe",
    itens: [{ tema: "Antipsicóticos (novo)", duracaoMin: 10, estimado: true, modulo: "Nivelamento", comoFazer: "Balde NOVO/?/≠, Formato 1" }],
  },
  {
    date: "2026-08-06",
    semana: "Semana 2 — Nivelamento: psicofarmacologia por classe",
    itens: [
      { tema: "Benzodiazepínicos e drogas Z (novo)", duracaoMin: 10, estimado: true, modulo: "Nivelamento", comoFazer: "Balde NOVO/?/≠, Formato 1" },
      { tema: "Estabilizadores de humor (novo)", duracaoMin: 10, estimado: true, modulo: "Nivelamento", comoFazer: "Balde NOVO/?/≠, Formato 1" },
    ],
  },
  {
    date: "2026-08-07",
    semana: "Semana 2 — Nivelamento: psicofarmacologia por classe",
    itens: [{ tema: "Psicoestimulantes (novo)", duracaoMin: 10, estimado: true, modulo: "Nivelamento", comoFazer: "Balde NOVO/?/≠, Formato 1" }],
  },
  {
    date: "2026-08-08",
    semana: "Semana 2 — sábado agressivo (v5)",
    itens: [
      { tema: "Modalidades de internação psiquiátrica (recuperação, se ainda pendente)", duracaoMin: 13, estimado: false, modulo: "Nivelamento" },
      { tema: "CEM — Fundamentos da Responsabilidade Clínica (recuperação, se ainda pendente)", duracaoMin: 11, estimado: false, modulo: "Nivelamento" },
      { tema: "Transtorno mental e diagnóstico psiquiátrico", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
      {
        tema: "5 casos clínicos: 'A vida perdeu a cor' · 'Naqueles dias nem eu me aguento' · 'A casa ficou cheia de silêncio' · 'Falo como se tivesse razão' · 'É um vazio barulhento'",
        duracaoMin: 69,
        estimado: false,
        modulo: "Transtornos Depressivos",
        comoFazer: "Formato 2 em [[Casos — Ambulatório]] — pausar antes da conclusão, hipótese e conduta primeiro.",
      },
    ],
  },
  {
    date: "2026-08-09",
    semana: "Semana 2 — domingo agressivo (v5)",
    itens: [
      {
        tema: "Bloco Tratamento completo: objetivo do tratamento · antidepressivos são para todos? · como escolher o antidepressivo inicial? · depressão tem tempo certo? · troco ou potencializo? · quando não melhora no TDM?",
        duracaoMin: 53,
        estimado: false,
        modulo: "Transtornos Depressivos",
        comoFazer: "Formato 1 — o bloco mais cobrado do módulo, inteiro num dia só.",
      },
      { tema: "Recall ativo do bloco Tratamento", duracaoMin: 20, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Folha em branco, reconstruir o algoritmo de decisão de memória." },
      {
        tema: "2 casos clínicos: 'Não é vontade de morrer' · 'TV fora do ar'",
        duracaoMin: 33,
        estimado: false,
        modulo: "Transtornos Depressivos",
        comoFazer: "Formato 2",
      },
    ],
  },
  {
    date: "2026-08-10",
    semana: "Semana 3 — Nivelamento: exame psíquico completo",
    itens: [
      { tema: "Aparência e atitude", duracaoMin: 10, estimado: true, modulo: "Nivelamento", comoFazer: "Usar Fluxograma - Funções Psíquicas como mapa de referência." },
      { tema: "Consciência e orientação", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-11",
    semana: "Semana 3 — Nivelamento: exame psíquico completo",
    itens: [
      { tema: "Atenção e memória", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
      { tema: "Humor e afeto", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-12",
    semana: "Semana 3 — Nivelamento: exame psíquico completo",
    itens: [
      { tema: "Pensamento", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
      { tema: "Sensopercepção e psicomotricidade", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-13",
    semana: "Semana 3 — Nivelamento: exame psíquico completo",
    itens: [
      { tema: "Conação / volição / crítica", duracaoMin: 10, estimado: true, modulo: "Nivelamento" },
      { tema: "Objetivo e estrutura do exame psíquico (índice das 7 funções)", duracaoMin: 5, estimado: false, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-14",
    semana: "Semana 3 — Nivelamento: exame psíquico completo",
    itens: [{ tema: "Formulação de caso", duracaoMin: 10, estimado: true, modulo: "Nivelamento" }],
  },
  {
    date: "2026-08-15",
    semana: "Semana 3 — sábado agressivo (v5)",
    itens: [
      {
        tema: "Blocos Luto e Clínica ampliada: 'A perda nos define?' · 'A dor que transforma' · 'A morte como parte da vida' · 'O impacto e os riscos no corpo' · 'O que o paciente espera do médico' · 'Estigma e autoestigma' · 'Existe prevenção?'",
        duracaoMin: 58,
        estimado: false,
        modulo: "Transtornos Depressivos",
        comoFazer: "Formato 1 — fecha os 2 blocos temáticos que restam da Aula 02.",
      },
      { tema: "Último caso clínico: 'Voltar ao normal eu não voltei... mas me conformei'", duracaoMin: 18, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Formato 2 — fecha os 9 casos da Aula 01 inteira." },
      { tema: "Recall ativo dos blocos Luto + Clínica ampliada", duracaoMin: 20, estimado: false, modulo: "Transtornos Depressivos" },
    ],
  },
  {
    date: "2026-08-16",
    semana: "Semana 3 — domingo agressivo (v5)",
    itens: [
      { tema: "Caso de risco de suicídio (ideação passiva)", duracaoMin: 40, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Formato 2 — pausar antes da conclusão, escrever hipótese e conduta primeiro. O mais importante do módulo." },
      { tema: "Montar/revisar tabela de antidepressivos", duracaoMin: 40, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Formato 6 — com isso, Aula 01 e Aula 02 fecham 100% antes da virada de 20/08." },
    ],
  },
  {
    date: "2026-08-17",
    semana: "Semana 4 — Nivelamento: prática clínica",
    itens: [
      { tema: "Como conduzir emergência / enfermaria / CAPS / consultório", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
      { tema: "Plantão, ambulatório, consultório, CAPS (cenários de prática)", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-18",
    semana: "Semana 4 — Nivelamento: prática clínica",
    itens: [
      { tema: "Como começar a entrevista psiquiátrica", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
      { tema: "Como estruturar avaliação/prontuário", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
      { tema: "Pacientes difíceis / discutir caso com colega / preparar caso com preceptor", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-19",
    semana: "Semana 4 — Nivelamento: prática clínica",
    itens: [
      { tema: "Como perguntar sobre ideação suicida", duracaoMin: 9, estimado: false, modulo: "Nivelamento", comoFazer: "Alta prioridade — risco de suicídio não espera." },
      { tema: "Vínculo terapêutico / carga emocional / trabalho em equipe / família do paciente", duracaoMin: 8, estimado: true, modulo: "Nivelamento" },
    ],
  },
  {
    date: "2026-08-20",
    semana: "Semana 4 — virada para Transtornos Depressivos",
    itens: [{ tema: "Montar lista de 10 dúvidas para o presencial", duracaoMin: 40, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Virada: 100% Transtornos Depressivos a partir de hoje." }],
  },
  {
    date: "2026-08-21",
    semana: "Semana 4 — presencial",
    itens: [{ tema: "PRESENCIAL — Av. do Contorno 2073, Floresta", duracaoMin: 780, estimado: false, modulo: "Presencial", comoFazer: "Levar a lista de 10 dúvidas." }],
  },
  {
    date: "2026-08-22",
    semana: "Semana 4 — presencial",
    itens: [{ tema: "PRESENCIAL (2º dia)", duracaoMin: 540, estimado: false, modulo: "Presencial", comoFazer: "Sem estudo extra." }],
  },
  {
    date: "2026-08-23",
    semana: "Semana 4 — consolidação",
    itens: [{ tema: "Consolidação leve: transcrever anotações do presencial", duracaoMin: 0, estimado: true, modulo: "Transtornos Depressivos", comoFazer: "Sem sprint fixo — passar a limpo o que foi anotado à mão." }],
  },
  {
    date: "2026-08-24",
    semana: "Semana 5 — só Transtornos Depressivos",
    itens: [{ tema: "Mapa mental do módulo inteiro", duracaoMin: 40, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Formato 6, folha em branco." }],
  },
  {
    date: "2026-08-25",
    semana: "Semana 5 — só Transtornos Depressivos",
    itens: [{ tema: "Escrever as 5 perguntas da webconferência", duracaoMin: 30, estimado: false, modulo: "Transtornos Depressivos" }],
  },
  {
    date: "2026-08-26",
    semana: "Semana 5 — webconferência",
    itens: [{ tema: "Revisão final leve", duracaoMin: 30, estimado: false, modulo: "Transtornos Depressivos" }, { tema: "WEBCONFERÊNCIA — fim do plano", duracaoMin: 180, estimado: false, modulo: "Transtornos Depressivos", comoFazer: "Levar as 5 perguntas." }],
  },
];

export function getStudyPlanForDate(date: string): StudyPlanDay | undefined {
  return STUDY_PLAN.find((d) => d.date === date);
}
