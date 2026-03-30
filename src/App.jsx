import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import RegistrarMovimiento from './pages/RegistrarMovimiento';
import Movimientos from './pages/Movimientos';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas privadas — envueltas en Layout (sidebar + main area) */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/registrar"  element={<RegistrarMovimiento />} />
              <Route path="/movimientos" element={<Movimientos />} />
            </Route>
          </Route>

          {/* Redirect raíz → dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
