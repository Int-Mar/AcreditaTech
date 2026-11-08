// peticiones.js
// Aquí están todas las funciones que hablan con el backend.
// Las páginas llaman a estas funciones en lugar de escribir fetch directo.

import axios from 'axios';

// Guarda y lee el token del localStorage del navegador
const guardarToken = (token) => localStorage.setItem('token', token);
const leerToken    = ()        => localStorage.getItem('token');
const borrarToken  = ()        => localStorage.removeItem('token');

// Crea un header de autorización con el token guardado
const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` }
});

// ── Catálogos ──────────────────────────────────────────────────────────────
export async function obtenerCatalogos() {
  const res = await axios.get('/api/acceso/catalogos');
  return res.data;
}

// ── Registro ───────────────────────────────────────────────────────────────
export async function registrar(datos) {
  const res = await axios.post('/api/acceso/registro', datos);
  return res.data;
}

// ── Login ──────────────────────────────────────────────────────────────────
export async function iniciarSesion(datos) {
  const res = await axios.post('/api/acceso/iniciar-sesion', datos);
  guardarToken(res.data.token);
  return res.data;
}

export { borrarToken, leerToken };

// ── Perfil ─────────────────────────────────────────────────────────────────
export async function obtenerPerfil() {
  const res = await axios.get('/api/perfil', encabezadoAuth());
  return res.data;
}

export async function editarPerfil(datos) {
  const res = await axios.put('/api/perfil', datos, encabezadoAuth());
  return res.data;
}

export async function subirFoto(archivo) {
  const form = new FormData();
  form.append('foto', archivo);
  const res = await axios.post('/api/perfil/foto', form, encabezadoAuth());
  return res.data;
}