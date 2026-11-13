// avance_controlador.js
// Calcula el avance del trabajador: cada prueba aprobada suma 50%.

const modelo = require("../modelos/avance_modelo");
const reglas = require("../reglas");

// Estados que cuentan como prueba aprobada
// (el test de salud también puede mostrarse como "Apto")
const ESTADOS_APROBADOS = ["Aprobado", "Apto"];

const ESTATUS_EN_PROCESO = "En Diagnóstico";
const ESTATUS_COMPLETADO = "Preparación Completada";
const ESTATUS_VENCIDA = "Vencida";

// Busca la evaluación más reciente de un tipo (1 técnica, 2 salud)
function buscarEvaluacion(evaluaciones, tipo) {
  return evaluaciones.find((e) => e.tipo_evaluacion === tipo);
}

// Arma el resumen de una prueba
function resumirPrueba(evaluacion) {
  if (!evaluacion) {
    return {
      calificacion: 0,
      estado: "Pendiente",
      aprobada: false,
      intentos: 0,
    };
  }
  return {
    calificacion: Number(evaluacion.calificacion),
    estado: evaluacion.estado_aprobacion,
    aprobada: ESTADOS_APROBADOS.includes(evaluacion.estado_aprobacion),
    intentos: evaluacion.intentos_acumulados || 0,
  };
}

// Ver avance
// GET /api/avance
// Regresa el porcentaje, el estatus y el resultado de cada prueba.
async function verAvance(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;

    const usuario = await modelo.obtenerEstatus(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const evaluaciones = await modelo.obtenerEvaluaciones(id_usuario);
    const tecnica = resumirPrueba(
      buscarEvaluacion(evaluaciones, reglas.TIPO_TECNICA),
    );
    const salud = resumirPrueba(
      buscarEvaluacion(evaluaciones, reglas.TIPO_SALUD),
    );

    // Cada prueba aprobada suma 50%
    const porcentaje = (tecnica.aprobada ? 50 : 0) + (salud.aprobada ? 50 : 0);

    // Estatus: con las dos aprobadas queda "Preparación Completada".
    // Si ya está "Vencida" no se toca: eso lo decide la Pre-Constancia.
    let estatus = usuario.estatus;
    if (estatus !== ESTATUS_VENCIDA) {
      estatus = porcentaje === 100 ? ESTATUS_COMPLETADO : ESTATUS_EN_PROCESO;
      if (estatus !== usuario.estatus) {
        await modelo.actualizarEstatus(id_usuario, estatus);
      }
    }

    // En salud ocupacional el trabajador no ve el número, solo el estado
    res.json({
      porcentaje,
      estatus,
      tecnica,
      salud: {
        estado: salud.estado,
        aprobada: salud.aprobada,
        intentos: salud.intentos,
      },
    });
  } catch (error) {
    console.error("Error al ver avance:", error.message);
    res.status(500).json({ mensaje: "Error al obtener el avance" });
  }
}

module.exports = { verAvance };
