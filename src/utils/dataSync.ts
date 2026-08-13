import { getDayData, saveDayData, listAllDayKeys, getConfig, saveConfig } from "./storage";
import type { DayData } from "../types";
import type { AppConfig } from "./storage";

export interface DataExport {
  version: 1;
  exportDate: string;
  config: AppConfig;
  days: Array<{ date: string; data: DayData }>;
}

export function exportAllData(): DataExport {
  const config = getConfig();
  const dayKeys = listAllDayKeys();
  const days = dayKeys.map((date) => ({
    date,
    data: getDayData(date),
  }));

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    config,
    days,
  };
}

export function importData(exportData: DataExport): { success: boolean; message: string } {
  try {
    if (exportData.version !== 1) {
      return { success: false, message: `Versão de dados não suportada: ${exportData.version}` };
    }

    if (!exportData.config || !Array.isArray(exportData.days)) {
      return { success: false, message: "Formato de dados inválido" };
    }

    saveConfig(exportData.config);

    for (const { data } of exportData.days) {
      saveDayData(data);
    }

    return {
      success: true,
      message: `Dados importados: ${exportData.days.length} dias + configuração`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro ao importar: ${error instanceof Error ? error.message : "desconhecido"}`,
    };
  }
}

export function downloadDataAsFile(data: DataExport) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `health-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseUploadedFile(file: File): Promise<DataExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as DataExport;
        resolve(data);
      } catch (error) {
        reject(new Error("Erro ao fazer parse do arquivo JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
    reader.readAsText(file);
  });
}
