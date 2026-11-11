const conexion = require('../conexion');

// Lista de usuarios con buscador y filtros (nunca regresa la contraseña)
async function listarUsuarios({ q, id_oficio, id_alcaldia }) {
  const condiciones = [];
  const valores = [];

  if (q) {
    valores.push('%' + q + '%');
    condiciones.push(
      `(u.nombre ILIKE $${valores.length} OR u.correo ILIKE $${valores.length})`
    );
  }
  if (id_oficio) {
    valores.push(id_oficio);
    condiciones.push(`u.id_oficio = $${valores.length}`);
  }
  if (id_alcaldia) {
    valores.push(id_alcaldia);
    condiciones.push(`u.id_alcaldia = $${valores.length}`);
  }

  const donde = condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : '';

  const resultado = await conexion.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.estatus, u.bloqueado,
            u.id_tipo_usuario, o.nombre_oficio, a.nombre_alcaldia
       FROM musuario u
       JOIN coficio o   ON o.id_oficio = u.id_oficio
       JOIN calcaldia a ON a.id_alcaldia = u.id_alcaldia
       ${donde}
      ORDER BY u.id_usuario`,
    valores
  );
  return resultado.rows;
}

// Un usuario completo, con sus evaluaciones
async function obtenerUsuario(id) {
  const usuario = await conexion.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.curp, u.foto_url,
            u.estatus, u.bloqueado, u.fecha_registro, u.id_tipo_usuario,
            u.id_oficio, o.nombre_oficio,
            u.id_alcaldia, a.nombre_alcaldia
       FROM musuario u
       JOIN coficio o   ON o.id_oficio = u.id_oficio
       JOIN calcaldia a ON a.id_alcaldia = u.id_alcaldia
      WHERE u.id_usuario = $1`,
    [id]
  );
  if (usuario.rows.length === 0) return null;

  const evaluaciones = await conexion.query(
    `SELECT tipo_evaluacion, calificacion, estado_aprobacion,
            intentos_acumulados, fecha_ultimo_intento
       FROM eevaluacion
      WHERE id_usuario = $1
      ORDER BY tipo_evaluacion`,
    [id]
  );

  return { ...usuario.rows[0], evaluaciones: evaluaciones.rows };
}

// Editar datos (lo que no se envía se queda igual)
async function actualizarUsuario(id, datos) {
  const resultado = await conexion.query(
    `UPDATE musuario
        SET nombre      = COALESCE($1, nombre),
            telefono    = COALESCE($2, telefono),
            correo      = COALESCE($3, correo),
            id_alcaldia = COALESCE($4, id_alcaldia),
            id_oficio   = COALESCE($5, id_oficio)
      WHERE id_usuario = $6
      RETURNING id_usuario, nombre, correo, telefono, id_alcaldia, id_oficio`,
    [
      datos.nombre || null,
      datos.telefono || null,
      datos.correo || null,
      datos.id_alcaldia || null,
      datos.id_oficio || null,
      id,
    ]
  );
  return resultado.rows[0] || null;
}

// Bloquear o desbloquear
async function cambiarBloqueo(id, bloqueado) {
  const resultado = await conexion.query(
    `UPDATE musuario SET bloqueado = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, nombre, bloqueado`,
    [bloqueado, id]
  );
  return resultado.rows[0] || null;
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarBloqueo,
};