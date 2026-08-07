export type Judgment = "muito ruim" | "ruim" | "padrão" | "pode melhorar" | "bom" | "muito bom";

export interface JudgmentResult {
  label: Judgment;
  color: string; // token usado no CSS
}

const JUDGMENT_COLOR: Record<Judgment, string> = {
  "muito ruim": "j-muito-ruim",
  ruim: "j-ruim",
  padrão: "j-padrao",
  "pode melhorar": "j-pode-melhorar",
  bom: "j-bom",
  "muito bom": "j-muito-bom",
};

function toResult(label: Judgment): JudgmentResult {
  return { label, color: JUDGMENT_COLOR[label] };
}

/**
 * Julgamento qualitativo consumido vs. meta.
 *
 * direction "min": nutriente que se busca maximizar (proteína, fibra, vitaminas, minerais).
 * Consumo moderado (perto da meta, sem passar muito) conta como mediano/fraco; quanto mais
 * alto acima da meta, melhor — calibrado pelos objetivos do usuário (cognição, massa magra,
 * cabelo), que priorizam fartura de nutrientes benéficos sobre economia.
 *
 * direction "max": nutriente que se busca limitar (sódio, açúcar, calorias, carboidratos,
 * gordura). Ficar bem abaixo do teto é ótimo; ultrapassar o teto piora o julgamento.
 */
export function judgeNutrient(consumido: number, meta: number, direction: "min" | "max" | "target"): JudgmentResult {
  if (meta <= 0) return toResult("padrão");
  const ratio = consumido / meta;

  if (direction === "min") {
    if (ratio < 0.25) return toResult("muito ruim");
    if (ratio < 0.5) return toResult("ruim");
    if (ratio < 0.85) return toResult("padrão");
    if (ratio < 1.0) return toResult("pode melhorar");
    if (ratio < 1.3) return toResult("bom");
    return toResult("muito bom");
  }

  if (direction === "target") {
    const diff = Math.abs(ratio - 1);
    if (diff <= 0.05) return toResult("muito bom");
    if (diff <= 0.15) return toResult("bom");
    if (diff <= 0.3) return toResult("pode melhorar");
    if (diff <= 0.5) return toResult("padrão");
    if (diff <= 0.75) return toResult("ruim");
    return toResult("muito ruim");
  }

  // direction === "max"
  if (ratio <= 0.4) return toResult("muito bom");
  if (ratio <= 0.7) return toResult("bom");
  if (ratio <= 0.9) return toResult("pode melhorar");
  if (ratio <= 1.0) return toResult("padrão");
  if (ratio <= 1.3) return toResult("ruim");
  return toResult("muito ruim");
}

const RANK: Record<Judgment, number> = {
  "muito ruim": 0,
  ruim: 1,
  padrão: 2,
  "pode melhorar": 3,
  bom: 4,
  "muito bom": 5,
};

export function judgmentRank(j: Judgment): number {
  return RANK[j];
}

export function rankToJudgment(rank: number): Judgment {
  const clamped = Math.max(0, Math.min(5, Math.round(rank)));
  return (Object.keys(RANK) as Judgment[]).find((k) => RANK[k] === clamped)!;
}
