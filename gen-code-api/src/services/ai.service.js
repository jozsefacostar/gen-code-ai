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

  const response = await client.responses.create({
    model: "meta-llama/llama-3.1-8b-instruct:free",
    input: `
          You are a senior software engineer.
          Generate clean production-ready code.
          Return ONLY code.

          Instruction:
          ${instruction}

          Code Context:
          ${context}
`
  });

  return response.output_text;
};
          