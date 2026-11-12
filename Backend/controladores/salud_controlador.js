const modelo = require('../modelos/salud_modelo');

const NIVELES = ['Ninguno', 'Leve', 'Moderado', 'Fuerte'];
const COLORES = { Alto: 'rojo', Medio: 'amarillo', Bajo: 'verde' };

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

async function obtenerPreventiva(req, res) {
  try {
    const datos = await modelo.obtenerRespuestasSalud(req.usuario.id_usuario);
    if (!datos || datos.respuestas.length === 0) {
      return res.status(404).json({ error: 'Aún no hay respuestas del test de salud' });
    }

    // Agrupar por pregunta (las de casillas traen varias filas)
    const porPregunta = new Map();
    for (const r of datos.respuestas) {
      if (!porPregunta.has(r.id_pregunta)) {
        porPregunta.set(r.id_pregunta, { ...r, opciones: [], total: 0 });
      }
      const g = porPregunta.get(r.id_pregunta);
      g.opciones.push(r.opcion);
      g.total += r.puntos;
    }

    const ficha = [];
    const puntosPorTema = new Map();

    for (const g of porPregunta.values()) {
      if (g.total > 10) g.total = 10;

      // Áreas a reforzar: se suman los puntos de cada tema (máximo 20)
      const codigo = g.tema.split(' · ')[0];
      const nombre = g.tema.split(' · ')[1] || g.tema;
      const acumulado = puntosPorTema.get(codigo) || { nombre, puntos: 0 };
      acumulado.puntos += g.total;
      puntosPorTema.set(codigo, acumulado);

      // Nivel de riesgo y recomendación
      let nivel = g.nivel_riesgo;
      let recomendacion = g.recomendacion;
      if (g.tipo_pregunta === 'checkbox') {
        const regla = datos.reglas.find(
          (x) => x.id_pregunta === g.id_pregunta &&
                 g.total >= x.puntos_min && g.total <= x.puntos_max
        );
        nivel = regla ? regla.nivel_riesgo : null;
        recomendacion = regla ? regla.recomendacion : null;
      }

      if (nivel === 'Alto' || nivel === 'Medio') {
        ficha.push({
          tema: nombre,
          pregunta: g.texto,
          respuesta: g.opciones.join(', '),
          nivel_riesgo: nivel,
          color: COLORES[nivel],
          recomendacion,
        });
      }
    }

    // Tema con 10 puntos o menos (de 20) = área a reforzar
    const areas = [];
    for (const t of puntosPorTema.values()) {
      if (t.puntos <= 10) areas.push(t.nombre);
    }

    res.json({
      resultado: datos.estado,        // Apto / Necesita reforzamiento / Pendiente
      areas_a_reforzar: areas,
      ficha_preventiva: ficha,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtenerFicha, guardarFicha, obtenerPreventiva };