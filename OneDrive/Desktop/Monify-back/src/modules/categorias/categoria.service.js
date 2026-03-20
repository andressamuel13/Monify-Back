const categoriaRepository = require("./categoria.repository");
const httpError = require("../../utils/httpError");

const TIPOS_VALIDOS = ["income", "expense", "saving"];

async function listar() {
  return categoriaRepository.findAll();
}

async function listarPorTipo(tipo) {
  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw httpError(400, "Tipo de categoria no valido");
  }

  return categoriaRepository.findByTipo(tipo);
}

async function obtenerPorId(id) {
  const categoria = await categoriaRepository.findById(id);

  if (!categoria) {
    throw httpError(404, "Categoria no encontrada");
  }

  return categoria;
}

module.exports = {
  listar,
  listarPorTipo,
  obtenerPorId,
};
