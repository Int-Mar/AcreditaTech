// guias_modelo.js
// Consultas a la base de datos para las guías de capacitación (ctutorial).

const conexion = require('../conexion');

// Regresa el id del oficio de un usuario (o undefined si no existe)
async function obtenerOficioDeUsuario(id_usuario) {
  const resultado = await conexion.query(
    'SELECT id_oficio FROM musuario WHERE id_usuario = $1',
    [id_usuario]
  );
  return resultado.rows[0];
}

// Regresa las guías de un oficio.
// Si viene "tipo" (1 técnica, 2 salud) filtra por ese tipo.
async function listarGuias(id_oficio, tipo) {
  let consulta = `
    SELECT id_tutorial, id_tipo_evaluacion, codigo, codigo_tema, tema,
           titulo, contenido_multimedia, infografia_sugerida
    FROM ctutorial
    WHERE id_oficio = $1`;
  const valores = [id_oficio];

  if (tipo) {
    consulta += ' AND id_tipo_evaluacion = $2';
    valores.push(tipo);
  }

  consulta += ' ORDER BY id_tipo_evaluacion, id_tutorial';

  const resultado = await conexion.query(consulta, valores);
  return resultado.rows;
}

module.exports = { obtenerOficioDeUsuario, listarGuias };