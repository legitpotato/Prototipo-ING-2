// listModels.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function listarModelos() {
  try {
    const models = await genAI.listModels();
    console.log("📋 Modelos disponibles:");
    models.models.forEach((model) => {
      console.log(`- ${model.name}`);
    });
  } catch (error) {
    console.error("❌ Error al listar modelos:", error);
  }
}

listarModelos();
