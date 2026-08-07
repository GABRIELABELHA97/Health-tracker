export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

const DIAS_SEMANA = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatLongDate(iso: string): string {
  const d = fromISODate(iso);
  return `${DIAS_SEMANA[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Segunda-feira da semana ISO que contém a data dada. */
export function startOfWeek(iso: string): string {
  const d = fromISODate(iso);
  const dow = d.getDay(); // 0 = domingo
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diffToMonday);
  return toISODate(d);
}

export function datesInRange(startIso: string, endIso: string): string[] {
  const out: string[] = [];
  let cur = startIso;
  while (cur <= endIso) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

export function startOfMonth(iso: string): string {
  const d = fromISODate(iso);
  return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
}
