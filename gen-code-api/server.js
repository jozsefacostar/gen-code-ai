const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-constructor", async (req, res) => {

    const { code, filename } = req.body;

    try {

        const response = await fetch(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    model: "gpt-4.1",
                    messages: [
                        {
                            role: "system",
                            content: `
You are a senior C# refactoring assistant.
Generate a constructor using all properties.
Return ONLY a unified diff patch.
`
                        },
                        {
                            role: "user",
                            content: `
File: ${filename}

${code}
`
                        }
                    ]
                })
            }
        );

        const json = await response.json();

        res.json({
            diff: json.choices[0].message.content
        });


        res.json({
            diff: response.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }

});

app.listen(3000, () =>
    console.log("happyCode API running on port 3000 🚀")
);
