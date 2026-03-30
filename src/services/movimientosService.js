// movimientosService.js — CRUD de movimientos en localStorage
// localStorage key: 'mc_movimientos'  (array)
//
// Estructura de un movimiento:
// {
//   id: string,
//   tipo: 'ingreso' | 'gasto',
//   monto: number,
//   fecha: string  (YYYY-MM-DD),
//   categoria: string,
//   descripcion: string,
//   usuarioId: string,
//   creadoEn: string (ISO),
// }

const KEY = 'mc_movimientos';

export const CATEGORIAS_INGRESO = ['Salario', 'Freelance', 'Inversiones', 'Otros'];
export const CATEGORIAS_GASTO   = ['Alimentación', 'Transporte', 'Servicios', 'Salud'];

function getTodos() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(movimientos) {
  localStorage.setItem(KEY, JSON.stringify(movimientos));
}

/**
 * Devuelve los movimientos del usuario indicado, ordenados por fecha desc.
 */
export function getMovimientos(usuarioId) {
  return getTodos()
    .filter(m => m.usuarioId === usuarioId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/**
 * Guarda un nuevo movimiento.
 * @returns {{ ok: boolean, error?: string, movimiento?: object }}
 */
export function guardar({ tipo, monto, fecha, categoria, descripcion, usuarioId }) {
  if (!tipo || !monto || !fecha || !categoria || !usuarioId) {
    return { ok: false, error: 'Completa todos los campos obligatorios.' };
  }

  const montoNum = parseFloat(String(monto).replace(/\./g, '').replace(',', '.'));
  if (isNaN(montoNum) || montoNum <= 0) {
    return { ok: false, error: 'El monto debe ser un número positivo.' };
  }

  const hoy = new Date().toISOString().slice(0, 10);
  if (fecha > hoy) {
    return { ok: false, error: 'La fecha no puede ser futura.' };
  }

  const nuevo = {
    id: Date.now().toString(),
    tipo,
    monto: montoNum,
    fecha,
    categoria,
    descripcion: descripcion || '',
    usuarioId,
    creadoEn: new Date().toISOString(),
  };

  saveTodos([...getTodos(), nuevo]);
  return { ok: true, movimiento: nuevo };
}

/**
 * Elimina un movimiento por id.
 */
export function eliminar(id) {
  saveTodos(getTodos().filter(m => m.id !== id));
}

/**
 * Calcula totales para un usuario y un mes (YYYY-MM).
 * Si mes es null, calcula sobre todos los movimientos del usuario.
 */
export function getTotales(usuarioId, mes = null) {
  const lista = getMovimientos(usuarioId).filter(m =>
    mes ? m.fecha.startsWith(mes) : true
  );

  const ingresos = lista
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);

  const gastos = lista
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  return { ingresos, gastos, balance: ingresos - gastos };
}

/**
 * Formatea un número como moneda COP.
 * Ej: 1750000 → "$ 1.750.000"
 */
export function formatCOP(num) {
  return '$ ' + Math.abs(num).toLocaleString('es-CO');
}
