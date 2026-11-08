import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { leerToken, borrarToken } from '../../utilidades/peticiones';
import Link from 'next/link';

export default function MenuUsuario() {
  const router = useRouter();

  useEffect(() => {
    if (!leerToken()) {
      router.push('/login');
    }
  }, []);

  function cerrarSesion() {
    borrarToken();
    router.push('/login');
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
          <Link href="/usuario/perfil" className="nav-item" title="Perfil">
            <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
          </Link>
          <button onClick={cerrarSesion} className="nav-item" title="Salir" style={{background:'none', border:'none', cursor:'pointer', padding:0}}>
            <img src="/img/Salir.png" alt="Salir" className="nav-icon" />
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="main-area">
        <header className="top-bar">
          <div className="logo-container">
            <img src="/img/LogoBlanco.png" alt="AcreditaTech" className="logo-img" />
            <span className="logo-text">AcreditaTech</span>
          </div>
        </header>

        <main className="content-grid">
          <div className="test-card">
            <div className="card-info">
              <h3>Salud Ocupacional</h3>
              <p>Ingresa al test y averigua si eres una persona apta</p>
            </div>
            <a href="#" className="btn-empezar">Empezar</a>
          </div>

          <div className="test-card">
            <div className="card-info">
              <h3>Test Técnico</h3>
              <p>Ingresa al test y averigua si eres una persona apta</p>
            </div>
            <a href="#" className="btn-empezar">Empezar</a>
          </div>

          <div className="test-card">
            <div className="card-info">
              <h3>Exámen final</h3>
              <p>Ingresa al test y averigua si eres una persona apta</p>
            </div>
            <a href="#" className="btn-empezar">Empezar</a>
          </div>
        </main>
      </div>
    </div>
  );
}