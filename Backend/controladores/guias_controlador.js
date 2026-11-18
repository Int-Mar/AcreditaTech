// guias_controlador.js
// Maneja las peticiones de las guías de capacitación.

const modelo = require("../modelos/guias_modelo");
const reglas = require("../reglas");

// ── Ver guías ──────────────────────────────────────────────────────────────
// GET /api/guias            → todas las guías del oficio del usuario
// GET /api/guias?tipo=1     → solo las técnicas
// GET /api/guias?tipo=2     → solo las de salud ocupacional
// GET /api/guias?refuerzo=1 → solo las guías de los temas donde el trabajador
//                             sacó el 50% o menos de los puntos (se puede
//                             combinar con ?tipo=)
async function verGuias(req, res) {
  try {
    // Validar el filtro opcional ?tipo=
    let tipo = null;
    if (req.query.tipo !== undefined) {
      tipo = Number(req.query.tipo);
      if (tipo !== reglas.TIPO_TECNICA && tipo !== reglas.TIPO_SALUD) {
        return res
          .status(400)
          .json({ mensaje: "El tipo debe ser 1 (técnica) o 2 (salud)" });
      }
    }

    // Filtro opcional ?refuerzo=1 (o true)
    const soloRefuerzo =
      req.query.refuerzo === "1" || req.query.refuerzo === "true";

    // req.usuario viene de requiereSesion (trae id_usuario del token)
    const usuario = await modelo.obtenerOficioDeUsuario(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const guias = soloRefuerzo
      ? await modelo.listarGuiasDeRefuerzo(
          req.usuario.id_usuario,
          usuario.id_oficio,
          tipo,
        )
      : await modelo.listarGuias(usuario.id_oficio, tipo);

    res.json({ guias });
  } catch (error) {
    console.error("Error al ver guías:", error.message);
    res.status(500).json({ mensaje: "Error al obtener las guías" });
  }
}

module.exports = { verGuias };
