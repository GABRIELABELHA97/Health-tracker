import { useState, useMemo } from "react";
import { useDayData } from "../hooks/useDayData";
import { useConfig } from "../hooks/useConfig";
import { computeDayNutrientTotals, computeCalorieBalance } from "../utils/analysis";
import { getAllIngredients } from "../data/ingredients";
import { NUTRIENT_META, NUTRIENT_ORDER, getWeeklyGoals } from "../data/nutrientGoals";
import type { FoodLogItem, NutrientKey } from "../types";
import { useSaveStatus } from "../hooks/useSaveStatus";
import SaveStatusButton from "./SaveStatusButton";

const REFEICOES: FoodLogItem["refeicao"][] = ["Café da manhã", "Almoço", "Lanche", "Jantar"];

interface MealPlan {
  [key: string]: string[]; // refeicao -> list of ingredient IDs
}

export default function PlanejadorCardapioTab({ date }: { date: string }) {
  const { day, update } = useDayData(date);
  const { config } = useConfig();
  const { status, markSaving, markSaved } = useSaveStatus();
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [selectedMeal, setSelectedMeal] = useState<FoodLogItem["refeicao"]>("Café da manhã");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);

  const INGREDIENTS = useMemo(() => getAllIngredients(config.customIngredients), [config.customIngredients]);
  const totals = computeDayNutrientTotals(day);
  const calorieBalance = computeCalorieBalance(date, config);
  const weeklyGoals = getWeeklyGoals(config);

  // Calculate nutrient gaps (what's missing for daily targets)
  const gaps = useMemo(() => {
    const dailyGoals = Object.fromEntries(
      Object.entries(weeklyGoals).map(([key, value]) => [key, value / 7])
    ) as Record<string, number>;

    const gaps: Record<string, number> = {};
    for (const key of NUTRIENT_ORDER) {
      const goal = dailyGoals[key] ?? 0;
      const consumed = totals[key as keyof typeof totals] ?? 0;
      gaps[key] = Math.max(0, goal - consumed);
    }
    return gaps;
  }, [totals, weeklyGoals]);

  // Calculate remaining calories for meals
  const remainingCalories = Math.max(0, calorieBalance.gastoEstimado - (totals.calorias ?? 0));

  // Get filtered ingredients based on search
  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter((ing) =>
      ing.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [INGREDIENTS, searchTerm]);

  // Get ingredients that help close specific nutrient gaps
  const suggestedForGaps = useMemo(() => {
    if (!selectedNutrient || gaps[selectedNutrient] <= 0) return [];

    return INGREDIENTS.filter((ing) => {
      const nutrientAmount = ing.porPorcao[selectedNutrient as keyof typeof ing.porPorcao] ?? 0;
      return nutrientAmount > 0;
    }).sort((a, b) => {
      const amountA = a.porPorcao[selectedNutrient as keyof typeof a.porPorcao] ?? 0;
      const amountB = b.porPorcao[selectedNutrient as keyof typeof b.porPorcao] ?? 0;
      return amountB - amountA;
    }).slice(0, 10);
  }, [selectedNutrient, gaps, INGREDIENTS]);

  // Meal-specific prioritization tips
  const getMealTips = (meal: FoodLogItem["refeicao"]): string[] => {
    const tips: string[] = [];
    const objectives = config.objetivos.join(" ").toLowerCase();

    if (meal === "Café da manhã") {
      tips.push("🥛 Priorize proteína máxima (20-30g) para iniciar o dia com saciedade");
      if (objectives.includes("cognição")) tips.push("🧠 Carboidratos complexos ajudam a cognição");
      tips.push("⏰ Refeição principal do dia — invista tempo/qualidade aqui");
    } else if (meal === "Almoço") {
      tips.push("🥗 Refeição completa: proteína, carboidrato e vegetais");
      tips.push("📊 Aproveite a maior flexibilidade calórica do dia");
      if (objectives.includes("composição")) tips.push("💪 Segunda melhor janela para proteína alta");
    } else if (meal === "Lanche") {
      tips.push("⚡ Refeição leve (200-300 kcal)");
      tips.push("💧 Bebidas proteicas funcionam bem aqui");
      tips.push("🍎 Fácil de fazer — não é hora de cozinhar");
    } else if (meal === "Jantar") {
      tips.push("🌙 Priorize proteína (20-25g) + fibra");
      tips.push("⏳ Refeição mais leve que almoço (150-300 kcal)");
      tips.push("😴 Evite excesso de carboidrato refinado próximo ao dormir");
    }

    return tips;
  };

  const addToMealPlan = (ingredientId: string) => {
    setMealPlan((prev) => ({
      ...prev,
      [selectedMeal]: [...(prev[selectedMeal] ?? []), ingredientId],
    }));
  };

  const removeMealPlanItem = (meal: FoodLogItem["refeicao"], index: number) => {
    setMealPlan((prev) => ({
      ...prev,
      [meal]: (prev[meal] ?? []).filter((_, i) => i !== index),
    }));
  };

  const saveMealPlan = () => {
    markSaving();
    // Add all planned items to foodLog
    const newItems: FoodLogItem[] = [];
    for (const [meal, ingredientIds] of Object.entries(mealPlan)) {
      for (const ingId of ingredientIds) {
        const ing = INGREDIENTS.find((i) => i.id === ingId);
        if (ing) {
          newItems.push({
            id: crypto.randomUUID(),
            refeicao: meal as FoodLogItem["refeicao"],
            nome: ing.nome,
            quantidade: ing.porcaoDescricao,
            nutrientes: ing.porPorcao,
            ingredienteId: ing.id,
          });
        }
      }
    }

    update((prev) => ({
      ...prev,
      foodLog: [...prev.foodLog, ...newItems],
    }));

    setMealPlan({});
    setTimeout(() => markSaved(), 100);
  };

  const getMealPlanTotals = () => {
    let totalsCalc: Record<string, number> = {};
    for (const ingredientIds of Object.values(mealPlan)) {
      for (const ingId of ingredientIds) {
        const ing = INGREDIENTS.find((i) => i.id === ingId);
        if (ing) {
          for (const [key, value] of Object.entries(ing.porPorcao)) {
            totalsCalc[key] = (totalsCalc[key] ?? 0) + (value as number);
          }
        }
      }
    }
    return totalsCalc;
  };

  const planTotals = getMealPlanTotals();
  const mealsWithItems = REFEICOES.filter((meal) => (mealPlan[meal] ?? []).length > 0);

  return (
    <>
      {/* Current Status */}
      <div className="card">
        <div className="row-between">
          <h2>🍽️ Planejador de Cardápio</h2>
          <SaveStatusButton status={status} onClick={() => {}} />
        </div>
        <p className="muted" style={{ marginTop: 4 }}>
          Construa seu cardápio do dia com base nos nutrientes que faltam e suas metas calóricas.
        </p>

        {/* Calorias e Nutrientes */}
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 12, backgroundColor: "#f0fdf4", borderRadius: 6 }}>
            <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4 }}>BALANÇO CALÓRICO</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#27ae60" }}>
              {remainingCalories.toFixed(0)} kcal
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
              Gasto: {calorieBalance.gastoEstimado.toFixed(0)} | Consumido: {(totals.calorias ?? 0).toFixed(0)}
            </div>
          </div>

          <div style={{ padding: 12, backgroundColor: "#f0f4f8", borderRadius: 6 }}>
            <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4 }}>PLANO ATUAL</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#2980b9" }}>
              {(planTotals.calorias ?? 0).toFixed(0)} kcal
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
              {mealsWithItems.length} refeição(ões) com itens
            </div>
          </div>
        </div>
      </div>

      {/* Nutrient Gaps */}
      <div className="card">
        <div className="section-title">Nutrientes que faltam hoje</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
          {NUTRIENT_ORDER.filter((key) => gaps[key] > 0)
            .slice(0, 6)
            .map((key) => {
              const meta = NUTRIENT_META[key];
              const gap = gaps[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedNutrient(selectedNutrient === key ? null : key)}
                  style={{
                    padding: 10,
                    backgroundColor: selectedNutrient === key ? "#e8f4f8" : "#f5f7fa",
                    border: selectedNutrient === key ? "2px solid #2980b9" : "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{meta.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
                    Faltam: {gap.toFixed(1)}{meta.unit}
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Meal Selector and Builder */}
      <div className="card">
        <div className="section-title">Selecione uma refeição</div>
        <div className="row" style={{ marginBottom: 16, gap: 8 }}>
          {REFEICOES.map((meal) => (
            <button
              key={meal}
              className={`pill-tab ${selectedMeal === meal ? "active" : ""}`}
              onClick={() => setSelectedMeal(meal)}
              style={{ flex: 1 }}
            >
              {meal}
            </button>
          ))}
        </div>

        {/* Meal Tips */}
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: "#fffbea", borderRadius: 6 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#f39c12", marginBottom: 8 }}>💡 Dicas para {selectedMeal}</div>
          {getMealTips(selectedMeal).map((tip, idx) => (
            <div key={idx} style={{ fontSize: "0.9rem", marginBottom: 4, color: "#333" }}>
              {tip}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Buscar alimentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: "8px 10px",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        />

        {/* Suggested Foods for Selected Nutrient */}
        {selectedNutrient && suggestedForGaps.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#666", marginBottom: 8, textTransform: "uppercase" }}>
              Alimentos ricos em {NUTRIENT_META[selectedNutrient as NutrientKey].label}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {suggestedForGaps.map((ing) => {
                const amount = ing.porPorcao[selectedNutrient as keyof typeof ing.porPorcao] ?? 0;
                return (
                  <button
                    key={ing.id}
                    onClick={() => addToMealPlan(ing.id)}
                    style={{
                      padding: 10,
                      backgroundColor: "#e8f4f8",
                      border: "1px solid #2980b9",
                      borderRadius: 6,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{ing.nome}</div>
                    <div style={{ fontSize: "0.75rem", color: "#2980b9", marginTop: 4 }}>
                      {amount.toFixed(1)}{NUTRIENT_META[selectedNutrient as NutrientKey].unit}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 2 }}>
                      {ing.porPorcao.calorias?.toFixed(0) ?? 0} kcal
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Ingredients */}
        {searchTerm && (
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#666", marginBottom: 8, textTransform: "uppercase" }}>
              Resultados da busca ({filteredIngredients.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {filteredIngredients.slice(0, 12).map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => addToMealPlan(ing.id)}
                  style={{
                    padding: 10,
                    backgroundColor: "#f5f7fa",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{ing.nome}</div>
                  <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 4 }}>
                    {ing.porPorcao.calorias?.toFixed(0) ?? 0} kcal | {ing.porPorcao.proteina?.toFixed(1) ?? 0}g prot
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meal Plan Preview */}
      {mealsWithItems.length > 0 && (
        <div className="card">
          <div className="section-title">Resumo do Plano</div>

          {mealsWithItems.map((meal) => {
            const items = mealPlan[meal] ?? [];
            let mealTotal: Record<string, number> = {};
            for (const ingId of items) {
              const ing = INGREDIENTS.find((i) => i.id === ingId);
              if (ing) {
                for (const [key, value] of Object.entries(ing.porPorcao)) {
                  mealTotal[key] = (mealTotal[key] ?? 0) + (value as number);
                }
              }
            }

            return (
              <div key={meal} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
                <h3 style={{ marginBottom: 10 }}>{meal}</h3>
                <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 10 }}>
                  {items.map((ingId, idx) => {
                    const ing = INGREDIENTS.find((i) => i.id === ingId);
                    return (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: 6,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div>
                          <strong>{ing?.nome}</strong>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>
                            {ing?.porPorcao.calorias?.toFixed(0)} kcal
                          </div>
                        </div>
                        <button
                          className="btn btn-small"
                          onClick={() => removeMealPlanItem(meal, idx)}
                        >
                          Remover
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div
                  style={{
                    padding: 8,
                    backgroundColor: "#f5f7fa",
                    borderRadius: 4,
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>{(mealTotal.calorias ?? 0).toFixed(0)} kcal</strong> • {(mealTotal.proteina ?? 0).toFixed(1)}g prot • {(mealTotal.carboidratos ?? 0).toFixed(1)}g carb
                </div>
              </div>
            );
          })}

          <div
            style={{
              padding: 12,
              backgroundColor: "#e8f4f8",
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 6 }}>📊 Totals do Plano</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: "0.9rem" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#2980b9" }}>{(planTotals.calorias ?? 0).toFixed(0)}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>kcal</div>
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#27ae60" }}>{(planTotals.proteina ?? 0).toFixed(1)}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>g prot</div>
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#f39c12" }}>{(planTotals.carboidratos ?? 0).toFixed(1)}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>g carb</div>
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#e74c3c" }}>{(planTotals.gordura ?? 0).toFixed(1)}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>g fat</div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={saveMealPlan}
            style={{ width: "100%" }}
          >
            ✓ Adicionar Plano à Alimentação de Hoje
          </button>
        </div>
      )}
    </>
  );
}
