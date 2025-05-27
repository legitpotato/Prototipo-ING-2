import React, { useState, useEffect } from 'react';

const items = [
  { src: '../src/assets/perro.jpg', key: 1 },
  { src: '../src/assets/porton.png', key: 2 },
  { src: '../src/assets/completada.jpg', key: 3 },
];

function Carrusel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const previous = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-visible py-6 mt-4 rounded-xl">
      
      {/* Contenedor que recorta la imagen visible */}
      <div className="overflow-hidden w-full">
        {/* Contenedor que se mueve para mostrar la imagen activa */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div className="min-w-full" key={item.key}>
              <img
                src={item.src}
                className="w-full h-80 object-contain mx-auto"
                alt={`Slide ${item.key}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones afuera */}
      <button
        className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-gray-600 opacity-90 text-white p-2 rounded hover:bg-indigo-600 font-mono z-10"
        onClick={previous}
      >
        ❮
      </button>

      <button
        className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-gray-600 opacity-90 text-white p-2 rounded hover:bg-indigo-600 z-10"
        onClick={next}
      >
        ❯
      </button>
    </div>
  );
}

export default Carrusel;
