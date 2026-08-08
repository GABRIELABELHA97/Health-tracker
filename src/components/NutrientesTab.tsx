import { useState } from "react";
import { useConfig } from "../hooks/useConfig";
import { buildNutrientRows, generateNutrientAnalysis, type NutrientAnalysisReport } from "../utils/analysis";
import JudgmentBadge from "./JudgmentBadge";

function fmt(n: number, unit: string) {
  const digits = unit === "mg" || unit === "mcg" || unit === "kcal" ? 0 : 1;
  return `${n.toFixed(digits)}${unit}`;
}

export default function NutrientesTab({ date }: { date: string }) {
  const { config } = useConfig();
  const rows = buildNutrientRows(date, config);
  const [report, setReport] = useState<NutrientAnalysisReport | null>(null);

  return (
    <>
      <div className="card">
        <h2>Nutrientes</h2>
        <p className="muted">
          Objetivo: {config.objetivos.join(", ")}. Metas semanais editáveis em Perfil / metas.
        </p>
        <div className="table-scroll" style={{ marginTop: 10 }}>
          <table>
            <thead>
              <tr>
                <th>Nutriente</th>
                <th>Consumido no dia</th>
                <th>Meta do dia</th>
                <th>Julgamento do dia</th>
                <th>Consumido na semana</th>
                <th>Meta da semana</th>
                <th>Julgamento da semana</th>
                <th>Revisão total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td>{r.label}</td>
                  <td>{fmt(r.consumidoDia, r.unit)}</td>
                  <td>{fmt(r.metaDia, r.unit)}</td>
                  <td>
                    <JudgmentBadge judgment={r.julgamentoDia} />
                  </td>
                  <td>{fmt(r.consumidoSemana, r.unit)}</td>
                  <td>{fmt(r.metaSemana, r.unit)}</td>
                  <td>
                    <JudgmentBadge judgment={r.julgamentoSemana} />
                  </td>
                  <td>
                    <JudgmentBadge judgment={r.revisaoTotal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={() => setReport(generateNutrientAnalysis(date, config))}>
            Analisar padrão nutricional
          </button>
        </div>
      </div>

      {report && (
        <div className="card">
          <h2>Análise de consumo — dia, semana e mês</h2>
          {(["dia", "semana", "mes"] as const).map((p) => {
            const block = p === "dia" ? report.dia : p === "semana" ? report.semana : report.mes;
            return (
              <div key={p}>
                <div className="section-title">{block.periodo}</div>
                <p>
                  <strong>Faltou:</strong> {block.faltaram.length > 0 ? block.faltaram.map((r) => r.label).join(", ") : "nada — todas as metas com direção 'quanto mais melhor' atingidas."}
                </p>
                <p>
                  <strong>Foi ideal:</strong> {block.ideais.length > 0 ? block.ideais.map((r) => r.label).join(", ") : "nenhum nutriente na faixa ideal ainda."}
                </p>
                <p>
                  <strong>Sobrou/passou do teto:</strong> {block.sobraram.length > 0 ? block.sobraram.map((r) => r.label).join(", ") : "nenhum excesso."}
                </p>
              </div>
            );
          })}

          <div className="section-title">Consequências possíveis</div>
          {report.consequencias.length > 0 ? (
            <ul>
              {report.consequencias.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nenhuma lacuna relevante identificada no momento.</p>
          )}

          <div className="section-title">Como obter o que faltou</div>
          {report.comoObter.length > 0 ? (
            <ul>
              {report.comoObter.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nada a repor no momento.</p>
          )}

          <div className="section-title">Análise franca e direta</div>
          <p className="analysis-text">{report.analiseFranca}</p>
        </div>
      )}
    </>
  );
}
