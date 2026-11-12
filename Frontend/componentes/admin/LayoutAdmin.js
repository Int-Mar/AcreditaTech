import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { leerToken, borrarToken } from '../../utilidades/peticiones';

export default function LayoutAdmin({ activo, children }) {
  const router = useRouter();

  useEffect(() => {
    if (!leerToken()) { router.push('/login'); return; }
    document.body.classList.add('dashboard-body');
    return () => document.body.classList.remove('dashboard-body');
  }, []);

  function cerrarSesion() {
    borrarToken();
    router.push('/login');
  }

  return (
    <>
      <Head>
        <title>AcreditaTech - Administrador</title>
        {/* Fuentes e íconos que usan las páginas del admin */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inria+Serif:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link href="/admin/menu" className={`nav-item ${activo === 'inicio' ? 'active' : ''}`} title="Padrones">
              <img src="/img/Inicio.png" alt="Inicio" className="nav-icon" />
            </Link>
            <Link href="/admin/modificar-estatus" className={`nav-item ${activo === 'estatus' ? 'active' : ''}`} title="Modificar estatus">
              <img src="/img/Progreso.png" alt="Modificar estatus" className="nav-icon" />
            </Link>
          </nav>
          <div className="sidebar-bottom">
            <Link href="/admin/perfil" className={`nav-item ${activo === 'perfil' ? 'active' : ''}`} title="Perfil">
              <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
            </Link>
            <button onClick={cerrarSesion} className="nav-item" title="Salir"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
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

          {children}
        </div>
      </div>
    </>
  );
}