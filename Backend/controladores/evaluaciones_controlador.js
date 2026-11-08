// evaluaciones_controlador.js
// Decide qué responder en cada petición del test.
// Paso 4: iniciar el test y ver la pregunta.

const modelo = require('../modelos/evaluaciones_modelo');
const reglas = require('../reglas');

// Revisa que el tipo de la dirección sea 1 (técnica) o 2 (salud)
function leerTipo(req) {
  const tipo = parseInt(req.params.tipo, 10);
  if (tipo === reglas.TIPO_TECNICA || tipo === reglas.TIPO_SALUD) {
    return tipo;
  }
  return null;
}

// Regresa a qué oficio pertenecen las preguntas:
// - técnica: el oficio del usuario
// - salud: null (las preguntas son para todos los oficios)
async function oficioDeLasPreguntas(tipo, id_usuario) {
  if (tipo === reglas.TIPO_SALUD) {
    return null;
  }
  const usuario = await modelo.obtenerOficioUsuario(id_usuario);
  return usuario ? usuario.id_oficio : undefined;
}

// Cuántas horas faltan para que termine el bloqueo (0 si no está bloqueado)
function horasQueFaltan(evaluacion) {
  if (evaluacion.intentos_acumulados < reglas.MAX_INTENTOS) {
    return 0;
  }
  if (!evaluacion.fecha_ultimo_intento) {
    return 0;
  }
  const desbloqueo =
    new Date(evaluacion.fecha_ultimo_intento).getTime() +
    reglas.HORAS_BLOQUEO * 60 * 60 * 1000;
  const faltan = (desbloqueo - Date.now()) / (60 * 60 * 1000);
  return faltan > 0 ? faltan : 0;
}

// ── Iniciar el test ───────────────────────────────────────────────────────
// POST /api/evaluaciones/:tipo/iniciar
async function iniciar(req, res) {
  const tipo = leerTipo(req);
  if (!tipo) {
    return res.status(400).json({ mensaje: 'Tipo de test inválido (usa 1 o 2)' });
  }

  try {
    const id_usuario = req.usuario.id_usuario;

    // Revisar que haya preguntas para este usuario
    const id_oficio = await oficioDeLasPreguntas(tipo, id_usuario);
    if (id_oficio === undefined) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    const total = await modelo.contarPreguntas(tipo, id_oficio);
    if (total === 0) {
      return res.status(404).json({ mensaje: 'Todavía no hay preguntas para este test' });
    }

    // Buscar la evaluación del usuario; si no existe, se crea
    let evaluacion = await modelo.buscarEvaluacion(id_usuario, tipo);
    if (!evaluacion) {
      evaluacion = await modelo.crearEvaluacion(id_usuario, tipo);
    }

    // Si tiene 5 intentos fallidos y no pasan 24 horas, no lo dejamos empezar
    const horas = horasQueFaltan(evaluacion);
    if (horas > 0) {
      return res.status(403).json({
        mensaje: 'Llegaste al máximo de intentos. Podrás intentarlo de nuevo más tarde.',
        horas_restantes: Math.ceil(horas),
      });
    }

    // Si había un test a medias, se continúa donde se quedó.
    // Si no, se empieza un intento nuevo desde el caso 1.
    if (!evaluacion.en_curso) {
      evaluacion = await modelo.empezarIntento(evaluacion.id_evaluacion);
    }

    res.json({
      mensaje: 'Test iniciado',
      caso_actual: evaluacion.caso_actual,
      total_casos: Math.min(total, 10),
    });

  } catch (error) {
    console.error('Error al iniciar el test:', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar el test' });
  }
}

// ── Ver la pregunta actual ────────────────────────────────────────────────
// GET /api/evaluaciones/:tipo/pregunta
async function verPregunta(req, res) {
  const tipo = leerTipo(req);
  if (!tipo) {
    return res.status(400).json({ mensaje: 'Tipo de test inválido (usa 1 o 2)' });
  }

  try {
    const id_usuario = req.usuario.id_usuario;

    const evaluacion = await modelo.buscarEvaluacion(id_usuario, tipo);
    if (!evaluacion || !evaluacion.en_curso) {
      return res.status(400).json({ mensaje: 'Primero debes iniciar el test' });
    }

    const id_oficio = await oficioDeLasPreguntas(tipo, id_usuario);
    const total = Math.min(await modelo.contarPreguntas(tipo, id_oficio), 10);

    const pregunta = await modelo.obtenerPreguntaPorPosicion(
      tipo,
      id_oficio,
      evaluacion.caso_actual
    );
    if (!pregunta) {
      return res.status(404).json({ mensaje: 'No se encontró la pregunta' });
    }

    // Las opciones se mandan SIN los puntos
    const opciones = await modelo.obtenerOpciones(pregunta.id_pregunta);

    res.json({
      caso: evaluacion.caso_actual,
      total_casos: total,
      pregunta: {
        id_pregunta: pregunta.id_pregunta,
        tema: pregunta.tema,
        texto: pregunta.texto,
        opciones,
      },
    });

  } catch (error) {
    console.error('Error al ver la pregunta:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener la pregunta' });
  }
}

// ── Responder una pregunta ────────────────────────────────────────────────
// POST /api/evaluaciones/:tipo/respuesta
// Recibe { id_pregunta, id_opcion }
async function responder(req, res) {
  const tipo = leerTipo(req);
  if (!tipo) {
    return res.status(400).json({ mensaje: 'Tipo de test inválido (usa 1 o 2)' });
  }

  const id_pregunta = parseInt(req.body.id_pregunta, 10);
  const id_opcion = parseInt(req.body.id_opcion, 10);
  if (!id_pregunta || !id_opcion) {
    return res.status(400).json({ mensaje: 'Faltan id_pregunta e id_opcion' });
  }

  try {
    const id_usuario = req.usuario.id_usuario;

    const evaluacion = await modelo.buscarEvaluacion(id_usuario, tipo);
    if (!evaluacion || !evaluacion.en_curso) {
      return res.status(400).json({ mensaje: 'Primero debes iniciar el test' });
    }

    const id_oficio = await oficioDeLasPreguntas(tipo, id_usuario);
    const total = Math.min(await modelo.contarPreguntas(tipo, id_oficio), 10);

    // Solo se puede contestar la pregunta actual (no se regresa ni se salta)
    const actual = await modelo.obtenerPreguntaPorPosicion(
      tipo,
      id_oficio,
      evaluacion.caso_actual
    );
    if (!actual || actual.id_pregunta !== id_pregunta) {
      return res.status(400).json({ mensaje: 'Esa no es la pregunta actual' });
    }

    // La opción debe existir y ser de esa pregunta
    const opcion = await modelo.obtenerOpcion(id_opcion);
    if (!opcion || opcion.id_pregunta !== id_pregunta) {
      return res.status(400).json({ mensaje: 'La opción no pertenece a esa pregunta' });
    }

    // Guardar la respuesta y avanzar al siguiente caso
    const guardada = await modelo.registrarRespuesta(
      evaluacion.id_evaluacion,
      id_pregunta,
      id_opcion,
      opcion.puntos,
      evaluacion.caso_actual
    );
    if (!guardada) {
      return res.status(409).json({ mensaje: 'Esta pregunta ya fue contestada' });
    }

    // Si todavía faltan preguntas, solo avisamos cuál sigue
    if (evaluacion.caso_actual < total) {
      return res.json({
        finalizado: false,
        siguiente_caso: evaluacion.caso_actual + 1,
        total_casos: total,
      });
    }

    // Era la última pregunta: sumar puntos y calificar.
    // Más de 50 es aprobado; 50 o menos es no aprobado.
    const calificacion = await modelo.sumarPuntos(evaluacion.id_evaluacion);
    const aprobado = calificacion > reglas.PUNTAJE_MINIMO;
    const estado = aprobado ? 'Aprobado' : 'No aprobado';
    await modelo.cerrarEvaluacion(evaluacion.id_evaluacion, calificacion, estado);

    res.json({
      finalizado: true,
      calificacion,
      aprobado,
      estado,
    });

  } catch (error) {
    console.error('Error al responder:', error.message);
    res.status(500).json({ mensaje: 'Error al guardar la respuesta' });
  }
}

module.exports = { iniciar, verPregunta, responder };