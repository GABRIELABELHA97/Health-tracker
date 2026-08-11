import type { DayData, IngredientNutrition, NutrientKey, NutrientTotals, Supplement } from "../types";
import { emptyDayData } from "../types";
import { safeStorage } from "./storageSafe";

const DAY_PREFIX = "ht:day:";
const CONFIG_KEY = "ht:config";

export interface Profile {
  pesoKg: number;
  alturaCm: number;
  idade: number;
  sexo: "M" | "F";
  nivelAtividade: "sedentario" | "leve" | "moderado" | "ativo" | "muito_ativo";
  deficitCaloricoPercent: number; // 0-100, ex: 20 = déficit de 20% sobre o TDEE
}

export interface DesmameConfig {
  dataInicio: string;
  doseInicialGotas: number;
  stepGotas: number;
  faseDuracaoSemanas: number;
}

export interface AppConfig {
  profile: Profile;
  nutrientGoalsWeekly: Partial<Record<NutrientKey, number>>; // override das metas semanais padrão
  customIngredients: IngredientNutrition[];
  customSupplements: Supplement[];
  objetivos: string[];
  desmame: DesmameConfig;
}

export const DEFAULT_DESMAME: DesmameConfig = {
  dataInicio: "2026-08-04",
  doseInicialGotas: 40,
  stepGotas: 5,
  faseDuracaoSemanas: 2,
};

export const DEFAULT_PROFILE: Profile = {
  pesoKg: 80,
  alturaCm: 178,
  idade: 30,
  sexo: "M",
  nivelAtividade: "moderado",
  deficitCaloricoPercent: 20,
};

export const DEFAULT_OBJETIVOS = [
  "Perda de peso",
  "Melhora na cognição",
  "Manutenção da massa muscular",
  "Vitaminas para cabelo",
  "Produtividade",
];

function defaultConfig(): AppConfig {
  return {
    profile: { ...DEFAULT_PROFILE },
    nutrientGoalsWeekly: {},
    customIngredients: [],
    customSupplements: [],
    objetivos: [...DEFAULT_OBJETIVOS],
    desmame: { ...DEFAULT_DESMAME },
  };
}

export function getConfig(): AppConfig {
  const raw = safeStorage.getItem(CONFIG_KEY);
  if (!raw) return defaultConfig();
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig(),
      ...parsed,
      profile: { ...DEFAULT_PROFILE, ...parsed.profile },
      desmame: { ...DEFAULT_DESMAME, ...parsed.desmame },
    };
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: AppConfig) {
  safeStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getDayData(date: string): DayData {
  const raw = safeStorage.getItem(DAY_PREFIX + date);
  if (!raw) return emptyDayData(date);
  try {
    const parsed = JSON.parse(raw);
    return { ...emptyDayData(date), ...parsed };
  } catch {
    return emptyDayData(date);
  }
}

export function saveDayData(data: DayData) {
  safeStorage.setItem(DAY_PREFIX + data.date, JSON.stringify(data));
}

export function listAllDayKeys(): string[] {
  const out: string[] = [];
  for (let i = 0; i < safeStorage.length; i++) {
    const key = safeStorage.key(i);
    if (key && key.startsWith(DAY_PREFIX)) out.push(key.slice(DAY_PREFIX.length));
  }
  return out.sort();
}

export function sumNutrients(list: Partial<NutrientTotals>[]): Partial<NutrientTotals> {
  const out: Partial<NutrientTotals> = {};
  for (const item of list) {
    for (const key of Object.keys(item) as NutrientKey[]) {
      out[key] = (out[key] ?? 0) + (item[key] ?? 0);
    }
  }
  return out;
}
