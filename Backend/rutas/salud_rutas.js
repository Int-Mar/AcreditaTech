const express = require('express');
const router = express.Router();
const { requiereSesion } = require('../seguridad/sesion');
const controlador = require('../controladores/salud_controlador');

router.get('/ficha', requiereSesion, controlador.obtenerFicha);
router.put('/ficha', requiereSesion, controlador.guardarFicha);

module.exports = router;