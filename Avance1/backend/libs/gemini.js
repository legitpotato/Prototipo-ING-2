import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);


export async function generarAnalisis(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  try {
    const result = await model.generateContent(prompt);
    console.log("Prompt enviado a Gemini:", prompt);
    const response = await result.response;
    console.log("Respuesta cruda de Gemini:", result);
    return response.text();
  } catch (error) {
    console.error('Error al generar contenido con Gemini:', error);
    return null;
  }
}
