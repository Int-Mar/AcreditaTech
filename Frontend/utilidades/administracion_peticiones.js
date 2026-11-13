// administracion_peticiones.js
// Peticiones de las pantallas de usuarios y estadísticas del administrador.

import axios from 'axios';
import { leerToken } from './peticiones';

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

export async function listarUsuarios(filtros = {}) {
  const params = {};
  Object.keys(filtros).forEach((clave) => {
    if (filtros[clave]) params[clave] = filtros[clave];
  });
  const res = await axios.get('/api/administracion/usuarios', {
    ...encabezadoAuth(),
    params,
  });
  return res.data;
}

export async function cambiarBloqueo(id, bloqueado) {
  const res = await axios.put(
    `/api/administracion/usuarios/${id}/bloqueo`,
    { bloqueado },
    encabezadoAuth()
  );
  return res.data;
}

export async function obtenerEstadisticas() {
  const res = await axios.get('/api/administracion/estadisticas', encabezadoAuth());
  return res.data;
}