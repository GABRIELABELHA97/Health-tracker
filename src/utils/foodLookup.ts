import type { NutrientTotals } from "../types";

export interface FoodLookupResult {
  nome: string;
  porcaoDescricao: string;
  porPorcao: Partial<NutrientTotals>;
}

interface OffProduct {
  product_name?: string;
  product_name_pt?: string;
  nutriments?: Record<string, number>;
}

interface OffSearchResponse {
  products?: OffProduct[];
}

/**
 * Busca ativa de tabela nutricional via Open Food Facts (API pública, sem API key).
 * Retorna valores por 100g do primeiro produto com dados nutricionais utilizáveis.
 * Só funciona em contexto com acesso à rede externa (não funciona dentro do preview
 * do Artifact, que bloqueia fetch para fora — funciona no app rodando de verdade).
 */
export async function searchFoodNutrition(query: string): Promise<FoodLookupResult | null> {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
    query,
  )}&search_simple=1&action=process&json=1&page_size=5&lc=pt`;

  let data: OffSearchResponse;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    data = await res.json();
  } catch {
    return null;
  }

  const product = (data.products ?? []).find((p) => p.nutriments && p.nutriments["energy-kcal_100g"] != null);
  if (!product || !product.nutriments) return null;
  const n = product.nutriments;

  const sodioMg =
    n["sodium_100g"] != null ? n["sodium_100g"] * 1000 : n["salt_100g"] != null ? n["salt_100g"] * 400 : undefined;

  const porPorcao: Partial<NutrientTotals> = {};
  const set = (key: keyof NutrientTotals, value: number | undefined) => {
    if (value != null && Number.isFinite(value)) porPorcao[key] = value;
  };
  set("calorias", n["energy-kcal_100g"]);
  set("proteina", n["proteins_100g"]);
  set("carboidratos", n["carbohydrates_100g"]);
  set("acucar", n["sugars_100g"]);
  set("gordura", n["fat_100g"]);
  set("fibra", n["fiber_100g"]);
  set("sodio", sodioMg);
  set("vitaminaC", n["vitamin-c_100g"] != null ? n["vitamin-c_100g"] * 1000 : undefined);
  set("vitaminaD", n["vitamin-d_100g"] != null ? n["vitamin-d_100g"] * 1_000_000 : undefined);
  set("vitaminaB12", n["vitamin-b12_100g"] != null ? n["vitamin-b12_100g"] * 1_000_000 : undefined);
  set("ferro", n["iron_100g"] != null ? n["iron_100g"] * 1000 : undefined);
  set("magnesio", n["magnesium_100g"] != null ? n["magnesium_100g"] * 1000 : undefined);

  if (Object.keys(porPorcao).length === 0) return null;

  return {
    nome: product.product_name_pt || product.product_name || query,
    porcaoDescricao: "100g",
    porPorcao,
  };
}
