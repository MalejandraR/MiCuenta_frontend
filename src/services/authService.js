// authService.js — manejo de usuarios en localStorage
// localStorage key: 'mc_usuarios'  (array de usuarios)
// localStorage key: 'mc_sesion'    (usuario activo o null)

const KEY_USUARIOS = 'mc_usuarios';
const KEY_SESION   = 'mc_sesion';

function getUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
  } catch {
    return [];
  }
}

function saveUsuarios(usuarios) {
  localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
}

/**
 * Registra un nuevo usuario.
 * @returns {{ ok: boolean, error?: string, usuario?: object }}
 */
export function registrar({ nombre, apellido, email, password }) {
  if (!nombre || !apellido || !email || !password) {
    return { ok: false, error: 'Todos los campos son obligatorios.' };
  }
  if (password.length < 8) {
    return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  const usuarios = getUsuarios();
  const existe = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existe) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo electrónico.' };
  }

  const nuevo = {
    id: Date.now().toString(),
    nombre,
    apellido,
    email: email.toLowerCase(),
    password, // texto plano — proyecto académico sin backend
    creadoEn: new Date().toISOString(),
  };

  saveUsuarios([...usuarios, nuevo]);
  
  // IMPORTANTE: Guardar la sesión inmediatamente después del registro
  guardarSesion(nuevo);
  
  return { ok: true, usuario: nuevo };
}

/**
 * Inicia sesión.
 * @returns {{ ok: boolean, error?: string, usuario?: object }}
 */
export function login({ email, password }) {
  if (!email || !password) {
    return { ok: false, error: 'Ingresa tu correo y contraseña.' };
  }

  const usuarios = getUsuarios();
  const usuario = usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!usuario) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' };
  }

  localStorage.setItem(KEY_SESION, JSON.stringify(usuario));
  return { ok: true, usuario };
}

/**
 * Cierra la sesión activa.
 */
export function logout() {
  localStorage.removeItem(KEY_SESION);
}

/**
 * Guarda la sesión activa en localStorage.
 */
export function guardarSesion(usuario) {
  localStorage.setItem(KEY_SESION, JSON.stringify(usuario));
}

/**
 * Devuelve el usuario en sesión o null.
 */
export function getSesion() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SESION)) || null;
  } catch {
    return null;
  }
}
