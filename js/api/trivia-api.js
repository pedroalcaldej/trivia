export async function fetchEnglishTriviaApi(limit, difficulty, checkedCats) {
  const englishCategoryMap = {
    "música": "music",
    "cine y series": "film_and_tv",
    "geografía": "geography",
    "historia": "history",
    "ciencia y tecnología": "science",
    "cultura general": "general_knowledge",
    "gastronomía": "food_and_drink",
    "deportes": "sport_and_leisure",
    "cultura pop y memes": "society_and_culture",
    "arte y literatura": "arts_and_literature"
  };

  const mappedCats = checkedCats.map(c => englishCategoryMap[c] || "general_knowledge");
  let url = `https://the-trivia-api.com/v2/questions?limit=${limit}`;
  if (difficulty !== 'all') url += `&difficulties=${difficulty}`;
  if (mappedCats.length > 0) url += `&categories=${mappedCats.join(',')}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("API HTTP Error " + response.status);
  const data = await response.json();

  return data.map(item => {
    const correctAnswer = item.correctAnswer || "N/A";
    const incorrectAnswers = item.incorrectAnswers || [];
    const allOptions = shuffleArray([correctAnswer, ...incorrectAnswers]);

    return {
      category: item.category ? item.category.replace(/_/g, " ").toUpperCase() : "GENERAL",
      question: item.question ? item.question.text : "No Question",
      answer: correctAnswer,
      options: allOptions
    };
  });
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}