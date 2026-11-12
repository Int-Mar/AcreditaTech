import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { obtenerCatalogos } from '../../utilidades/peticiones';
import { obtenerEstatus, obtenerPadron, redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import estilos from '../../estilos/admin.module.css';

const FILTROS_VACIOS = { alcaldia: '', oficio: '', estatus: '' };

export default function MenuAdmin() {
  const router = useRouter();
  const [tipo, setTipo] = useState('proceso');        
  const [alcaldias, setAlcaldias] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [listaEstatus, setListaEstatus] = useState({ proceso: [], preconstancia: [] });
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [cat, est] = await Promise.all([obtenerCatalogos(), obtenerEstatus()]);
        setAlcaldias(cat.alcaldias || []);
        setOficios(cat.oficios || []);
        setListaEstatus(est);
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) setError('No se pudieron cargar los filtros');
      }
    }
    cargarCatalogos();
  }, []);

  // Al cambiar de padrón se limpian los filtros y se carga la lista completa
  useEffect(() => {
    setFiltros(FILTROS_VACIOS);
    cargarPadron(tipo, FILTROS_VACIOS);
  }, [tipo]);

  async function cargarPadron(tipoPadron, filtrosAplicados) {
    setCargando(true);
    setError('');
    try {
      const data = await obtenerPadron(tipoPadron, filtrosAplicados);
      setTrabajadores(data.trabajadores);
    } catch (e) {
      if (!redirigirSiNoAutorizado(e, router)) {
        setError(e.response?.data?.mensaje || 'Error al obtener el padrón');
        setTrabajadores([]);
      }
    } finally {
      setCargando(false);
    }
  }

  function cambiarFiltro(campo, valor) {
    setFiltros({ ...filtros, [campo]: valor });
  }

  return (
    <LayoutAdmin activo="inicio">
      <main className="admin-content-area">

        <div className="admin-tabs-container">
          <button type="button" className={`admin-tab-btn ${tipo === 'proceso' ? 'active' : ''}`}
            onClick={() => setTipo('proceso')}>
            Padrón Trabajadores en proceso
          </button>
          <button type="button" className={`admin-tab-btn ${tipo === 'preconstancia' ? 'active' : ''}`}
            onClick={() => setTipo('preconstancia')}>
            Padrón Trabajadores con Pre-Constancia
          </button>
        </div>

        {/* Filtros: solo listas desplegables */}
        <div className={estilos.barraFiltros}>
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

          <select className={estilos.selectFiltro} value={filtros.estatus}
            onChange={(e) => cambiarFiltro('estatus', e.target.value)}>
            <option value="">Todos los estatus</option>
            {(listaEstatus[tipo] || []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button type="button" className={estilos.btnFiltro}
            onClick={() => cargarPadron(tipo, filtros)}>
            Aplicar Filtro
          </button>
        </div>

        {error && <p className={estilos.mensajeError}>{error}</p>}

        <div className="admin-table-wrapper">
          <div className="admin-table-card">
            <div className="admin-table-header">
              <span>Nombre</span>
              <span>Correo</span>
              <span>Alcaldía</span>
              <span>Oficio</span>
              <span>Estatus</span>
            </div>
            <div className="admin-table-body">
              {cargando && <p className={estilos.mensajeTabla}>Cargando...</p>}

              {!cargando && trabajadores.length === 0 && (
                <p className={estilos.mensajeTabla}>
                  No se encontraron trabajadores que coincidan con la búsqueda
                </p>
              )}

              {!cargando && trabajadores.map((t) => (
                <div className="admin-table-row" key={t.id_usuario}>
                  <span>{t.nombre}</span>
                  <span>{t.correo}</span>
                  <span>{t.nombre_alcaldia}</span>
                  <span>{t.nombre_oficio}</span>
                  <span>{t.estatus}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-action-footer">
            <button type="button" className="btn-hacer-cambios"
              onClick={() => router.push('/admin/modificar-estatus')}>
              Hacer Cambios
            </button>
          </div>
        </div>

      </main>
    </LayoutAdmin>
  );
}