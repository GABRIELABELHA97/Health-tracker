import type { NutrientKey } from "../types";

export interface NutrientInfo {
  consequenciaFalta?: string;
  consequenciaExcesso?: string;
  fontes: string[];
}

export const NUTRIENT_INFO: Record<NutrientKey, NutrientInfo> = {
  calorias: {
    consequenciaExcesso: "superávit calórico sustentado trava a perda de peso, que é seu objetivo principal.",
    consequenciaFalta: "déficit calórico exagerado (muito abaixo do alvo) derruba energia, recuperação muscular e adesão a longo prazo — pode até favorecer perda de massa magra em vez de gordura.",
    fontes: ["ajuste porções", "distribua melhor entre refeições"],
  },
  proteina: {
    consequenciaFalta: "sem proteína suficiente o corpo prioriza queima de massa magra junto com a gordura, o oposto do seu objetivo de manter músculo emagrecendo.",
    fontes: ["whey (Max Titanium, YoPro, Nutrigood)", "atum e sardinha Gomes da Costa", "frango, patinho ou salmão grelhado", "ovo cozido"],
  },
  carboidratos: {
    consequenciaExcesso: "carboidrato acima do teto planejado consome o espaço calórico que deveria vir de proteína/gordura no seu déficit.",
    fontes: ["pão integral Wickbold", "banana", "tortilla fit"],
  },
  gordura: {
    consequenciaExcesso: "gordura em excesso é a forma mais densa de estourar o orçamento calórico do dia.",
    fontes: ["ômega 3 Puravida", "salmão grelhado", "queijo muçarela com moderação"],
  },
  acucar: {
    consequenciaExcesso: "pico de açúcar recorrente (Monster/Coca não-zero) atrapalha saciedade e cognição ao longo do dia — direto contra dois dos seus objetivos.",
    fontes: [],
  },
  fibra: {
    consequenciaFalta: "fibra baixa piora saciedade (mais fome ao longo do dia, mais difícil manter déficit) e a saúde intestinal/metabólica.",
    fontes: ["pão integral Wickbold", "tortilla fit", "tomate, couve-manteiga, banana, tangerina"],
  },
  sodio: {
    consequenciaExcesso: "sódio muito acima do teto (comum com atum em óleo, patês e enlatados) retém líquido e mascara a evolução do peso na balança.",
    fontes: [],
  },
  omega3: {
    consequenciaFalta: "ômega-3 baixo é diretamente contra seu objetivo de cognição — é um dos nutrientes com mais evidência para função cerebral.",
    fontes: ["cápsula de Ômega 3 Puravida (já suplementa)", "salmão grelhado", "sardinha"],
  },
  vitaminaD: {
    consequenciaFalta: "vitamina D baixa afeta humor, imunidade e recuperação muscular — mesmo suplementando, vale conferir se a dose está sendo tomada todos os dias.",
    fontes: ["gotas True Source (já suplementa)", "ovo cozido", "exposição solar"],
  },
  vitaminaB12: {
    consequenciaFalta: "B12 baixa causa fadiga e prejudica cognição/memória — atenção redobrada por ser prioridade sua.",
    fontes: ["metilcobalamina e B Complexo (já suplementa)", "ovo, atum, salmão"],
  },
  ferro: {
    consequenciaFalta: "ferro baixo é uma das causas mais comuns de fadiga e queda de produtividade/cognição no dia a dia.",
    fontes: ["couve-manteiga", "carnes vermelhas (contrafilé, patinho)", "atum"],
  },
  vitaminaB1: { consequenciaFalta: "B1 baixa compromete metabolismo energético — sensação de cansaço mesmo dormindo bem.", fontes: ["B Complexo Bigens (já suplementa)"] },
  vitaminaB2: { consequenciaFalta: "B2 baixa reduz eficiência da produção de energia celular.", fontes: ["B Complexo Bigens (já suplementa)", "laticínios"] },
  vitaminaB3: { consequenciaFalta: "B3 baixa prejudica metabolismo energético e saúde da pele/cabelo.", fontes: ["B Complexo Bigens (já suplementa)", "carnes, atum"] },
  vitaminaB5: { consequenciaFalta: "B5 baixa afeta produção de energia e síntese hormonal.", fontes: ["B Complexo Bigens (já suplementa)"] },
  vitaminaB6: { consequenciaFalta: "B6 baixa afeta síntese de neurotransmissores — impacta humor e cognição.", fontes: ["B Complexo Bigens (já suplementa)", "frango, salmão"] },
  vitaminaB7: { consequenciaFalta: "biotina (B7) baixa é diretamente ligada a queda de cabelo e unhas fracas — um dos seus objetivos explícitos.", fontes: ["B Complexo Bigens (já suplementa)", "ovo cozido"] },
  vitaminaB9: {
    consequenciaFalta: "folato baixo prejudica produção de células novas e função cognitiva.",
    fontes: ["B Complexo Bigens (já suplementa)", "couve-manteiga"],
  },
  vitaminaC: {
    consequenciaFalta: "vitamina C baixa prejudica síntese de colágeno (pele/cabelo) e imunidade — relevante para seu objetivo de cabelo.",
    fontes: ["limão", "tangerina (mixirica)", "tomate"],
  },
  magnesio: {
    consequenciaFalta: "magnésio baixo piora qualidade de sono, ansiedade e cãibras — e sono ruim derruba cognição e produtividade no dia seguinte.",
    fontes: ["suplemento de magnésio (já suplementa)", "banana, couve-manteiga"],
  },
};
