import { useState } from "react";
import { useConfig } from "../hooks/useConfig";
import { DEFAULT_WEEKLY_GOALS, NUTRIENT_META, NUTRIENT_ORDER, getWeeklyGoals } from "../data/nutrientGoals";
import type { NutrientKey, IngredientNutrition, Supplement } from "../types";
import type { Profile } from "../utils/storage";

export default function PerfilMetas({ onClose }: { onClose: () => void }) {
  const { config, update } = useConfig();
  const weeklyGoals = getWeeklyGoals(config);

  const [objetivosText, setObjetivosText] = useState(config.objetivos.join(", "));
  const [newIng, setNewIng] = useState({ nome: "", categoria: "", porcao: "", calorias: "", proteina: "" });
  const [newSup, setNewSup] = useState({ nome: "", dose: "" });

  function setProfileField<K extends keyof Profile>(key: K, value: Profile[K]) {
    update((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  }

  function setGoal(key: NutrientKey, value: string) {
    update((prev) => ({
      ...prev,
      nutrientGoalsWeekly: { ...prev.nutrientGoalsWeekly, [key]: value === "" ? undefined : Number(value) },
    }));
  }

  function saveObjetivos() {
    update((prev) => ({
      ...prev,
      objetivos: objetivosText.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  }

  function addCustomIngredient() {
    if (!newIng.nome.trim()) return;
    const ing: IngredientNutrition = {
      id: `custom-${crypto.randomUUID()}`,
      nome: newIng.nome.trim(),
      categoria: newIng.categoria.trim() || "Outros",
      porcaoDescricao: newIng.porcao.trim() || "1 porção",
      porPorcao: { calorias: Number(newIng.calorias) || 0, proteina: Number(newIng.proteina) || 0 },
      fonte: "estimativa_padrao",
    };
    update((prev) => ({ ...prev, customIngredients: [...prev.customIngredients, ing] }));
    setNewIng({ nome: "", categoria: "", porcao: "", calorias: "", proteina: "" });
  }

  function removeCustomIngredient(id: string) {
    update((prev) => ({ ...prev, customIngredients: prev.customIngredients.filter((i) => i.id !== id) }));
  }

  function addCustomSupplement() {
    if (!newSup.nome.trim()) return;
    const sup: Supplement = { id: `custom-${crypto.randomUUID()}`, nome: newSup.nome.trim(), doseDescricao: newSup.dose.trim() || "1 dose" };
    update((prev) => ({ ...prev, customSupplements: [...prev.customSupplements, sup] }));
    setNewSup({ nome: "", dose: "" });
  }

  function removeCustomSupplement(id: string) {
    update((prev) => ({ ...prev, customSupplements: prev.customSupplements.filter((s) => s.id !== id) }));
  }

  return (
    <>
      <div className="row-between">
        <h2>Perfil / metas</h2>
        <button className="btn" onClick={onClose}>
          ← Voltar
        </button>
      </div>

      <div className="card">
        <h2>Perfil</h2>
        <p className="muted">Usado para calcular metas de calorias, carboidratos e gordura.</p>
        <div className="field-grid" style={{ marginTop: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Peso (kg)</span>
            <input type="number" value={config.profile.pesoKg} onChange={(e) => setProfileField("pesoKg", Number(e.target.value))} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Altura (cm)</span>
            <input type="number" value={config.profile.alturaCm} onChange={(e) => setProfileField("alturaCm", Number(e.target.value))} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Idade</span>
            <input type="number" value={config.profile.idade} onChange={(e) => setProfileField("idade", Number(e.target.value))} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Sexo</span>
            <select value={config.profile.sexo} onChange={(e) => setProfileField("sexo", e.target.value as Profile["sexo"])}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Nível de atividade</span>
            <select value={config.profile.nivelAtividade} onChange={(e) => setProfileField("nivelAtividade", e.target.value as Profile["nivelAtividade"])}>
              <option value="sedentario">Sedentário</option>
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="ativo">Ativo</option>
              <option value="muito_ativo">Muito ativo</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="muted">Déficit calórico (%)</span>
            <input
              type="number"
              value={config.profile.deficitCaloricoPercent}
              onChange={(e) => setProfileField("deficitCaloricoPercent", Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="card">
        <h2>Objetivos pessoais</h2>
        <p className="muted">Usados para calibrar o julgamento de tarefas. Separe por vírgula.</p>
        <textarea rows={2} value={objetivosText} onChange={(e) => setObjetivosText(e.target.value)} style={{ marginTop: 8 }} />
        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={saveObjetivos}>
          Salvar objetivos
        </button>
      </div>

      <div className="card">
        <h2>Metas semanais por nutriente</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nutriente</th>
                <th>Meta semanal atual</th>
                <th>Override</th>
              </tr>
            </thead>
            <tbody>
              {NUTRIENT_ORDER.map((key) => (
                <tr key={key}>
                  <td>
                    {NUTRIENT_META[key].label} ({NUTRIENT_META[key].unit})
                  </td>
                  <td className="muted">{weeklyGoals[key].toFixed(1)}</td>
                  <td>
                    <input
                      type="number"
                      placeholder={String(DEFAULT_WEEKLY_GOALS[key])}
                      value={config.nutrientGoalsWeekly[key] ?? ""}
                      onChange={(e) => setGoal(key, e.target.value)}
                      style={{ width: 100 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Ingredientes personalizados</h2>
        <p className="muted">Some à base de "adicionar rápido" quando um item não estiver no catálogo.</p>
        <div className="row" style={{ marginTop: 10 }}>
          <input type="text" placeholder="Nome" value={newIng.nome} onChange={(e) => setNewIng({ ...newIng, nome: e.target.value })} style={{ flex: 2, minWidth: 140 }} />
          <input type="text" placeholder="Categoria" value={newIng.categoria} onChange={(e) => setNewIng({ ...newIng, categoria: e.target.value })} style={{ flex: 1, minWidth: 100 }} />
          <input type="text" placeholder="Porção (ex: 100g)" value={newIng.porcao} onChange={(e) => setNewIng({ ...newIng, porcao: e.target.value })} style={{ flex: 1, minWidth: 100 }} />
          <input type="number" placeholder="Kcal" value={newIng.calorias} onChange={(e) => setNewIng({ ...newIng, calorias: e.target.value })} style={{ width: 80 }} />
          <input type="number" placeholder="Proteína g" value={newIng.proteina} onChange={(e) => setNewIng({ ...newIng, proteina: e.target.value })} style={{ width: 100 }} />
          <button className="btn btn-primary" onClick={addCustomIngredient}>
            Adicionar
          </button>
        </div>
        {config.customIngredients.map((i) => (
          <div key={i.id} className="list-item">
            <span>
              {i.nome} <span className="muted">({i.porcaoDescricao})</span>
            </span>
            <button className="btn btn-small" onClick={() => removeCustomIngredient(i.id)}>
              remover
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Suplementos personalizados</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <input type="text" placeholder="Nome" value={newSup.nome} onChange={(e) => setNewSup({ ...newSup, nome: e.target.value })} style={{ flex: 2, minWidth: 140 }} />
          <input type="text" placeholder="Dose" value={newSup.dose} onChange={(e) => setNewSup({ ...newSup, dose: e.target.value })} style={{ flex: 1, minWidth: 100 }} />
          <button className="btn btn-primary" onClick={addCustomSupplement}>
            Adicionar
          </button>
        </div>
        {config.customSupplements.map((s) => (
          <div key={s.id} className="list-item">
            <span>
              {s.nome} <span className="muted">({s.doseDescricao})</span>
            </span>
            <button className="btn btn-small" onClick={() => removeCustomSupplement(s.id)}>
              remover
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
