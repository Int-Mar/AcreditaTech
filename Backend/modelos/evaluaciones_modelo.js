// evaluaciones_modelo.js
// Todas las consultas a la base de datos relacionadas con los tests.
// (tipo 1 = técnica, tipo 2 = salud)

const conexion = require('../conexion');

// Regresa el oficio del usuario (lo necesitamos para elegir sus preguntas)
async function obtenerOficioUsuario(id_usuario) {
  const resultado = await conexion.query(
    'SELECT id_oficio FROM musuario WHERE id_usuario = $1',
    [id_usuario]
  );
  return resultado.rows[0];
}

// Busca la evaluación del usuario para ese tipo de test (si ya existe)
async function buscarEvaluacion(id_usuario, tipo) {
  const resultado = await conexion.query(
    'SELECT * FROM eevaluacion WHERE id_usuario = $1 AND tipo_evaluacion = $2',
    [id_usuario, tipo]
  );
  return resultado.rows[0];
}

// Crea la evaluación del usuario para ese tipo de test y la regresa
async function crearEvaluacion(id_usuario, tipo) {
  const resultado = await conexion.query(
    `INSERT INTO eevaluacion (id_usuario, tipo_evaluacion)
     VALUES ($1, $2)
     RETURNING *`,
    [id_usuario, tipo]
  );
  return resultado.rows[0];
}

// Empieza un intento nuevo: marca el test "en curso", vuelve al caso 1
// y borra las respuestas del intento anterior.
async function empezarIntento(id_evaluacion) {
  await conexion.query(
    'DELETE FROM erespuesta WHERE id_evaluacion = $1',
    [id_evaluacion]
  );
  const resultado = await conexion.query(
    `UPDATE eevaluacion
     SET en_curso = true, caso_actual = 1
     WHERE id_evaluacion = $1
     RETURNING *`,
    [id_evaluacion]
  );
  return resultado.rows[0];
}

// Cuenta cuántas preguntas tiene el test para este usuario
// Técnico: preguntas de su oficio. Salud: preguntas sin oficio (para todos).
async function contarPreguntas(tipo, id_oficio) {
  const resultado = await conexion.query(
    `SELECT COUNT(*)::int AS total
     FROM cpregunta
     WHERE id_tipo_evaluacion = $1
       AND (id_oficio = $2 OR ($2::int IS NULL AND id_oficio IS NULL))`,
    [tipo, id_oficio]
  );
  return resultado.rows[0].total;
}

// Regresa la pregunta que está en la posición indicada (1, 2, 3...)
async function obtenerPreguntaPorPosicion(tipo, id_oficio, posicion) {
  const resultado = await conexion.query(
    `SELECT id_pregunta, tema, texto
     FROM cpregunta
     WHERE id_tipo_evaluacion = $1
       AND (id_oficio = $2 OR ($2::int IS NULL AND id_oficio IS NULL))
     ORDER BY id_pregunta
     OFFSET $3 LIMIT 1`,
    [tipo, id_oficio, posicion - 1]
  );
  return resultado.rows[0];
}

// Regresa las opciones de una pregunta SIN los puntos
async function obtenerOpciones(id_pregunta) {
  const resultado = await conexion.query(
    `SELECT id_opcion, texto
     FROM copcion
     WHERE id_pregunta = $1
     ORDER BY id_opcion`,
    [id_pregunta]
  );
  return resultado.rows;
}

module.exports = {
  obtenerOficioUsuario,
  buscarEvaluacion,
  crearEvaluacion,
  empezarIntento,
  contarPreguntas,
  obtenerPreguntaPorPosicion,
  obtenerOpciones,
};