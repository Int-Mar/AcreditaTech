import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { obtenerPerfilAdmin, editarPerfilAdmin, redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import estilos from '../../estilos/admin.module.css';

export default function PerfilAdmin() {
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    try {
      const data = await obtenerPerfilAdmin();
      setPerfil(data.perfil);
      setNombre(data.perfil.nombre);
    } catch (e) {
      if (!redirigirSiNoAutorizado(e, router)) {
        setMensaje(e.response?.data?.mensaje || 'Error al obtener el perfil');
      }
    }
  }

  async function guardarCambios(e) {
    e.preventDefault();
    setMensaje('');

    // Sin cambios: no se hace ninguna petición
    if (nombre.trim() === perfil.nombre) {
      setEditando(false);
      return;
    }

    try {
      const data = await editarPerfilAdmin(nombre);
      setMensaje(data.mensaje);
      setEditando(false);
      cargarPerfil();
    } catch (err) {
      if (!redirigirSiNoAutorizado(err, router)) {
        setMensaje(err.response?.data?.mensaje || 'Error al actualizar el perfil');
      }
    }
  }

  return (
    <LayoutAdmin activo="perfil">
      <main className="profile-content-area">
        <div className="profile-card-wrapper">
          <div className="profile-avatar-container">
            <div className="profile-avatar-circle">
              <i className="fa-solid fa-user"></i>
            </div>
          </div>

          <div className="profile-card">
            <h2 className="profile-user-name">{perfil ? perfil.nombre : ''}</h2>

            <div className="profile-form-box">
              <h3 className="profile-section-title">ADMIN</h3>

              {mensaje && <p style={{ color: '#f90', marginBottom: '8px' }}>{mensaje}</p>}

              {perfil && !editando && (
                <>
                  <div className="profile-field">
                    <label>Nombre</label>
                    <p>{perfil.nombre}</p>
                  </div>
                  <div className="profile-field">
                    <label>Correo Electrónico</label>
                    <p>{perfil.correo}</p>
                  </div>
                  <button type="button" className="btn-hacer-cambios"
                    onClick={() => { setEditando(true); setMensaje(''); }}>
                    Editar Perfil
                  </button>
                </>
              )}

              {perfil && editando && (
                <form onSubmit={guardarCambios}>
                  <div className="profile-field">
                    <label>Nombre</label>
                    <input type="text" className={estilos.inputEditable} value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{5,25}$"
                      title="Solo letras, entre 5 y 25 caracteres" required />
                  </div>
                  <div className="profile-field">
                    <label>Correo Electrónico</label>
                    <p>{perfil.correo}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                    <button type="submit" className="btn-hacer-cambios">Guardar cambios</button>
                    <button type="button" className="btn-hacer-cambios" style={{ background: '#666' }}
                      onClick={() => { setEditando(false); setNombre(perfil.nombre); setMensaje(''); }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}