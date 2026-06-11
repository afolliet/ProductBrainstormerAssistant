import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/generate", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Product description is required." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert marketing and brand architect. Based on the following product description, generate a comprehensive brand identity and marketing package. 

Important requirements for the visual descriptions:
- You must describe what the visual marketing materials would look like without giving actual images.
- Describe scenes across 5 mediums: billboard, newspaper, socialMedia, websiteBanner, packaging.
- Maintain strict product consistency across all visual descriptions. The product should look identical in style, form, and vibe in every marketing piece.
- DO NOT INCLUDE ANY PEOPLE in the descriptions of these visualizations. 
- Ensure a cohesive, professional aesthetic.

Product Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              positioningStatement: {
                type: Type.STRING,
                description: "A succinct and powerful product positioning statement",
              },
              targetAudience: {
                type: Type.OBJECT,
                description: "A detailed customer persona for the ideal target audience",
                properties: {
                  name: { type: Type.STRING },
                  demographics: { type: Type.STRING },
                  occupation: { type: Type.STRING },
                  interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                  painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["name", "demographics", "occupation", "interests", "painPoints", "goals"],
              },
              marketingStrategies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 core marketing strategies",
              },
              influencerRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Suggested types of influencers and how they would market the product",
              },
              contentIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific campaign or content ideas",
              },
              swot: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              visualDescriptions: {
                type: Type.OBJECT,
                properties: {
                  billboard: { type: Type.STRING, description: "Description of a billboard ad featuring the product (NO PEOPLE)" },
                  newspaper: { type: Type.STRING, description: "Description of a newspaper ad featuring the product (NO PEOPLE)" },
                  socialMedia: { type: Type.STRING, description: "Description of a social media post featuring the product (NO PEOPLE)" },
                  websiteBanner: { type: Type.STRING, description: "Description of a website banner featuring the product (NO PEOPLE)" },
                  packaging: { type: Type.STRING, description: "Description of the product packaging (NO PEOPLE)" },
                },
              },
            },
            required: [
              "positioningStatement", "targetAudience", "marketingStrategies", 
              "influencerRecommendations", "contentIdeas", "swot", "visualDescriptions"
            ],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate brand package. Please try again." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
