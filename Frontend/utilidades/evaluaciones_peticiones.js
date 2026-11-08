// evaluaciones_peticiones.js
// Funciones que hablan con las rutas /api/evaluaciones del servidor.
// Están en un archivo aparte para no tocar peticiones.js (que es de la Persona 1)
// y así evitar choques al unir el trabajo.
// tipo: 1 = técnica, 2 = salud

import axios from 'axios';
import { leerToken } from './peticiones';

// Header de autorización con el token guardado al iniciar sesión
const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` }
});

// Empieza el test (o continúa uno a medias)
export async function iniciarTest(tipo) {
  const res = await axios.post(`/api/evaluaciones/${tipo}/iniciar`, {}, encabezadoAuth());
  return res.data;
}

// Pide la pregunta actual con sus opciones (sin puntos)
export async function obtenerPregunta(tipo) {
  const res = await axios.get(`/api/evaluaciones/${tipo}/pregunta`, encabezadoAuth());
  return res.data;
}

// Manda la respuesta elegida
export async function responderPregunta(tipo, id_pregunta, id_opcion) {
  const res = await axios.post(
    `/api/evaluaciones/${tipo}/respuesta`,
    { id_pregunta, id_opcion },
    encabezadoAuth()
  );
  return res.data;
}

// Calificación, intentos usados y si está bloqueado
export async function obtenerEstadoTest(tipo) {
  const res = await axios.get(`/api/evaluaciones/${tipo}/estado`, encabezadoAuth());
  return res.data;
}