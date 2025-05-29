// libs/cohere.js
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function generarAnalisis(prompt) {
  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    return response.generations[0].text.trim();
  } catch (error) {
    console.error("Error al generar contenido con Cohere:", error);
    return null;
  }
}
