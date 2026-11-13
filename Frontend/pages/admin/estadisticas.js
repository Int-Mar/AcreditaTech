// /admin/estadisticas — Totales por estatus, oficio, alcaldía y promedios

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import { obtenerEstadisticas } from '../../utilidades/administracion_peticiones';
import estilos from '../../estilos/salud.module.css';

function Lista({ titulo, filas, campoNombre }) {
  return (
    <section className={estilos.tarjeta}>
      <h3 className={estilos.titulo}>{titulo}</h3>
      {filas.length === 0 && <p>Sin datos todavía</p>}
      {filas.map((f) => (
        <p key={f[campoNombre]} style={{ margin: '0.3rem 0' }}>
          {f[campoNombre]}: <strong>{f.cantidad}</strong>
        </p>
      ))}
    </section>
  );
}

export default function EstadisticasAdmin() {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setDatos(await obtenerEstadisticas());
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) {
          setError(e.response?.data?.error || 'No se pudieron cargar las estadísticas');
        }
      }
    }
    cargar();
  }, []);

  return (
    <LayoutAdmin activo="estadisticas">
      <main className="admin-content-area">
        <div className={estilos.contenedor}>
          <h2 className={estilos.titulo}>Estadísticas</h2>

          {error && <p className={estilos.error}>{error}</p>}
          {!datos && !error && <p>Cargando...</p>}

          {datos && (
            <>
              <section className={estilos.tarjeta}>
                <h3 className={estilos.titulo}>Total de trabajadores</h3>
                <p style={{ fontSize: '2rem', margin: 0 }}>
                  <strong>{datos.total_usuarios}</strong>
                </p>
              </section>

              <Lista titulo="Por estatus" filas={datos.por_estado} campoNombre="estatus" />
              <Lista titulo="Por oficio" filas={datos.por_oficio} campoNombre="nombre_oficio" />
              <Lista titulo="Por alcaldía" filas={datos.por_alcaldia} campoNombre="nombre_alcaldia" />

              <section className={estilos.tarjeta}>
                <h3 className={estilos.titulo}>Promedio de calificación por test</h3>
                {datos.promedio_por_test.map((t) => (
                  <p key={t.id_tipo_evaluacion} style={{ margin: '0.3rem 0' }}>
                    {t.nombre}:{' '}
                    <strong>{t.promedio === null ? 'Sin intentos' : t.promedio}</strong>
                  </p>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </LayoutAdmin>
  );
}