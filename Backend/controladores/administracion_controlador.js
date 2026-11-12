const modelo = require('../modelos/administracion_modelo');

function esIdValido(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

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

  // Mismas reglas del registro
  if (nombre !== undefined && !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{5,25}$/.test(nombre)) {
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
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarBloqueo,
  obtenerEstadisticas,
};