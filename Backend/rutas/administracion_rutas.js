const express = require('express');
const router = express.Router();
const { requiereSesion, soloAdministrador } = require('../seguridad/sesion');
const controlador = require('../controladores/administracion_controlador');

// Todo lo de este archivo es solo para administradores
router.use(requiereSesion, soloAdministrador);

// Las usan menu.js, modificar-estatus.js y perfil.js (del equipo)
router.get('/estatus', controlador.obtenerEstatus);
router.put('/estatus', controlador.cambiarEstatus);
router.get('/padron/:tipo', controlador.obtenerPadron);
router.get('/perfil', controlador.obtenerPerfil);
router.put('/perfil', controlador.editarPerfil);

// Las usan mis pantallas (usuarios y estadísticas)
router.get('/estadisticas', controlador.obtenerEstadisticas);
router.get('/usuarios', controlador.listarUsuarios);
router.get('/usuarios/:id', controlador.obtenerUsuario);
router.put('/usuarios/:id', controlador.actualizarUsuario);
router.put('/usuarios/:id/bloqueo', controlador.cambiarBloqueo);

module.exports = router;