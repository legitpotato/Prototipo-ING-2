import pool from '../db.js';  // Ajusta la ruta según tu estructura

export async function crearPago({
  descripcion,
  fecha_emision,
  fecha_vencimiento,
  monto_original,
  interes_acumulado = 0,
  monto_total,
  cuenta_destino,
  estado = 'pendiente'
}) {
  const query = `
    INSERT INTO "Pagos" (
      descripcion,
      fecha_emision,
      fecha_vencimiento,
      monto_original,
      interes_acumulado,
      monto_total,
      cuenta_destino,
      estado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    descripcion,
    fecha_emision,
    fecha_vencimiento,
    monto_original,
    interes_acumulado,
    monto_total,
    cuenta_destino,
    estado
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function obtenerPagos() {
  const { rows } = await pool.query('SELECT * FROM "Pagos" ORDER BY fecha_emision DESC;');
  return rows;
}

export async function obtenerPagoPorId(id) {
  const { rows } = await pool.query('SELECT * FROM "Pagos" WHERE id = $1;', [id]);
  return rows[0];
}

export async function obtenerPagosPorEstado(estado) {
  const { rows } = await pool.query(
    'SELECT * FROM "Pagos" WHERE estado = $1 ORDER BY fecha_emision DESC;',
    [estado]
  );
  return rows;
}
