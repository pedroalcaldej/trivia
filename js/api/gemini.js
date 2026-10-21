export async function fetchSpanishGeminiApi(apiKey, limit, difficulty, checkedCats) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const catNames = checkedCats.join(", ");
  const diffText = difficulty === 'all' ? 'variada (fácil, media y difícil)' : difficulty;

  const promptText = `Genera un paquete JSON con exactamente ${limit} preguntas de trivia en ESPAÑOL NATIVO.
Dificultad: ${diffText}.
Categorías elegidas: ${catNames}.
Incluye cultura pop, cine, música, deportes, geografía y datos curiosos.
Cada pregunta debe ser un objeto JSON con los siguientes campos:
- "category": categoría de la pregunta
- "question": texto de la pregunta
- "answer": respuesta correcta
- "options": un arreglo de 4 cadenas con las alternativas A, B, C y D`;

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        description: "Lista de preguntas de trivia",
        items: {
          type: "OBJECT",
          properties: {
            category: { type: "STRING" },
            question: { type: "STRING" },
            answer: { type: "STRING" },
            options: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["category", "question", "answer", "options"]
        }
      }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData.error?.message || `Error HTTP ${response.status}`;
    throw new Error(`Gemini API Error: ${msg}`);
  }

  const resData = await response.json();
  const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Respuesta vacía recibida de Gemini API");

  const parsedJSON = JSON.parse(rawText);
  return parsedJSON.map(item => ({
    category: (item.category || "GENERAL").toUpperCase(),
    question: item.question,
    answer: item.answer,
    options: item.options && item.options.length === 4 ? item.options : shuffleArray([item.answer, "Opción B", "Opción C", "Opción D"])
  }));
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}