import { useState } from 'react';
import Link from 'next/link';
import { Barlow_Condensed, Source_Sans_3 } from 'next/font/google';

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--at-display' });
const cuerpo = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--at-body' });

const OFICIOS = [
  { id: 'electricidad', nombre: 'Electricidad', texto: 'Instalaciones, tableros y seguridad eléctrica.' },
  { id: 'plomeria', nombre: 'Plomería', texto: 'Tuberías, fugas, calentadores y drenaje.' },
  { id: 'carpinteria', nombre: 'Carpintería', texto: 'Cortes, ensambles, acabados y herramienta.' },
  { id: 'albanileria', nombre: 'Albañilería', texto: 'Muros, firmes, mezclas y niveles.' },
];

const PASOS = [
  { t: 'Regístrate y elige tu oficio', d: 'Tu cuestionario cambia según el oficio de tu cuenta.' },
  { t: 'Estudia con minitutoriales', d: 'Repasa lo que se evalúa antes de presentar.' },
  { t: 'Presenta tus evaluaciones', d: 'Una técnica y otra de salud ocupacional, a tu ritmo.' },
  { t: 'Descarga tu Pre-Constancia', d: 'Un PDF con tu avance y tu resultado.' },
];

function Foto({ oficio, etiqueta }) {
  return <div className={`at-foto at-foto-${oficio}`} role="img" aria-label={etiqueta} />;
}

function Logo() {
  return (
    <Link href="/" className="at-logo" aria-label="AcreditaTech, inicio">
      <img src="/img/LogoBlanco.png" alt="" />
      <span>AcreditaTech</span>
    </Link>
  );
}

export default function Landing() {
  const [enviado, setEnviado] = useState(false);

  function enviar(e) {
    e.preventDefault();
    setEnviado(true);
    e.target.reset();
  }

  return (
    <div className={`at ${display.variable} ${cuerpo.variable}`}>
      <header className="at-header">
        <Logo />
        <nav aria-label="Principal" className="at-nav">
          <a href="#quienes-somos">Quiénes somos</a>
          <a href="#productos-servicios">Productos y servicios</a>
          <a href="#contactanos">Contáctanos</a>
        </nav>
        <div className="at-header-cta">
          <Link href="/registro" className="at-btn at-btn-light">Registrarse</Link>
          <Link href="/login" className="at-btn at-btn-line">Iniciar sesión</Link>
        </div>
      </header>

      <main>
        <section className="at-hero">
          <div className="at-hero-text">
            <h1>Tu oficio, con constancia digital.</h1>
            <p>
              Prepárate de manera autónoma, evalúa tus competencias técnicas y de salud ocupacional,
              y obtén una Pre-Constancia en la que tus clientes puedan confiar.
            </p>
            <div className="at-hero-actions">
              <Link href="/registro" className="at-btn at-btn-obra">Comenzar</Link>
              <a href="#productos-servicios" className="at-btn at-btn-line">Ver cómo funciona</a>
            </div>
          </div>
        </section>

        <section id="quienes-somos" className="at-sec">
          <div className="at-wrap at-two">
            <h2>Quiénes somos</h2>
            <div className="at-objetivo">
              <h3>Nuestro objetivo</h3>
              <p>
                Desarrollar una aplicación web y móvil para trabajadores independientes informales (oficios) en las alcaldías Azcapotzalco y Miguel Hidalgo, para la orientación y preparación de manera autónoma de sus competencias técnicas y de salud física ocupacional, con el fin de impulsar su preparación hacia la formalidad laboral en el periodo de agosto a diciembre de 2026.
              </p>
            </div>
          </div>
        </section>

        <section id="productos-servicios" className="at-sec at-sec-claro">
          <div className="at-wrap">
            <h2>Oficios que puedes acreditar</h2>
            <ul className="at-oficios">
              {OFICIOS.map((o) => (
                <li key={o.id}>
                  <Foto oficio={o.id} etiqueta={`Ilustración de ${o.nombre.toLowerCase()}`} />
                  <h3>{o.nombre}</h3>
                  <p>{o.texto}</p>
                </li>
              ))}
            </ul>

            <h2 className="at-h2-sep">Cómo funciona</h2>
            <ol className="at-pasos">
              {PASOS.map((p, i) => (
                <li key={p.t}>
                  <span className="at-num">{i + 1}</span>
                  <div><h3>{p.t}</h3><p>{p.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contactanos" className="at-sec at-sec-hondo">
          <div className="at-wrap at-two">
            <div>
              <h2>Contáctanos</h2>
              <p>¿Tienes dudas o quieres sumar tu oficio? Escríbenos y te respondemos.</p>
            </div>
            <form onSubmit={enviar} className="at-form">
              <label>Nombre<input name="nombre" required autoComplete="name" /></label>
              <label>Correo electrónico<input name="correo" type="email" required autoComplete="email" /></label>
              <label>Mensaje<textarea name="mensaje" rows={4} required /></label>
              <button className="at-btn at-btn-obra" type="submit">Enviar mensaje</button>
              {enviado && <p role="status" className="at-gracias">Mensaje enviado. Gracias por escribirnos.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="at-footer">
        <Logo />
        <p>2026 AcreditaTech · CDMX</p>
      </footer>
    </div>
  );
}