// testCohere.js
import { generarAnalisis } from './libs/cohere.js';

const prompt = `Analiza la siguiente lista de residentes morosos de un vecindario y a partir de su atraso en el pago, sugiere a la Directiva de la junta de vecinos si es bueno o no darles chance a repactar su deuda:

Residente: Sebastián Saa, RUT: 198399329, Monto: $50000, Vencimiento: 2025-02-04
Residente: Yobi Carrasco, RUT: 214327716, Monto: $50000, Vencimiento: 2025-03-04`;

const main = async () => {
  const respuesta = await generarAnalisis(prompt);
  console.log("✅ Respuesta de Cohere:\n", respuesta);
};

main();
