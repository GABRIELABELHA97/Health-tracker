// Chave de nutriente rastreado no app — usada como índice em todas as tabelas de metas/consumo.
export type NutrientKey =
  | "calorias"
  | "proteina"
  | "carboidratos"
  | "gordura"
  | "acucar"
  | "fibra"
  | "sodio"
  | "omega3"
  | "vitaminaD"
  | "vitaminaB12"
  | "ferro"
  | "vitaminaB1"
  | "vitaminaB2"
  | "vitaminaB3"
  | "vitaminaB5"
  | "vitaminaB6"
  | "vitaminaB7"
  | "vitaminaB9"
  | "vitaminaC"
  | "magnesio";

export type NutrientTotals = Record<NutrientKey, number>;

export interface NutrientMeta {
  label: string;
  unit: string;
  /**
   * "max" = quanto menos melhor, até um teto (ex: sódio, açúcar).
   * "min" = quanto mais melhor, sem teto real (proteína, vitaminas, minerais).
   * "target" = melhor perto da meta calculada, pra mais ou pra menos piora (calorias, carboidratos, gordura).
   */
  direction: "min" | "max" | "target";
}

export interface IngredientNutrition {
  id: string;
  nome: string;
  categoria: string;
  porcaoDescricao: string;
  /** Nutrientes na porção descrita acima (não por 100g). */
  porPorcao: Partial<NutrientTotals>;
  fonte: "rotulo_oficial" | "estimativa_agregador" | "estimativa_padrao" | "taco";
  observacao?: string;
}

export interface Supplement {
  id: string;
  nome: string;
  /** Unidade em que a quantidade tomada é registrada (ex: "gotas", "comprimidos", "cápsulas"). */
  unidade: string;
  /** Referência de dose habitual, só como texto informativo (não é mais aplicada automaticamente). */
  doseReferencia: string;
  horario?: string;
  observacao?: string;
}

export interface FoodLogItem {
  id: string;
  refeicao: "Café da manhã" | "Almoço" | "Lanche" | "Jantar" | "Ceia" | "Outro";
  nome: string;
  quantidade: string;
  nutrientes: Partial<NutrientTotals>;
  ingredienteId?: string;
}

export interface MedicationLogItem {
  id: string;
  nome: string;
  dose?: string;
}

export interface AppleWatchData {
  sonoHoras?: number;
  qualidadeSono?: number;
  caloriasMovimento?: number;
  energiaRepouso?: number;
  exercicioMin?: number;
  tempoEmPeHoras?: number;
  passos?: number;
  distanciaKm?: number;
  vo2max?: number;
  aguaL?: number;
}

export interface TaskItem {
  id: string;
  oQueFoiFeito: string;
  como?: string;
}

export interface DesmameConfig {
  dataInicio: string;
  doseInicialGotas: number;
}

export interface DesmameLog {
  rivotrilGotas?: number;
  cbdGotas?: number;
  melatoninaGotas?: number;
  comoMeSenti?: string;
}

export interface StudyLogItem {
  id: string;
  oQueFoiEstudado: string;
  como?: string;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  tasks: TaskItem[];
  suplementosQuantidade: Partial<Record<string, number>>; // id de Supplement -> quantidade de unidades tomadas no dia
  foodLog: FoodLogItem[];
  nutrientesManuais: Partial<NutrientTotals>; // preenchimento manual por nutriente em "o que você comeu hoje"
  medications: MedicationLogItem[];
  appleWatch: AppleWatchData;
  desmame: DesmameLog;
  objetivoEstudoDia?: string;
  studyLog: StudyLogItem[];
  resumoAnaliseTexto?: string;
  nutrientesAnaliseTexto?: string;
}

export function emptyDayData(date: string): DayData {
  return {
    date,
    tasks: [],
    suplementosQuantidade: {},
    foodLog: [],
    nutrientesManuais: {},
    medications: [],
    appleWatch: {},
    desmame: {},
    studyLog: [],
  };
}
