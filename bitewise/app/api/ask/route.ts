import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for USDA results (simple Map, can be replaced with Redis or similar for large-scale)
const usdaCache = new Map<string, any>();

function isFoodFactQuestion(question: string) {
  return /(how much|what is|amount of|content of|contains|grams of|protein|carb|fat|calorie|energy|fiber|sugar|vitamin|mineral|nutrition)/i.test(question);
}

function isDietPlanQuestion(question: string) {
  return /(diet plan|meal plan|weekly diet|week diet|what should i eat|plan my meals|plan my diet)/i.test(question);
}

function extractFoodName(question: string) {
  const match = question.match(/in (a |an |the )?([a-zA-Z ]+)/i);
  return match ? match[2].trim() : question;
}

async function fetchUsdaFact(food: string, apiKey: string) {
  if (usdaCache.has(food)) return usdaCache.get(food);

  const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&api_key=${apiKey}`;
  const res = await fetch(usdaUrl, { cache: "force-cache" });
  const data = await res.json();
  const match = (data.foods || []).find((f: any) =>
    f.description.toLowerCase().includes(food.toLowerCase())
  );
  if (match) {
    const protein = match.foodNutrients?.find((n: any) => n.nutrientName === "Protein");
    const calories = match.foodNutrients?.find((n: any) => n.nutrientName === "Energy");
    const fat = match.foodNutrients?.find((n: any) => n.nutrientName === "Total lipid (fat)");
    const carbs = match.foodNutrients?.find((n: any) => n.nutrientName === "Carbohydrate, by difference");
    const fact = {
      food,
      description: match.description,
      protein: protein?.value ?? "unknown",
      calories: calories?.value ?? "unknown",
      fat: fat?.value ?? "unknown",
      carbs: carbs?.value ?? "unknown"
    };
    usdaCache.set(food, fact);
    return fact;
  }
  return null;
}

async function getUsdaFactsForFoods(foods: string[], apiKey: string) {
  // Parallel fetch, with caching
  const uniqueFoods = Array.from(new Set(foods.map(f => f.toLowerCase().trim())));
  const requests = uniqueFoods.map(food => fetchUsdaFact(food, apiKey));
  const facts = await Promise.all(requests);
  return facts.filter(Boolean);
}

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const usdaApiKey = process.env.USDA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  let prompt = "";
  let usedUsda = false;

  if (isDietPlanQuestion(question)) {
    usedUsda = true;
    // Key Indian foods for a diet plan
    const foods = [
      "oats", "dal", "roti", "brown rice", "chana", "paneer", "egg", "vegetable curry",
      "chicken curry", "idli", "sambar", "poha", "upma", "aloo gobi", "khichdi", "tofu",
      "rajma", "palak paneer", "besan cheela", "missi roti"
    ];
    const facts = await getUsdaFactsForFoods(foods, usdaApiKey);

    const factsText = facts.map(f =>
      `${f.food} (${f.description}): ${f.protein}g protein, ${f.fat}g fat, ${f.carbs}g carbs, ${f.calories} kcal per 100g`
    ).join("; ");

    prompt = `
You are a nutritionist. Using the following USDA nutritional facts for common Indian foods, create a systematic, healthy 7-day Indian diet plan for the user. Each meal should be balanced and include a variety of these foods. Present the plan in a clear, conversational manner, weaving in nutrition values where relevant, but do not mention USDA or the database. Here are the facts: ${factsText}. User's request: ${question}
    `.trim();
  } else if (isFoodFactQuestion(question)) {
    const foodQuery = extractFoodName(question);
    const factsArr = await getUsdaFactsForFoods([foodQuery], usdaApiKey);

    if (factsArr.length > 0) {
      usedUsda = true;
      const f = factsArr[0];
      const facts = [
        f.protein ? `${f.protein}g protein` : null,
        f.fat ? `${f.fat}g fat` : null,
        f.carbs ? `${f.carbs}g carbs` : null,
        f.calories ? `${f.calories} kcal` : null
      ].filter(Boolean).join(", ") + ` in ${f.description} (per 100g)`;

      prompt = `You are a nutrition expert. Here are food facts: ${facts}. Answer the user's question in a concise, direct way based on these facts, as if you know them. User's question: ${question}`;
    } else {
      usedUsda = false;
      prompt = question;
    }
  } else {
    usedUsda = false;
    prompt = question;
  }

  // Ask Gemini
  const geminiBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });
  const geminiData = await geminiResponse.json();

  return NextResponse.json({
    answer: geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No answer.",
    usedUsda,
  });
}