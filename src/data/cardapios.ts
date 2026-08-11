export interface MealItem {
  nome: string;
  quantidade: string;
  notas?: string;
}

export interface Refeicao {
  nome: string;
  emoji: string;
  itens: MealItem[];
  kcal: number;
  prot: number;
  carb: number;
  fat: number;
  fiber: number;
}

export interface Cardapio {
  id: string;
  semana: string;
  descricao: string;
  duracao: string;
  inicio: string;
  refeicoes: Refeicao[];
  totais: {
    kcal: number;
    prot: number;
    carb: number;
    fat: number;
    fiber: number;
  };
  destaques: string[];
  notas: string[];
  alteracoes?: string[];
}

export const CARDAPIOS: Cardapio[] = [
  {
    id: "semana-11-17",
    semana: "Semana 11-17 Agosto",
    descricao: "Cardápio com iogurte mantido, sem brócolis/alface (a comprar)",
    duracao: "7 dias",
    inicio: "11 de Agosto 2026",
    refeicoes: [
      {
        nome: "Café da Manhã",
        emoji: "☀️",
        itens: [
          { nome: "Whey Max Titanium Baunilha", quantidade: "3 doses (90g)" },
          { nome: "Leite Integral Itambé", quantidade: "150ml" },
          { nome: "Café Dark Roast", quantidade: "300ml (6 xícaras)" },
          { nome: "Atum em Pedaços Natural", quantidade: "1 lata (56g)" },
          { nome: "Tortilla Fit Rap10", quantidade: "1 unidade (40g)" },
          { nome: "Limão Taiti com água", quantidade: "100ml" },
        ],
        kcal: 658,
        prot: 86,
        carb: 48.6,
        fat: 14,
        fiber: 6.6,
      },
      {
        nome: "Almoço",
        emoji: "🍽️",
        itens: [
          { nome: "Monster Ultra Strawberry Dreams Zero", quantidade: "1 lata (473ml)" },
          { nome: "Shake Emana Caramel Coffee 23g", quantidade: "250ml" },
          { nome: "Batavo Probio2 Ameixa", quantidade: "1 pacote (170g)", notas: "Mantém esta semana" },
        ],
        kcal: 238,
        prot: 24.9,
        carb: 28,
        fat: 3.4,
        fiber: 0,
      },
      {
        nome: "Jantar",
        emoji: "🌙",
        itens: [
          { nome: "Bife Patinho Grelhado", quantidade: "2 porções (200g)" },
          { nome: "Asinhas de Frango Temperadas", quantidade: "2 porções (200g)" },
          { nome: "Tomate", quantidade: "1 porção (100g)" },
          { nome: "Tortilla Fit Rap10", quantidade: "1 unidade (40g)" },
          { nome: "Queijo Minas Frescal", quantidade: "2 porções (200g)" },
        ],
        kcal: 1542,
        prot: 154.1,
        carb: 32.2,
        fat: 85.8,
        fiber: 4.1,
      },
    ],
    totais: {
      kcal: 2438,
      prot: 265,
      carb: 108.8,
      fat: 103.2,
      fiber: 10.7,
    },
    destaques: [
      "Proteína: 265g (1.8x acima da meta)",
      "Vitamina B12: 71.4mcg (28x acima)",
      "Mantém todas as proteínas animais",
      "Iogurte mantido por essa semana",
    ],
    notas: [
      "Compre brócolis e alface para próxima semana",
      "Se sentir cansaço: é normal em déficit calórico",
      "Beba muita água (2-3L por dia)",
    ],
    alteracoes: [
      "Leite reduzido de 300ml para 150ml (-113 kcal)",
      "Queijo mantido no jantar (movido do café)",
      "Pão integral removido do café (-122 kcal)",
    ],
  },
  {
    id: "semana-18-24",
    semana: "Semana 18-24 Agosto",
    descricao: "Redução significativa (-862 kcal) com máxima proteína, vitaminas e fibra",
    duracao: "7 dias",
    inicio: "18 de Agosto 2026",
    refeicoes: [
      {
        nome: "Café da Manhã",
        emoji: "☀️",
        itens: [
          { nome: "Whey Max Titanium Baunilha", quantidade: "3 doses (90g)", notas: "PROTEÍNA MÁXIMA" },
          { nome: "Café Dark Roast", quantidade: "300ml (6 xícaras)" },
          { nome: "Atum em Pedaços Natural", quantidade: "1 lata (56g)", notas: "FERRO + SELÊNIO" },
          { nome: "Limão Taiti com água", quantidade: "100ml" },
        ],
        kcal: 472,
        prot: 78.7,
        carb: 21,
        fat: 8.7,
        fiber: 2.8,
      },
      {
        nome: "Almoço",
        emoji: "🍽️",
        itens: [
          { nome: "Monster Ultra Strawberry Dreams Zero", quantidade: "1 lata (473ml)" },
          { nome: "Shake Emana Caramel Coffee 23g", quantidade: "250ml" },
        ],
        kcal: 116,
        prot: 23,
        carb: 6,
        fat: 1.5,
        fiber: 0,
      },
      {
        nome: "Jantar",
        emoji: "🌙",
        itens: [
          { nome: "Bife Patinho Grelhado", quantidade: "2 porções (200g)", notas: "PROTEÍNA + FERRO" },
          { nome: "Asinhas de Frango Temperadas", quantidade: "2 porções (200g)", notas: "PROTEÍNA + ZINCO" },
          { nome: "Tomate", quantidade: "1 porção (100g)", notas: "VITAMINA C + LICOPENO" },
          { nome: "Brócolis Cozido", quantidade: "150g", notas: "FIBRA + VITAMINA C + FERRO" },
          { nome: "Alface Folha", quantidade: "200g", notas: "FIBRA + VITAMINA A + VOLUME" },
        ],
        kcal: 988,
        prot: 123.7,
        carb: 18,
        fat: 45.6,
        fiber: 5.3,
      },
    ],
    totais: {
      kcal: 1576,
      prot: 225.4,
      carb: 45,
      fat: 55.8,
      fiber: 8.1,
    },
    destaques: [
      "REDUÇÃO: -862 kcal (-35%)",
      "Proteína mantida: 225.4g (2.5g/kg)",
      "Vitamina C: 129mg (172% da meta)",
      "Brócolis/Alface: 350g de verduras",
      "Déficit calórico: 71% (agressivo mas sustentável)",
    ],
    notas: [
      "Se sentir cansaço: adicione batata-doce 100g (+90 kcal)",
      "Se sentir fraqueza: volte para semana anterior",
      "Se tiver energia normal: continue este plano!",
      "Revise na próxima semana conforme energia/peso",
    ],
    alteracoes: [
      "REMOVIDO: Queijo Minas (-528 kcal, maior corte)",
      "REMOVIDO: Leite (-56.5 kcal)",
      "REMOVIDO: Iogurte (-122 kcal)",
      "REMOVIDO: Tortillas (-202 kcal)",
      "ADICIONADO: Brócolis 150g (+45 kcal)",
      "ADICIONADO: Alface 200g (+30 kcal)",
    ],
  },
];
