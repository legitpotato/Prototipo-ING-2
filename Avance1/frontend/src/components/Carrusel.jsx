import React, { useState, useEffect } from 'react';

// Array que contiene las imágenes del carrusel y sus claves únicas.
const items = [
  { src: '../src/assets/slide1.png', key: 1 },
  { src: '../src/assets/slide2.png', key: 2 },
  { src: '../src/assets/slide3.png', key: 3 },
];

function Carrusel() {
  // Estado que controla el índice de la imagen actualmente activa.
  const [activeIndex, setActiveIndex] = useState(0);

  // Función para avanzar a la siguiente imagen.
  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Función para retroceder a la imagen anterior.
  const previous = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // useEffect para configurar la rotación automática
  useEffect(() => {
    const interval = setInterval(() => {
      next(); // Llama a la función 'next' cada X milisegundos
    }, 3000); // Cambia cada 3 segundos (3000 ms)

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl 
                 transition-transform duration-300 hover:scale-105 py-16 mt-4"
    >
      {/* Contenedor que desplaza las imágenes usando transform según el índice activo */}
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {/* Recorre el array de imágenes y renderiza cada una */}
        {items.map((item) => (
          <div className="min-w-full" key={item.key}>
            <img src={item.src} className="w-full h-full" alt={`Slide ${item.key}`} />
          </div>
        ))}
      </div>

      {/* Botón para retroceder a la imagen anterior */}
      <button 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 
                   bg-gray-600 opacity-50 text-white p-2 rounded hover:bg-black font-mono"
        onClick={previous}
      >
        ❮
      </button>

      {/* Botón para avanzar a la siguiente imagen */}
      <button 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 
                   bg-gray-600 opacity-50 text-white p-2 rounded hover:bg-black"
        onClick={next}
      >
        ❯
      </button>
    </div>
  );
}

export default Carrusel;
