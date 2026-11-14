// constancia_modelo.js
// Consultas a la base de datos para la Pre-Constancia (tabla mpre_constancia).

const conexion = require("../conexion");

// Datos del trabajador para escribir en el PDF
async function obtenerDatosTrabajador(id_usuario) {
  const resultado = await conexion.query(
    `SELECT u.id_usuario, u.nombre, u.estatus,
            o.nombre_oficio, a.nombre_alcaldia
     FROM musuario u
     JOIN coficio   o ON o.id_oficio   = u.id_oficio
     JOIN calcaldia a ON a.id_alcaldia = u.id_alcaldia
     WHERE u.id_usuario = $1`,
    [id_usuario],
  );
  return resultado.rows[0];
}

// Evaluaciones del usuario con su id (la más reciente de cada tipo va primero)
async function obtenerEvaluacionesConId(id_usuario) {
  const resultado = await conexion.query(
    `SELECT id_evaluacion, tipo_evaluacion, estado_aprobacion
     FROM eevaluacion
     WHERE id_usuario = $1
     ORDER BY id_evaluacion DESC`,
    [id_usuario],
  );
  return resultado.rows;
}

// Constancia más reciente del usuario (o undefined si no tiene)
async function buscarConstanciaDeUsuario(id_usuario) {
  const resultado = await conexion.query(
    `SELECT id_constancia, codigo, fecha_emision, fecha_vencimiento, firma_digital
     FROM mpre_constancia
     WHERE id_usuario = $1
     ORDER BY id_constancia DESC
     LIMIT 1`,
    [id_usuario],
  );
  return resultado.rows[0];
}

// Crea la constancia. La fecha de vencimiento se calcula en la base:
// hoy + los meses de vigencia que marca reglas.js.
async function crearConstancia(datos) {
  const resultado = await conexion.query(
    `INSERT INTO mpre_constancia
       (id_evaluacion, id_usuario, codigo, folio_unico,
        fecha_emision, fecha_vencimiento, firma_digital, url_archivo_pdf)
     VALUES
       ($1, $2, $3, $3,
        CURRENT_DATE, (CURRENT_DATE + ($4 * INTERVAL '1 month'))::date, $5, $6)
     RETURNING id_constancia, codigo, fecha_emision, fecha_vencimiento, firma_digital`,
    [
      datos.id_evaluacion,
      datos.id_usuario,
      datos.codigo,
      datos.meses_vigencia,
      datos.firma,
      datos.url_archivo_pdf,
    ],
  );
  return resultado.rows[0];
}

// Consulta pública por código: SOLO datos que se pueden mostrar a cualquiera.
// No se piden teléfono, correo ni CURP.
async function buscarPorCodigo(codigo) {
  const resultado = await conexion.query(
    `SELECT c.codigo, c.fecha_emision, c.fecha_vencimiento,
            u.nombre, u.foto_url,
            o.nombre_oficio, a.nombre_alcaldia
     FROM mpre_constancia c
     JOIN musuario  u ON u.id_usuario  = c.id_usuario
     JOIN coficio   o ON o.id_oficio   = u.id_oficio
     JOIN calcaldia a ON a.id_alcaldia = u.id_alcaldia
     WHERE c.codigo = $1`,
    [codigo],
  );
  return resultado.rows[0];
}

module.exports = {
  obtenerDatosTrabajador,
  obtenerEvaluacionesConId,
  buscarConstanciaDeUsuario,
  crearConstancia,
  buscarPorCodigo,
};
