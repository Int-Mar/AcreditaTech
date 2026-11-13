// /admin/usuarios — Lista de usuarios con buscador, filtros y bloqueo

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { obtenerCatalogos } from '../../utilidades/peticiones';
import { redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import { listarUsuarios, cambiarBloqueo } from '../../utilidades/administracion_peticiones';
import estilos from '../../estilos/admin.module.css';

const COLUMNAS = { gridTemplateColumns: '1.6fr 2fr 1.4fr 1.4fr 1.4fr 1fr 1fr' };

export default function UsuariosAdmin() {
  const router = useRouter();
  const [alcaldias, setAlcaldias] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [filtros, setFiltros] = useState({ q: '', alcaldia: '', oficio: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const cat = await obtenerCatalogos();
        setAlcaldias(cat.alcaldias || []);
        setOficios(cat.oficios || []);
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) setError('No se pudieron cargar los filtros');
      }
    }
    cargarCatalogos();
    cargar(filtros);
  }, []);

  async function cargar(filtrosAplicados) {
    setCargando(true);
    setError('');
    try {
      setUsuarios(await listarUsuarios(filtrosAplicados));
    } catch (e) {
      if (!redirigirSiNoAutorizado(e, router)) {
        setError(e.response?.data?.error || 'Error al obtener los usuarios');
        setUsuarios([]);
      }
    } finally {
      setCargando(false);
    }
  }

  function cambiarFiltro(campo, valor) {
    setFiltros({ ...filtros, [campo]: valor });
  }

  async function alternarBloqueo(usuario) {
    const accion = usuario.bloqueado ? 'desbloquear' : 'bloquear';
    if (!window.confirm(`¿Seguro que quieres ${accion} a ${usuario.nombre}?`)) return;
    setError('');
    try {
      await cambiarBloqueo(usuario.id_usuario, !usuario.bloqueado);
      cargar(filtros);
    } catch (e) {
      if (!redirigirSiNoAutorizado(e, router)) {
        setError(e.response?.data?.error || 'No se pudo cambiar el bloqueo');
      }
    }
  }

  return (
    <LayoutAdmin activo="usuarios">
      <main className="admin-content-area">

        <div className={estilos.barraFiltros}>
          <input type="text" className={estilos.selectFiltro}
            placeholder="Buscar por nombre o correo"
            value={filtros.q}
            onChange={(e) => cambiarFiltro('q', e.target.value)} />

          <select className={estilos.selectFiltro} value={filtros.alcaldia}
            onChange={(e) => cambiarFiltro('alcaldia', e.target.value)}>
            <option value="">Todas las alcaldías</option>
            {alcaldias.map((a) => (
              <option key={a.id_alcaldia} value={a.id_alcaldia}>{a.nombre_alcaldia}</option>
            ))}
          </select>

          <select className={estilos.selectFiltro} value={filtros.oficio}
            onChange={(e) => cambiarFiltro('oficio', e.target.value)}>
            <option value="">Todos los oficios</option>
            {oficios.map((o) => (
              <option key={o.id_oficio} value={o.id_oficio}>{o.nombre_oficio}</option>
            ))}
          </select>

          <button type="button" className={estilos.btnFiltro} onClick={() => cargar(filtros)}>
            Buscar
          </button>
        </div>

        {error && <p className={estilos.mensajeError}>{error}</p>}

        <div className="admin-table-wrapper">
          <div className="admin-table-card">
            <div className="admin-table-header" style={COLUMNAS}>
              <span>Nombre</span>
              <span>Correo</span>
              <span>Alcaldía</span>
              <span>Oficio</span>
              <span>Estatus</span>
              <span>Acceso</span>
              <span>Acción</span>
            </div>
            <div className="admin-table-body">
              {cargando && <p className={estilos.mensajeTabla}>Cargando...</p>}

              {!cargando && usuarios.length === 0 && (
                <p className={estilos.mensajeTabla}>No se encontraron usuarios</p>
              )}

              {!cargando && usuarios.map((u) => (
                <div className="admin-table-row" key={u.id_usuario} style={COLUMNAS}>
                  <span>{u.nombre}</span>
                  <span>{u.correo}</span>
                  <span>{u.nombre_alcaldia}</span>
                  <span>{u.nombre_oficio}</span>
                  <span>{u.estatus}</span>
                  <span>{u.bloqueado ? 'Bloqueado' : 'Activo'}</span>
                  <span>
                    {u.id_tipo_usuario === 1 ? (
                      <button type="button" className={estilos.btnFiltro}
                        onClick={() => alternarBloqueo(u)}>
                        {u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    ) : 'Admin'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </LayoutAdmin>
  );
}