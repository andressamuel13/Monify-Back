const planLibertadService = require("./planLibertad.service");

async function listar(_req, res, next) {
  try {
    const data = await planLibertadService.listar();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function listarPorUsuario(req, res, next) {
  try {
    const data = await planLibertadService.listarPorUsuario(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function resumen(req, res, next) {
  try {
    const data = await planLibertadService.obtenerResumen(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const data = await planLibertadService.obtenerPorId(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const data = await planLibertadService.crear(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const data = await planLibertadService.actualizar(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const data = await planLibertadService.eliminar(req.params.id);
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
