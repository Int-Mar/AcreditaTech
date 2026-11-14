// constancia_rutas.js
// Rutas de la Pre-Constancia.

const express = require("express");
const ruta = express.Router();
const controlador = require("../controladores/constancia_controlador");
const { requiereSesion } = require("../seguridad/sesion");

// GET /api/constancia/pdf → descarga la Pre-Constancia (requiere sesión)
ruta.get("/pdf", requiereSesion, controlador.descargarPdf);

// GET /api/constancia/verificar/:codigo → consulta pública (SIN sesión)
ruta.get("/verificar/:codigo", controlador.verificar);

module.exports = ruta;
