import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { iniciarSesion } from '../utilidades/peticiones';


export default function Login() {
  const router = useRouter();
  const [esAdmin, setEsAdmin]     = useState(false);
  const [correo, setCorreo]       = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]         = useState('');
  const [cargando, setCargando]   = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const datos = await iniciarSesion({ correo, contrasena });
      // Guardar el tipo de usuario para redirigir correctamente
      if (datos.id_tipo_usuario === 2) {
        router.push('/admin/menu');
      } else {
        router.push('/usuario/menu');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  }

  // Poner la clase login-body al body cuando carga esta página
    useEffect(() => {
    document.body.classList.add('login-body');
    return () => document.body.classList.remove('login-body');
    }, []);

  return (
    <>

      <div className="login-card-container">
        <div className="login-card" style={{ borderColor: esAdmin ? '#204c6f' : 'transparent' }}>
          <div className="form-header">
            <div className="form-logo">
              <img src="/img/LogoAzul.png" alt="AcreditaTech" />
              <span>AcreditaTech</span>
            </div>
            <div className="login-title-text">
              {esAdmin ? 'Iniciar Sesión (Admin)' : 'Iniciar Sesión'}
            </div>
          </div>

          <form className="auth-form" onSubmit={manejarEnvio}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo: algo@gmail.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="tu contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-submit" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <a href="#" className="admin-link" onClick={e => { e.preventDefault(); setEsAdmin(!esAdmin); }}>
              {esAdmin ? 'Usuario' : 'Admin'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}