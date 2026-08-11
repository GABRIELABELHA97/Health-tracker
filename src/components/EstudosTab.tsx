import { useState, useEffect } from "react";
import { useDayData } from "../hooks/useDayData";
import { getStudyPlanForDate } from "../data/studyPlan";
import { judgeStudyDay } from "../utils/analysis";
import { useSaveStatus } from "../hooks/useSaveStatus";
import JudgmentBadge from "./JudgmentBadge";
import SaveStatusButton from "./SaveStatusButton";

export default function EstudosTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { status, markSaving, markSaved } = useSaveStatus();
  const [oQueFoiEstudado, setOQueFoiEstudado] = useState("");
  const [como, setComo] = useState("");

  const plano = getStudyPlanForDate(date);
  const report = judgeStudyDay(date, day);

  useEffect(() => {
    if (plano && !day.objetivoEstudoDia) {
      const temas = plano.itens.map((item) => item.tema).join(" · ");
      const totalMin = plano.itens.reduce((sum, item) => sum + item.duracaoMin, 0);
      const objetivo = `${temas} (~${totalMin}min)`;
      update((prev) => ({ ...prev, objetivoEstudoDia: objetivo }));
    }
  }, [date, plano, day.objetivoEstudoDia, update]);

  function saveObjetivo(v: string) {
    markSaving();
    update((prev) => ({ ...prev, objetivoEstudoDia: v }));
    setTimeout(() => markSaved(), 100);
  }

  function addStudy() {
    if (!oQueFoiEstudado.trim()) return;
    markSaving();
    update((prev) => ({
      ...prev,
      studyLog: [...prev.studyLog, { id: crypto.randomUUID(), oQueFoiEstudado: oQueFoiEstudado.trim(), como: como.trim() || undefined }],
    }));
    setOQueFoiEstudado("");
    setComo("");
    setTimeout(() => markSaved(), 100);
  }

  function removeStudy(id: string) {
    markSaving();
    update((prev) => ({ ...prev, studyLog: prev.studyLog.filter((s) => s.id !== id) }));
    setTimeout(() => markSaved(), 100);
  }

  function handleSave() {
    markSaving();
    setTimeout(() => markSaved(), 300);
  }

  return (
    <>
      <div className="card">
        <h2>O que o cronograma da pós em psiquiatria prevê para hoje</h2>
        {plano ? (
          <>
            <p className="muted">{plano.semana}</p>
            <ul>
              {plano.itens.map((item, i) => (
                <li key={i}>
                  {item.tema} — ~{item.duracaoMin}min{item.estimado ? " (estimado)" : ""}
                  {item.comoFazer && <div className="muted">{item.comoFazer}</div>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">Sem item fixo de cronograma para esta data no vault (Pós Psiquiatria).</p>
        )}
      </div>

      <div className="card">
        <div className="row-between">
          <h2>O que pretendo estudar hoje</h2>
          <SaveStatusButton status={status} onClick={handleSave} />
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Objetivo de estudo do dia"
            value={day.objetivoEstudoDia ?? ""}
            onChange={(e) => saveObjetivo(e.target.value)}
            style={{ flex: 1, minWidth: 220 }}
          />
        </div>
      </div>

      <div className="card">
        <h2>O que você estudou hoje</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <input type="text" placeholder="O que foi estudado" value={oQueFoiEstudado} onChange={(e) => setOQueFoiEstudado(e.target.value)} style={{ flex: 2, minWidth: 180 }} />
          <input type="text" placeholder="Como (opcional)" value={como} onChange={(e) => setComo(e.target.value)} style={{ flex: 2, minWidth: 180 }} />
          <button className="btn btn-primary" onClick={addStudy}>
            Adicionar
          </button>
        </div>
        {day.studyLog.length === 0 ? (
          <p className="muted" style={{ marginTop: 12 }}>
            Nenhum registro de estudo ainda.
          </p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {day.studyLog.map((s) => (
              <div key={s.id} className="list-item">
                <div>
                  <strong>{s.oQueFoiEstudado}</strong>
                  {s.como && <div className="muted">{s.como}</div>}
                </div>
                <button className="btn btn-small" onClick={() => removeStudy(s.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="row-between">
          <h2>Julgamento vs. cronograma</h2>
          <JudgmentBadge judgment={report.julgamento} />
        </div>
        <p className="analysis-text" style={{ marginTop: 10 }}>
          {report.texto}
        </p>
      </div>
    </>
  );
}
