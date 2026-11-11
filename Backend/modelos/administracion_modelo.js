const conexion = require('../conexion');
const reglas   = require('../reglas');

async function listarTrabajadores({ estatusPermitidos, id_alcaldia, id_oficio, estatus }) {
  const condiciones = ['u.id_tipo_usuario = $1', 'u.estatus = ANY($2)'];
  const valores = [reglas.ROL_TRABAJADOR, estatusPermitidos];

  if (id_alcaldia) {
    valores.push(id_alcaldia);
    condiciones.push(`u.id_alcaldia = $${valores.length}`);
  }
  if (id_oficio) {
    valores.push(id_oficio);
    condiciones.push(`u.id_oficio = $${valores.length}`);
  }
  if (estatus) {
    valores.push(estatus);
    condiciones.push(`u.estatus = $${valores.length}`);
  }

  const resultado = await conexion.query(
    `SELECT u.id_usuario, u.nombre, u.correo,
            a.nombre_alcaldia, o.nombre_oficio, u.estatus
     FROM musuario u
     JOIN calcaldia a ON u.id_alcaldia = a.id_alcaldia
     JOIN coficio   o ON u.id_oficio   = o.id_oficio
     WHERE ${condiciones.join(' AND ')}
     ORDER BY u.nombre`,
    valores
  );
  return resultado.rows;
}

async function actualizarEstatusPorCorreo(correo, estatus) {
  const resultado = await conexion.query(
    `UPDATE musuario
     SET estatus = $1
     WHERE lower(correo) = $2 AND id_tipo_usuario = $3
     RETURNING id_usuario, nombre, correo, estatus`,
    [estatus, correo, reglas.ROL_TRABAJADOR]
  );
  return resultado.rows[0];
}

async function obtenerAdmin(id_usuario) {
  const resultado = await conexion.query(
    `SELECT id_usuario, nombre, correo
     FROM musuario
     WHERE id_usuario = $1 AND id_tipo_usuario = $2`,
    [id_usuario, reglas.ROL_ADMINISTRADOR]
  );
  return resultado.rows[0];
}

async function actualizarNombreAdmin(id_usuario, nombre) {
  const resultado = await conexion.query(
    `UPDATE musuario
     SET nombre = $1
     WHERE id_usuario = $2 AND id_tipo_usuario = $3
     RETURNING id_usuario`,
    [nombre, id_usuario, reglas.ROL_ADMINISTRADOR]
  );
  return resultado.rows[0];
}

module.exports = {
  listarTrabajadores,
  actualizarEstatusPorCorreo,
  obtenerAdmin,
  actualizarNombreAdmin,
};