import { useMemo } from "react";
import { useDayData } from "../hooks/useDayData";
import { useConfig } from "../hooks/useConfig";
import { computeWeekScorecard, generateDayResumo } from "../utils/analysis";
import { formatLongDate, startOfWeek } from "../utils/dates";
import { listAllDayKeys } from "../utils/storage";
import JudgmentBadge from "./JudgmentBadge";

export default function ResumoTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config } = useConfig();

  function analisar() {
    const texto = generateDayResumo(date, config);
    update((prev) => ({ ...prev, resumoAnaliseTexto: texto }));
  }

  const currentScorecard = useMemo(() => computeWeekScorecard(date, config), [date, config]);

  const allWeeks = useMemo(() => {
    const weeks = Array.from(new Set(listAllDayKeys().map((d) => startOfWeek(d)))).sort().reverse();
    return weeks.map((w) => ({ weekStart: w, scorecard: computeWeekScorecard(w, config) }));
  }, [config]);

  return (
    <>
      <div className="card">
        <div className="row-between">
          <h2>Análise do dia</h2>
          <button className="btn btn-primary" onClick={analisar}>
            Analisar dia
          </button>
        </div>
        {day.resumoAnaliseTexto ? (
          <p className="analysis-text" style={{ marginTop: 10 }}>
            {day.resumoAnaliseTexto}
          </p>
        ) : (
          <p className="muted" style={{ marginTop: 10, fontStyle: "italic" }}>
            Nenhuma análise gerada ainda — clique em "Analisar dia" acima.
          </p>
        )}
      </div>

      <div className="card">
        <div className="row-between">
          <h2>
            Resultado da semana ({formatLongDate(currentScorecard.weekStart)} — {formatLongDate(currentScorecard.weekEnd)})
          </h2>
          <span className="stat-tile" style={{ textAlign: "center" }}>
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Nota geral
            </div>
            <div className="value">{currentScorecard.score}/100</div>
          </span>
        </div>

        <div className="row" style={{ marginTop: 12, gap: 14 }}>
          <div className="stat-tile">
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Nutrientes
            </div>
            <div className="value">{currentScorecard.nutrientScore}/100</div>
          </div>
          <div className="stat-tile">
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Calorias
            </div>
            <div className="value">{currentScorecard.calorieScore}/100</div>
            <div className="muted" style={{ fontSize: "0.8rem" }}>
              {currentScorecard.calorieBalanceTotal <= 0
                ? `déficit acumulado ${Math.abs(currentScorecard.calorieBalanceTotal).toFixed(0)}kcal`
                : `superávit acumulado ${currentScorecard.calorieBalanceTotal.toFixed(0)}kcal`}
            </div>
          </div>
          <div className="stat-tile">
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Apple Watch
            </div>
            <div className="value">{currentScorecard.appleWatchScore}/100</div>
          </div>
        </div>

        <div className="section-title">Apple Watch — julgamento por item (média da semana)</div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Média</th>
                <th>Julgamento</th>
              </tr>
            </thead>
            <tbody>
              {currentScorecard.appleWatchJudgments.map((j) => (
                <tr key={j.campo}>
                  <td>{j.campo}</td>
                  <td>{Number.isNaN(j.media) ? "—" : j.media.toFixed(1)}</td>
                  <td>
                    <JudgmentBadge judgment={j.julgamento} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Histórico de notas semanais</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Nutrientes</th>
                <th>Calorias</th>
                <th>Apple Watch</th>
                <th>Nota geral</th>
              </tr>
            </thead>
            <tbody>
              {allWeeks.map(({ weekStart, scorecard }) => (
                <tr key={weekStart}>
                  <td>
                    {formatLongDate(scorecard.weekStart)} — {formatLongDate(scorecard.weekEnd)}
                  </td>
                  <td>{scorecard.nutrientScore}</td>
                  <td>{scorecard.calorieScore}</td>
                  <td>{scorecard.appleWatchScore}</td>
                  <td>
                    <strong>{scorecard.score}/100</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
