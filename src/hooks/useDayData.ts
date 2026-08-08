import { useEffect, useState } from "react";
import type { DayData } from "../types";
import { getDayData, saveDayData } from "../utils/storage";

export function useDayData(date: string) {
  const [day, setDay] = useState<DayData>(() => getDayData(date));

  useEffect(() => {
    setDay(getDayData(date));
  }, [date]);

  function update(updater: (prev: DayData) => DayData) {
    setDay((prev) => {
      const next = updater(prev);
      saveDayData(next);
      return next;
    });
  }

  return { day, update };
}
