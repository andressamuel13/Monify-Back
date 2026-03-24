const movimientoRepository = require("./movimiento.repository");
const categoriaRepository = require("../categorias/categoria.repository");
const httpError = require("../../utils/httpError");

const TIPOS_VALIDOS = ["income", "expense", "saving", "debt"];

async function listar() {
  return movimientoRepository.findAll();
}

async function listarPorUsuario(usuarioId) {
  return movimientoRepository.findByUsuario(usuarioId);
}

async function listarRecientes(usuarioId) {
  return movimientoRepository.findRecientesByUsuario(usuarioId);
}

async function obtenerResumen(usuarioId) {
  return movimientoRepository.getResumenByUsuario(usuarioId);
}

async function obtenerHistorial(usuarioId) {
  return movimientoRepository.getHistorialByUsuario(usuarioId);
}

async function obtenerPorId(id) {
  const movimiento = await movimientoRepository.findById(id);

  if (!movimiento) {
    throw httpError(404, "Movimiento no encontrado");
  }

  return movimiento;
}

async function crear(payload) {
  validarPayload(payload);
  await validarCategoria(payload.categoria_id, payload.type);
  return movimientoRepository.create(payload);
}

async function actualizar(id, payload) {
  const actual = await obtenerPorId(id);
  validarPayload(payload, true);

  const categoriaId = payload.categoria_id !== undefined ? payload.categoria_id : actual.categoria_id;
  const type = payload.type !== undefined ? payload.type : actual.type;

  if (categoriaId && type) {
    await validarCategoria(categoriaId, type);
  }

  return movimientoRepository.update(id, payload);
}

async function eliminar(id) {
  await obtenerPorId(id);
  await movimientoRepository.remove(id);

  return { ok: true, message: "Movimiento eliminado correctamente" };
}

function validarPayload(payload, isPartial = false) {
  const requiredFields = ["usuario_id", "categoria_id", "type", "amount", "date"];

  if (!isPartial) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
        throw httpError(400, `El campo ${field} es obligatorio`);
      }
    }
  }

  if (payload.type && !TIPOS_VALIDOS.includes(payload.type)) {
    throw httpError(400, "Tipo de movimiento no valido");
  }

  if (payload.amount !== undefined && Number(payload.amount) <= 0) {
    throw httpError(400, "El monto debe ser mayor a 0");
  }
}

async function validarCategoria(categoriaId, type) {
  const categoria = await categoriaRepository.findById(categoriaId);

  if (!categoria) {
    throw httpError(404, "Categoria no encontrada");
  }

  if (categoria.tipo !== type) {
    throw httpError(400, "La categoria no coincide con el tipo de movimiento");
  }
}

module.exports = {
  listar,
  listarPorUsuario,
  listarRecientes,
  obtenerResumen,
  obtenerHistorial,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
