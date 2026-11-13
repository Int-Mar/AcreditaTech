// avance_rutas.js
// Define las rutas del avance. Requieren sesión activa.

const express = require("express");
const ruta = express.Router();
const controlador = require("../controladores/avance_controlador");
const { requiereSesion } = require("../seguridad/sesion");

// GET /api/avance → porcentaje, estatus y resultado de cada prueba
ruta.get("/", requiereSesion, controlador.verAvance);

module.exports = ruta;
