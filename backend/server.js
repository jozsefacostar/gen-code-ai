import express from "express";
import cors from "cors";
import { generateCode } from './services/ai.service.js'

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {

  try {

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const result = await generateCode(prompt);

    // 🔴 IMPORTANTE: envolver en { code }
    res.json({
      code: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`gen-code-ai API running on port ${PORT}`)
);