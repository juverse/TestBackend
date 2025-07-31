import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// Whitelist für CORS
const allowedOrigins = [
  "http://localhost:3000",   
  "http://localhost:5000",   
  "http://localhost:8000",       // für lokalen Test
  "https://juverse.github.io"    // GitHub Pages Domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blockiert Zugriff von: " + origin));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API-Key aus Umgebungsvariable
const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4",
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
    console.error("OpenRouter-Fehler:", err.response?.data || err.message);
    res.status(500).send("Fehler bei der Anfrage an OpenRouter");
  }
});

// Port dynamisch setzen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OpenRouter-Proxy läuft auf Port ${PORT}`);
});
