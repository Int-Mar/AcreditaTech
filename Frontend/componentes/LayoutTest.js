// LayoutTest.js
// Barra lateral y barra superior del maquetado (el marco de las pantallas del usuario).
// TEMPORAL: cuando la Persona 1 suba su componente de menú (MenuPrincipal.js),
// se cambia este por el suyo para no tener dos barras laterales distintas.

import { useEffect } from 'react';
import Link from 'next/link';
import { borrarToken } from '../utilidades/peticiones';

export default function LayoutTest({ children }) {
  // El maquetado pone la clase dashboard-body en el <body>
  useEffect(() => {
    document.body.classList.add('dashboard-body');
    return () => document.body.classList.remove('dashboard-body');
  }, []);

  return (
    <div className="dashboard-container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <Link href="/usuario/menu" className="nav-item" title="Inicio">
            <img src="/img/Inicio.png" alt="Inicio" className="nav-icon" />
          </Link>

          <Link href="/usuario/progreso" className="nav-item active" title="Progreso / Test">
            <img src="/img/Progreso.png" alt="Progreso" className="nav-icon" />
          </Link>

          <Link href="/usuario/guias" className="nav-item" title="Resultados y Guías">
            <img src="/img/Guias.png" alt="Guías" className="nav-icon" />
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/usuario/perfil" className="nav-item" title="Perfil">
            <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
          </Link>

          <Link
            href="/login"
            className="nav-item"
            title="Cerrar Sesión"
            onClick={() => borrarToken()}
          >
            <img src="/img/Salir.png" alt="Cerrar Sesión" className="nav-icon" />
          </Link>
        </div>
      </aside>

      {/* Área principal */}
      <div className="main-area">
        <header className="top-bar">
          <div className="logo-container">
            <img src="/img/LogoBlanco.png" alt="AcreditaTech Logo" className="logo-img" />
            <span className="logo-text">AcreditaTech</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}