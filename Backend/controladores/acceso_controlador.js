// acceso_controlador.js
// Reglas del negocio: validar datos, cifrar, generar token, decidir qué responder.

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const modelo = require('../modelos/usuarios_modelo');

// ── Catálogos ──────────────────────────────────────────────────────────────
// GET /api/acceso/catalogos
async function obtenerCatalogos(req, res) {
  try {
    const alcaldias = await modelo.obtenerAlcaldias();
    const oficios   = await modelo.obtenerOficios();
    res.json({ alcaldias, oficios });
  } catch (error) {
    console.error('Error en catalogos:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener catálogos' });
  }
}

// ── Registro ───────────────────────────────────────────────────────────────
// POST /api/acceso/registro
async function registrar(req, res) {
  const {
    nombre, correo, contrasena,
    telefono, curp,
    id_alcaldia, id_oficio,
    acepta_terminos
  } = req.body;

  // Validar que llegaron todos los campos
  if (!nombre || !correo || !contrasena ||
      !telefono || !curp ||
      !id_alcaldia || !id_oficio) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  if (!acepta_terminos) {
    return res.status(400).json({ mensaje: 'Debes aceptar los términos' });
  }

  // Nombre: solo letras y espacios, 5-25 caracteres
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{5,25}$/;
  if (!regexNombre.test(nombre.trim())) {
    return res.status(400).json({
      mensaje: 'Nombre inválido: solo letras, entre 5 y 25 caracteres'
    });
  }

  // Teléfono: 10 dígitos empezando con 55
  const regexTel = /^55\d{8}$/;
  if (!regexTel.test(telefono)) {
    return res.status(400).json({
      mensaje: 'Teléfono inválido: 10 dígitos comenzando con 55'
    });
  }

  // Correo: termina en @gmail.com, máximo 50 caracteres
  const regexCorreo = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/;
  if (!regexCorreo.test(correo) || correo.length > 50) {
    return res.status(400).json({
      mensaje: 'Correo inválido: debe ser @gmail.com de máximo 50 caracteres'
    });
  }

  // Contraseña: 8-20 caracteres
  if (contrasena.length < 8 || contrasena.length > 20) {
    return res.status(400).json({
      mensaje: 'Contraseña inválida: debe tener entre 8 y 20 caracteres'
    });
  }

  // CURP: exactamente 18 caracteres
  if (curp.length !== 18) {
    return res.status(400).json({
      mensaje: 'CURP inválida: debe tener 18 caracteres'
    });
  }

  // Revisar duplicados
  const correoExiste   = await modelo.buscarPorCorreo(correo);
  const telefonoExiste = await modelo.buscarPorTelefono(telefono);
  const curpExiste     = await modelo.buscarPorCurp(curp.toUpperCase());

  if (correoExiste) {
    return res.status(409).json({ mensaje: 'El correo ya está registrado' });
  }
  if (telefonoExiste) {
    return res.status(409).json({ mensaje: 'El teléfono ya está registrado' });
  }
  if (curpExiste) {
    return res.status(409).json({ mensaje: 'La CURP ya está registrada' });
  }

  // Cifrar la contraseña
  const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

  // Guardar en la base de datos
  try {
    const nuevo = await modelo.crearUsuario({
      id_alcaldia:  Number(id_alcaldia),
      id_oficio:    Number(id_oficio),
      nombre:       nombre.trim(),
      correo:       correo.toLowerCase(),
      contrasena:   contrasenaCifrada,
      telefono,
      curp:         curp.toUpperCase()
    });

    res.status(201).json({
      mensaje: '¡Registro exitoso!',
      id_usuario: nuevo.id_usuario
    });

  } catch (error) {
    console.error('Error al registrar:', error.message);
    res.status(500).json({ mensaje: 'Error interno al registrar' });
  }
}

// ── Login ──────────────────────────────────────────────────────────────────
// POST /api/acceso/iniciar-sesion
async function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;

  // 1. Validar que llegaron los dos campos
  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  // 2. Buscar el usuario en la base de datos
  const usuario = await modelo.buscarParaLogin(correo.toLowerCase());

  // 3. Si no existe el correo, responder igual que si la contraseña fuera mala
  //    (nunca decimos cuál de los dos falló, por seguridad)
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  // 4. Comparar la contraseña que llegó con la cifrada que está en la BD
  const contrasenaCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaCorrecta) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  // 5. Generar el token JWT
  //    El token lleva id_usuario e id_tipo_usuario, dura 8 horas,
  //    y está firmado con la clave secreta del .env
  const token = jwt.sign(
    {
      id_usuario:      usuario.id_usuario,
      id_tipo_usuario: usuario.id_tipo_usuario
    },
    process.env.CLAVE_TOKEN,
    { expiresIn: '8h' }
  );

  // 6. Responder con el token
  res.json({
    mensaje: 'Sesión iniciada',
    token,
    id_tipo_usuario: usuario.id_tipo_usuario  // útil para que el frontend sepa si es admin
  });
}

module.exports = { obtenerCatalogos, registrar, iniciarSesion };