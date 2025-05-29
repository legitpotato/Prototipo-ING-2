import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generarAnalisis(prompt) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4', // o 'gpt-4' si tienes acceso
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en gestión de comunidades residenciales.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error al generar contenido con OpenAI:', error);
    return null;
  }
}
