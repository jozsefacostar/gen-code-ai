import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://gen-code-ai.onrender.com",
    "X-Title": "gen-code-ai"
  }
});

export async function generateCode(prompt) {

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

  return response.choices[0].message.content;
}
