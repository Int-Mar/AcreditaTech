const modelo = require('../modelos/administracion_modelo');

const ESTATUS_EN_PROCESO        = ['En Diagnóstico', 'Pendiente de asesoría'];
const ESTATUS_CON_PRECONSTANCIA = ['Preparación Completada', 'Vencida'];
const TODOS_LOS_ESTATUS         = [...ESTATUS_EN_PROCESO, ...ESTATUS_CON_PRECONSTANCIA];

const PADRONES = {
  proceso:       ESTATUS_EN_PROCESO,
  preconstancia: ESTATUS_CON_PRECONSTANCIA,
};

function obtenerEstatus(req, res) {
  res.json({
    proceso:       ESTATUS_EN_PROCESO,
    preconstancia: ESTATUS_CON_PRECONSTANCIA,
    todos:         TODOS_LOS_ESTATUS,
  });
}

async function verPadron(req, res) {
  const estatusPermitidos = PADRONES[req.params.tipo];
  if (!estatusPermitidos) {
    return res.status(400).json({ mensaje: 'Padrón inválido' });
  }

  const { alcaldia, oficio, estatus } = req.query;

  if (estatus && !estatusPermitidos.includes(estatus)) {
    return res.status(400).json({ mensaje: 'Estatus inválido para este padrón' });
  }
  if ((alcaldia && !Number.isInteger(Number(alcaldia))) ||
      (oficio && !Number.isInteger(Number(oficio)))) {
    return res.status(400).json({ mensaje: 'Filtro inválido' });
  }

  try {
    const trabajadores = await modelo.listarTrabajadores({
      estatusPermitidos,
      id_alcaldia: alcaldia ? Number(alcaldia) : null,
      id_oficio:   oficio   ? Number(oficio)   : null,
      estatus:     estatus || null,
    });
    res.json({ trabajadores });
  } catch (error) {
    console.error('Error al listar el padrón:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el padrón' });
  }
}

async function cambiarEstatus(req, res) {
  const { correo, estatus } = req.body;

  if (!correo || !estatus) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }
  if (!TODOS_LOS_ESTATUS.includes(estatus)) {
    return res.status(400).json({ mensaje: 'Estatus inválido' });
  }

  try {
    const trabajador = await modelo.actualizarEstatusPorCorreo(
      correo.trim().toLowerCase(),
      estatus
    );

    if (!trabajador) {
      return res.status(404).json({
        mensaje: 'No se encontró ningún trabajador registrado con ese correo'
      });
    }

    res.json({ mensaje: 'Estatus actualizado correctamente', trabajador });
  } catch (error) {
    console.error('Error al cambiar estatus:', error.message);
    res.status(500).json({ mensaje: 'Error al cambiar el estatus' });
  }
}

async function verPerfil(req, res) {
  try {
    const perfil = await modelo.obtenerAdmin(req.usuario.id_usuario);
    if (!perfil) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }
    res.json({ perfil });
  } catch (error) {
    console.error('Error al ver perfil admin:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
}

async function editarPerfil(req, res) {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{5,25}$/;
  if (!regexNombre.test(nombre.trim())) {
    return res.status(400).json({
      mensaje: 'Nombre inválido: solo letras, entre 5 y 25 caracteres'
    });
  }

  try {
    await modelo.actualizarNombreAdmin(req.usuario.id_usuario, nombre.trim());
    res.json({ mensaje: 'Información actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar perfil admin:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
}

module.exports = { obtenerEstatus, verPadron, cambiarEstatus, verPerfil, editarPerfil };