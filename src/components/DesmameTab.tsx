import { useDayData } from "../hooks/useDayData";
import { useConfig } from "../hooks/useConfig";
import { computeDesmamePhase, getDesmameHistory } from "../utils/desmame";
import { formatLongDate } from "../utils/dates";
import NormalizedLineChart from "./NormalizedLineChart";

export default function DesmameTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config, update: updateConfig } = useConfig();

  const phase = computeDesmamePhase(date, config.desmame);
  const history = getDesmameHistory();

  function setField(field: "rivotrilGotas" | "cbdGotas" | "melatoninaGotas", value: string) {
    update((prev) => ({
      ...prev,
      desmame: { ...prev.desmame, [field]: value === "" ? undefined : Number(value) },
    }));
  }

  function setComoMeSenti(value: string) {
    update((prev) => ({ ...prev, desmame: { ...prev.desmame, comoMeSenti: value } }));
  }

  return (
    <>
      <div className="card">
        <h2>Configuração</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <label className="muted">
            Data de início
            <br />
            <input
              type="date"
              value={config.desmame.dataInicio}
              onChange={(e) => updateConfig((prev) => ({ ...prev, desmame: { ...prev.desmame, dataInicio: e.target.value } }))}
            />
          </label>
          <label className="muted">
            Dose inicial (gotas)
            <br />
            <input
              type="number"
              value={config.desmame.doseInicialGotas}
              onChange={(e) =>
                updateConfig((prev) => ({ ...prev, desmame: { ...prev.desmame, doseInicialGotas: Number(e.target.value) } }))
              }
              style={{ width: 90 }}
            />
          </label>
        </div>
        <div className="card" style={{ background: "#eef3fc", marginTop: 12, marginBottom: 0 }}>
          Fase esperada hoje: Fase {phase.fase} — {phase.doseMg.toFixed(1)}mg ({phase.doseGotas} gotas), mínimo{" "}
          {config.desmame.faseDuracaoSemanas} semanas. {phase.semanasNestaFase.toFixed(1)} semana(s) nesta fase.
        </div>
      </div>

      <div className="card">
        <h2>Registro de hoje</h2>
        <div className="field-grid" style={{ marginTop: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Rivotril (gotas)</span>
            <input type="number" value={day.desmame.rivotrilGotas ?? ""} onChange={(e) => setField("rivotrilGotas", e.target.value)} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">CBD Full Spectrum (gotas)</span>
            <input type="number" value={day.desmame.cbdGotas ?? ""} onChange={(e) => setField("cbdGotas", e.target.value)} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Melatonina noite anterior (gotas)</span>
            <input type="number" value={day.desmame.melatoninaGotas ?? ""} onChange={(e) => setField("melatoninaGotas", e.target.value)} />
          </label>
        </div>
        <p className="muted" style={{ marginTop: 10 }}>
          Você deveria estar tomando neste dia ({date}): {phase.doseGotas} gotas ({phase.doseMg.toFixed(1)}mg) — Fase {phase.fase}.
        </p>
        <textarea
          placeholder="Como me senti hoje (sintomas, humor, sono, ansiedade...)"
          rows={3}
          value={day.desmame.comoMeSenti ?? ""}
          onChange={(e) => setComoMeSenti(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>

      <div className="card">
        <h2>Rivotril × CBD × Melatonina ao longo do tempo</h2>
        <p className="muted">
          Séries normalizadas pelo próprio pico de cada uma, para facilitar ver padrões — não é escala absoluta comparável entre elas.
        </p>
        <NormalizedLineChart
          series={[
            { name: "Rivotril", color: "#2f5fbf", points: history.map((h) => ({ date: h.date, value: h.rivotril ?? 0 })) },
            { name: "CBD", color: "#2c9c6b", points: history.map((h) => ({ date: h.date, value: h.cbd ?? 0 })) },
            { name: "Melatonina", color: "#b8951e", points: history.map((h) => ({ date: h.date, value: h.melatonina ?? 0 })) },
          ]}
        />

        {history.length > 0 && (
          <div className="table-scroll" style={{ marginTop: 14 }}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Rivotril</th>
                  <th>CBD</th>
                  <th>Melatonina</th>
                  <th>Sintomas relatados</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .slice()
                  .reverse()
                  .map((h) => (
                    <tr key={h.date}>
                      <td>{formatLongDate(h.date)}</td>
                      <td>{h.rivotril ?? "—"}</td>
                      <td>{h.cbd ?? "—"}</td>
                      <td>{h.melatonina ?? "—"}</td>
                      <td>{h.sintomas || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
