import { Navigate, useOutlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSesion } from '../services/authService';

export default function PrivateRoute() {
  const { usuario } = useAuth();
  
  // Verificar tanto el estado como localStorage directamente
  // para evitar timing issues con el setState de login
  const usuarioEnSesion = usuario || getSesion();
  
  // Si no hay usuario en sesión, redirigir al login
  if (!usuarioEnSesion) {
    return <Navigate to="/login" replace />;
  }
  
  // Usar useOutlet para renderizar las rutas children (Layout + páginas)
  const outlet = useOutlet();
  
  return outlet;
}
