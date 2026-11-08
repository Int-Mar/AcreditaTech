// perfil_rutas.js
// Define las rutas del perfil. Todas requieren sesión activa.

const express      = require('express');
const ruta         = express.Router();
const multer       = require('multer');
const controlador  = require('../controladores/perfil_controlador');
const { requiereSesion } = require('../seguridad/sesion');

// multer en memoria: la imagen no se guarda en disco,
// se queda en RAM y la mandamos directo a Supabase Storage
const subida = multer({ storage: multer.memoryStorage() });

// GET  /api/perfil       → ver datos del perfil
ruta.get('/', requiereSesion, controlador.verPerfil);

// PUT  /api/perfil       → editar nombre, teléfono, alcaldía, oficio
ruta.put('/', requiereSesion, controlador.editarPerfil);

// POST /api/perfil/foto  → subir foto de perfil
// "foto" es el nombre del campo que debe venir en el formulario
ruta.post('/foto', requiereSesion, subida.single('foto'), controlador.subirFoto);

module.exports = ruta;