import { useState } from "react";
import { useDayData } from "../hooks/useDayData";
import { useConfig } from "../hooks/useConfig";
import { judgeTasks } from "../utils/analysis";
import { useSaveStatus } from "../hooks/useSaveStatus";
import JudgmentBadge from "./JudgmentBadge";
import SaveStatusButton from "./SaveStatusButton";

export default function TarefasTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config } = useConfig();
  const { status, markSaving, markSaved } = useSaveStatus();
  const [oQueFoiFeito, setOQueFoiFeito] = useState("");
  const [como, setComo] = useState("");

  function addTask() {
    if (!oQueFoiFeito.trim()) return;
    markSaving();
    update((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { id: crypto.randomUUID(), oQueFoiFeito: oQueFoiFeito.trim(), como: como.trim() || undefined }],
    }));
    setOQueFoiFeito("");
    setComo("");
    setTimeout(() => markSaved(), 100);
  }

  function removeTask(id: string) {
    markSaving();
    update((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    setTimeout(() => markSaved(), 100);
  }

  function handleSave() {
    markSaving();
    setTimeout(() => markSaved(), 300);
  }

  const report = judgeTasks(day.tasks, config.objetivos);

  return (
    <>
      <div className="card">
        <div className="row-between">
          <h2>O que você fez hoje</h2>
          <SaveStatusButton status={status} onClick={handleSave} />
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="O que foi feito"
            value={oQueFoiFeito}
            onChange={(e) => setOQueFoiFeito(e.target.value)}
            style={{ flex: 2, minWidth: 180 }}
          />
          <input
            type="text"
            placeholder="Como (opcional)"
            value={como}
            onChange={(e) => setComo(e.target.value)}
            style={{ flex: 2, minWidth: 180 }}
          />
          <button className="btn btn-primary" onClick={addTask}>
            Adicionar
          </button>
        </div>

        {day.tasks.length === 0 ? (
          <p className="muted" style={{ marginTop: 12 }}>
            Nenhuma tarefa registrada ainda.
          </p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {day.tasks.map((t) => (
              <div key={t.id} className="list-item">
                <div>
                  <strong>{t.oQueFoiFeito}</strong>
                  {t.como && <div className="muted">{t.como}</div>}
                </div>
                <button className="btn btn-small" onClick={() => removeTask(t.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="row-between">
          <h2>Julgamento de performance do dia</h2>
          <JudgmentBadge judgment={report.julgamento} />
        </div>
        <p className="muted" style={{ marginTop: 4 }}>
          Calibrado pelos seus objetivos: {config.objetivos.join(", ")}.
        </p>
        <p className="analysis-text" style={{ marginTop: 10 }}>
          {report.texto}
        </p>
      </div>
    </>
  );
}
