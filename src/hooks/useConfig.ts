import { useState } from "react";
import { getConfig, saveConfig, type AppConfig } from "../utils/storage";

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(() => getConfig());

  function update(updater: (prev: AppConfig) => AppConfig) {
    setConfig((prev) => {
      const next = updater(prev);
      saveConfig(next);
      return next;
    });
  }

  return { config, update };
}
