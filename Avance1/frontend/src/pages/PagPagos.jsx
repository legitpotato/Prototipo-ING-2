import React, { useEffect, useState } from 'react';
import PagoDetalle from './PagDetalles';

export default function PagPagos() {
  const [pagos, setPagos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'pagados', 'pendientes'
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  useEffect(() => {
  fetch('http://localhost:4000/pagos')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error en la API: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setPagos(data);
      } else {
        console.error("Error: La respuesta de pagos no es un array", data);
        setPagos([]); 
      }
    })
    .catch(err => console.error("Error fetching pagos:", err));
}, []);


  // Filtrar pagos según estado
  const pagosFiltrados = pagos.filter(pago => {
    if (filtro === 'todos') return true;
    if (filtro === 'pagados') return pago.estado === 'pagado';
    if (filtro === 'pendientes') return pago.estado === 'pendiente';
    return true;
  });

  return (
    <div style={{ padding: 20, color: 'black' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Sección de Pagos</h1>

      {!pagoSeleccionado && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <label htmlFor="filtro" style={{ marginRight: 10, alignSelf: 'center' }}>Filtrar por estado:</label>
            <select
              id="filtro"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '1rem' }}
            >
              <option value="todos">Todos</option>
              <option value="pagados">Pagados</option>
              <option value="pendientes">Pendientes</option>
            </select>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Descripción</th>
                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
                {pagosFiltrados.map(pago => (
                    <tr
                    key={pago.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPagoSeleccionado(pago)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d1e7fd'}  // color uniforme al pasar mouse
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} // vuelve a transparente al salir
                    >
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{pago.descripcion}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{pago.estado}</td>
                    </tr>
                ))}
                </tbody>
          </table>
        </>
      )}

      {pagoSeleccionado && (
        <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc', borderRadius: 4, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 20 }}>Detalles del pago</h2>
          <PagoDetalle pago={pagoSeleccionado} />
          <button
            onClick={() => setPagoSeleccionado(null)}
            style={{
              marginTop: 20,
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 4,
              border: 'none',
              backgroundColor: '#007BFF',
              color: 'white',
            }}
          >
            Volver a la lista
          </button>
        </div>
      )}
    </div>
  );
}
