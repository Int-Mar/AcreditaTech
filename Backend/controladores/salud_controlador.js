const modelo = require('../modelos/salud_modelo');

const NIVELES = ['Ninguno', 'Leve', 'Moderado', 'Fuerte'];

async function obtenerFicha(req, res) {
  try {
    const ficha = await modelo.obtenerFicha(req.usuario.id_usuario);
    res.json(ficha || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function guardarFicha(req, res) {
  const d = req.body;

  for (const campo of ['dolor_espalda', 'dolor_hombros_cuello']) {
    if (d[campo] !== undefined && d[campo] !== null && !NIVELES.includes(d[campo])) {
      return res.status(400).json({ error: campo + ' debe ser: ' + NIVELES.join(', ') });
    }
  }
  if (d.horas_trabajo_dia !== undefined && d.horas_trabajo_dia !== null &&
      !(Number.isInteger(d.horas_trabajo_dia) && d.horas_trabajo_dia >= 0 && d.horas_trabajo_dia <= 24)) {
    return res.status(400).json({ error: 'horas_trabajo_dia debe ser un número entre 0 y 24' });
  }
  for (const campo of ['usa_casco', 'usa_guantes', 'usa_lentes', 'usa_calzado_seguridad']) {
    if (d[campo] !== undefined && d[campo] !== null && typeof d[campo] !== 'boolean') {
      return res.status(400).json({ error: campo + ' debe ser true o false' });
    }
  }
  if (d.observaciones && d.observaciones.length > 255) {
    return res.status(400).json({ error: 'observaciones: máximo 255 caracteres' });
  }

  try {
    const ficha = await modelo.guardarFicha(req.usuario.id_usuario, d);
    res.json(ficha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtenerFicha, guardarFicha };