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

  const systemPrompt = `
  You are a senior software engineer.
  Generate clean, production-ready code.
  Follow SOLID principles.
  Return only code without explanations.
  `;

  const response = await client.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: [
      {
        role: "system",
        content: "You are an expert software engineer. Generate only code without explanation."
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