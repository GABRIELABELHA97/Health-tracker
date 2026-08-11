import type { AppleWatchData, DayData, NutrientKey, NutrientTotals, TaskItem } from "../types";
import { NUTRIENT_META, NUTRIENT_ORDER, computeCalorieMacroGoals, getWeeklyGoals } from "../data/nutrientGoals";
import { NUTRIENT_INFO } from "../data/nutrientInfo";
import { SUPPLEMENT_NUTRIENTS_PER_UNIT } from "../data/supplements";
import { getStudyPlanForDate } from "../data/studyPlan";
import type { AppConfig } from "./storage";
import { getDayData, listAllDayKeys, sumNutrients } from "./storage";
import { addDays, datesInRange, startOfMonth, startOfWeek } from "./dates";
import { judgeNutrient, judgmentRank, rankToJudgment, type Judgment } from "./judgment";

export function computeDayNutrientTotals(day: DayData): Partial<NutrientTotals> {
  const foodTotals = sumNutrients(day.foodLog.map((f) => f.nutrientes));
  const supplementTotals = sumNutrients(
    Object.entries(day.suplementosQuantidade).map(([id, qtd]) => {
      const perUnit = (SUPPLEMENT_NUTRIENTS_PER_UNIT[id] ?? {}) as Partial<NutrientTotals>;
      const scaled: Partial<NutrientTotals> = {};
      for (const key of Object.keys(perUnit) as (keyof NutrientTotals)[]) {
        scaled[key] = (perUnit[key] ?? 0) * (qtd ?? 0);
      }
      return scaled;
    }),
  );
  return sumNutrients([foodTotals, supplementTotals, day.nutrientesManuais]);
}

export function computeRangeTotals(dates: string[]): Partial<NutrientTotals> {
  const existing = new Set(listAllDayKeys());
  const totals = dates.filter((d) => existing.has(d)).map((d) => computeDayNutrientTotals(getDayData(d)));
  return sumNutrients(totals);
}

export function getWeekRange(date: string): string[] {
  const start = startOfWeek(date);
  return datesInRange(start, addDays(start, 6));
}

export function getMonthRange(date: string): string[] {
  const start = startOfMonth(date);
  const next = addDays(start, 32);
  const end = addDays(`${next.slice(0, 7)}-01`, -1);
  return datesInRange(start, end);
}

export interface NutrientRow {
  key: NutrientKey;
  label: string;
  unit: string;
  consumidoDia: number;
  metaDia: number;
  julgamentoDia: Judgment;
  consumidoSemana: number;
  metaSemana: number;
  julgamentoSemana: Judgment;
  revisaoTotal: Judgment;
}

export function buildNutrientRows(date: string, config: AppConfig): NutrientRow[] {
  const dayTotals = computeDayNutrientTotals(getDayData(date));
  const weekTotals = computeRangeTotals(getWeekRange(date));
  const monthTotals = computeRangeTotals(getMonthRange(date));
  const weeklyGoals = getWeeklyGoals(config);

  return NUTRIENT_ORDER.map((key) => {
    const meta = NUTRIENT_META[key];
    const metaSemana = weeklyGoals[key];
    const metaDia = metaSemana / 7;
    const consumidoDia = dayTotals[key] ?? 0;
    const consumidoSemana = weekTotals[key] ?? 0;
    const consumidoMes = monthTotals[key] ?? 0;
    const metaMes = metaDia * getMonthRange(date).length;

    const julgamentoDia = judgeNutrient(consumidoDia, metaDia, meta.direction).label;
    const julgamentoSemana = judgeNutrient(consumidoSemana, metaSemana, meta.direction).label;
    const julgamentoMes = judgeNutrient(consumidoMes, metaMes, meta.direction).label;

    const revisaoTotal = rankToJudgment(
      (judgmentRank(julgamentoDia) + judgmentRank(julgamentoSemana) + judgmentRank(julgamentoMes)) / 3,
    );

    return {
      key,
      label: meta.label,
      unit: meta.unit,
      consumidoDia,
      metaDia,
      julgamentoDia,
      consumidoSemana,
      metaSemana,
      julgamentoSemana,
      revisaoTotal,
    };
  });
}

interface PeriodBlock {
  periodo: "dia" | "semana" | "mês";
  faltaram: NutrientRow[];
  ideais: NutrientRow[];
  sobraram: NutrientRow[];
}

function classifyPeriod(rows: NutrientRow[], periodo: "dia" | "semana" | "mês"): PeriodBlock {
  const faltaram: NutrientRow[] = [];
  const ideais: NutrientRow[] = [];
  const sobraram: NutrientRow[] = [];
  for (const row of rows) {
    const meta = NUTRIENT_META[row.key];
    const consumido = periodo === "dia" ? row.consumidoDia : row.consumidoSemana;
    const metaAlvo = periodo === "dia" ? row.metaDia : row.metaSemana;
    const ratio = metaAlvo > 0 ? consumido / metaAlvo : 1;
    if (meta.direction === "min") {
      if (ratio < 1.0) faltaram.push(row);
      else if (ratio <= 1.5) ideais.push(row);
      else sobraram.push(row);
    } else if (meta.direction === "target") {
      const diff = ratio - 1;
      if (diff < -0.15) faltaram.push(row);
      else if (diff > 0.15) sobraram.push(row);
      else ideais.push(row);
    } else {
      if (ratio <= 1.0) ideais.push(row);
      else sobraram.push(row);
    }
  }
  return { periodo, faltaram, ideais, sobraram };
}

export interface NutrientAnalysisReport {
  dia: PeriodBlock;
  semana: PeriodBlock;
  mes: PeriodBlock;
  consequencias: string[];
  comoObter: string[];
  analiseFranca: string;
}

export function generateNutrientAnalysis(date: string, config: AppConfig): NutrientAnalysisReport {
  const rows = buildNutrientRows(date, config);
  const dia = classifyPeriod(rows, "dia");
  const semana = classifyPeriod(rows, "semana");
  const mes = classifyPeriod(rows, "mês");

  const deficientKeys = Array.from(new Set([...dia.faltaram, ...semana.faltaram].map((r) => r.key)));
  const excessKeys = Array.from(new Set([...dia.sobraram, ...semana.sobraram].map((r) => r.key)));

  const consequencias: string[] = [];
  for (const key of deficientKeys) {
    const info = NUTRIENT_INFO[key];
    if (info.consequenciaFalta) consequencias.push(`${NUTRIENT_META[key].label}: ${info.consequenciaFalta}`);
  }
  for (const key of excessKeys) {
    const info = NUTRIENT_INFO[key];
    if (info.consequenciaExcesso) consequencias.push(`${NUTRIENT_META[key].label}: ${info.consequenciaExcesso}`);
  }

  const comoObter = deficientKeys
    .filter((k) => NUTRIENT_INFO[k].fontes.length > 0)
    .map((k) => `${NUTRIENT_META[k].label}: ${NUTRIENT_INFO[k].fontes.join(", ")}`);

  const scoreDia = rows.reduce((acc, r) => acc + judgmentRank(r.julgamentoDia), 0) / (rows.length * 5);
  const scoreSemana = rows.reduce((acc, r) => acc + judgmentRank(r.julgamentoSemana), 0) / (rows.length * 5);

  let analiseFranca: string;
  if (scoreSemana >= 0.8) {
    analiseFranca = `Padrão nutricional da semana está sólido (${Math.round(scoreSemana * 100)}% de aderência às metas). ${deficientKeys.length > 0 ? `Ainda assim, ${deficientKeys.map((k) => NUTRIENT_META[k].label).join(", ")} seguem abaixo do ideal — não é hora de relaxar, é hora de fechar os últimos furos.` : "Sem lacunas relevantes no momento — manter o padrão é o desafio agora, não melhorá-lo."}`;
  } else if (scoreSemana >= 0.55) {
    analiseFranca = `Padrão mediano (${Math.round(scoreSemana * 100)}% de aderência). ${deficientKeys.length} nutriente(s) abaixo do alvo na semana: ${deficientKeys.map((k) => NUTRIENT_META[k].label).join(", ") || "nenhum"}. Isso não é uma catástrofe, mas também não é o que seus objetivos (perda de peso mantendo massa magra, cognição, cabelo) pedem — dá para corrigir com ajustes pontuais, não com um replanejamento inteiro.`;
  } else {
    analiseFranca = `Padrão nutricional fraco (${Math.round(scoreSemana * 100)}% de aderência às metas na semana). ${deficientKeys.length} nutrientes abaixo do alvo: ${deficientKeys.map((k) => NUTRIENT_META[k].label).join(", ") || "nenhum"}. Nesse ritmo os objetivos de cognição, cabelo e manutenção de massa magra ficam comprometidos — vale revisar o dia inteiro de alimentação, não só um item isolado.`;
  }
  void scoreDia;

  return { dia, semana, mes, consequencias, comoObter, analiseFranca };
}

// ---------------------------------------------------------------------------
// Balanço calórico
// ---------------------------------------------------------------------------

export interface CalorieBalance {
  consumido: number;
  gastoEstimado: number;
  balanco: number; // negativo = déficit, positivo = superávit
  fonteGasto: "apple_watch" | "perfil";
}

export function computeCalorieBalance(date: string, config: AppConfig): CalorieBalance {
  const day = getDayData(date);
  const consumido = computeDayNutrientTotals(day).calorias ?? 0;
  const { energiaRepouso, caloriasMovimento } = day.appleWatch;

  let gastoEstimado: number;
  let fonteGasto: CalorieBalance["fonteGasto"];
  if (energiaRepouso != null && caloriasMovimento != null) {
    gastoEstimado = energiaRepouso + caloriasMovimento;
    fonteGasto = "apple_watch";
  } else {
    const macros = computeCalorieMacroGoals(config.profile, getWeeklyGoals(config).proteina);
    gastoEstimado = macros.tdeeDiario;
    fonteGasto = "perfil";
  }

  return { consumido, gastoEstimado, balanco: consumido - gastoEstimado, fonteGasto };
}

// ---------------------------------------------------------------------------
// Apple Watch
// ---------------------------------------------------------------------------

const APPLE_WATCH_LABELS: Record<keyof AppleWatchData, string> = {
  sonoHoras: "Sono",
  qualidadeSono: "Qualidade do sono",
  caloriasMovimento: "Calorias de movimento",
  energiaRepouso: "Energia em repouso",
  exercicioMin: "Exercício",
  tempoEmPeHoras: "Tempo em pé",
  passos: "Passos",
  distanciaKm: "Distância",
  vo2max: "VO2 máx.",
  aguaL: "Água",
};

export function judgeAppleWatchField(key: keyof AppleWatchData, value: number | undefined): Judgment | null {
  if (value == null) return null;
  switch (key) {
    case "sonoHoras":
      if (value < 5.5) return "muito ruim";
      if (value < 6.5) return "ruim";
      if (value < 7) return "padrão";
      if (value < 7.5) return "pode melhorar";
      if (value <= 9) return "bom";
      return "muito bom";
    case "exercicioMin":
      if (value === 0) return "muito ruim";
      if (value < 15) return "ruim";
      if (value < 30) return "padrão";
      if (value < 45) return "pode melhorar";
      if (value <= 90) return "bom";
      return "muito bom";
    case "passos":
      if (value < 3000) return "muito ruim";
      if (value < 5000) return "ruim";
      if (value < 7000) return "padrão";
      if (value < 8000) return "pode melhorar";
      if (value <= 14000) return "bom";
      return "muito bom";
    case "aguaL":
      if (value < 1) return "muito ruim";
      if (value < 1.5) return "ruim";
      if (value < 2) return "padrão";
      if (value < 2.5) return "pode melhorar";
      if (value <= 4) return "bom";
      return "muito bom";
    case "tempoEmPeHoras":
      if (value < 4) return "muito ruim";
      if (value < 6) return "ruim";
      if (value < 8) return "padrão";
      if (value < 10) return "pode melhorar";
      return "bom";
    case "qualidadeSono":
      if (value < 40) return "muito ruim";
      if (value < 60) return "ruim";
      if (value < 75) return "padrão";
      if (value < 85) return "pode melhorar";
      return "bom";
    default:
      return null; // caloriasMovimento, energiaRepouso, distanciaKm, vo2max: informativos, sem meta fixa
  }
}

export function appleWatchLabel(key: keyof AppleWatchData): string {
  return APPLE_WATCH_LABELS[key];
}

export function appleWatchFieldsWithGoal(): (keyof AppleWatchData)[] {
  return ["sonoHoras", "qualidadeSono", "exercicioMin", "tempoEmPeHoras", "passos", "aguaL"];
}

// ---------------------------------------------------------------------------
// Tarefas — julgamento crítico, construtivo, qualitativo
// ---------------------------------------------------------------------------

export interface TaskJudgmentReport {
  julgamento: Judgment;
  texto: string;
}

export function judgeTasks(tasks: TaskItem[], objetivos: string[]): TaskJudgmentReport {
  if (tasks.length === 0) {
    return {
      julgamento: "muito ruim",
      texto:
        "Nenhuma tarefa registrada hoje. Sem registro não há como avaliar performance — e a ausência de registro, por si só, já é um sinal: normalmente indica que o dia não teve prioridades claras. Alta performance começa por definir e registrar o que importa, mesmo em dias mais fracos.",
    };
  }

  const textoCompleto = tasks.map((t) => `${t.oQueFoiFeito} ${t.como ?? ""}`).join(" ").toLowerCase();
  const objetivosAtendidos = objetivos.filter((obj) =>
    (OBJECTIVE_KEYWORDS[obj] ?? []).some((kw) => textoCompleto.includes(kw)),
  );
  const objetivosIgnorados = objetivos.filter((o) => !objetivosAtendidos.includes(o));

  const substantivas = tasks.filter((t) => t.oQueFoiFeito.trim().length >= 8 || (t.como ?? "").trim().length >= 8);
  const proporcaoSubstantiva = substantivas.length / tasks.length;

  let rank = 2; // padrão
  rank += Math.min(2, tasks.length >= 3 ? 1 : 0);
  rank += proporcaoSubstantiva >= 0.7 ? 1 : proporcaoSubstantiva < 0.3 ? -1 : 0;
  rank += objetivosAtendidos.length >= Math.ceil(objetivos.length / 2) ? 1 : objetivosAtendidos.length === 0 ? -1 : 0;
  rank = Math.max(0, Math.min(5, rank));
  const julgamento = rankToJudgment(rank);

  const partes: string[] = [];
  partes.push(
    `${tasks.length} tarefa(s) registrada(s) hoje, ${substantivas.length} com detalhe suficiente para avaliar de fato ("como" descrito).`,
  );
  if (objetivosAtendidos.length > 0) {
    partes.push(`Conectadas aos objetivos: ${objetivosAtendidos.join(", ")}.`);
  }
  if (objetivosIgnorados.length > 0) {
    partes.push(
      `Sem nenhuma ação hoje ligada a: ${objetivosIgnorados.join(", ")} — se isso se repetir vários dias seguidos, esses objetivos vão estagnar por falta de ação, não por falta de intenção.`,
    );
  }
  if (proporcaoSubstantiva < 0.5) {
    partes.push(
      "Boa parte dos registros está rasa (só o título, sem 'como'). Performance alta exige registrar não só o que foi feito, mas como — é isso que permite corrigir o processo, não só contar o resultado.",
    );
  }
  if (julgamento === "muito bom" || julgamento === "bom") {
    partes.push("Dia acima da régua: volume de tarefas bom, detalhe presente, objetivos cobertos. O padrão a manter, não a exceção.");
  } else if (julgamento === "muito ruim" || julgamento === "ruim") {
    partes.push("Dia abaixo do que alta performance exige. Não é sobre culpa — é sobre reconhecer o padrão e ajustar amanhã, com metas menores e mais específicas se necessário.");
  }

  return { julgamento, texto: partes.join(" ") };
}

export interface TaskAnalysisDetail {
  tarefasRegistradas: number;
  tarefasComDetalhe: number;
  proporcaoDetalhe: number;
  objetivo: {
    nome: string;
    atendido: boolean;
    tarefasRelacionadas: string[];
  }[];
  tarefasIndividuais: {
    tarefa: string;
    como: string;
    qualidade: "excelente" | "boa" | "adequada" | "fraca" | "muito_fraca";
    observacoes: string[];
  }[];
  padroes: string[];
  recomendacoes: string[];
  analiseConstrutiva: string;
}

const OBJECTIVE_KEYWORDS: Record<string, string[]> = {
  "Cognição (estudos, pesquisa, aprender)": ["estud", "pesquis", "aprend", "lei", "aproveitar", "ler", "plano", "planejamento"],
  "Saúde mental (terapia, meditação, mindfulness)": ["terap", "medita", "mindfull", "psicolog", "saud", "ment", "ansied", "ansid"],
  "Composição corporal (exercícios, nutrição)": [
    "exerc",
    "muscula",
    "treino",
    "malh",
    "corrida",
    "cardio",
    "nutri",
    "dieta",
    "prote",
    "calorica",
  ],
  "Criatividade (art, design, música)": ["art", "design", "musica", "criat", "desenh", "pintura", "escrever", "escreve"],
  "Conexão interpessoal (relacionamentos, amigos, família)": ["amigo", "familia", "relacion", "convers", "ligou", "saiu", "encontr"],
  Diversão: ["diversão", "divers", "fun", "jogo", "jogou", "entretenim", "lazer", "cinem", "filmes"],
};

export function analyzeTasksInDepth(tasks: TaskItem[], objetivos: string[]): TaskAnalysisDetail {
  const tarefasComDetalhe = tasks.filter((t) => (t.como ?? "").trim().length >= 5).length;
  const proporcaoDetalhe = tasks.length > 0 ? tarefasComDetalhe / tasks.length : 0;

  const textoCompleto = tasks.map((t) => `${t.oQueFoiFeito} ${t.como ?? ""}`).join(" ").toLowerCase();

  const objetivosAnalise = objetivos.map((obj) => ({
    nome: obj,
    atendido: (OBJECTIVE_KEYWORDS[obj] ?? []).some((kw) => textoCompleto.includes(kw)),
    tarefasRelacionadas: tasks
      .filter((t) => (OBJECTIVE_KEYWORDS[obj] ?? []).some((kw) => `${t.oQueFoiFeito} ${t.como ?? ""}`.toLowerCase().includes(kw)))
      .map((t) => t.oQueFoiFeito),
  }));

  const tarefasIndividuais = tasks.map((t) => {
    const comLength = (t.como ?? "").trim().length;
    const taskLength = t.oQueFoiFeito.trim().length;
    let qualidade: "excelente" | "boa" | "adequada" | "fraca" | "muito_fraca";
    const observacoes: string[] = [];

    if (comLength >= 20 && taskLength >= 15) {
      qualidade = "excelente";
      observacoes.push("Excelente detalhe — processo claramente descrito");
    } else if (comLength >= 10 && taskLength >= 10) {
      qualidade = "boa";
      observacoes.push("Bom nível de detalhe para análise");
    } else if (comLength >= 5 || taskLength >= 15) {
      qualidade = "adequada";
      observacoes.push("Detalhe mínimo capturando o essencial");
    } else if (comLength >= 2 || taskLength >= 8) {
      qualidade = "fraca";
      observacoes.push("Falta contexto — como/por quê não descrito");
    } else {
      qualidade = "muito_fraca";
      observacoes.push("Muito genérico — impossível extrair aprendizado");
    }

    return {
      tarefa: t.oQueFoiFeito,
      como: t.como ?? "(não descrito)",
      qualidade,
      observacoes,
    };
  });

  const padroes: string[] = [];
  if (tarefasIndividuais.filter((t) => t.qualidade === "excelente").length >= tasks.length * 0.6) {
    padroes.push("✓ Padrão de registro de alta qualidade — registros detalhados e acionáveis");
  } else if (tarefasIndividuais.filter((t) => t.qualidade === "fraca" || t.qualidade === "muito_fraca").length >= tasks.length * 0.5) {
    padroes.push("⚠ Padrão de registro superficial — faltam detalhes sobre processo e contexto");
  }

  const atendidosCount = objetivosAnalise.filter((o) => o.atendido).length;
  if (atendidosCount === objetivos.length) {
    padroes.push("✓ Todos os objetivos foram tocados hoje");
  } else if (atendidosCount === 0) {
    padroes.push("⚠ Nenhum objetivo foi tocado — dia reativo, sem foco estratégico");
  } else if (atendidosCount >= objetivos.length / 2) {
    padroes.push(`✓ ${atendidosCount} de ${objetivos.length} objetivos foram cobertos`);
  }

  if (tasks.length >= 5) {
    padroes.push("✓ Volume saudável de tarefas registradas");
  } else if (tasks.length <= 2) {
    padroes.push("⚠ Muito poucas tarefas registradas — pode indicar dia reativo");
  }

  const recomendacoes: string[] = [];
  if (proporcaoDetalhe < 0.5) {
    recomendacoes.push("Registre o 'como' para cada tarefa — isso permite análise de processo, não só resultado. Exemplo: 'Estudi Neuroanatomia' → 'Estudi Neuroanatomia usando flashcards de Anki, 45 min'");
  }
  if (atendidosCount < objetivos.length) {
    const ignorados = objetivosAnalise.filter((o) => !o.atendido).map((o) => o.nome);
    recomendacoes.push(`${ignorados.join(", ")} não foram tocados hoje — amanhã, dedique tempo explícito a ${ignorados.length === 1 ? "esse objetivo" : "esses objetivos"}`);
  }
  if (tasks.length < 3) {
    recomendacoes.push("Tente registrar pelo menos 3 tarefas por dia — mesmo pequenas — para ter visibilidade do padrão");
  }
  if (tarefasComDetalhe === 0 && tasks.length > 0) {
    recomendacoes.push("Importante: comece a registrar o 'como' em cada tarefa. Sem isso, é impossível diagnosticar bloqueios de processo");
  }

  const analiseConstrutiva = `
    Seu dia foi marcado por ${tasks.length} tarefa(s) registrada(s). Delas, ${tarefasComDetalhe} têm detalhe suficiente para análise (${(proporcaoDetalhe * 100).toFixed(0)}%).

    ${atendidosCount === objetivos.length ? `Você tocou todos os ${objetivos.length} objetivos — excelente distribuição de foco.` : atendidosCount === 0 ? "Nenhum objetivo foi tocado — o dia foi totalmente reativo. Isso é normal ocasionalmente, mas se virar padrão, é sinal de falta de planejamento." : `Você cobriu ${atendidosCount} de ${objetivos.length} objetivos — boa cobertura.`}

    ${proporcaoDetalhe >= 0.7 ? "Seus registros têm excelente qualidade — descrevem não só o quê, mas como. Isso permite aprendizado real." : proporcaoDetalhe >= 0.5 ? "Bom equilíbrio entre quantidade e qualidade nos registros." : "Seus registros são principalmente títulos — faltam 'como' e contexto. Isso limita a análise a contar tarefas, sem aprender do processo."}

    A métrica que importa não é só volume de tarefas, mas qualidade do registro. Um dia com 3 tarefas bem detalhadas é mais valioso que 10 títulos genéricos.
  `.trim();

  return {
    tarefasRegistradas: tasks.length,
    tarefasComDetalhe,
    proporcaoDetalhe,
    objetivo: objetivosAnalise,
    tarefasIndividuais,
    padroes,
    recomendacoes,
    analiseConstrutiva,
  };
}

// ---------------------------------------------------------------------------
// Estudos — comparação com o cronograma da pós em psiquiatria
// ---------------------------------------------------------------------------

export interface StudyJudgmentReport {
  planoDoDia: string[];
  julgamento: Judgment | null;
  texto: string;
}

export function judgeStudyDay(date: string, day: DayData): StudyJudgmentReport {
  const plano = getStudyPlanForDate(date);
  const planoDoDia = plano?.itens.map((i) => `${i.tema} (${i.duracaoMin}min${i.estimado ? ", estimado" : ""})`) ?? [];

  if (!plano) {
    return {
      planoDoDia: [],
      julgamento: day.studyLog.length > 0 ? "bom" : null,
      texto:
        day.studyLog.length > 0
          ? "Sem item de cronograma fixo para esta data no vault, mas houve estudo registrado — conta como fila oportunista."
          : "Sem item de cronograma fixo para esta data no vault e sem estudo registrado.",
    };
  }

  if (day.studyLog.length === 0) {
    return {
      planoDoDia,
      julgamento: "muito ruim",
      texto: `Previsto para hoje: ${planoDoDia.join("; ")}. Nada foi registrado como estudado. Pelo cronograma (regra do piso mínimo), mesmo um item curto de ~10min contaria como dia cumprido — zero é o único resultado que realmente quebra a sequência.`,
    };
  }

  const minutosEstudados = day.studyLog.length;
  const minutosPrevistos = plano.itens.reduce((acc, i) => acc + i.duracaoMin, 0);
  const cobertura = minutosPrevistos > 0 ? Math.min(1, minutosEstudados / plano.itens.length) : 1;
  const julgamento = cobertura >= 0.9 ? "muito bom" : cobertura >= 0.6 ? "bom" : cobertura >= 0.3 ? "pode melhorar" : "ruim";

  return {
    planoDoDia,
    julgamento,
    texto: `Previsto: ${planoDoDia.join("; ")} (~${minutosPrevistos}min ao todo). Registrados ${day.studyLog.length} item(ns) de estudo hoje.`,
  };
}

// ---------------------------------------------------------------------------
// Resumo — análise qualitativa completa do dia
// ---------------------------------------------------------------------------

export function generateDayResumo(date: string, config: AppConfig): string {
  const day = getDayData(date);
  const nutrientRows = buildNutrientRows(date, config);
  const calorieBalance = computeCalorieBalance(date, config);
  const taskReport = judgeTasks(day.tasks, config.objetivos);
  const studyReport = judgeStudyDay(date, day);

  const nutrientesRuins = nutrientRows.filter((r) => judgmentRank(r.julgamentoDia) <= 1);
  const nutrientesBons = nutrientRows.filter((r) => judgmentRank(r.julgamentoDia) >= 4);

  const secoes: string[] = [];

  secoes.push(
    `TAREFAS — ${taskReport.julgamento.toUpperCase()}. ${taskReport.texto}`,
  );

  secoes.push(
    `ALIMENTAÇÃO E NUTRIENTES — Balanço calórico do dia: ${calorieBalance.consumido.toFixed(0)}kcal consumidas vs. ${calorieBalance.gastoEstimado.toFixed(0)}kcal de gasto estimado (${calorieBalance.fonteGasto === "apple_watch" ? "baseado no Apple Watch" : "estimado pelo perfil"}), ${calorieBalance.balanco <= 0 ? `déficit de ${Math.abs(calorieBalance.balanco).toFixed(0)}kcal` : `superávit de ${calorieBalance.balanco.toFixed(0)}kcal`}. ${
      nutrientesRuins.length > 0
        ? `Pontos fracos do dia: ${nutrientesRuins.map((r) => r.label).join(", ")}.`
        : "Sem nutrientes em situação ruim hoje."
    } ${nutrientesBons.length > 0 ? `Pontos fortes: ${nutrientesBons.map((r) => r.label).join(", ")}.` : ""}`,
  );

  secoes.push(
    `ESTUDOS — ${studyReport.julgamento ? studyReport.julgamento.toUpperCase() + ". " : ""}${studyReport.texto}`,
  );

  const aw = day.appleWatch;
  const awEntries = (Object.keys(aw) as (keyof AppleWatchData)[]).filter((k) => aw[k] != null);
  if (awEntries.length > 0) {
    secoes.push(
      `APPLE WATCH — ${awEntries
        .map((k) => {
          const j = judgeAppleWatchField(k, aw[k]);
          return `${appleWatchLabel(k)}: ${aw[k]}${j ? ` (${j})` : ""}`;
        })
        .join(" · ")}`,
    );
  } else {
    secoes.push("APPLE WATCH — nenhum dado preenchido hoje.");
  }

  if (day.desmame.rivotrilGotas != null || day.desmame.cbdGotas != null || day.desmame.melatoninaGotas != null) {
    secoes.push(
      `DESMAME — Rivotril ${day.desmame.rivotrilGotas ?? "—"} gotas · CBD ${day.desmame.cbdGotas ?? "—"} gotas · Melatonina ${day.desmame.melatoninaGotas ?? "—"} gotas.${day.desmame.comoMeSenti ? ` Relato: "${day.desmame.comoMeSenti}"` : ""}`,
    );
  }

  return secoes.join("\n\n");
}

// ---------------------------------------------------------------------------
// Resumo semanal — placar 0-100
// ---------------------------------------------------------------------------

export interface WeekScorecard {
  weekStart: string;
  weekEnd: string;
  nutrientScore: number;
  calorieScore: number;
  appleWatchScore: number;
  score: number;
  calorieBalanceTotal: number;
  appleWatchJudgments: { campo: string; media: number; julgamento: Judgment | null }[];
}

export function computeWeekScorecard(date: string, config: AppConfig): WeekScorecard {
  const dates = getWeekRange(date);
  const existing = new Set(listAllDayKeys());
  const daysWithData = dates.filter((d) => existing.has(d));

  const rows = buildNutrientRows(date, config);
  const nutrientScore = rows.reduce((acc, r) => acc + judgmentRank(r.julgamentoSemana), 0) / (rows.length * 5) * 100;

  let calorieBalanceTotal = 0;
  let calorieScoreAcc = 0;
  for (const d of daysWithData) {
    const cb = computeCalorieBalance(d, config);
    calorieBalanceTotal += cb.balanco;
    const ratio = cb.gastoEstimado > 0 ? cb.consumido / cb.gastoEstimado : 1;
    // alvo: leve déficit (0.75-0.95 do gasto). Fora disso, penaliza.
    let dayScore: number;
    if (ratio >= 0.75 && ratio <= 0.95) dayScore = 100;
    else if (ratio > 0.95 && ratio <= 1.05) dayScore = 75;
    else if (ratio < 0.75 && ratio >= 0.6) dayScore = 70;
    else if (ratio > 1.05 && ratio <= 1.2) dayScore = 45;
    else dayScore = 20;
    calorieScoreAcc += dayScore;
  }
  const calorieScore = daysWithData.length > 0 ? calorieScoreAcc / daysWithData.length : 50;

  const fields = appleWatchFieldsWithGoal();
  const appleWatchJudgments: WeekScorecard["appleWatchJudgments"] = [];
  let awScoreAcc = 0;
  let awScoreCount = 0;
  for (const field of fields) {
    const values = daysWithData.map((d) => getDayData(d).appleWatch[field]).filter((v): v is number => v != null);
    if (values.length === 0) {
      appleWatchJudgments.push({ campo: appleWatchLabel(field), media: NaN, julgamento: null });
      continue;
    }
    const media = values.reduce((a, b) => a + b, 0) / values.length;
    const julgamento = judgeAppleWatchField(field, media);
    appleWatchJudgments.push({ campo: appleWatchLabel(field), media, julgamento });
    if (julgamento) {
      awScoreAcc += judgmentRank(julgamento);
      awScoreCount += 1;
    }
  }
  const appleWatchScore = awScoreCount > 0 ? (awScoreAcc / (awScoreCount * 5)) * 100 : 50;

  const score = Math.round(nutrientScore * 0.5 + calorieScore * 0.3 + appleWatchScore * 0.2);

  return {
    weekStart: dates[0],
    weekEnd: dates[6],
    nutrientScore: Math.round(nutrientScore),
    calorieScore: Math.round(calorieScore),
    appleWatchScore: Math.round(appleWatchScore),
    score,
    calorieBalanceTotal,
    appleWatchJudgments,
  };
}
