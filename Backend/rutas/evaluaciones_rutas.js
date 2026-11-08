// evaluaciones_rutas.js
// Define las rutas de los tests. Todas requieren sesión activa.
// :tipo es 1 (técnica) o 2 (salud)

const express     = require('express');
const ruta        = express.Router();
const controlador = require('../controladores/evaluaciones_controlador');
const { requiereSesion } = require('../seguridad/sesion');

// POST /api/evaluaciones/:tipo/iniciar → empezar (o continuar) el test
ruta.post('/:tipo/iniciar', requiereSesion, controlador.iniciar);

// GET /api/evaluaciones/:tipo/pregunta → ver la pregunta actual
ruta.get('/:tipo/pregunta', requiereSesion, controlador.verPregunta);

// POST /api/evaluaciones/:tipo/respuesta → contestar la pregunta actual
ruta.post('/:tipo/respuesta', requiereSesion, controlador.responder);

module.exports = ruta;