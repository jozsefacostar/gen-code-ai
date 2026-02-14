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
app.post("/generate", async (req, res) => {

  try {

    const { instruction, context } = req.body;

    if (!instruction)
      return res.status(400).json({
        error: "Instruction is required"
      });

    const result = await generateCode(instruction, context);

    res.json({
      code: result
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "AI generation failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`gen-code-ai API running on port ${PORT} 🚀`)
);