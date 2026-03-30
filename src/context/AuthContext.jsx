import { createContext, useContext, useState, useEffect } from 'react';
import { getSesion, logout as doLogout, guardarSesion } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => getSesion());

  // Sincronizar con localStorage al inicio
  useEffect(() => {
    const sesion = getSesion();
    if (sesion && !usuario) {
      setUsuario(sesion);
    }
  }, []);

  function login(u) {
    // Guardar la sesión en localStorage para persistencia
    guardarSesion(u);
    setUsuario(u);
  }

  function logout() {
    doLogout();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
