import app from "./src/app.js";
import { connectDB } from "./db.js";


// Conecta a una base de datos desde el puerto 4000
connectDB();
app.listen(4000)
console.log('Server on port', 4000)