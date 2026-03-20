const usuarioService = require("./usuario.service");

async function listar(_req, res, next) {
  try {
    const data = await usuarioService.listar();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const data = await usuarioService.obtenerPorId(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const data = await usuarioService.crear(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const data = await usuarioService.actualizar(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const data = await usuarioService.eliminar(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
