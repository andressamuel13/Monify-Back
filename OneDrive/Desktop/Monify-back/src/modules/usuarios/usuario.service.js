const usuarioRepository = require("./usuario.repository");
const httpError = require("../../utils/httpError");

async function listar() {
  return usuarioRepository.findAll();
}

async function obtenerPorId(id) {
  const usuario = await usuarioRepository.findById(id);

  if (!usuario) {
    throw httpError(404, "Usuario no encontrado");
  }

  return usuario;
}

async function crear(payload) {
  if (!payload.nombre || !payload.email) {
    throw httpError(400, "nombre y email son obligatorios");
  }

  return usuarioRepository.create(payload);
}

async function actualizar(id, payload) {
  await obtenerPorId(id);
  return usuarioRepository.update(id, payload);
}

async function eliminar(id) {
  await obtenerPorId(id);
  await usuarioRepository.remove(id);

  return { ok: true, message: "Usuario eliminado correctamente" };
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
