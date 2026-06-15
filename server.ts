import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is missing. Please configure it in the .env or secrets panel." });
      }

      const prompt = `You are HeyJipro AI, a smart and calm productivity companion for students. Your goal is to help brainstorm, analyze tasks, and give actionable advice on achieving habit goals.
Keep your responses relatively concise, encouraging, structured (use markdown), and focused.

Here is the current context of the user (their tasks and habits):
${JSON.stringify(context, null, 2)}

User Request: ${message}

Provide your response:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate response." });
    }
  });

  app.post("/api/generate-habits", async (req, res) => {
    try {
      const { goal } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is missing." });
      }

      const prompt = `The user wants to achieve this goal: "${goal}".
Generate 3 to 5 highly specific, atomic daily habits or daily study focus areas that will help them reach this goal.
For example, if the goal is "software engineer", do not return a generic "learn programming" habit. Instead, break it down into specific individual skills or languages to focus on daily, like "Study Java concepts", "Practice Laravel", "Solve 1 Algorithm puzzle". Apply this granular, 1-by-1 activity breakdown to whatever goal the user provides.
Respond ONLY with a JSON array of objects following exactly this schema. Do not use markdown wrapping or reasoning.
[
  { "title": "Specific actionable habit", "goal": 30, "unit": "days", "category": "A general short category name" }
]
The 'goal' number should be a realistic time period in days (e.g. 30, 60, 90).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text || "[]";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const habits = JSON.parse(text);

      res.json({ habits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate habits." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
