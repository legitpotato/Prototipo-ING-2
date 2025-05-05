import React from 'react'; // Importa React para usar JSX
import Carrusel from '../components/Carrusel'; // Importa el componente Carrusel

function PagPrincipal() {
  return (
    <div className="bg-cover bg-center min-h-screen"> {/* Aplica un fondo que cubre toda la pantalla */}
      
      <Carrusel/> {/* Renderiza el componente Carrusel que puede ser un carrusel de imágenes o contenido */}

      <section className="flex flex-col items-center font-mono"> {/* Contenedor principal para los libros populares */}
        <h2 className="text-4xl text-white font-bold">POPULARES ESTE MES</h2> {/* Título de la sección */}
        
        <div className="flex flex-wrap justify-center gap-8 mt-20"> {/* Contenedor de los libros populares con espacio entre ellos */}
          
          {/* Primer libro */}
          <div className="bg-white bg-opacity-90 p-5 rounded-lg text-center shadow-lg max-w-xs font-mono transition-transform duration-300 hover:scale-105">
            <img src="src/assets/tolkien.jpg" alt="La comunidad del Anillo" className="w-full h-96 object-cover rounded-md" /> {/* Imagen del libro */}
            <h3 className="text-black text-xl font-bold mt-4">La comunidad del Anillo</h3> {/* Título del libro */}
            <p className="text-gray-600">J.R.R. Tolkien</p> {/* Autor del libro */}
          </div>

          {/* Segundo libro */}
          <div className="bg-white bg-opacity-90 p-5 rounded-lg text-center shadow-lg max-w-xs font-mono transition-transform duration-300 hover:scale-105">
            <img src="src/assets/serway.jpg" alt="Serway Física" className="w-full h-96 object-cover rounded-md" /> {/* Imagen del libro */}
            <h3 className="text-black text-xl font-bold mt-4">Serway Física</h3> {/* Título del libro */}
            <p className="text-gray-600">Raymond A. Serway</p> {/* Autor del libro */}
          </div>

          {/* Tercer libro */}
          <div className="bg-white bg-opacity-90 p-5 rounded-lg text-center shadow-lg max-w-xs font-mono transition-transform duration-300 hover:scale-105">
            <img src="src/assets/mac.jpg" alt="Mac el microbio desconocido" className="w-full h-96 object-cover rounded-md" /> {/* Imagen del libro */}
            <h3 className="text-black text-xl font-bold mt-4">Mac el microbio desconocido</h3> {/* Título del libro */}
            <p className="text-gray-600">Hernán del Solar</p> {/* Autor del libro */}
          </div>
          
        </div>
      </section>
    </div>
  )
}

export default PagPrincipal;
