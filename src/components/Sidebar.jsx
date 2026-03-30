import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    section: 'Principal',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
          </svg>
        ),
      },
      {
        to: '/registrar',
        label: '+ Registrar movimiento',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        to: '/movimientos',
        label: 'Mis movimientos',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Finanzas',
    items: [
      {
        to: '#',
        label: 'Categorías',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M7 7h10M7 12h10M7 17h4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        to: '#',
        label: 'Presupuestos',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="2"/>
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        to: '#',
        label: 'Reportes',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const initiales = usuario
    ? (usuario.nombre[0] + usuario.apellido[0]).toUpperCase()
    : 'US';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">MiCuenta</span>
        <span className="sidebar-brand-sub">Gestión financiera personal</span>
      </div>

      {NAV_ITEMS.map(group => (
        <div key={group.section} className="sidebar-section">
          <span className="sidebar-section-label">{group.section}</span>
          {group.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'nav-item' + (isActive && item.to !== '#' ? ' active' : '')
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="avatar">{initiales}</div>
        <div className="sidebar-footer-info">
          <span className="sidebar-footer-name">
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
          </span>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
