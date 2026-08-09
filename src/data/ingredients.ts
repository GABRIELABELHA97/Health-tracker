import type { IngredientNutrition } from "../types";

/**
 * Catálogo de "adicionar rápido". Sempre que o rótulo oficial não tem a tabela completa
 * publicada em texto (só em imagem), os valores foram aproximados por agregadores ou por
 * referência padrão (TACO / valores típicos da categoria) — marcados em `fonte` e, quando
 * relevante, detalhados em `observacao`. Corrija/expanda a qualquer momento em Perfil/Metas.
 */
export const INGREDIENTS: IngredientNutrition[] = [
  // Bebidas proteicas
  {
    id: "proforce-cacau",
    nome: "Proforce — Piracanjuba ProForce Cacau",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: { calorias: 132, carboidratos: 5, proteina: 15, gordura: 2.2, sodio: 241 },
    fonte: "rotulo_oficial",
  },
  {
    id: "yopro-chocolate",
    nome: "Yopro 15g chocolate",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: {
      calorias: 172.5,
      proteina: 15,
      carboidratos: 21,
      acucar: 18.25,
      gordura: 2.75,
      fibra: 1.5,
      sodio: 230,
    },
    fonte: "rotulo_oficial",
  },
  {
    id: "yopro-coco",
    nome: "Yopro 15g coco",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: { calorias: 139, carboidratos: 7, proteina: 15, gordura: 2.3, sodio: 188 },
    fonte: "estimativa_agregador",
    observacao: "Valor de referência é do sabor 'Coco com Morango' — não achei o sabor Coco puro publicado separadamente em texto.",
  },
  {
    id: "yopro-morango",
    nome: "Yopro 15g morango",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: { calorias: 139, carboidratos: 7, proteina: 15, gordura: 2.3, sodio: 188 },
    fonte: "estimativa_agregador",
    observacao: "Valor de referência é do sabor 'Coco com Morango' — não achei o sabor Morango puro publicado separadamente em texto.",
  },
  {
    id: "bebida-proteica-porto-alegre",
    nome: "Bebida Proteica Porto Alegre (Chocolate)",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: { calorias: 145, carboidratos: 8, proteina: 15, gordura: 2.5, sodio: 230 },
    fonte: "rotulo_oficial",
  },
  {
    id: "itambe-whey",
    nome: "Itambé Whey Protein (Baunilha)",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "250ml",
    porPorcao: { calorias: 133, carboidratos: 12, proteina: 15, gordura: 2.3, sodio: 215 },
    fonte: "rotulo_oficial",
  },
  {
    id: "tres-coracoes-power-whey",
    nome: "Bebida Láctea Cappuccino Power Whey (Três Corações)",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "260ml",
    porPorcao: { calorias: 160, carboidratos: 19, proteina: 15, gordura: 2.8, sodio: 472 },
    fonte: "rotulo_oficial",
  },

  // Whey em pó
  {
    id: "whey-max-titanium-baunilha",
    nome: "Whey Max Titanium Baunilha",
    categoria: "Whey protein",
    porcaoDescricao: "30g (1 dose)",
    porPorcao: { calorias: 121, proteina: 21, carboidratos: 4, gordura: 2.6, sodio: 51 },
    fonte: "rotulo_oficial",
  },
  {
    id: "whey-nutrigood-milkshake-chocolate",
    nome: "Whey Nutrigood Milkshake Chocolate",
    categoria: "Whey protein",
    porcaoDescricao: "30g (1 scoop dosador)",
    porPorcao: { calorias: 120, carboidratos: 5, acucar: 0, proteina: 21, gordura: 1.8, fibra: 0, sodio: 70 },
    fonte: "rotulo_oficial",
    observacao: "Aminograma completo no rótulo (leucina 2060mg, isoleucina 1160mg, valina 1030mg etc.) não rastreado no app — só macros/sódio.",
  },

  // Pães
  {
    id: "pao-forma-seven-boys",
    nome: "Pão de forma (Seven Boys tradicional)",
    categoria: "Pães",
    porcaoDescricao: "50g (2½ fatias)",
    porPorcao: { calorias: 126, carboidratos: 25, proteina: 4.5, gordura: 0.9, fibra: 1.2 },
    fonte: "rotulo_oficial",
  },
  {
    id: "pao-forma-integral-wickbold",
    nome: "Pão de Forma Integral Wickbold",
    categoria: "Pães",
    porcaoDescricao: "50g",
    porPorcao: { calorias: 122, carboidratos: 20, proteina: 6.3, gordura: 1.7, fibra: 3.5 },
    fonte: "rotulo_oficial",
    observacao: "Linhas 'Wickbold 100% Nutrição'/'5 Zeros' variam ~109-114kcal/50g — ajuste se for uma dessas linhas.",
  },
  {
    id: "pao-de-queijo",
    nome: "Pão de queijo",
    categoria: "Pães",
    porcaoDescricao: "50g (2 unidades)",
    porPorcao: { calorias: 133, carboidratos: 16, proteina: 2.9, gordura: 6.5 },
    fonte: "rotulo_oficial",
  },
  {
    id: "tortilla-fit-rap10",
    nome: "Tortilla Fit Rap10",
    categoria: "Pães",
    porcaoDescricao: "40g (1 unidade)",
    porPorcao: { calorias: 101, carboidratos: 21, acucar: 0.3, proteina: 2.8, gordura: 0.8, fibra: 3.8, sodio: 172 },
    fonte: "rotulo_oficial",
  },

  // Leite e laticínios
  {
    id: "leite-integral-itambe",
    nome: "Leite Integral Itambé",
    categoria: "Laticínios",
    porcaoDescricao: "200ml (1 copo)",
    porPorcao: { calorias: 113, carboidratos: 8.8, proteina: 6, gordura: 6, sodio: 138 },
    fonte: "rotulo_oficial",
  },
  {
    id: "queijo-mucarela",
    nome: "Queijo muçarela",
    categoria: "Laticínios",
    porcaoDescricao: "30g (~2 fatias)",
    porPorcao: { calorias: 99, proteina: 6.6, gordura: 7.5, sodio: 190 },
    fonte: "taco",
  },
  {
    id: "iogurte-batavo-probio2-ameixa",
    nome: "Iogurte Batavo Probio2 Ameixa",
    categoria: "Laticínios",
    porcaoDescricao: "170g (pacote)",
    porPorcao: { calorias: 122, carboidratos: 22, acucar: 22, gordura: 1.9, fibra: 2.6, sodio: 68 },
    fonte: "rotulo_oficial",
  },

  // Enlatados Gomes da Costa
  {
    id: "atum-solido-natural",
    nome: "Atum Ralado Natural (água) Gomes da Costa",
    categoria: "Enlatados",
    porcaoDescricao: "56g",
    porPorcao: { calorias: 68, proteina: 15, gordura: 0.7, sodio: 159 },
    fonte: "rotulo_oficial",
  },
  {
    id: "atum-solido-natural-agua",
    nome: "Atum Sólido Natural (água) Gomes da Costa",
    categoria: "Enlatados",
    porcaoDescricao: "56g",
    porPorcao: { calorias: 68, proteina: 15, gordura: 0.7, sodio: 159 },
    fonte: "rotulo_oficial",
  },
  {
    id: "atum-em-pedacos-em-oleo",
    nome: "Atum em Pedaços em Óleo",
    categoria: "Enlatados",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 105, proteina: 15, gordura: 5.1 },
    fonte: "rotulo_oficial",
  },
  {
    id: "atum-ralado-oleo-gomes-da-costa",
    nome: "Atum Ralado em Óleo Gomes da Costa",
    categoria: "Enlatados",
    porcaoDescricao: "60g drenado (3 colheres de sopa)",
    porPorcao: { calorias: 115, carboidratos: 0, proteina: 10, gordura: 8, sodio: 220 },
    fonte: "rotulo_oficial",
  },
  {
    id: "atum-em-oleo-defumado",
    nome: "Atum em Óleo Defumado",
    categoria: "Enlatados",
    porcaoDescricao: "60g drenado (3 colheres de sopa)",
    porPorcao: { calorias: 120, carboidratos: 0, proteina: 11, gordura: 8.5, sodio: 240 },
    fonte: "rotulo_oficial",
  },
  {
    id: "sardinha-molho-tomate-picante",
    nome: "Sardinha em óleo",
    categoria: "Enlatados",
    porcaoDescricao: "60g drenado (3 colheres de sopa)",
    porPorcao: { calorias: 134, carboidratos: 0, proteina: 13, gordura: 9, omega3: 1.5, sodio: 260 },
    fonte: "rotulo_oficial",
  },

  // Frios / outros industrializados
  {
    id: "pate-peito-peru-seara",
    nome: "Patê de Peito de Peru (potinho)",
    categoria: "Frios",
    porcaoDescricao: "10g (1 colher de sopa)",
    porPorcao: { calorias: 22, carboidratos: 0.5, proteina: 0.8, gordura: 1.8, sodio: 65 },
    fonte: "rotulo_oficial",
  },
  {
    id: "pate-presunto-seara",
    nome: "Patê de Presunto Seara",
    categoria: "Frios",
    porcaoDescricao: "25g (sachê)",
    porPorcao: { calorias: 57.5, proteina: 2.5, gordura: 4.75, sodio: 230 },
    fonte: "rotulo_oficial",
  },
  {
    id: "cafe-tres-coracoes-dark-roast",
    nome: "Café Três Corações Premium Dark Roast (coado, sem açúcar)",
    categoria: "Bebidas",
    porcaoDescricao: "1 xícara (~50ml)",
    porPorcao: { calorias: 2 },
    fonte: "estimativa_padrao",
    observacao: "Pó torrado e moído é 'não significativo' pela ANVISA — valor é da bebida coada, desprezível.",
  },
  {
    id: "coca-cola",
    nome: "Coca-Cola",
    categoria: "Bebidas",
    porcaoDescricao: "350ml (lata)",
    porPorcao: { calorias: 149, carboidratos: 37, acucar: 37, gordura: 0, fibra: 0, sodio: 18 },
    fonte: "rotulo_oficial",
  },

  // Energéticos Monster
  {
    id: "monster-original",
    nome: "Monster Original",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 210, acucar: 54, carboidratos: 54, sodio: 370 },
    fonte: "rotulo_oficial",
  },
  {
    id: "monster-mango-loco",
    nome: "Monster Mango Loco",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 246, sodio: 370 },
    fonte: "estimativa_agregador",
  },
  {
    id: "monster-original-zero",
    nome: "Monster Original Zero",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 12, carboidratos: 5.6, acucar: 0, sodio: 312, vitaminaB3: 30, vitaminaB6: 2.6, vitaminaB12: 4.8 },
    fonte: "rotulo_oficial",
    observacao: "Rótulo também traz 1600mg taurina, 120mg cafeína e 8mg inositol por lata — não rastreados como colunas no app.",
  },
  {
    id: "monster-pacific-punch",
    nome: "Monster Pacific Punch",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 210, carboidratos: 50, acucar: 50, sodio: 380 },
    fonte: "estimativa_agregador",
    observacao: "Valor médio de referência para a linha com açúcar/suco (junto com Watermelon comum) — não achei o rótulo exato deste sabor em texto.",
  },
  {
    id: "monster-ultra-branco",
    nome: "Monster Ultra Branco",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 6, carboidratos: 1, acucar: 0, sodio: 380 },
    fonte: "estimativa_agregador",
    observacao: "Valor médio de referência para a linha Ultra Zero (junto com Ultra Watermelon Zero) — não achei o rótulo exato deste sabor em texto.",
  },
  {
    id: "monster-ultra-watermelon-zero",
    nome: "Monster Ultra Watermelon Zero",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 6, carboidratos: 1, acucar: 0, sodio: 380 },
    fonte: "estimativa_agregador",
    observacao: "Valor médio de referência para a linha Ultra Zero (junto com Ultra Branco) — não achei o rótulo exato deste sabor em texto.",
  },
  {
    id: "monster-watermelon",
    nome: "Monster Watermelon",
    categoria: "Energéticos",
    porcaoDescricao: "473ml (lata)",
    porPorcao: { calorias: 210, carboidratos: 50, acucar: 50, sodio: 380 },
    fonte: "estimativa_agregador",
    observacao: "Valor médio de referência para a linha com açúcar/suco (junto com Pacific Punch) — não achei o rótulo exato deste sabor em texto.",
  },

  // Carnes / ovos
  {
    id: "sobrecoxa-frango-grelhado",
    nome: "Frango sobrecoxa grelhado (sem pele)",
    categoria: "Carnes",
    porcaoDescricao: "100g (pós-cocção)",
    porPorcao: { calorias: 170, carboidratos: 0, proteina: 24, gordura: 8, sodio: 85 },
    fonte: "estimativa_agregador",
  },
  {
    id: "sobrecoxa-frango-crua-sadia",
    nome: "Frango sobrecoxa (Sadia, crua, com pele)",
    categoria: "Carnes",
    porcaoDescricao: "100g (cru)",
    porPorcao: { calorias: 232, proteina: 15, carboidratos: 1, gordura: 19, fibra: 0, sodio: 480 },
    fonte: "rotulo_oficial",
    observacao: "Rótulo da peça crua com pele — para a versão grelhada sem pele, ver 'Frango sobrecoxa grelhado (sem pele)'.",
  },
  {
    id: "asinhas-temperadas",
    nome: "Asinhas de frango temperadas (assadas/grelhadas, com pele)",
    categoria: "Carnes",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 230, carboidratos: 0.8, proteina: 22, gordura: 15, sodio: 550 },
    fonte: "estimativa_agregador",
  },
  {
    id: "contrafile-grelhado",
    nome: "Contrafilé grelhado",
    categoria: "Carnes",
    porcaoDescricao: "100g (pós-cocção)",
    porPorcao: { calorias: 250, proteina: 28, gordura: 15 },
    fonte: "taco",
  },
  {
    id: "bife-patinho-grelhado",
    nome: "Bife de Patinho grelhado",
    categoria: "Carnes",
    porcaoDescricao: "100g (pós-cocção)",
    porPorcao: { calorias: 219, proteina: 35.9, gordura: 7.3 },
    fonte: "taco",
  },
  {
    id: "salmao-grelhado",
    nome: "Salmão grelhado / assado",
    categoria: "Carnes",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 210, carboidratos: 0, proteina: 26, gordura: 11, omega3: 1.8, sodio: 60 },
    fonte: "estimativa_agregador",
  },
  {
    id: "ovo-cozido",
    nome: "Ovo cozido",
    categoria: "Carnes",
    porcaoDescricao: "1 unidade (~50g)",
    porPorcao: { calorias: 78, proteina: 6.3, gordura: 5.3, vitaminaD: 1.1, vitaminaB12: 0.6 },
    fonte: "taco",
  },

  // Hortifrúti
  {
    id: "tomate",
    nome: "Tomate",
    categoria: "Hortifrúti",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 15, vitaminaC: 13 },
    fonte: "taco",
  },
  {
    id: "couve-manteiga",
    nome: "Couve-manteiga (refogada em pouca gordura)",
    categoria: "Hortifrúti",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 50, carboidratos: 7.5, proteina: 2.5, gordura: 1.5, fibra: 4, ferro: 2.7, vitaminaC: 76, sodio: 15 },
    fonte: "estimativa_agregador",
  },
  {
    id: "banana",
    nome: "Banana",
    categoria: "Hortifrúti",
    porcaoDescricao: "100g (~1 unidade média)",
    porPorcao: { calorias: 98, carboidratos: 26, fibra: 2 },
    fonte: "taco",
  },
  {
    id: "mixirica",
    nome: "Mixirica (tangerina)",
    categoria: "Hortifrúti",
    porcaoDescricao: "100g (~1 unidade)",
    porPorcao: { calorias: 53, carboidratos: 13, fibra: 1.8, vitaminaC: 27 },
    fonte: "taco",
  },
  {
    id: "limao",
    nome: "Limão Taiti (suco puro)",
    categoria: "Hortifrúti",
    porcaoDescricao: "100g (~2 unidades)",
    porPorcao: { calorias: 29, carboidratos: 9, proteina: 0.7, gordura: 0.2, fibra: 2.8, vitaminaC: 35, sodio: 2 },
    fonte: "estimativa_agregador",
  },

  // Suplementos alimentares (Emana)
  {
    id: "creatina-emana",
    nome: "Creatina Monohidratada (Emana)",
    categoria: "Suplementos",
    porcaoDescricao: "1 dose (~3g)",
    porPorcao: { calorias: 0, carboidratos: 0, proteina: 0, gordura: 0 },
    fonte: "estimativa_padrao",
    observacao:
      "Creatina monohidratada pura é nutricionalmente inerte nos nutrientes rastreados por este app (sem kcal/macros/vitaminas) — o próprio composto 'creatina' não é uma das 20 colunas da aba Nutrientes.",
  },
  {
    id: "shake-proteico-emana",
    nome: "Shake Proteico (Emana, 23g proteína)",
    categoria: "Bebidas proteicas",
    porcaoDescricao: "1 sachê (pó, preparado em água)",
    porPorcao: { calorias: 110, carboidratos: 5, proteina: 23, gordura: 1.5, fibra: 2, sodio: 180 },
    fonte: "estimativa_padrao",
    observacao: "Proteína vegetal (ervilha) confirmada em 23g; kcal/carbo/gordura/sódio não achei publicados em texto — estimados por similaridade com shakes veganos de perfil parecido. Confirme no rótulo.",
  },

  // Laticínios e industrializados
  {
    id: "queijo-minas-frescal",
    nome: "Queijo Minas Frescal",
    categoria: "Laticínios",
    porcaoDescricao: "100g",
    porPorcao: { calorias: 264, carboidratos: 3.2, proteina: 17.4, gordura: 20.2 },
    fonte: "taco",
  },
  {
    id: "iogurte-liquido-ameixa-activia",
    nome: "Iogurte líquido de ameixa (Activia)",
    categoria: "Laticínios",
    porcaoDescricao: "170g (garrafa)",
    porPorcao: { calorias: 129, carboidratos: 24, proteina: 3.9, gordura: 1.9 },
    fonte: "estimativa_agregador",
    observacao: "Rótulo oficial não encontrado em texto — valor escalado de 100g→170g a partir de agregador nutricional. Confirme sódio/açúcares no rótulo.",
  },
  {
    id: "chocolate-bis",
    nome: "Chocolate Bis (Lacta)",
    categoria: "Doces e snacks",
    porcaoDescricao: "1 unidade (6,3g)",
    porPorcao: { calorias: 31, carboidratos: 4, acucar: 2.9, proteina: 0, gordura: 1.5, fibra: 0, sodio: 14 },
    fonte: "estimativa_agregador",
  },
  {
    id: "biscoito-trakinas-chocolate",
    nome: "Biscoito recheado Trakinas chocolate",
    categoria: "Doces e snacks",
    porcaoDescricao: "30g (3 biscoitos)",
    porPorcao: { calorias: 143, carboidratos: 22, acucar: 9.2, proteina: 1.6, gordura: 5.4, fibra: 0, sodio: 78 },
    fonte: "estimativa_agregador",
  },
];

export const INGREDIENT_CATEGORIES = Array.from(new Set(INGREDIENTS.map((i) => i.categoria)));

export function getAllIngredients(custom: IngredientNutrition[]): IngredientNutrition[] {
  return [...INGREDIENTS, ...custom];
}

export function getAllCategories(custom: IngredientNutrition[]): string[] {
  return Array.from(new Set(getAllIngredients(custom).map((i) => i.categoria)));
}
