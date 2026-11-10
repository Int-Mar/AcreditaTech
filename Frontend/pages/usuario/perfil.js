import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { leerToken, borrarToken, obtenerPerfil, editarPerfil, subirFoto } from '../../utilidades/peticiones';
import Link from 'next/link';

export default function PerfilUsuario() {
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!leerToken()) { router.push('/login'); return; }
    document.body.classList.add('dashboard-body');
    cargarPerfil();
    return () => document.body.classList.remove('dashboard-body');
  }, []);

  async function cargarPerfil() {
    try {
      const data = await obtenerPerfil();
      const info = data.perfil || data;
      setPerfil(info);
      setNombre(info.nombre);
      setTelefono(info.telefono);
    } catch (error) {
      router.push('/login');
    }
  }

  async function guardarCambios(e) {
    e.preventDefault();
    try {
      await editarPerfil({ nombre, telefono });
      setMensaje('Perfil actualizado');
      setEditando(false);
      cargarPerfil();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al actualizar');
    }
  }

  async function cambiarFoto(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    try {
      await subirFoto(archivo);
      cargarPerfil();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al subir foto');
    }
  }

  function cerrarSesion() {
    borrarToken();
    router.push('/login');
  }

  if (!perfil) return null;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <Link href="/usuario/menu" className="nav-item" title="Inicio">
            <img src="/img/Inicio.png" alt="Inicio" className="nav-icon" />
          </Link>
          <Link href="/usuario/progreso" className="nav-item" title="Progreso">
            <img src="/img/Progreso.png" alt="Progreso" className="nav-icon" />
          </Link>
          <Link href="/usuario/guias" className="nav-item" title="Guías">
            <img src="/img/Guias.png" alt="Guías" className="nav-icon" />
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/usuario/perfil" className="nav-item active" title="Perfil">
            <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
          </Link>
          <button onClick={cerrarSesion} className="nav-item" title="Salir"
            style={{background:'none', border:'none', cursor:'pointer', padding:0}}>
            <img src="/img/Salir.png" alt="Salir" className="nav-icon" />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="top-bar">
          <div className="logo-container">
            <img src="/img/LogoBlanco.png" alt="AcreditaTech" className="logo-img" />
            <span className="logo-text">AcreditaTech</span>
          </div>
        </header>

        <main className="profile-content-area">
          <div className="profile-card-wrapper">
            <div className="profile-avatar-container">
              <label htmlFor="inputFoto" style={{cursor:'pointer'}}>
                <div className="profile-avatar-circle">
                  {perfil.foto_url
                    ? <img src={perfil.foto_url} alt="Foto" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} />
                    : <i className="fa-solid fa-user"></i>
                  }
                </div>
              </label>
              <input id="inputFoto" type="file" accept="image/jpeg,image/png"
                style={{display:'none'}} onChange={cambiarFoto} />
            </div>

            <div className="profile-card">
              <h2 className="profile-user-name">{perfil.nombre}</h2>

              <div className="profile-form-box">
                <h3 className="profile-section-title">{perfil.nombre_oficio || 'OFICIO'}</h3>

                {mensaje && <p style={{color:'#f90', marginBottom:'8px'}}>{mensaje}</p>}

                {!editando ? (
                  <>
                    <div className="profile-field">
                      <label>Correo Electrónico</label>
                      <p>{perfil.correo}</p>
                    </div>
                    <div className="profile-field">
                      <label>Teléfono de contacto</label>
                      <p>{perfil.telefono}</p>
                    </div>
                    <div className="profile-field">
                      <label>Alcaldía de Trabajo</label>
                      <p>{perfil.nombre_alcaldia}</p>
                    </div>
                    <div className="profile-field">
                      <label>CURP</label>
                      <p>{perfil.curp}</p>
                    </div>
                    <button type="button" className="btn-hacer-cambios"
                      onClick={() => { setEditando(true); setMensaje(''); }}>
                      Hacer Cambios
                    </button>
                  </>
                ) : (
                  <form onSubmit={guardarCambios}>
                    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                      <div className="profile-field">
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                          pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,25}$"
                          style={{display:'block', width:'100%', marginTop:'4px', padding:'4px 0', background:'transparent', border:'none', borderBottom:'2px solid #1b4b73', outline:'none', fontFamily:'Inter, sans-serif', fontWeight:'600', fontSize:'0.95rem', color:'#111'}} />
                      </div>
                      <div className="profile-field">
                        <label>Teléfono</label>
                        <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)}
                          pattern="^55\d{8}$"
                          style={{display:'block', width:'100%', marginTop:'4px', padding:'4px 0', background:'transparent', border:'none', borderBottom:'2px solid #1b4b73', outline:'none', fontFamily:'Inter, sans-serif', fontWeight:'600', fontSize:'0.95rem', color:'#111'}} />
                      </div>
                    </div>
                    <div style={{display:'flex', gap:'10px', marginTop:'20px', justifyContent:'center'}}>
                      <button type="submit" className="btn-hacer-cambios">Guardar</button>
                      <button type="button" className="btn-hacer-cambios"
                        style={{background:'#666'}}
                        onClick={() => { setEditando(false); setMensaje(''); }}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}