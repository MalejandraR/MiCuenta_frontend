# MiCuenta - Gestión Financiera Personal

Aplicación web de gestión financiera personal desarrollada como propuesta para el programa **CodeF@ctory** de la Universidad de Antioquia.

## 🚀 Quickstart

```bash
# Instalar dependencias (ya hecho)
cd frontend
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:5173
```

## 📋 Historias de Usuario Implementadas (Hito 1)

| HU | Nombre | SP | Descripción |
|----|--------|-----|-------------|
| HU-01 | Registro de usuario | 3 | Crear cuenta con nombre, correo y contraseña |
| HU-03 | Inicio de sesión | 3 | Login con correo y contraseña |
| HU-08 | Registrar ingreso | 3 | Registrar ingresos con monto, fecha, categoría |
| HU-09 | Registrar gasto | 5 | Registrar gastos con alertas de presupuesto |
| HU-10 | Listar movimientos | 3 | Ver historial de movimientos con filtros |
| HU-18 | Dashboard financiero | 3 | Resumen con stats y gráfica de evolución |

**Total: 20 Story Points**

## 🎨 Diseño

El diseño está basado en los prototipos HTML originales en `D:\MiCuenta_Prototipos\`. Se respetaron los colores, tipografía y layout.

### Paleta de Colores

| Elemento | Color |
|----------|-------|
| Sidebar | `#0d2260` (navy) |
| Acento principal | `#2952cc` (azul) |
| Ingresos | `#1a8a4a` (verde) |
| Gastos | `#d93025` (rojo) |
| Balance positivo | `#2952cc` (azul) |
| Balance negativo | `#d93025` (rojo) |

### Tipografía

- **Font principal**: Inter (Google Fonts)
- **Tamaños**: 10px-28px según componente

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Layout principal (Sidebar + contenido)
│   │   ├── Layout.css
│   │   ├── Sidebar.jsx       # Navegación lateral
│   │   ├── Sidebar.css
│   │   └── PrivateRoute.jsx   # Protección de rutas
│   │
│   ├── pages/
│   │   ├── Login.jsx         # HU-03: Inicio de sesión
│   │   ├── Auth.css
│   │   ├── Registro.jsx       # HU-01: Registro de usuario
│   │   ├── Dashboard.jsx     # HU-18: Dashboard financiero
│   │   ├── Dashboard.css
│   │   ├── Movimientos.jsx   # HU-10: Listar movimientos
│   │   ├── Movimientos.css
│   │   ├── RegistrarMovimiento.jsx  # HU-08 + HU-09
│   │   └── RegistrarMovimiento.css
│   │
│   ├── services/
│   │   ├── authService.js    # Autenticación (localStorage)
│   │   └── movimientosService.js  # CRUD movimientos
│   │
│   ├── context/
│   │   └── AuthContext.jsx   # Context API para auth
│   │
│   ├── App.jsx               # Router principal
│   ├── App.css
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globales
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Autenticación

- **Almacenamiento**: localStorage (sin backend)
- **Clave de sesión**: `mc_sesion`
- **Clave de usuarios**: `mc_usuarios`
- **Flujo**:
  1. Registro → se guarda en `mc_usuarios`
  2. Login → verifica credenciales → crea sesión en `mc_sesion`
  3. Logout → elimina sesión

## 💾 Gestión de Datos

- **Almacenamiento**: localStorage
- **Clave de movimientos**: `mc_movimientos`
- **Estructura de movimiento**:
```javascript
{
  id: string,
  tipo: 'ingreso' | 'gasto',
  monto: number,
  fecha: string,        // YYYY-MM-DD
  categoria: string,
  descripcion: string,
  usuarioId: string,
  creadoEn: string      // ISO timestamp
}
```

### Categorías por Defecto

**Ingresos**: Salario, Freelance, Inversiones, Otros  
**Gastos**: Alimentación, Transporte, Servicios, Salud

## 🛣️ Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Redirect | Redirige a `/dashboard` |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de nuevo usuario |
| `/dashboard` | Privado | Dashboard financiero |
| `/registrar` | Privado | Registrar movimiento |
| `/movimientos` | Privado | Listado de movimientos |

## ⚙️ Validaciones Implementadas

### Registro (HU-01)
- Nombre requerido
- Correo único (no registrado)
- Contraseña mínimo 8 caracteres
- Confirmar contraseña coincide

### Login (HU-03)
- Credenciales válidas
- Mostrar error "Correo o contraseña incorrectos"

### Registrar Movimiento (HU-08, HU-09)
- Monto mayor a 0
- Fecha no futura
- Categoría obligatoria
- Validación de localStorage

### Listar Movimientos (HU-10)
- Filtro por tipo (ingreso/gasto)
- Filtro por categoría
- Filtro por rango de fechas

## 🧪 Cómo Probar

1. **Arrancar**: `npm run dev`
2. **Registrarse**: Ir a `/registro`, crear cuenta
3. **Login**: Usar las credenciales creadas
4. **Dashboard**: Ver stats y gráfica
5. **Registrar**: Ir a `/registrar`, crear ingresos y gastos
6. **Movimientos**: Ir a `/movimientos`, aplicar filtros

## 📊 Dashboard (HU-18)

Muestra:
- **Stats**: Total ingresos, Total gastos, Balance neto del mes
- **Últimos 5 movimientos**: Lista de movimientos recientes
- **Gráfica**: Evolución últimos 6 meses (barras agrupadas)
- **Recomendación**: Categoría con más gastos

## 🎯 Scope Hito 1

Lo que **SÍ incluye**:
- ✅ Registro y login funcional
- ✅ CRUD básico de movimientos
- ✅ Dashboard con stats y gráfica
- ✅ Diseño responsive basado en prototipos

Lo que **NO incluye** (Hito 2-3):
- ❌ Verificación de correo
- ❌ Recuperación de contraseña
- ❌ Presupuestos con alertas avanzadas
- ❌ Reportes gráficos avanzados
- ❌ Gestión de categorías personales
- ❌ Panel de administración

## 🔧 Tecnologías

- **Framework**: React 19 (Vite)
- **Router**: React Router DOM v7
- **Estilos**: CSS puro (sin frameworks)
- **Estado**: React Context + useState
- **Datos**: localStorage

## 📝 Notas para Desarrollo Futuro

1. **Backend**: Actualmente todo está en localStorage. Para producción, integrar con SpringBoot + PostgreSQL.
2. **Validaciones**: Las validaciones son del lado del cliente. Agregar validaciones en backend.
3. **Seguridad**: No hay hash de contraseñas en localStorage. Para producción, usar JWT + bcrypt.
4. **Presupuestos**: La lógica de alertas (80%, 100%) está preparada pero no activada completamente.

---

**Universidad de Antioquia** · CodeF@ctory 2026-1
