// Importa la biblioteca axios para realizar solicitudes HTTP.
import axios from "axios";

// Crea una instancia personalizada de axios con configuraciones específicas.
const instance = axios.create({
    // Establece la URL base para todas las solicitudes realizadas con esta instancia.
    // Esto evita tener que repetir 'http://localhost:4000/api' en cada solicitud.
    baseURL: 'http://localhost:4000/api',
    
    // Permite que las solicitudes incluyan cookies y otras credenciales, 
    // lo cual es útil para autenticación basada en sesiones o tokens almacenados en cookies.
    withCredentials: true
});

// Exporta la instancia personalizada para que pueda ser utilizada en otros archivos del proyecto.
export default instance;
