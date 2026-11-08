// acceso_controlador.js
// Aquí están las reglas del negocio: validar datos, cifrar, decidir qué responder.
// Recibe la petición, la revisa y llama al modelo para guardar o buscar.

const bcrypt = require('bcryptjs');
const modelo = require('../modelos/usuarios_modelo');

// ── Catálogos ──────────────────────────────────────────────────────────────
// GET /api/acceso/catalogos
// Regresa alcaldías y oficios para llenar el formulario del frontend.
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
  // 1. Sacar los datos que mandó el frontend
  const {
    nombre, correo, contrasena,
    telefono, curp,
    id_alcaldia, id_oficio,
    acepta_terminos
  } = req.body;

  // 2. Validar que llegaron todos los campos
  if (!nombre || !correo || !contrasena ||
      !telefono || !curp ||
      !id_alcaldia || !id_oficio) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  // 3. Validar que aceptó los términos
  if (!acepta_terminos) {
    return res.status(400).json({ mensaje: 'Debes aceptar los términos' });
  }

  // 4. Validar nombre: solo letras y espacios, 5-25 caracteres
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{5,25}$/;
  if (!regexNombre.test(nombre.trim())) {
    return res.status(400).json({
      mensaje: 'Nombre inválido: solo letras, entre 5 y 25 caracteres'
    });
  }

  // 5. Validar teléfono: 10 dígitos empezando con 55
  const regexTel = /^55\d{8}$/;
  if (!regexTel.test(telefono)) {
    return res.status(400).json({
      mensaje: 'Teléfono inválido: 10 dígitos comenzando con 55'
    });
  }

  // 6. Validar correo: termina en @gmail.com, máximo 50 caracteres
  const regexCorreo = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/;
  if (!regexCorreo.test(correo) || correo.length > 50) {
    return res.status(400).json({
      mensaje: 'Correo inválido: debe ser @gmail.com de máximo 50 caracteres'
    });
  }

  // 7. Validar contraseña: 8-20 caracteres
  if (contrasena.length < 8 || contrasena.length > 20) {
    return res.status(400).json({
      mensaje: 'Contraseña inválida: debe tener entre 8 y 20 caracteres'
    });
  }

  // 8. Validar CURP: exactamente 18 caracteres
  if (curp.length !== 18) {
    return res.status(400).json({
      mensaje: 'CURP inválida: debe tener 18 caracteres'
    });
  }

  // 9. Revisar duplicados en la base de datos
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

  // 10. Cifrar la contraseña (bcrypt genera un "texto raro" que no se puede revertir)
  const contrasenacifrada = await bcrypt.hash(contrasena, 10);

  // 11. Guardar en la base de datos
  try {
    const nuevo = await modelo.crearUsuario({
      id_alcaldia:  Number(id_alcaldia),
      id_oficio:    Number(id_oficio),
      nombre:       nombre.trim(),
      correo:       correo.toLowerCase(),
      contrasena:   contrasenacifrada,
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

module.exports = { obtenerCatalogos, registrar };