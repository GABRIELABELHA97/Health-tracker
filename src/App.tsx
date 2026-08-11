import { useState } from "react";
import { addDays, formatLongDate, toISODate } from "./utils/dates";
import { listAllDayKeys } from "./utils/storage";
import { getStorageWarning } from "./utils/storageSafe";
import TarefasTab from "./components/TarefasTab";
import AlimentacaoTab from "./components/AlimentacaoTab";
import NutrientesTab from "./components/NutrientesTab";
import DesmameTab from "./components/DesmameTab";
import EstudosTab from "./components/EstudosTab";
import ResumoTab from "./components/ResumoTab";
import PerfilMetas from "./components/PerfilMetas";

type TabId = "tarefas" | "alimentacao" | "nutrientes" | "desmame" | "estudos" | "resumo";

const TABS: { id: TabId; label: string }[] = [
  { id: "tarefas", label: "Tarefas" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "nutrientes", label: "Nutrientes" },
  { id: "desmame", label: "Desmame" },
  { id: "estudos", label: "Estudos" },
  { id: "resumo", label: "Resumo" },
];

export default function App() {
  const [view, setView] = useState<"dia" | "historico">("dia");
  const [showPerfil, setShowPerfil] = useState(false);
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [tab, setTab] = useState<TabId>("tarefas");

  if (showPerfil) {
    return (
      <>
        <h1>Acompanhamento diário</h1>
        <PerfilMetas onClose={() => setShowPerfil(false)} />
      </>
    );
  }

  const storageWarning = getStorageWarning();

  return (
    <>
      <h1>Acompanhamento diário</h1>

      {storageWarning && (
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: 4,
          padding: 12,
          marginBottom: 16,
          color: "#856404",
          fontSize: "0.9rem"
        }}>
          {storageWarning}
        </div>
      )}

      <div className="row" style={{ marginBottom: 16 }}>
        <button
          className={`pill-tab ${view === "dia" ? "active" : ""}`}
          style={{ flex: 1 }}
          onClick={() => setView("dia")}
        >
          Dia
        </button>
        <button
          className={`pill-tab ${view === "historico" ? "active" : ""}`}
          style={{ flex: 1 }}
          onClick={() => setView("historico")}
        >
          Histórico
        </button>
      </div>

      {view === "dia" && (
        <>
          <div className="row-between" style={{ marginBottom: 16 }}>
            <div className="row">
              <button className="btn" onClick={() => setDate((d) => addDays(d, -1))}>
                ←
              </button>
              <span className="muted">{formatLongDate(date)}</span>
            </div>
            <div className="row">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn" onClick={() => setDate((d) => addDays(d, 1))}>
                →
              </button>
            </div>
          </div>

          <nav className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`pill-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="row-between" style={{ marginBottom: 16 }}>
            <span className="muted">Análise gerada por regras simples (sem API key)</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPerfil(true); }}>
              Perfil / metas
            </a>
          </div>

          {tab === "tarefas" && <TarefasTab date={date} />}
          {tab === "alimentacao" && <AlimentacaoTab date={date} />}
          {tab === "nutrientes" && <NutrientesTab date={date} />}
          {tab === "desmame" && <DesmameTab date={date} />}
          {tab === "estudos" && <EstudosTab date={date} />}
          {tab === "resumo" && <ResumoTab date={date} />}
        </>
      )}

      {view === "historico" && <Historico onSelectDate={(d) => { setDate(d); setView("dia"); }} />}
    </>
  );
}

function Historico({ onSelectDate }: { onSelectDate: (date: string) => void }) {
  const dates = listAllDayKeys().slice().reverse();
  return (
    <div className="card">
      <h2>Histórico</h2>
      {dates.length === 0 && <p className="muted">Nenhum dia registrado ainda.</p>}
      {dates.map((d) => (
        <div key={d} className="list-item">
          <span>{formatLongDate(d)}</span>
          <button className="btn btn-small" onClick={() => onSelectDate(d)}>
            Abrir
          </button>
        </div>
      ))}
    </div>
  );
}
