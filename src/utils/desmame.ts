import type { DesmameConfig } from "./storage";
import { fromISODate } from "./dates";
import { getDayData, listAllDayKeys } from "./storage";

export interface DesmamePhase {
  fase: number;
  doseGotas: number;
  doseMg: number;
  semanasNestaFase: number;
}

const MG_POR_GOTA = 0.1;

export function computeDesmamePhase(date: string, config: DesmameConfig): DesmamePhase {
  const start = fromISODate(config.dataInicio);
  const current = fromISODate(date);
  const diasDesdeInicio = Math.max(0, (current.getTime() - start.getTime()) / 86400000);
  const semanasDesdeInicio = diasDesdeInicio / 7;
  const fase = Math.floor(semanasDesdeInicio / config.faseDuracaoSemanas);
  const semanasNestaFase = semanasDesdeInicio - fase * config.faseDuracaoSemanas;
  const doseGotas = Math.max(0, config.doseInicialGotas - fase * config.stepGotas);

  return {
    fase: fase + 1,
    doseGotas,
    doseMg: doseGotas * MG_POR_GOTA,
    semanasNestaFase,
  };
}

export interface DesmameHistoryRow {
  date: string;
  rivotril?: number;
  cbd?: number;
  melatonina?: number;
  sintomas?: string;
}

export function getDesmameHistory(): DesmameHistoryRow[] {
  const rows: DesmameHistoryRow[] = [];
  for (const date of listAllDayKeys()) {
    const d = getDayData(date).desmame;
    if (d.rivotrilGotas == null && d.cbdGotas == null && d.melatoninaGotas == null && !d.comoMeSenti) continue;
    rows.push({ date, rivotril: d.rivotrilGotas, cbd: d.cbdGotas, melatonina: d.melatoninaGotas, sintomas: d.comoMeSenti });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}
