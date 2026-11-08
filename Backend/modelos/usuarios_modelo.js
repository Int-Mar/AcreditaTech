// usuarios_modelo.js
// Todas las consultas a la base de datos relacionadas con usuarios.

const conexion = require('../conexion');

// Busca un usuario por correo (para saber si ya existe)
async function buscarPorCorreo(correo) {
  const resultado = await conexion.query(
    'SELECT id_usuario FROM musuario WHERE correo = $1',
    [correo]
  );
  return resultado.rows[0];
}

// Busca un usuario por teléfono
async function buscarPorTelefono(telefono) {
  const resultado = await conexion.query(
    'SELECT id_usuario FROM musuario WHERE telefono = $1',
    [telefono]
  );
  return resultado.rows[0];
}

// Busca un usuario por CURP
async function buscarPorCurp(curp) {
  const resultado = await conexion.query(
    'SELECT id_usuario FROM musuario WHERE curp = $1',
    [curp]
  );
  return resultado.rows[0];
}

// Crea un usuario nuevo y regresa su id
async function crearUsuario(datos) {
  const resultado = await conexion.query(
    `INSERT INTO musuario
       (id_tipo_usuario, id_alcaldia, id_oficio,
        nombre, correo, contrasena, telefono, curp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id_usuario`,
    [
      1,
      datos.id_alcaldia,
      datos.id_oficio,
      datos.nombre,
      datos.correo,
      datos.contrasena,
      datos.telefono,
      datos.curp
    ]
  );
  return resultado.rows[0];
}

// Busca un usuario por correo y regresa TODO lo necesario para el login
async function buscarParaLogin(correo) {
  const resultado = await conexion.query(
    `SELECT id_usuario, id_tipo_usuario, contrasena
     FROM musuario
     WHERE correo = $1`,
    [correo]
  );
  return resultado.rows[0]; // undefined si no existe
}

// Regresa todas las alcaldías
async function obtenerAlcaldias() {
  const resultado = await conexion.query(
    'SELECT id_alcaldia, nombre_alcaldia FROM calcaldia ORDER BY id_alcaldia'
  );
  return resultado.rows;
}

// Regresa todos los oficios
async function obtenerOficios() {
  const resultado = await conexion.query(
    'SELECT id_oficio, nombre_oficio FROM coficio ORDER BY id_oficio'
  );
  return resultado.rows;
}


// Busca todos los datos del perfil de un usuario por su id
async function obtenerPerfil(id_usuario) {
  const resultado = await conexion.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.curp,
            u.foto_url, u.estatus, u.fecha_registro,
            u.id_alcaldia, a.nombre_alcaldia,
            u.id_oficio,   o.nombre_oficio
     FROM musuario u
     JOIN calcaldia a ON u.id_alcaldia = a.id_alcaldia
     JOIN coficio   o ON u.id_oficio   = o.id_oficio
     WHERE u.id_usuario = $1`,
    [id_usuario]
  );
  return resultado.rows[0];
}

// Edita nombre, teléfono, alcaldía y oficio
async function actualizarPerfil(id_usuario, datos) {
  const resultado = await conexion.query(
    `UPDATE musuario
     SET nombre      = $1,
         telefono    = $2,
         id_alcaldia = $3,
         id_oficio   = $4
     WHERE id_usuario = $5
     RETURNING id_usuario`,
    [datos.nombre, datos.telefono, datos.id_alcaldia, datos.id_oficio, id_usuario]
  );
  return resultado.rows[0];
}

// Guarda la URL pública de la foto en la base de datos
async function actualizarFoto(id_usuario, foto_url) {
  const resultado = await conexion.query(
    `UPDATE musuario
     SET foto_url = $1
     WHERE id_usuario = $2
     RETURNING id_usuario`,
    [foto_url, id_usuario]
  );
  return resultado.rows[0];
}

// Busca si un teléfono ya existe en OTRO usuario (para validar al editar)
async function buscarTelefonoDeOtro(telefono, id_usuario) {
  const resultado = await conexion.query(
    `SELECT id_usuario FROM musuario
     WHERE telefono = $1 AND id_usuario != $2`,
    [telefono, id_usuario]
  );
  return resultado.rows[0];
}


module.exports = {
  buscarPorCorreo,
  buscarPorTelefono,
  buscarPorCurp,
  crearUsuario,
  buscarParaLogin,
  obtenerAlcaldias,
  obtenerOficios,
  obtenerPerfil,
  actualizarPerfil,
  actualizarFoto,
  buscarTelefonoDeOtro
};