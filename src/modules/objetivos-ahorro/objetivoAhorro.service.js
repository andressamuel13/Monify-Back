const objetivoAhorroRepository = require("./objetivoAhorro.repository");
const movimientoRepository = require("../movimientos/movimiento.repository");
const httpError = require("../../utils/httpError");

async function listar() {
  return objetivoAhorroRepository.findAll();
}

async function listarPorUsuario(usuarioId) {
  return objetivoAhorroRepository.findByUsuario(usuarioId);
}

async function obtenerPorId(id) {
  const objetivo = await objetivoAhorroRepository.findById(id);

  if (!objetivo) {
    throw httpError(404, "Objetivo de ahorro no encontrado");
  }

  return objetivo;
}

async function crear(payload) {
  if (!payload.usuario_id || !payload.nombre || !payload.meta) {
    throw httpError(400, "usuario_id, nombre y meta son obligatorios");
  }

  if (Number(payload.meta) <= 0) {
    throw httpError(400, "La meta debe ser mayor a 0");
  }

  return objetivoAhorroRepository.create(payload);
}

async function actualizar(id, payload) {
  await obtenerPorId(id);
  return objetivoAhorroRepository.update(id, payload);
}

async function eliminar(id) {
  await obtenerPorId(id);
  await objetivoAhorroRepository.remove(id);

  return {
    ok: true,
    message: "Objetivo de ahorro eliminado correctamente",
  };
}

async function obtenerResumen(usuarioId) {
  const objetivos = await objetivoAhorroRepository.findByUsuario(usuarioId);
  const metaActiva = objetivos.data[0] || null;

  if (!metaActiva) {
    return {
      ok: true,
      data: {
        ahorrado: 0,
        meta: 0,
        restante: 0,
        progreso: 0,
      },
    };
  }

  const movimientos = await movimientoRepository.findByUsuario(usuarioId);
  const ahorrado = movimientos.data
    .filter((item) => item.type === "saving")
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const meta = Number(metaActiva.meta);
  const restante = Math.max(meta - ahorrado, 0);
  const progreso = meta > 0 ? Math.min((ahorrado / meta) * 100, 100) : 0;

  return {
    ok: true,
    data: {
      ahorrado,
      meta,
      restante,
      progreso,
    },
  };
}

module.exports = {
  listar,
  listarPorUsuario,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  obtenerResumen,
};
