const objetivoAhorroService = require("./objetivoAhorro.service");

async function listar(_req, res, next) {
  try {
    const data = await objetivoAhorroService.listar();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function listarPorUsuario(req, res, next) {
  try {
    const data = await objetivoAhorroService.listarPorUsuario(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function resumen(req, res, next) {
  try {
    const data = await objetivoAhorroService.obtenerResumen(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const data = await objetivoAhorroService.obtenerPorId(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const data = await objetivoAhorroService.crear(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const data = await objetivoAhorroService.actualizar(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const data = await objetivoAhorroService.eliminar(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  listarPorUsuario,
  resumen,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
