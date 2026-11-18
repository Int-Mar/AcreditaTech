// guias_modelo.js
// Consultas a la base de datos para las guías de capacitación (ctutorial).

const conexion = require("../conexion");

// Regresa el id del oficio de un usuario (o undefined si no existe)
async function obtenerOficioDeUsuario(id_usuario) {
  const resultado = await conexion.query(
    "SELECT id_oficio FROM musuario WHERE id_usuario = $1",
    [id_usuario],
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
    consulta += " AND id_tipo_evaluacion = $2";
    valores.push(tipo);
  }

  consulta += " ORDER BY id_tipo_evaluacion, id_tutorial";

  const resultado = await conexion.query(consulta, valores);
  return resultado.rows;
}

// Regresa solo las guías de REFUERZO de un usuario.
// Regla del Documento Maestro: una guía se habilita cuando el puntaje que el
// trabajador obtuvo en su tema es igual o menor al 50% de los puntos de ese tema.
// Se toma el último intento de cada prueba, y solo si ya la terminó.
// "tipo" (1 técnica, 2 salud) es opcional.
async function listarGuiasDeRefuerzo(id_usuario, id_oficio, tipo) {
  const resultado = await conexion.query(
    `WITH ultimas AS (
       -- último intento terminado de cada prueba
       SELECT DISTINCT ON (tipo_evaluacion) id_evaluacion
       FROM eevaluacion
       WHERE id_usuario = $1 AND estado_aprobacion <> 'Pendiente'
       ORDER BY tipo_evaluacion, id_evaluacion DESC
     ),
     maximo_pregunta AS (
       -- puntos máximos de cada pregunta (en checkbox se suman todas las opciones)
       SELECT p.id_pregunta, p.id_tipo_evaluacion, p.tema,
              CASE WHEN p.tipo_pregunta = 'checkbox'
                   THEN SUM(o.puntos) ELSE MAX(o.puntos) END AS maximo
       FROM cpregunta p
       JOIN copcion o ON o.id_pregunta = p.id_pregunta
       WHERE p.id_oficio = $2
       GROUP BY p.id_pregunta, p.id_tipo_evaluacion, p.tema, p.tipo_pregunta
     ),
     maximo_tema AS (
       SELECT id_tipo_evaluacion, tema, SUM(maximo) AS maximo
       FROM maximo_pregunta
       GROUP BY id_tipo_evaluacion, tema
     ),
     obtenido_tema AS (
       SELECT p.id_tipo_evaluacion, p.tema, SUM(r.puntos) AS obtenido
       FROM erespuesta r
       JOIN cpregunta p ON p.id_pregunta = r.id_pregunta
       JOIN ultimas u   ON u.id_evaluacion = r.id_evaluacion
       GROUP BY p.id_tipo_evaluacion, p.tema
     ),
     temas_debiles AS (
       SELECT m.tema
       FROM maximo_tema m
       JOIN obtenido_tema o
         ON o.id_tipo_evaluacion = m.id_tipo_evaluacion AND o.tema = m.tema
       WHERE o.obtenido * 2 <= m.maximo
     )
     SELECT g.id_tutorial, g.id_tipo_evaluacion, g.codigo, g.codigo_tema, g.tema,
            g.titulo, g.contenido_multimedia, g.infografia_sugerida
     FROM ctutorial g
     WHERE g.id_oficio = $2
       AND ($3::int IS NULL OR g.id_tipo_evaluacion = $3)
       AND EXISTS (
         -- el tema de la pregunta puede ser "E-S1 · EPP eléctrico" o solo el nombre
         SELECT 1 FROM temas_debiles t
         WHERE g.codigo_tema = split_part(t.tema, ' · ', 1)
            OR lower(g.tema) = lower(COALESCE(NULLIF(split_part(t.tema, ' · ', 2), ''), t.tema))
       )
     ORDER BY g.id_tipo_evaluacion, g.id_tutorial`,
    [id_usuario, id_oficio, tipo],
  );
  return resultado.rows;
}

module.exports = { obtenerOficioDeUsuario, listarGuias, listarGuiasDeRefuerzo };
