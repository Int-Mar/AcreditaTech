// acceso_rutas.js
// Le dice al servidor qué controlador usar para cada URL de acceso.

const express     = require('express');
const ruta        = express.Router();
const controlador = require('../controladores/acceso_controlador');

// GET  /api/acceso/catalogos      → regresa alcaldías y oficios
ruta.get('/catalogos', controlador.obtenerCatalogos);

// POST /api/acceso/registro       → registra un usuario nuevo
ruta.post('/registro', controlador.registrar);

// POST /api/acceso/iniciar-sesion → verifica credenciales y regresa un token
ruta.post('/iniciar-sesion', controlador.iniciarSesion);

module.exports = ruta;