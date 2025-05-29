// testOpenAI.js
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const prompt = `Analiza la siguiente lista de residentes morosos de un vecindario y a partir de su atraso en el pago, sugiere a la Directiva de la junta de vecinos si es bueno o no darles chance a repactar su deuda:

Residente: Sebastián Saa, RUT: 198399329, Monto: $50000, Vencimiento: 2025-02-04
Residente: Yobi Carrasco, RUT: 214327716, Monto: $50000, Vencimiento: 2025-03-04`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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

    console.log("✅ Respuesta de OpenAI:\n", chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error al probar OpenAI:", error);
  }
}

testOpenAI();
