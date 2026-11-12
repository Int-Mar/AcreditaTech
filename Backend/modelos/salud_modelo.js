const conexion = require('../conexion');

async function obtenerFicha(id_usuario) {
  const r = await conexion.query(
    'SELECT * FROM mficha_salud WHERE id_usuario = $1',
    [id_usuario]
  );
  return r.rows[0] || null;
}

async function guardarFicha(id_usuario, d) {
  const r = await conexion.query(
    `INSERT INTO mficha_salud
       (id_usuario, dolor_espalda, dolor_hombros_cuello, horas_trabajo_dia,
        usa_casco, usa_guantes, usa_lentes, usa_calzado_seguridad, observaciones)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (id_usuario) DO UPDATE SET
        dolor_espalda = EXCLUDED.dolor_espalda,
        dolor_hombros_cuello = EXCLUDED.dolor_hombros_cuello,
        horas_trabajo_dia = EXCLUDED.horas_trabajo_dia,
        usa_casco = EXCLUDED.usa_casco,
        usa_guantes = EXCLUDED.usa_guantes,
        usa_lentes = EXCLUDED.usa_lentes,
        usa_calzado_seguridad = EXCLUDED.usa_calzado_seguridad,
        observaciones = EXCLUDED.observaciones,
        fecha_actualizacion = now()
     RETURNING *`,
    [
      id_usuario,
      d.dolor_espalda ?? null,
      d.dolor_hombros_cuello ?? null,
      d.horas_trabajo_dia ?? null,
      d.usa_casco ?? null,
      d.usa_guantes ?? null,
      d.usa_lentes ?? null,
      d.usa_calzado_seguridad ?? null,
      d.observaciones ?? null,
    ]
  );
  return r.rows[0];
}

// Respuestas del test de salud del usuario, con su riesgo y recomendación
async function obtenerRespuestasSalud(id_usuario) {
  const ev = await conexion.query(
    `SELECT id_evaluacion, estado_aprobacion
       FROM eevaluacion
      WHERE id_usuario = $1 AND tipo_evaluacion = 2`,
    [id_usuario]
  );
  if (ev.rows.length === 0) return null;

  const id_evaluacion = ev.rows[0].id_evaluacion;

  const respuestas = await conexion.query(
    `SELECT p.id_pregunta, p.tema, p.texto, p.tipo_pregunta,
            o.texto AS opcion, r.puntos, o.nivel_riesgo, o.recomendacion
       FROM erespuesta r
       JOIN cpregunta p ON p.id_pregunta = r.id_pregunta
       JOIN copcion o   ON o.id_opcion = r.id_opcion
      WHERE r.id_evaluacion = $1
      ORDER BY p.id_pregunta, r.id_respuesta`,
    [id_evaluacion]
  );

  const reglas = await conexion.query(
    `SELECT id_pregunta, puntos_min, puntos_max, nivel_riesgo, recomendacion
       FROM cregla_ficha
      WHERE id_pregunta IN (
        SELECT id_pregunta FROM erespuesta WHERE id_evaluacion = $1)`,
    [id_evaluacion]
  );

  return {
    estado: ev.rows[0].estado_aprobacion,
    respuestas: respuestas.rows,
    reglas: reglas.rows,
  };
}

module.exports = { obtenerFicha, guardarFicha, obtenerRespuestasSalud };