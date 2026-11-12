import axios from 'axios';
import { leerToken, borrarToken } from './peticiones';

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` }
});

export async function obtenerEstatus() {
  const res = await axios.get('/api/administracion/estatus', encabezadoAuth());
  return res.data;
}

export async function obtenerPadron(tipo, filtros = {}) {
  const params = {};
  Object.keys(filtros).forEach((clave) => {
    if (filtros[clave]) params[clave] = filtros[clave];
  });
  const res = await axios.get(`/api/administracion/padron/${tipo}`, {
    ...encabezadoAuth(),
    params
  });
  return res.data;
}

export async function cambiarEstatus(correo, estatus) {
  const res = await axios.put('/api/administracion/estatus', { correo, estatus }, encabezadoAuth());
  return res.data;
}

export async function obtenerPerfilAdmin() {
  const res = await axios.get('/api/administracion/perfil', encabezadoAuth());
  return res.data;
}

export async function editarPerfilAdmin(nombre) {
  const res = await axios.put('/api/administracion/perfil', { nombre }, encabezadoAuth());
  return res.data;
}

export function redirigirSiNoAutorizado(error, router) {
  const estado = error.response?.status;
  if (estado === 401) {
    borrarToken();
    router.push('/login');
    return true;
  }
  if (estado === 403) {
    router.push('/usuario/menu');
    return true;
  }
  return false;
}