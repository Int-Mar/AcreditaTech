import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { registrar, obtenerCatalogos } from '../utilidades/peticiones';

export default function Registro() {
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = useState(true);
  const [catalogos, setCatalogos]       = useState({ alcaldias: [], oficios: [] });
  const [error, setError]               = useState('');
  const [cargando, setCargando]         = useState(false);
  const [form, setForm] = useState({
    nombre: '', telefono: '', correo: '',
    contrasena: '', curp: '',
    id_alcaldia: '', id_oficio: '',
    acepta_terminos: false
  });

  // Cargar alcaldías y oficios al abrir la página
  useEffect(() => {
    obtenerCatalogos()
      .then(datos => setCatalogos(datos))
      .catch(() => {});
  }, []);

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrar({ ...form, acepta_terminos: true });
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Head>
        <title>AcreditaTech - Registro</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inria+Serif:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Modal de Términos */}
      {mostrarModal && (
        <div className="modal-overlay" id="termsModal">
          <div className="modal-card">
            <div className="modal-logo">
              <img src="/img/LogoAzul.png" alt="AcreditaTech Logo" />
              <span className="modal-logo-text">AcreditaTech</span>
            </div>
            <div className="terms-box">
              <h3>Términos y Condiciones</h3>
              <p>
                Al registrarte en AcreditaTech aceptas la evaluación autónoma
                de tus competencias técnicas y de salud ocupacional.
                Tu información será usada únicamente para fines de certificación
                dentro del programa de trabajadores independientes de las
                alcaldías Azcapotzalco y Miguel Hidalgo.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-modal"
              onClick={() => setMostrarModal(false)}
            >
              Aceptar y continuar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-overlay"></div>
          <div className="auth-brand">
            <img src="/img/LogoBlanco.png" alt="AcreditaTech" className="brand-logo" />
            <h1 className="brand-name">AcreditaTech</h1>
          </div>
        </div>

        <div className="auth-right">
          <div className="form-header">
            <div className="form-logo">
              <img src="/img/LogoAzul.png" alt="AcreditaTech" />
              <span>AcreditaTech</span>
            </div>
            <div className="form-title-badge">Registrarse</div>
          </div>

          <form className="auth-form" onSubmit={manejarEnvio}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" name="nombre" placeholder="ejemplo: Juan Pérez González"
                value={form.nombre} onChange={manejarCambio} required
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{5,25}$"
                title="Solo letras, entre 5 y 25 caracteres" />
            </div>

            <div className="form-group">
              <label>Teléfono de Contacto</label>
              <input type="tel" name="telefono" placeholder="ejemplo: 5548461405"
                value={form.telefono} onChange={manejarCambio} required
                pattern="^55\d{8}$"
                title="10 dígitos comenzando con 55" />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" name="correo" placeholder="ejemplo: juanpg@gmail.com"
                value={form.correo} onChange={manejarCambio} required />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="contrasena" placeholder="entre 8 y 20 caracteres"
                value={form.contrasena} onChange={manejarCambio} required />
            </div>

            <div className="form-group">
              <label>CURP</label>
              <input type="text" name="curp" placeholder="18 caracteres"
                value={form.curp} onChange={manejarCambio} required maxLength={18}
                pattern="^.{18}$"
                title="Debe tener exactamente 18 caracteres" />
            </div>

            <div className="form-group">
              <label>Alcaldía de Trabajo</label>
              <select name="id_alcaldia" value={form.id_alcaldia} onChange={manejarCambio} required>
                <option value="" disabled>Selecciona tu alcaldía</option>
                {catalogos.alcaldias.map(a => (
                  <option key={a.id_alcaldia} value={a.id_alcaldia}>{a.nombre_alcaldia}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Elige tu Oficio</label>
              <select name="id_oficio" value={form.id_oficio} onChange={manejarCambio} required>
                <option value="" disabled>Selecciona tu oficio</option>
                {catalogos.oficios.map(o => (
                  <option key={o.id_oficio} value={o.id_oficio}>{o.nombre_oficio}</option>
                ))}
              </select>
            </div>

            <div className="form-group terms-group">
              <input type="checkbox" id="acceptTerms" name="acepta_terminos"
                checked={form.acepta_terminos} onChange={manejarCambio} required />
              <label htmlFor="acceptTerms" className="terms-label">
                Acepto aviso de Términos y Condiciones
              </label>
            </div>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-submit" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}