const express = require('express');
const router = express.Router();
const { requiereSesion, soloAdministrador } = require('../seguridad/sesion');
const controlador = require('../controladores/administracion_controlador');

// Todo lo de este archivo es solo para administradores
router.use(requiereSesion, soloAdministrador);

router.get('/usuarios', controlador.listarUsuarios);
router.get('/usuarios/:id', controlador.obtenerUsuario);
router.put('/usuarios/:id', controlador.actualizarUsuario);
router.put('/usuarios/:id/bloqueo', controlador.cambiarBloqueo);

module.exports = router;