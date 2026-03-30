import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovimientos, getTotales, formatCOP } from '../services/movimientosService';
import './Dashboard.css';

// Formatea fecha YYYY-MM-DD → "27 mar 2026"
function formatFecha(fechaStr) {
  const [y, m, d] = fechaStr.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

// Fecha larga: "27 de marzo de 2026"
function getFechaLarga() {
  return new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Mes actual YYYY-MM
function getMesActual() {
  return new Date().toISOString().slice(0, 7);
}

// Nombre del mes actual capitalizado
function getNombreMes() {
  const d = new Date();
  const mes = d.toLocaleString('es-CO', { month: 'long' });
  return mes.charAt(0).toUpperCase() + mes.slice(1) + ' ' + d.getFullYear();
}

// Últimos 6 meses como strings "YYYY-MM"
function getUltimos6Meses() {
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    meses.push(d.toISOString().slice(0, 7));
  }
  return meses;
}

// Etiqueta corta del mes: "Mar", "Abr", etc.
function labelMes(mesStr) {
  const [y, m] = mesStr.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  const label = d.toLocaleString('es-CO', { month: 'short' });
  return label.charAt(0).toUpperCase() + label.slice(1, 3);
}

// Calcula categoría que más gasta
function getCategoriaTop(movimientos) {
  const conteo = {};
  movimientos.filter(m => m.tipo === 'gasto').forEach(m => {
    conteo[m.categoria] = (conteo[m.categoria] || 0) + m.monto;
  });
  return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Si no hay usuario en el contexto, intentar obtenerlo directamente de localStorage
  // Esto evita la página en blanco por timing issues entre login y navegación
  const usuarioActivo = usuario || (() => {
    try {
      return JSON.parse(localStorage.getItem('mc_sesion')) || null;
    } catch {
      return null;
    }
  })();

  // Si aún no hay usuario activo, mostrar indicador de carga
  // (PrivateRoute debería evitar esto, pero por seguridad manejamos el caso)
  if (!usuarioActivo) {
    return (
      <div className="dash-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: '#666'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  const mesActual = getMesActual();
  const totales = getTotales(usuarioActivo.id, mesActual);
  const todosMovimientos = getMovimientos(usuarioActivo.id);
  const ultimosCinco = todosMovimientos.slice(0, 5);

  const catTop = useMemo(() => getCategoriaTop(todosMovimientos), [todosMovimientos]);

  // Datos de los últimos 6 meses para la gráfica
  const ultimos6 = useMemo(() => {
    const meses = getUltimos6Meses();
    return meses.map(mes => ({
      mes,
      label: labelMes(mes),
      ...getTotales(usuarioActivo.id, mes),
      esActual: mes === mesActual,
    }));
  }, [usuarioActivo.id, mesActual]);

  // Altura máxima para normalizar barras (máx 120px)
  const maxValor = useMemo(() => {
    const max = Math.max(...ultimos6.map(m => Math.max(m.ingresos, m.gastos)), 1);
    return max;
  }, [ultimos6]);

  function altura(valor) {
    return Math.max(8, Math.round((valor / maxValor) * 120));
  }

  // Nombre visible del usuario
  const nombreUsuario = usuarioActivo.nombre || usuarioActivo.email.split('@')[0];

  return (
    <div className="dash-page">

      {/* TOPBAR */}
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <h1>Dashboard</h1>
          <div className="dash-topbar-sub">Resumen financiero · {getNombreMes()}</div>
        </div>
        <div className="dash-topbar-right">
          <button className="dash-btn-nuevo" onClick={() => navigate('/registrar')}>
            + Nuevo movimiento
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dash-content">

        {/* WELCOME */}
        <div className="dash-welcome">
          <div>
            <div className="dash-welcome-title">Buen día, {nombreUsuario}</div>
            <div className="dash-welcome-sub">Aquí está el resumen de tus finanzas de este mes</div>
          </div>
          <div className="dash-welcome-date">{getFechaLarga()}</div>
        </div>

        {/* STATS */}
        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-header">
              <div className="dash-stat-dot dot-green"></div>
              <span className="dash-stat-label">Total Ingresos</span>
            </div>
            <div className="dash-stat-value ing">{formatCOP(totales.ingresos)}</div>
            <div className="dash-stat-period">{getNombreMes()}</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-header">
              <div className="dash-stat-dot dot-red"></div>
              <span className="dash-stat-label">Total Gastos</span>
            </div>
            <div className="dash-stat-value gas">{formatCOP(totales.gastos)}</div>
            <div className="dash-stat-period">{getNombreMes()}</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-header">
              <div className="dash-stat-dot dot-blue"></div>
              <span className="dash-stat-label">Balance Neto</span>
            </div>
            <div className={`dash-stat-value bal ${totales.balance < 0 ? 'negativo' : ''}`}>
              {formatCOP(totales.balance)}
            </div>
            <div className="dash-stat-period">Ahorro del mes</div>
            <div className={`dash-stat-trend ${totales.balance >= 0 ? 'trend-pos' : 'trend-neg'}`}>
              {totales.balance >= 0 ? 'Balance positivo' : 'Balance negativo'}
            </div>
          </div>
        </div>

        {/* RECOMMENDATION */}
        {catTop && totales.gastos > 0 && (
          <div className="dash-rec">
            <div className="dash-rec-icon">💡</div>
            <div>
              <div className="dash-rec-title">Recomendación financiera</div>
              <div className="dash-rec-text">
                La categoría <strong>{catTop}</strong> es donde más has gastado este mes.
                Considera revisar tus hábitos en esta área para mejorar tu ahorro.
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM GRID */}
        <div className="dash-bottom-grid">

          {/* Últimos movimientos */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Últimos movimientos</span>
              <button className="dash-card-link" onClick={() => navigate('/movimientos')}>
                Ver todos →
              </button>
            </div>

            {ultimosCinco.length === 0 ? (
              <div className="dash-empty">
                <p>Aún no tienes movimientos.</p>
                <button className="dash-btn-nuevo" onClick={() => navigate('/registrar')}>
                  + Registrar primero
                </button>
              </div>
            ) : (
              ultimosCinco.map(m => (
                <div key={m.id} className="dash-mov-item">
                  <div className="dash-mov-left">
                    <div className={`dash-mov-badge ${m.tipo === 'ingreso' ? 'ing' : 'gas'}`}>
                      {m.tipo === 'ingreso' ? '+' : '−'}
                    </div>
                    <div>
                      <div className="dash-mov-name">{m.categoria}</div>
                      <div className="dash-mov-date">{formatFecha(m.fecha)}</div>
                    </div>
                  </div>
                  <div className={`dash-mov-amount ${m.tipo === 'ingreso' ? 'ing' : 'gas'}`}>
                    {m.tipo === 'ingreso' ? '+' : '−'}{formatCOP(m.monto)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Gráfica de barras */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Evolución últimos 6 meses</span>
            </div>
            <div className="dash-chart-legend">
              <div className="dash-legend-item">
                <div className="dash-legend-dot ld-green"></div>
                Ingresos
              </div>
              <div className="dash-legend-item">
                <div className="dash-legend-dot ld-red"></div>
                Gastos
              </div>
            </div>
            <div className="dash-chart-area">
              {ultimos6.map(d => (
                <div key={d.mes} className="dash-bar-group">
                  <div className="dash-bars">
                    <div
                      className={`dash-bar ${d.esActual ? 'ing-dark' : 'ing-light'}`}
                      style={{ height: `${altura(d.ingresos)}px` }}
                      title={`Ingresos: ${formatCOP(d.ingresos)}`}
                    ></div>
                    <div
                      className={`dash-bar ${d.esActual ? 'gas-dark' : 'gas-light'}`}
                      style={{ height: `${altura(d.gastos)}px` }}
                      title={`Gastos: ${formatCOP(d.gastos)}`}
                    ></div>
                  </div>
                  <div className={`dash-bar-label ${d.esActual ? 'active' : ''}`}>
                    {d.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
