import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Inicio() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AcreditaTech - Bienvenido</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inria+Serif:wght@400;700&family=Inter:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <header className="navbar">
        <div className="logo">
          <img src="/img/LogoBlanco.png" alt="AcreditaTech Logo" />
          <span className="logo-text">AcreditaTech</span>
        </div>
        <nav className="nav-links">
          <a href="#quienes-somos">Quiénes Somos</a>
          <a href="#productos-servicios">Productos y Servicios</a>
          <a href="#contactanos">Contáctanos</a>
        </nav>
        <div className="auth-buttons">
          <button className="btn btn-secondary" onClick={() => router.push('/registro')}>Registrarse</button>
          <button className="btn btn-primary" onClick={() => router.push('/login')}>Iniciar Sesión</button>
        </div>
      </header>

      <main className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Te damos la bienvenida a<br />AcreditaTech
          </h1>
          <h2 className="hero-subtitle">Preparación y Diagnóstico integral de oficios</h2>
          <p className="hero-description">
            Bienvenido. Prepárate de manera autónoma en tu oficio evaluando<br />
            las competencias técnicas y de salud ocupacional.
          </p>
          <button className="btn btn-start" onClick={() => router.push('/registro')}>Comenzar</button>
        </div>
      </main>
    </>
  );
}