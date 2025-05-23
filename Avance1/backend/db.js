import mongoose from "mongoose";

// Conexion de la base de datos utilizando mongoose
// Mostrando en consola si la conexion es efectiva o no
// Conection to the DB
export const connectDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://yobi:nose@desarrolloweb.k2vh2.mongodb.net/biblioteca_db?retryWrites=true&w=majority&appName=DesarrolloWeb');
        console.log('>>> DB connected');
    }
    catch (error) {
        console.log(error);
    }
}