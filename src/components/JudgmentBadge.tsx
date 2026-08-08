import type { Judgment } from "../utils/judgment";

const COLOR_CLASS: Record<Judgment, string> = {
  "muito ruim": "j-muito-ruim",
  ruim: "j-ruim",
  padrão: "j-padrao",
  "pode melhorar": "j-pode-melhorar",
  bom: "j-bom",
  "muito bom": "j-muito-bom",
};

export default function JudgmentBadge({ judgment }: { judgment: Judgment | null }) {
  if (!judgment) return <span className="muted">—</span>;
  return <span className={`badge ${COLOR_CLASS[judgment]}`}>{judgment}</span>;
}
