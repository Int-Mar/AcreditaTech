// /admin/modificar-estatus — Cambiar el estatus de un trabajador por su correo

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { obtenerEstatus, cambiarEstatus, redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import estilos from '../../estilos/admin.module.css';

export default function ModificarEstatus() {
  const router = useRouter();
  const [listaEstatus, setListaEstatus] = useState([]);
  const [correo, setCorreo] = useState('');
  const [estatus, setEstatus] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargarEstatus() {
      try {
        const data = await obtenerEstatus();
        setListaEstatus(data.todos);
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) {
          setMensaje({ texto: 'No se pudieron cargar los estatus', tipo: 'error' });
        }
      }
    }
    cargarEstatus();
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setEnviando(true);
    try {
      const data = await cambiarEstatus(correo, estatus);
      setMensaje({ texto: data.mensaje, tipo: 'exito' });
      setCorreo('');
      setEstatus('');
    } catch (err) {
      if (!redirigirSiNoAutorizado(err, router)) {
        setMensaje({
          texto: err.response?.data?.mensaje || 'Error al cambiar el estatus',
          tipo: 'error'
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <LayoutAdmin activo="estatus">
      <main className="status-content-area">
        <div className="status-card">

          <div className="status-card-header">
            <div className="status-card-logo">
              <img src="/img/LogoAzul.png" alt="AcreditaTech" />
              <span>AcreditaTech</span>
            </div>
            <h2 className="status-card-title">Modificar Estatus</h2>
          </div>

          <form className="status-form" onSubmit={enviar}>
            <div className="status-form-group">
              <label>Correo electrónico del trabajador a modificar estatus</label>
              <input type="email" placeholder="ejemplo: juanpg@gmail.com" required
                value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>

            <div className="status-form-group">
              <label>Estatus</label>
              <select required value={estatus} onChange={(e) => setEstatus(e.target.value)}>
                <option value="" disabled>Elije el estatus al que deseas cambiar</option>
                {listaEstatus.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-status-submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Cambiar estatus'}
            </button>

            {mensaje.texto && (
              <p className={`${estilos.mensajeFormulario} ${mensaje.tipo === 'exito' ? estilos.exito : estilos.error}`}>
                {mensaje.texto}
              </p>
            )}
          </form>

        </div>
      </main>
    </LayoutAdmin>
  );
}