const jwt = require('jsonwebtoken');
const reglas = require('../reglas');

function requiereSesion(req, res, next) {
  const encabezado = req.headers.authorization || '';
  const token = encabezado.replace('Bearer ', '');
  try {
    req.usuario = jwt.verify(token, process.env.CLAVE_TOKEN);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
  }
}

function soloAdministrador(req, res, next) {
  if (req.usuario && req.usuario.id_tipo_usuario === reglas.ROL_ADMINISTRADOR) {
    return next();
  }
  res.status(403).json({ error: 'Solo para administradores' });
}

module.exports = { requiereSesion, soloAdministrador };