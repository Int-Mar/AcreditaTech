// salud_peticiones.js
// Funciones que hablan con las rutas /api/salud del servidor.

import axios from 'axios';
import { leerToken } from './peticiones';

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

export async function obtenerFicha() {
  const res = await axios.get('/api/salud/ficha', encabezadoAuth());
  return res.data;
}

export async function guardarFicha(datos) {
  const res = await axios.put('/api/salud/ficha', datos, encabezadoAuth());
  return res.data;
}

export async function obtenerPreventiva() {
  const res = await axios.get('/api/salud/preventiva', encabezadoAuth());
  return res.data;
}