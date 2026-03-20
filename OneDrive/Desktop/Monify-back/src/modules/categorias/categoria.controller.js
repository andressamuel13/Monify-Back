const categoriaService = require("./categoria.service");

async function listar(_req, res, next) {
  try {
    const data = await categoriaService.listar();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function listarPorTipo(req, res, next) {
  try {
    const data = await categoriaService.listarPorTipo(req.params.tipo);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const data = await categoriaService.obtenerPorId(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  listarPorTipo,
  obtenerPorId,
};
