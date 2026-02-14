import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://gen-code-ai.onrender.com",
    "X-Title": "gen-code-ai"
  }
});

export const generateCode = async (instruction, context) => {

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a senior software engineer. Generate only clean production-ready code."
      },
      {
        role: "user",
        content: `
Instruction:
${instruction}

Code Context:
${context}
`
      }
    ]
  });

  return response.choices[0].message.content;
};

