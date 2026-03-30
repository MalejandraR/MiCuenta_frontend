import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getMovimientos,
  eliminar,
  getTotales,
  formatCOP,
  CATEGORIAS_INGRESO,
  CATEGORIAS_GASTO,
} from '../services/movimientosService';
import './Movimientos.css';

// Formatea fecha YYYY-MM-DD → "27 mar 2026"
function formatFecha(fechaStr) {
  const [y, m, d] = fechaStr.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

// Mes actual como "YYYY-MM"
function getMesActual() {
  return new Date().toISOString().slice(0, 7);
}

// Nombre legible del mes actual
function getNombreMes() {
  return new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' });
}

// Clase CSS para badge de categoría
const CAT_CLASS = {
  Salario:       'cat-salario',
  Freelance:     'cat-free',
  Inversiones:   'cat-inv',
  Otros:         'cat-otros',
  Alimentación:  'cat-alim',
  Transporte:    'cat-trans',
  Servicios:     'cat-serv',
  Salud:         'cat-salud',
};

const TODAS_CATEGORIAS = [...CATEGORIAS_INGRESO, ...CATEGORIAS_GASTO];

export default function Movimientos() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Estado de filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState(false);

  // Confirmación de eliminación
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Forzar re-render al eliminar
  const [tick, setTick] = useState(0);

  const mesActual = getMesActual();
  const totales = getTotales(usuario.id, mesActual);

  // Movimientos filtrados (memo sobre tick para re-calcular al eliminar)
  const movimientos = useMemo(() => {
    let lista = getMovimientos(usuario.id);

    if (filtrosActivos) {
      if (filtroTipo)      lista = lista.filter(m => m.tipo === filtroTipo);
      if (filtroCategoria) lista = lista.filter(m => m.categoria === filtroCategoria);
      if (filtroDesde)     lista = lista.filter(m => m.fecha >= filtroDesde);
      if (filtroHasta)     lista = lista.filter(m => m.fecha <= filtroHasta);
    }

    return lista;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id, filtrosActivos, filtroTipo, filtroCategoria, filtroDesde, filtroHasta, tick]);

  function handleAplicar() {
    setFiltrosActivos(true);
  }

  function handleLimpiarFiltros() {
    setFiltroTipo('');
    setFiltroCategoria('');
    setFiltroDesde('');
    setFiltroHasta('');
    setFiltrosActivos(false);
  }

  function handleEliminar(id) {
    eliminar(id);
    setIdAEliminar(null);
    setTick(t => t + 1);
  }

  return (
    <div className="mov-page">

      {/* TOPBAR */}
      <div className="mov-topbar">
        <div className="mov-topbar-left">
          <h1>Mis movimientos</h1>
          <div className="mov-breadcrumb">Inicio / <span>Mis movimientos</span></div>
        </div>
        <button className="mov-btn-nuevo" onClick={() => navigate('/registrar')}>
          + Nuevo movimiento
        </button>
      </div>

      {/* CONTENT */}
      <div className="mov-content">

        {/* STATS */}
        <div className="mov-stats">
          <div className="mov-stat-card">
            <div className="mov-stat-label">Total Ingresos</div>
            <div className="mov-stat-value ingreso">{formatCOP(totales.ingresos)}</div>
            <div className="mov-stat-period">{getNombreMes()}</div>
          </div>
          <div className="mov-stat-card">
            <div className="mov-stat-label">Total Gastos</div>
            <div className="mov-stat-value gasto">{formatCOP(totales.gastos)}</div>
            <div className="mov-stat-period">{getNombreMes()}</div>
          </div>
          <div className="mov-stat-card">
            <div className="mov-stat-label">Balance Neto</div>
            <div className={`mov-stat-value balance ${totales.balance < 0 ? 'negativo' : ''}`}>
              {formatCOP(totales.balance)}
            </div>
            <div className="mov-stat-period">Ahorro del mes</div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="mov-filters">
          <span className="mov-filter-label">Filtrar por:</span>

          <select
            className="mov-filter-select"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>

          <select
            className="mov-filter-select"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {TODAS_CATEGORIAS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            className="mov-filter-date"
            type="date"
            value={filtroDesde}
            onChange={e => setFiltroDesde(e.target.value)}
          />
          <span className="mov-filter-dash">—</span>
          <input
            className="mov-filter-date"
            type="date"
            value={filtroHasta}
            onChange={e => setFiltroHasta(e.target.value)}
          />

          <button className="mov-btn-aplicar" onClick={handleAplicar}>Aplicar</button>
          <button className="mov-btn-limpiar" onClick={handleLimpiarFiltros}>Limpiar</button>
        </div>

        {/* TABLA */}
        <div className="mov-table-card">
          <div className="mov-table-header">
            <span className="mov-table-title">Historial de movimientos</span>
            <span className="mov-table-count">
              {movimientos.length} {movimientos.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {movimientos.length === 0 ? (
            <div className="mov-empty">
              <p>No hay movimientos que mostrar.</p>
              <button className="mov-btn-nuevo" onClick={() => navigate('/registrar')}>
                + Registrar tu primer movimiento
              </button>
            </div>
          ) : (
            <table className="mov-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td>{formatFecha(m.fecha)}</td>
                    <td>
                      {m.tipo === 'ingreso'
                        ? <span className="mov-badge mov-badge-ing">+ Ingreso</span>
                        : <span className="mov-badge mov-badge-gas">− Gasto</span>
                      }
                    </td>
                    <td>
                      <span className={`mov-cat ${CAT_CLASS[m.categoria] || 'cat-otros'}`}>
                        {m.categoria}
                      </span>
                    </td>
                    <td className="mov-desc">{m.descripcion || '—'}</td>
                    <td className={m.tipo === 'ingreso' ? 'monto-ing' : 'monto-gas'}>
                      {m.tipo === 'ingreso' ? '+ ' : '− '}{formatCOP(m.monto)}
                    </td>
                    <td>
                      <button
                        className="accion-eliminar"
                        onClick={() => setIdAEliminar(m.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* MODAL CONFIRMACIÓN */}
      {idAEliminar && (
        <div className="mov-modal-overlay" onClick={() => setIdAEliminar(null)}>
          <div className="mov-modal" onClick={e => e.stopPropagation()}>
            <div className="mov-modal-title">¿Eliminar movimiento?</div>
            <div className="mov-modal-text">Esta acción no se puede deshacer.</div>
            <div className="mov-modal-actions">
              <button className="mov-modal-cancel" onClick={() => setIdAEliminar(null)}>
                Cancelar
              </button>
              <button className="mov-modal-confirm" onClick={() => handleEliminar(idAEliminar)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
