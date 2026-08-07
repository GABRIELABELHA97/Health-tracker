import type { NutrientKey, NutrientMeta } from "../types";
import type { AppConfig, Profile } from "../utils/storage";

export const NUTRIENT_ORDER: NutrientKey[] = [
  "proteina",
  "fibra",
  "sodio",
  "acucar",
  "omega3",
  "vitaminaD",
  "vitaminaB12",
  "ferro",
  "vitaminaB9",
  "vitaminaB1",
  "vitaminaB2",
  "vitaminaB3",
  "vitaminaB5",
  "vitaminaB6",
  "vitaminaB7",
  "vitaminaC",
  "magnesio",
  "calorias",
  "carboidratos",
  "gordura",
];

export const NUTRIENT_META: Record<NutrientKey, NutrientMeta> = {
  calorias: { label: "Calorias", unit: "kcal", direction: "target" },
  proteina: { label: "Proteína", unit: "g", direction: "min" },
  carboidratos: { label: "Carboidratos", unit: "g", direction: "target" },
  gordura: { label: "Gordura total", unit: "g", direction: "target" },
  acucar: { label: "Açúcar", unit: "g", direction: "max" },
  fibra: { label: "Fibra", unit: "g", direction: "min" },
  sodio: { label: "Sódio", unit: "mg", direction: "max" },
  omega3: { label: "Ômega-3", unit: "g", direction: "min" },
  vitaminaD: { label: "Vitamina D", unit: "mcg", direction: "min" },
  vitaminaB12: { label: "Vitamina B12", unit: "mcg", direction: "min" },
  ferro: { label: "Ferro", unit: "mg", direction: "min" },
  vitaminaB1: { label: "Vitamina B1", unit: "mg", direction: "min" },
  vitaminaB2: { label: "Vitamina B2", unit: "mg", direction: "min" },
  vitaminaB3: { label: "Vitamina B3", unit: "mg", direction: "min" },
  vitaminaB5: { label: "Vitamina B5", unit: "mg", direction: "min" },
  vitaminaB6: { label: "Vitamina B6", unit: "mg", direction: "min" },
  vitaminaB7: { label: "Vitamina B7", unit: "mcg", direction: "min" },
  vitaminaB9: { label: "Vitamina B9 (Folato)", unit: "mcg", direction: "min" },
  vitaminaC: { label: "Vitamina C", unit: "mg", direction: "min" },
  magnesio: { label: "Magnésio", unit: "mg", direction: "min" },
};

/** Metas semanais fixas herdadas do app original (editáveis em Perfil/Metas). */
export const DEFAULT_WEEKLY_GOALS: Record<NutrientKey, number> = {
  proteina: 720,
  fibra: 180,
  sodio: 12000,
  acucar: 300,
  omega3: 9.6,
  vitaminaD: 90,
  vitaminaB12: 14.4,
  ferro: 48,
  vitaminaB9: 2400,
  vitaminaB1: 7.2,
  vitaminaB2: 7.8,
  vitaminaB3: 96,
  vitaminaB5: 30,
  vitaminaB6: 7.8,
  vitaminaB7: 180,
  vitaminaC: 540,
  magnesio: 2400,
  // calculados a partir do perfil por computeCalorieMacroGoals — valores abaixo são apenas fallback
  calorias: 14000,
  carboidratos: 1050,
  gordura: 500,
};

const ACTIVITY_MULTIPLIER: Record<Profile["nivelAtividade"], number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  ativo: 1.725,
  muito_ativo: 1.9,
};

export interface CalorieMacroGoals {
  tdeeDiario: number;
  caloriasDiaAlvo: number;
  caloriasSemanaAlvo: number;
  carboidratosSemanaAlvo: number;
  gorduraSemanaAlvo: number;
}

export function computeCalorieMacroGoals(profile: Profile, proteinaSemanaGoal: number): CalorieMacroGoals {
  const bmr =
    profile.sexo === "M"
      ? 10 * profile.pesoKg + 6.25 * profile.alturaCm - 5 * profile.idade + 5
      : 10 * profile.pesoKg + 6.25 * profile.alturaCm - 5 * profile.idade - 161;
  const tdeeDiario = bmr * ACTIVITY_MULTIPLIER[profile.nivelAtividade];
  const caloriasDiaAlvo = tdeeDiario * (1 - profile.deficitCaloricoPercent / 100);
  const caloriasSemanaAlvo = caloriasDiaAlvo * 7;

  const proteinaKcalSemana = proteinaSemanaGoal * 4;
  const gorduraKcalSemana = caloriasSemanaAlvo * 0.25;
  const carboKcalSemana = Math.max(caloriasSemanaAlvo - proteinaKcalSemana - gorduraKcalSemana, 0);

  return {
    tdeeDiario,
    caloriasDiaAlvo,
    caloriasSemanaAlvo,
    carboidratosSemanaAlvo: carboKcalSemana / 4,
    gorduraSemanaAlvo: gorduraKcalSemana / 9,
  };
}

export function getWeeklyGoals(config: AppConfig): Record<NutrientKey, number> {
  const base = { ...DEFAULT_WEEKLY_GOALS, ...config.nutrientGoalsWeekly };
  const macros = computeCalorieMacroGoals(config.profile, base.proteina);
  return {
    ...base,
    calorias: config.nutrientGoalsWeekly.calorias ?? macros.caloriasSemanaAlvo,
    carboidratos: config.nutrientGoalsWeekly.carboidratos ?? macros.carboidratosSemanaAlvo,
    gordura: config.nutrientGoalsWeekly.gordura ?? macros.gorduraSemanaAlvo,
  };
}
