import type { Supplement } from "../types";

export const SUPPLEMENTS: Supplement[] = [
  {
    id: "vitamina-d-true-source",
    nome: "Vitamina D (True Source)",
    doseDescricao: "6 gotas (30mcg)",
    horario: "Manhã",
  },
  {
    id: "cbd-manha",
    nome: "CBD Full Spectrum 6000mg — manhã",
    doseDescricao: "4 gotas (em progressão para 5 gotas)",
    horario: "Manhã",
    observacao: "Progressão combinada: de 4 para 5 gotas de manhã em 2 dias.",
  },
  {
    id: "cbd-noite",
    nome: "CBD Full Spectrum 6000mg — noite",
    doseDescricao: "4 gotas (em progressão para 10 gotas)",
    horario: "Noite",
    observacao: "Progressão combinada: de 4 para 10 gotas à noite em 2 dias.",
  },
  {
    id: "metilcobalamina",
    nome: "Metilcobalamina",
    doseDescricao: "50mcg",
    horario: "Manhã",
  },
  {
    id: "b-complexo-bigens",
    nome: "Bigens B Complexo (gotas)",
    doseDescricao:
      "8 gotas = B1 2mg, B2 2,7mg, B3 3mg, B5 5mg, B6 5mg, B7 45mcg, B9 100mcg, B12 9,9mcg (dose ainda a definir)",
    horario: "Manhã",
  },
  {
    id: "magnesio",
    nome: "Magnésio (1400mg, 60cp)",
    doseDescricao: "2 comprimidos (200mg por porção — dose ainda a definir)",
  },
  {
    id: "omega-3-puravida",
    nome: "Ômega 3 Puravida",
    doseDescricao: "2 cápsulas — EPA 660mg, DHA 440mg, Vitamina E 10mg",
  },
];

/** Nutrientes aportados por uma porção "padrão" (1 clique) de cada suplemento, quando aplicável. */
export const SUPPLEMENT_NUTRIENTS: Record<string, Partial<Record<string, number>>> = {
  "vitamina-d-true-source": { vitaminaD: 30 },
  "cbd-manha": {},
  "cbd-noite": {},
  metilcobalamina: { vitaminaB12: 50 },
  "b-complexo-bigens": {
    vitaminaB1: 2,
    vitaminaB2: 2.7,
    vitaminaB3: 3,
    vitaminaB5: 5,
    vitaminaB6: 5,
    vitaminaB7: 45,
    vitaminaB9: 100,
    vitaminaB12: 9.9,
  },
  magnesio: { magnesio: 200 },
  "omega-3-puravida": { omega3: 1.1 },
};

export function getAllSupplements(custom: Supplement[]): Supplement[] {
  return [...SUPPLEMENTS, ...custom];
}
