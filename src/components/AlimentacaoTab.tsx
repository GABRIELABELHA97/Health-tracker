import { useMemo, useState } from "react";
import { useDayData } from "../hooks/useDayData";
import { getAllSupplements } from "../data/supplements";
import { getAllCategories, getAllIngredients } from "../data/ingredients";
import { NUTRIENT_META, NUTRIENT_ORDER } from "../data/nutrientGoals";
import type { FoodLogItem, NutrientKey } from "../types";
import { computeCalorieBalance, computeDayNutrientTotals } from "../utils/analysis";
import { useConfig } from "../hooks/useConfig";

const REFEICOES: FoodLogItem["refeicao"][] = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia", "Outro"];

export default function AlimentacaoTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config } = useConfig();
  const [refeicaoSelecionada, setRefeicaoSelecionada] = useState<FoodLogItem["refeicao"]>("Almoço");
  const [catalogoId, setCatalogoId] = useState("");
  const [nome, setNome] = useState("");
  const [qtd, setQtd] = useState("");
  const [kcal, setKcal] = useState("");
  const [proteina, setProteina] = useState("");
  const [medNome, setMedNome] = useState("");
  const [medDose, setMedDose] = useState("");

  const totals = computeDayNutrientTotals(day);
  const calorieBalance = computeCalorieBalance(date, config);
  const SUPPLEMENTS = useMemo(() => getAllSupplements(config.customSupplements), [config.customSupplements]);
  const INGREDIENTS = useMemo(() => getAllIngredients(config.customIngredients), [config.customIngredients]);
  const INGREDIENT_CATEGORIES = useMemo(() => getAllCategories(config.customIngredients), [config.customIngredients]);

  function toggleSupplement(id: string) {
    update((prev) => ({
      ...prev,
      suplementosTomados: prev.suplementosTomados.includes(id)
        ? prev.suplementosTomados.filter((s) => s !== id)
        : [...prev.suplementosTomados, id],
    }));
  }

  function addFromCatalog(id: string) {
    const ing = INGREDIENTS.find((i) => i.id === id);
    if (!ing) return;
    update((prev) => ({
      ...prev,
      foodLog: [
        ...prev.foodLog,
        {
          id: crypto.randomUUID(),
          refeicao: refeicaoSelecionada,
          nome: ing.nome,
          quantidade: ing.porcaoDescricao,
          nutrientes: ing.porPorcao,
          ingredienteId: ing.id,
        },
      ],
    }));
  }

  function addManualItem() {
    if (!nome.trim()) return;
    const catalogIng = INGREDIENTS.find((i) => i.id === catalogoId);
    const nutrientes = catalogIng
      ? catalogIng.porPorcao
      : { calorias: Number(kcal) || 0, proteina: Number(proteina) || 0 };
    update((prev) => ({
      ...prev,
      foodLog: [
        ...prev.foodLog,
        {
          id: crypto.randomUUID(),
          refeicao: refeicaoSelecionada,
          nome: nome.trim(),
          quantidade: qtd.trim() || (catalogIng?.porcaoDescricao ?? ""),
          nutrientes,
          ingredienteId: catalogIng?.id,
        },
      ],
    }));
    setNome("");
    setQtd("");
    setKcal("");
    setProteina("");
    setCatalogoId("");
  }

  function removeFoodItem(id: string) {
    update((prev) => ({ ...prev, foodLog: prev.foodLog.filter((f) => f.id !== id) }));
  }

  function addMedication() {
    if (!medNome.trim()) return;
    update((prev) => ({
      ...prev,
      medications: [...prev.medications, { id: crypto.randomUUID(), nome: medNome.trim(), dose: medDose.trim() || undefined }],
    }));
    setMedNome("");
    setMedDose("");
  }

  function removeMedication(id: string) {
    update((prev) => ({ ...prev, medications: prev.medications.filter((m) => m.id !== id) }));
  }

  function setAppleWatchField(field: keyof typeof day.appleWatch, value: string) {
    update((prev) => ({
      ...prev,
      appleWatch: { ...prev.appleWatch, [field]: value === "" ? undefined : Number(value) },
    }));
  }

  function setManualNutrient(key: NutrientKey, value: string) {
    update((prev) => ({
      ...prev,
      nutrientesManuais: { ...prev.nutrientesManuais, [key]: value === "" ? undefined : Number(value) },
    }));
  }

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof INGREDIENTS>();
    for (const cat of INGREDIENT_CATEGORIES) map.set(cat, INGREDIENTS.filter((i) => i.categoria === cat));
    return map;
  }, [INGREDIENTS, INGREDIENT_CATEGORIES]);

  return (
    <>
      <div className="card">
        <h2>Suplementos de hoje</h2>
        <p className="muted">Um clique registra a dose padrão de cada um (sempre a mesma, todo dia).</p>
        <div className="chip-grid" style={{ marginTop: 10 }}>
          {SUPPLEMENTS.map((s) => {
            const taken = day.suplementosTomados.includes(s.id);
            return (
              <button
                key={s.id}
                className={`chip ${taken ? "taken" : ""}`}
                title={s.doseDescricao}
                onClick={() => toggleSupplement(s.id)}
              >
                {taken ? "✓ " : ""}
                {s.nome} — {s.doseDescricao}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2>Adicionar rápido</h2>
        <p className="muted">Itens já comprados/usados antes — clique pra adicionar na refeição selecionada abaixo.</p>
        <div className="row" style={{ margin: "10px 0" }}>
          <label className="muted">Refeição selecionada:</label>
          <select value={refeicaoSelecionada} onChange={(e) => setRefeicaoSelecionada(e.target.value as FoodLogItem["refeicao"])}>
            {REFEICOES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {[...byCategory.entries()].map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 10 }}>
            <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 6 }}>
              {cat}
            </div>
            <div className="chip-grid">
              {items.map((ing) => (
                <button key={ing.id} className="chip" title={`${ing.porcaoDescricao}${ing.observacao ? " — " + ing.observacao : ""}`} onClick={() => addFromCatalog(ing.id)}>
                  {ing.nome}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>O que você comeu hoje</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <select value={refeicaoSelecionada} onChange={(e) => setRefeicaoSelecionada(e.target.value as FoodLogItem["refeicao"])}>
            {REFEICOES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select value={catalogoId} onChange={(e) => setCatalogoId(e.target.value)}>
            <option value="">— item do catálogo (opcional) —</option>
            {INGREDIENTS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <input type="text" placeholder="Nome do item" value={nome} onChange={(e) => setNome(e.target.value)} style={{ flex: 2, minWidth: 140 }} />
          <input type="text" placeholder="Qtd (ex: 2 unid)" value={qtd} onChange={(e) => setQtd(e.target.value)} style={{ flex: 1, minWidth: 100 }} />
          <input type="number" placeholder="kcal" value={kcal} onChange={(e) => setKcal(e.target.value)} disabled={!!catalogoId} style={{ width: 90 }} />
          <input type="number" placeholder="Proteína g" value={proteina} onChange={(e) => setProteina(e.target.value)} disabled={!!catalogoId} style={{ width: 100 }} />
          <button className="btn btn-primary" onClick={addManualItem}>
            Adicionar
          </button>
        </div>

        {day.foodLog.length === 0 ? (
          <p className="muted" style={{ marginTop: 12 }}>
            Nenhum item registrado ainda.
          </p>
        ) : (
          <div className="table-scroll" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Refeição</th>
                  <th>Kcal</th>
                  <th>Prot.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {day.foodLog.map((f, idx) => (
                  <tr key={f.id}>
                    <td>{idx + 1}</td>
                    <td>
                      {f.nome} <span className="muted">({f.quantidade})</span>
                    </td>
                    <td>{f.refeicao}</td>
                    <td>{(f.nutrientes.calorias ?? 0).toFixed(0)}</td>
                    <td>{(f.nutrientes.proteina ?? 0).toFixed(1)}g</td>
                    <td>
                      <button className="btn btn-small" onClick={() => removeFoodItem(f.id)}>
                        remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="row-between" style={{ marginTop: 12 }}>
          <strong>Total consumido</strong>
          <strong>
            ~{(totals.calorias ?? 0).toFixed(0)} kcal / ~{(totals.proteina ?? 0).toFixed(1)}g proteína
          </strong>
        </div>

        <div className="section-title">Preenchimento manual por nutriente (somado ao restante do dia)</div>
        <p className="muted">
          Use quando souber o total de um nutriente pelo dia (ex: contagem à parte) sem lançar item por item.
        </p>
        <div className="field-grid" style={{ marginTop: 8 }}>
          {NUTRIENT_ORDER.map((key) => (
            <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="muted" style={{ fontSize: "0.78rem" }}>
                {NUTRIENT_META[key].label} ({NUTRIENT_META[key].unit})
              </span>
              <input
                type="number"
                value={day.nutrientesManuais[key] ?? ""}
                onChange={(e) => setManualNutrient(key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Medicações registradas hoje</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <input type="text" placeholder="Nome" value={medNome} onChange={(e) => setMedNome(e.target.value)} style={{ flex: 2, minWidth: 140 }} />
          <input type="text" placeholder="Dose (opcional)" value={medDose} onChange={(e) => setMedDose(e.target.value)} style={{ flex: 1, minWidth: 100 }} />
          <button className="btn btn-primary" onClick={addMedication}>
            Adicionar
          </button>
        </div>
        {day.medications.length === 0 ? (
          <p className="muted" style={{ marginTop: 12 }}>
            Registro apenas informativo — ajustes de dose ou horário são decisão sua e do médico prescritor.
          </p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {day.medications.map((m) => (
              <div key={m.id} className="list-item">
                <span>
                  {m.nome} {m.dose && <span className="muted">— {m.dose}</span>}
                </span>
                <button className="btn btn-small" onClick={() => removeMedication(m.id)}>
                  remover
                </button>
              </div>
            ))}
            <p className="muted" style={{ marginTop: 8 }}>
              Registro apenas informativo — ajustes de dose ou horário são decisão sua e do médico prescritor.
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Dados do Apple Watch</h2>
        <p className="muted">Preenchimento manual.</p>
        <div className="field-grid" style={{ marginTop: 10 }}>
          <AWField label="Sono (h, ex: 7.5)" value={day.appleWatch.sonoHoras} onChange={(v) => setAppleWatchField("sonoHoras", v)} />
          <AWField label="Qualidade sono (%)" value={day.appleWatch.qualidadeSono} onChange={(v) => setAppleWatchField("qualidadeSono", v)} />
          <AWField label="Calorias movimento" value={day.appleWatch.caloriasMovimento} onChange={(v) => setAppleWatchField("caloriasMovimento", v)} />
          <AWField label="Energia repouso" value={day.appleWatch.energiaRepouso} onChange={(v) => setAppleWatchField("energiaRepouso", v)} />
          <AWField label="Exercício (min)" value={day.appleWatch.exercicioMin} onChange={(v) => setAppleWatchField("exercicioMin", v)} />
          <AWField label="Tempo em pé (h)" value={day.appleWatch.tempoEmPeHoras} onChange={(v) => setAppleWatchField("tempoEmPeHoras", v)} />
          <AWField label="Passos" value={day.appleWatch.passos} onChange={(v) => setAppleWatchField("passos", v)} />
          <AWField label="Distância (km)" value={day.appleWatch.distanciaKm} onChange={(v) => setAppleWatchField("distanciaKm", v)} />
          <AWField label="VO2 máx." value={day.appleWatch.vo2max} onChange={(v) => setAppleWatchField("vo2max", v)} />
          <AWField label="Água (L)" value={day.appleWatch.aguaL} onChange={(v) => setAppleWatchField("aguaL", v)} />
        </div>
      </div>

      <div className="card">
        <h2>Balanço calórico</h2>
        <p style={{ marginTop: 8 }}>
          Consumido: ~{calorieBalance.consumido.toFixed(0)} kcal — Gasto estimado: ~{calorieBalance.gastoEstimado.toFixed(0)} kcal (
          {calorieBalance.fonteGasto === "apple_watch" ? "Apple Watch" : "perfil"})
        </p>
        <p style={{ fontWeight: 700 }}>
          {calorieBalance.balanco <= 0
            ? `Déficit de ${Math.abs(calorieBalance.balanco).toFixed(0)} kcal`
            : `Superávit de ${calorieBalance.balanco.toFixed(0)} kcal`}
        </p>
      </div>
    </>
  );
}

function AWField({ label, value, onChange }: { label: string; value: number | undefined; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="muted" style={{ fontSize: "0.78rem" }}>
        {label}
      </span>
      <input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
