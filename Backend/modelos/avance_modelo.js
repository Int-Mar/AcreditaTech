// avance_modelo.js
// Consultas a la base de datos para el avance del trabajador.

const conexion = require("../conexion");

// Regresa las evaluaciones del usuario (la más reciente de cada tipo va primero)
async function obtenerEvaluaciones(id_usuario) {
  const resultado = await conexion.query(
    `SELECT tipo_evaluacion, calificacion, estado_aprobacion,
            intentos_acumulados, fecha_ultimo_intento
     FROM eevaluacion
     WHERE id_usuario = $1
     ORDER BY id_evaluacion DESC`,
    [id_usuario],
  );
  return resultado.rows;
}

// Regresa el estatus actual del usuario (o undefined si no existe)
async function obtenerEstatus(id_usuario) {
  const resultado = await conexion.query(
    "SELECT estatus FROM musuario WHERE id_usuario = $1",
    [id_usuario],
  );
  return resultado.rows[0];
}

// Regresa el vencimiento de la Pre-Constancia más reciente (o undefined si no tiene)
async function obtenerVencimientoConstancia(id_usuario) {
  const resultado = await conexion.query(
    `SELECT fecha_vencimiento
     FROM mpre_constancia
     WHERE id_usuario = $1
     ORDER BY id_constancia DESC
     LIMIT 1`,
    [id_usuario],
  );
  return resultado.rows[0];
}

// Cambia el estatus del usuario
async function actualizarEstatus(id_usuario, estatus) {
  await conexion.query(
    "UPDATE musuario SET estatus = $2 WHERE id_usuario = $1",
    [id_usuario, estatus],
  );
}

module.exports = {
  obtenerEvaluaciones,
  obtenerEstatus,
  obtenerVencimientoConstancia,
  actualizarEstatus,
};
