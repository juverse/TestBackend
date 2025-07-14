import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4", // oder ein anderes Modell
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Fehler bei der Anfrage an OpenRouter");
  }
});

app.listen(3000, () => {
  console.log("OpenRouter-Proxy läuft auf Port 3000");
});
