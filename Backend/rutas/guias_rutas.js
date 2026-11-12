// guias_rutas.js
// Define las rutas de las guías. Requieren sesión activa.

const express     = require('express');
const ruta        = express.Router();
const controlador = require('../controladores/guias_controlador');
const { requiereSesion } = require('../seguridad/sesion');

// GET /api/guias  → guías del oficio del usuario (opcional ?tipo=1 o ?tipo=2)
ruta.get('/', requiereSesion, controlador.verGuias);

module.exports = ruta;