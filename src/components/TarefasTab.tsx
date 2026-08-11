import { useState } from "react";
import { useDayData } from "../hooks/useDayData";
import { useConfig } from "../hooks/useConfig";
import { judgeTasks, analyzeTasksInDepth } from "../utils/analysis";
import { useSaveStatus } from "../hooks/useSaveStatus";
import JudgmentBadge from "./JudgmentBadge";
import SaveStatusButton from "./SaveStatusButton";

export default function TarefasTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config } = useConfig();
  const { status, markSaving, markSaved } = useSaveStatus();
  const [oQueFoiFeito, setOQueFoiFeito] = useState("");
  const [como, setComo] = useState("");
  const [mostrarAnaliseProfunda, setMostrarAnaliseProfunda] = useState(false);

  const analiseDetalhada = analyzeTasksInDepth(day.tasks, config.objetivos);

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
        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={() => setMostrarAnaliseProfunda(!mostrarAnaliseProfunda)}>
            {mostrarAnaliseProfunda ? "▼ Ocultar análise profunda" : "▶ Análise profunda"}
          </button>
        </div>
      </div>

      {mostrarAnaliseProfunda && (
        <div className="card">
          <h2>🔍 Análise Profunda das Tarefas</h2>

          {/* Resumo de Tarefas */}
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Resumo</div>
            <p>
              <strong>Tarefas registradas:</strong> {analiseDetalhada.tarefasRegistradas}
            </p>
            <p>
              <strong>Com detalhe suficiente ("como"):</strong> {analiseDetalhada.tarefasComDetalhe} ({(analiseDetalhada.proporcaoDetalhe * 100).toFixed(0)}%)
            </p>
            <div style={{ marginTop: 8, padding: 12, backgroundColor: "#f0fdf4", borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>
                <strong>Análise construtiva:</strong> {analiseDetalhada.analiseConstrutiva}
              </p>
            </div>
          </div>

          {/* Objetivos */}
          {analiseDetalhada.objetivo.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="section-title">Cobertura de Objetivos</div>
              {analiseDetalhada.objetivo.map((obj) => (
                <div key={obj.nome} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{obj.atendido ? "✓" : "✗"}</span>
                    <span style={{ fontWeight: "bold", color: obj.atendido ? "#27ae60" : "#e74c3c" }}>{obj.nome}</span>
                  </div>
                  {obj.tarefasRelacionadas.length > 0 && (
                    <p className="muted" style={{ marginTop: 4, fontSize: "0.9rem" }}>
                      Tarefas: {obj.tarefasRelacionadas.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tarefas Individuais */}
          {analiseDetalhada.tarefasIndividuais.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="section-title">Análise de Cada Tarefa</div>
              {analiseDetalhada.tarefasIndividuais.map((t, i) => {
                const qualidadeColor = {
                  excelente: "#27ae60",
                  boa: "#2980b9",
                  adequada: "#f39c12",
                  fraca: "#e67e22",
                  muito_fraca: "#e74c3c",
                };
                return (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
                      <span style={{ color: qualidadeColor[t.qualidade], fontWeight: "bold" }}>
                        {t.qualidade === "excelente" ? "★★★" : t.qualidade === "boa" ? "★★" : t.qualidade === "adequada" ? "★" : "—"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <strong>{t.tarefa}</strong>
                        {t.como !== "(não descrito)" && <div className="muted">{t.como}</div>}
                        <div style={{ marginTop: 4, fontSize: "0.85rem", color: qualidadeColor[t.qualidade] }}>
                          {t.observacoes.join("; ")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Padrões Observados */}
          {analiseDetalhada.padroes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="section-title">Padrões Observados</div>
              <ul style={{ margin: "0 0 0 20px" }}>
                {analiseDetalhada.padroes.map((p, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {analiseDetalhada.recomendacoes.length > 0 && (
            <div>
              <div className="section-title">Recomendações para Melhorar</div>
              <div style={{ padding: 12, backgroundColor: "#fff9e6", borderLeft: "4px solid #f39c12", borderRadius: 4 }}>
                <ul style={{ margin: "0 0 0 20px" }}>
                  {analiseDetalhada.recomendacoes.map((rec, i) => (
                    <li key={i} style={{ marginBottom: 8, lineHeight: 1.5 }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
