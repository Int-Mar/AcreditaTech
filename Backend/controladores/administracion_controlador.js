const modelo = require('../modelos/administracion_modelo');
const { esIdValido, esNombre } = require('../seguridad/validaciones');

function obtenerEstatus(req, res) {
  res.json(modelo.ESTATUS);
}

async function obtenerPadron(req, res) {
  const { tipo } = req.params;
  if (!['proceso', 'preconstancia'].includes(tipo)) {
    return res.status(400).json({ mensaje: 'Tipo de padrón no válido' });
  }
  try {
    const trabajadores = await modelo.obtenerPadron(tipo, {
      alcaldia: req.query.alcaldia,
      oficio: req.query.oficio,
      estatus: req.query.estatus,
    });
    res.json({ trabajadores });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el padrón' });
  }
}

async function cambiarEstatus(req, res) {
  const { correo, estatus } = req.body;
  if (typeof correo !== 'string' || !correo.trim()) {
    return res.status(400).json({ mensaje: 'Escribe el correo del trabajador' });
  }
  if (!modelo.ESTATUS.todos.includes(estatus)) {
    return res.status(400).json({ mensaje: 'Estatus no válido' });
  }
  try {
    const usuario = await modelo.cambiarEstatusPorCorreo(correo.trim(), estatus);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'No existe un trabajador con ese correo' });
    }
    res.json({ mensaje: `El estatus de ${usuario.nombre} cambió a "${usuario.estatus}"` });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar el estatus' });
  }
}

async function obtenerPerfil(req, res) {
  try {
    const perfil = await modelo.obtenerPerfilAdmin(req.usuario.id_usuario);
    if (!perfil) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
}

async function editarPerfil(req, res) {
  const { nombre } = req.body;
  if (!esNombre(nombre)) {
    return res.status(400).json({ mensaje: 'Nombre: solo letras, de 5 a 25 caracteres' });
  }
  try {
    const perfil = await modelo.actualizarNombreAdmin(req.usuario.id_usuario, nombre);
    res.json({ mensaje: 'Perfil actualizado', nombre: perfil.nombre });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
}

// ---------- Mis pantallas (usuarios y estadísticas) leen "error" ----------
async function listarUsuarios(req, res) {
  try {
    const usuarios = await modelo.listarUsuarios({
      q: req.query.q,
      id_oficio: req.query.oficio,
      id_alcaldia: req.query.alcaldia,
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerUsuario(req, res) {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({ error: 'Id no válido' });
  }
  try {
    const usuario = await modelo.obtenerUsuario(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizarUsuario(req, res) {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({ error: 'Id no válido' });
  }
  const { nombre, telefono, correo, id_alcaldia, id_oficio } = req.body;

  if (nombre !== undefined && !esNombre(nombre)) {
    return res.status(400).json({ error: 'Nombre: solo letras, de 5 a 25 caracteres' });
  }
  if (telefono !== undefined && !/^55\d{8}$/.test(telefono)) {
    return res.status(400).json({ error: 'Teléfono: 10 dígitos y empieza con 55' });
  }
  if (correo !== undefined && !(correo.endsWith('@gmail.com') && correo.length <= 50)) {
    return res.status(400).json({ error: 'Correo: debe terminar en @gmail.com (máximo 50)' });
  }

  try {
    const usuario = await modelo.actualizarUsuario(req.params.id, {
      nombre, telefono, correo, id_alcaldia, id_oficio,
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El correo o teléfono ya existe' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Alcaldía u oficio no válido' });
    }
    res.status(500).json({ error: error.message });
  }
}

async function cambiarBloqueo(req, res) {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({ error: 'Id no válido' });
  }
  const { bloqueado } = req.body;
  if (typeof bloqueado !== 'boolean') {
    return res.status(400).json({ error: 'Envía { "bloqueado": true } o { "bloqueado": false }' });
  }
  if (Number(req.params.id) === req.usuario.id_usuario) {
    return res.status(400).json({ error: 'No puedes bloquearte a ti mismo' });
  }
  try {
    const usuario = await modelo.cambiarBloqueo(req.params.id, bloqueado);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerEstadisticas(req, res) {
  try {
    const datos = await modelo.obtenerEstadisticas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerEstatus,
  obtenerPadron,
  cambiarEstatus,
  obtenerPerfil,
  editarPerfil,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarBloqueo,
  obtenerEstadisticas,
};