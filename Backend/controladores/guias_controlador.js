// guias_controlador.js
// Maneja las peticiones de las guías de capacitación.

const modelo = require('../modelos/guias_modelo');
const reglas = require('../reglas');

// ── Ver guías ──────────────────────────────────────────────────────────────
// GET /api/guias            → todas las guías del oficio del usuario
// GET /api/guias?tipo=1     → solo las técnicas
// GET /api/guias?tipo=2     → solo las de salud ocupacional
async function verGuias(req, res) {
  try {
    // Validar el filtro opcional ?tipo=
    let tipo = null;
    if (req.query.tipo !== undefined) {
      tipo = Number(req.query.tipo);
      if (tipo !== reglas.TIPO_TECNICA && tipo !== reglas.TIPO_SALUD) {
        return res.status(400).json({ mensaje: 'El tipo debe ser 1 (técnica) o 2 (salud)' });
      }
    }

    // req.usuario viene de requiereSesion (trae id_usuario del token)
    const usuario = await modelo.obtenerOficioDeUsuario(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const guias = await modelo.listarGuias(usuario.id_oficio, tipo);
    res.json({ guias });

  } catch (error) {
    console.error('Error al ver guías:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener las guías' });
  }
}

module.exports = { verGuias };