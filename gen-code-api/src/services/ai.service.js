const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateCode(userPrompt, context) {

  const systemPrompt = `
  You are a senior software engineer.
  Generate clean, production-ready code.
  Follow SOLID principles.
  Return only code without explanations.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `
        Instruction: ${userPrompt}
        Context: ${context}
        `
      }
    ],
    temperature: 0.2
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateCode
};
