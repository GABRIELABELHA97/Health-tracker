import type { Supplement } from "../types";

export const SUPPLEMENTS: Supplement[] = [
  {
    id: "vitamina-d-true-source",
    nome: "Vitamina D (True Source)",
    unidade: "gotas",
    doseReferencia: "6 gotas/dia (30mcg)",
    horario: "Manhã",
  },
  {
    id: "cbd-manha",
    nome: "CBD Full Spectrum 6000mg — manhã",
    unidade: "gotas",
    doseReferencia: "4 gotas (em progressão para 5)",
    horario: "Manhã",
    observacao: "Progressão combinada: de 4 para 5 gotas de manhã em 2 dias.",
  },
  {
    id: "cbd-noite",
    nome: "CBD Full Spectrum 6000mg — noite",
    unidade: "gotas",
    doseReferencia: "4 gotas (em progressão para 10)",
    horario: "Noite",
    observacao: "Progressão combinada: de 4 para 10 gotas à noite em 2 dias.",
  },
  {
    id: "metilcobalamina",
    nome: "Metilcobalamina",
    unidade: "doses (50mcg cada)",
    doseReferencia: "1 dose/dia",
    horario: "Manhã",
  },
  {
    id: "b-complexo-bigens",
    nome: "Bigens B Complexo (gotas)",
    unidade: "gotas",
    doseReferencia: "8 gotas/dia (dose ainda a definir)",
    horario: "Manhã",
    observacao: "Por gota: B1 0,25mg, B2 0,34mg, B3 0,38mg, B5 0,63mg, B6 0,63mg, B7 5,6mcg, B9 12,5mcg, B12 1,24mcg.",
  },
  {
    id: "magnesio",
    nome: "Magnésio (1400mg, 60cp)",
    unidade: "comprimidos",
    doseReferencia: "2 comprimidos/dia (dose ainda a definir)",
  },
  {
    id: "omega-3-puravida",
    nome: "Ômega 3 Puravida",
    unidade: "cápsulas",
    doseReferencia: "2 cápsulas/dia",
    observacao: "Por cápsula: EPA 330mg, DHA 220mg, Vitamina E 5mg.",
  },
];

/** Nutrientes aportados por 1 UNIDADE (gota/comprimido/cápsula/dose) de cada suplemento. */
export const SUPPLEMENT_NUTRIENTS_PER_UNIT: Record<string, Partial<Record<string, number>>> = {
  "vitamina-d-true-source": { vitaminaD: 5 }, // 6 gotas = 30mcg
  "cbd-manha": {},
  "cbd-noite": {},
  metilcobalamina: { vitaminaB12: 50 }, // 1 dose = 50mcg
  "b-complexo-bigens": {
    // 8 gotas = B1 2mg, B2 2,7mg, B3 3mg, B5 5mg, B6 5mg, B7 45mcg, B9 100mcg, B12 9,9mcg
    vitaminaB1: 2 / 8,
    vitaminaB2: 2.7 / 8,
    vitaminaB3: 3 / 8,
    vitaminaB5: 5 / 8,
    vitaminaB6: 5 / 8,
    vitaminaB7: 45 / 8,
    vitaminaB9: 100 / 8,
    vitaminaB12: 9.9 / 8,
  },
  magnesio: { magnesio: 100 }, // 2cp = 200mg
  "omega-3-puravida": { omega3: 0.55 }, // 2 cápsulas = 1,1g (EPA 660mg + DHA 440mg)
};

export function getAllSupplements(custom: Supplement[]): Supplement[] {
  return [...SUPPLEMENTS, ...custom];
}
