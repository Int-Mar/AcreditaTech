const express     = require('express');
const router      = express.Router();
const controlador = require('../controladores/administracion_controlador');
const { requiereSesion, soloAdministrador } = require('../seguridad/sesion');

router.use(requiereSesion, soloAdministrador);

router.get('/estatus', controlador.obtenerEstatus);

router.get('/padron/:tipo', controlador.verPadron);

router.put('/estatus', controlador.cambiarEstatus);

router.get('/perfil', controlador.verPerfil);

router.put('/perfil', controlador.editarPerfil);

module.exports = router;