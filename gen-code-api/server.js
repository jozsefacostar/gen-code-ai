const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { generateCode } = require("./src/services/ai.service");


const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
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

app.listen(3000, () =>
    console.log("happyCode API running on port 3000 🚀")
);
