export interface FoodSuggestion {
  alimento: string;
  quantidade: string;
  nutrientes: string[];
  notas?: string;
}

export const NUTRIENT_SUGGESTIONS: Record<string, FoodSuggestion[]> = {
  "Vitamina C": [
    { alimento: "Laranja", quantidade: "1 unidade (200g)", nutrientes: ["100mg vitC"], notas: "Sumo natural" },
    { alimento: "Morango", quantidade: "150g", nutrientes: ["84mg vitC"], notas: "Fruta vermelha" },
    { alimento: "Abacaxi", quantidade: "200g", nutrientes: ["60mg vitC"], notas: "Fibra extra" },
    { alimento: "Brócolis cozido", quantidade: "100g", nutrientes: ["50mg vitC"], notas: "Já no cardápio!" },
  ],
  "Potássio": [
    { alimento: "Banana", quantidade: "1 média (120g)", nutrientes: ["422mg potássio"], notas: "Rápida energia" },
    { alimento: "Batata-doce cozida", quantidade: "100g", nutrientes: ["337mg potássio"], notas: "Carboidrato complexo" },
    { alimento: "Abacate", quantidade: "1/2 unidade (60g)", nutrientes: ["240mg potássio"], notas: "Gordura saudável" },
    { alimento: "Melancia", quantidade: "200g", nutrientes: ["252mg potássio"], notas: "Hidratação" },
  ],
  "Ferro": [
    { alimento: "Carne vermelha (bife)", quantidade: "100g", nutrientes: ["2.5mg ferro"], notas: "Já no cardápio!" },
    { alimento: "Feijão cozido", quantidade: "150g", nutrientes: ["3mg ferro"], notas: "Combine com vit C" },
    { alimento: "Espinafre cozido", quantidade: "100g", nutrientes: ["3.2mg ferro"], notas: "Folhoso" },
    { alimento: "Atum em lata", quantidade: "56g", nutrientes: ["0.7mg ferro"], notas: "Já no cardápio!" },
  ],
  "Cálcio": [
    { alimento: "Leite integral", quantidade: "200ml", nutrientes: ["240mg cálcio"], notas: "Já consome" },
    { alimento: "Queijo branco", quantidade: "50g", nutrientes: ["210mg cálcio"], notas: "Já no cardápio!" },
    { alimento: "Iogurte natural", quantidade: "170g", nutrientes: ["140mg cálcio"], notas: "Probióticos" },
    { alimento: "Semente de gergelim", quantidade: "15g", nutrientes: ["135mg cálcio"], notas: "Adicione em saladas" },
  ],
  "Fibra": [
    { alimento: "Brócolis cozido", quantidade: "100g", nutrientes: ["2g fibra"], notas: "Já no novo cardápio!" },
    { alimento: "Alface folha", quantidade: "100g", nutrientes: ["1g fibra"], notas: "Já no novo cardápio!" },
    { alimento: "Maçã com casca", quantidade: "1 unidade (180g)", nutrientes: ["4.4g fibra"], notas: "Sobremesa" },
    { alimento: "Pera", quantidade: "1 unidade (150g)", nutrientes: ["5.5g fibra"], notas: "Hidratação extra" },
  ],
  "Vitamina A": [
    { alimento: "Cenoura cozida", quantidade: "100g", nutrientes: ["835mcg vitA"], notas: "Beta-caroteno" },
    { alimento: "Abóbora cozida", quantidade: "100g", nutrientes: ["576mcg vitA"], notas: "Cor laranja" },
    { alimento: "Alface folha", quantidade: "100g", nutrientes: ["185mcg vitA"], notas: "Já no novo cardápio!" },
    { alimento: "Batata-doce cozida", quantidade: "100g", nutrientes: ["450mcg vitA"], notas: "Carboidrato complexo" },
  ],
  "Magnésio": [
    { alimento: "Amêndoa", quantidade: "30g (23 unidades)", nutrientes: ["81mg magnésio"], notas: "Oleaginosa" },
    { alimento: "Abacate", quantidade: "1/2 unidade (60g)", nutrientes: ["20mg magnésio"], notas: "Gordura boa" },
    { alimento: "Brócolis cozido", quantidade: "100g", nutrientes: ["21mg magnésio"], notas: "Já no novo cardápio!" },
    { alimento: "Espinafre cozido", quantidade: "100g", nutrientes: ["79mg magnésio"], notas: "Folhoso" },
  ],
  "Ômega-3": [
    { alimento: "Salmão cozido", quantidade: "100g", nutrientes: ["2.3g ômega-3"], notas: "Melhor fonte animal" },
    { alimento: "Sardinha em lata", quantidade: "100g", nutrientes: ["1.5g ômega-3"], notas: "Acessível" },
    { alimento: "Linhaça moída", quantidade: "15g", nutrientes: ["2.3g ômega-3"], notas: "Adicione em sucos" },
    { alimento: "Chia", quantidade: "15g", nutrientes: ["2.5g ômega-3"], notas: "Sobremesa ou iogurte" },
  ],
  "Carboidrato": [
    { alimento: "Arroz integral cozido", quantidade: "100g", nutrientes: ["23g carb"], notas: "Fibra extra" },
    { alimento: "Batata-doce cozida", quantidade: "100g", nutrientes: ["20g carb"], notas: "Vitamina A" },
    { alimento: "Aveia em flocos", quantidade: "50g", nutrientes: ["27g carb"], notas: "Café da manhã" },
    { alimento: "Pão integral", quantidade: "50g", nutrientes: ["20g carb"], notas: "Já testa no cardápio" },
  ],
};

export function getSuggestionsForNutrient(nutrient: string): FoodSuggestion[] {
  return NUTRIENT_SUGGESTIONS[nutrient] || [];
}
