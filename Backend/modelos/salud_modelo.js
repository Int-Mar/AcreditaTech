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

module.exports = { obtenerFicha, guardarFicha };