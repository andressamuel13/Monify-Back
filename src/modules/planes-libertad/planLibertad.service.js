const planLibertadRepository = require("./planLibertad.repository");
const movimientoRepository = require("../movimientos/movimiento.repository");
const httpError = require("../../utils/httpError");

async function listar() {
  return planLibertadRepository.findAll();
}

async function listarPorUsuario(usuarioId) {
  return planLibertadRepository.findByUsuario(usuarioId);
}

async function obtenerPorId(id) {
  const plan = await planLibertadRepository.findById(id);

  if (!plan) {
    throw httpError(404, "Plan de libertad no encontrado");
  }

  return plan;
}

async function crear(payload) {
  if (!payload.usuario_id || !payload.meta) {
    throw httpError(400, "usuario_id y meta son obligatorios");
  }

  if (Number(payload.meta) <= 0) {
    throw httpError(400, "La meta debe ser mayor a 0");
  }

  return planLibertadRepository.create(payload);
}

async function actualizar(id, payload) {
  await obtenerPorId(id);
  return planLibertadRepository.update(id, payload);
}

async function eliminar(id) {
  await obtenerPorId(id);
  await planLibertadRepository.remove(id);

  return {
    ok: true,
    message: "Plan de libertad eliminado correctamente",
  };
}

async function obtenerResumen(usuarioId) {
  const planes = await planLibertadRepository.findByUsuario(usuarioId);
  const planActivo =
    planes.data.find((item) => item.estado === "activo") || planes.data[0] || null;

  if (!planActivo) {
    return {
      ok: true,
      data: {
        abonado: 0,
        meta: 0,
        restante: 0,
        progreso: 0,
      },
    };
  }

  const movimientos = await movimientoRepository.findByUsuario(usuarioId);
  const abonado = movimientos.data
    .filter((item) => item.type === "debt")
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const meta = Number(planActivo.meta);
  const restante = Math.max(meta - abonado, 0);
  const progreso = meta > 0 ? Math.min((abonado / meta) * 100, 100) : 0;

  return {
    ok: true,
    data: {
      abonado,
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
