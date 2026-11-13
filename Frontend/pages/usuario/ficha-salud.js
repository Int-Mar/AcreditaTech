// ficha-salud.js
// El trabajador llena su ficha de salud y ve su Ficha Preventiva.
// La Ficha Preventiva nunca muestra números, solo la etiqueta y las recomendaciones.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LayoutTest from '../../componentes/LayoutTest';
import { leerToken } from '../../utilidades/peticiones';
import { obtenerFicha, guardarFicha, obtenerPreventiva } from '../../utilidades/salud_peticiones';
import estilos from '../../estilos/salud.module.css';

const NIVELES = ['Ninguno', 'Leve', 'Moderado', 'Fuerte'];

const FICHA_VACIA = {
  dolor_espalda: '',
  dolor_hombros_cuello: '',
  horas_trabajo_dia: '',
  usa_casco: false,
  usa_guantes: false,
  usa_lentes: false,
  usa_calzado_seguridad: false,
  observaciones: '',
};

export default function FichaSalud() {
  const router = useRouter();
  const [ficha, setFicha] = useState(FICHA_VACIA);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);
  const [preventiva, setPreventiva] = useState(null);
  const [sinTest, setSinTest] = useState(false);

  useEffect(() => {
    if (!leerToken()) { router.push('/login'); return; }

    async function cargar() {
      try {
        const datos = await obtenerFicha();
        setFicha({
          ...FICHA_VACIA,
          ...Object.fromEntries(
            Object.entries(datos).filter(([, v]) => v !== null)
          ),
        });
      } catch (e) {
        if (e.response?.status === 401) router.push('/login');
      }

      try {
        setPreventiva(await obtenerPreventiva());
      } catch (e) {
        if (e.response?.status === 401) router.push('/login');
        else if (e.response?.status === 404) setSinTest(true);
      }
    }
    cargar();
  }, []);

  function cambiar(campo, valor) {
    setFicha({ ...ficha, [campo]: valor });
  }

  async function enviar(e) {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setGuardando(true);
    try {
      await guardarFicha({
        dolor_espalda: ficha.dolor_espalda || null,
        dolor_hombros_cuello: ficha.dolor_hombros_cuello || null,
        horas_trabajo_dia:
          ficha.horas_trabajo_dia === '' ? null : Number(ficha.horas_trabajo_dia),
        usa_casco: ficha.usa_casco,
        usa_guantes: ficha.usa_guantes,
        usa_lentes: ficha.usa_lentes,
        usa_calzado_seguridad: ficha.usa_calzado_seguridad,
        observaciones: ficha.observaciones || null,
      });
      setMensaje({ texto: 'Ficha guardada correctamente', tipo: 'exito' });
    } catch (err) {
      if (err.response?.status === 401) { router.push('/login'); return; }
      setMensaje({
        texto: err.response?.data?.error || 'No se pudo guardar la ficha',
        tipo: 'error',
      });
    } finally {
      setGuardando(false);
    }
  }

  const claseEtiqueta =
    preventiva?.resultado === 'Apto' ? estilos.apto
    : preventiva?.resultado === 'Necesita reforzamiento' ? estilos.refuerzo
    : estilos.pendiente;

  return (
    <>
      <Head><title>AcreditaTech - Ficha de Salud</title></Head>
      <LayoutTest>
        <main className={estilos.contenedor}>

          <section className={estilos.tarjeta}>
            <h2 className={estilos.titulo}>Mi ficha de salud ocupacional</h2>
            <form onSubmit={enviar}>
              <div className={estilos.campo}>
                <label>¿Tienes dolor de espalda?</label>
                <select value={ficha.dolor_espalda}
                  onChange={(e) => cambiar('dolor_espalda', e.target.value)}>
                  <option value="">Elige una opción</option>
                  {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className={estilos.campo}>
                <label>¿Tienes dolor de hombros o cuello?</label>
                <select value={ficha.dolor_hombros_cuello}
                  onChange={(e) => cambiar('dolor_hombros_cuello', e.target.value)}>
                  <option value="">Elige una opción</option>
                  {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className={estilos.campo}>
                <label>Horas de trabajo al día</label>
                <input type="number" min="0" max="24" value={ficha.horas_trabajo_dia}
                  onChange={(e) => cambiar('horas_trabajo_dia', e.target.value)} />
              </div>

              <div className={estilos.campo}>
                <label>Equipo de protección que usas</label>
                {[
                  ['usa_casco', 'Casco'],
                  ['usa_guantes', 'Guantes'],
                  ['usa_lentes', 'Lentes de seguridad'],
                  ['usa_calzado_seguridad', 'Calzado de seguridad'],
                ].map(([campo, texto]) => (
                  <label key={campo} className={estilos.casilla}>
                    <input type="checkbox" checked={!!ficha[campo]}
                      onChange={(e) => cambiar(campo, e.target.checked)} />
                    {texto}
                  </label>
                ))}
              </div>

              <div className={estilos.campo}>
                <label>Observaciones (opcional)</label>
                <textarea rows="3" maxLength="255" value={ficha.observaciones}
                  onChange={(e) => cambiar('observaciones', e.target.value)} />
              </div>

              <button type="submit" className={estilos.boton} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar ficha'}
              </button>

              {mensaje.texto && (
                <p className={mensaje.tipo === 'exito' ? estilos.exito : estilos.error}>
                  {mensaje.texto}
                </p>
              )}
            </form>
          </section>

          <section className={estilos.tarjeta}>
            <h2 className={estilos.titulo}>Mi Ficha Preventiva</h2>

            {sinTest && (
              <p>Aún no has contestado el test de salud ocupacional. Cuando lo termines, aquí verás tus recomendaciones.</p>
            )}

            {preventiva && (
              <>
                <span className={`${estilos.etiqueta} ${claseEtiqueta}`}>
                  {preventiva.resultado}
                </span>

                {preventiva.areas_a_reforzar.length > 0 && (
                  <>
                    <h3>Áreas a reforzar</h3>
                    <ul>
                      {preventiva.areas_a_reforzar.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </>
                )}

                <h3>Recomendaciones</h3>
                {preventiva.ficha_preventiva.length === 0 && (
                  <p>No hay recomendaciones pendientes. ¡Buen trabajo!</p>
                )}
                {preventiva.ficha_preventiva.map((item, i) => (
                  <div key={i} className={`${estilos.item} ${estilos[item.color]}`}>
                    <div className={estilos.itemTema}>{item.tema}</div>
                    <div className={estilos.itemRespuesta}>Tu respuesta: {item.respuesta}</div>
                    <div>{item.recomendacion}</div>
                  </div>
                ))}
              </>
            )}
          </section>

        </main>
      </LayoutTest>
    </>
  );
}