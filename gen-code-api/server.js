import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { generateCode } from "./src/services/ai.service.js";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.inference.ai.azure.com"
});

console.log("BASE URL:", client.baseURL);

app.post("/generate", async (req, res) => {

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required"
    });
  }

  const result = await generateCode(prompt);

  res.json(result);

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`gen-code-ai API running on port ${PORT} 🚀`)
);