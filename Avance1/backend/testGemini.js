// testGemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent("¿Cuál es la capital de Chile?");
    const response = await result.response;
    console.log("✅ Respuesta de Gemini:", response.text());
  } catch (error) {
    console.error("Error al probar Gemini:", error);
  }
}

testGemini();
