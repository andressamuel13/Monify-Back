const movimientoService = require("./movimiento.service");

async function listar(_req, res, next) {
  try {
    const data = await movimientoService.listar();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function listarPorUsuario(req, res, next) {
  try {
    const data = await movimientoService.listarPorUsuario(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function listarRecientes(req, res, next) {
  try {
    const data = await movimientoService.listarRecientes(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function resumen(req, res, next) {
  try {
    const data = await movimientoService.obtenerResumen(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function historial(req, res, next) {
  try {
    const data = await movimientoService.obtenerHistorial(req.params.usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const data = await movimientoService.obtenerPorId(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const data = await movimientoService.crear(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const data = await movimientoService.actualizar(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const data = await movimientoService.eliminar(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  listarPorUsuario,
  listarRecientes,
  resumen,
  historial,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
