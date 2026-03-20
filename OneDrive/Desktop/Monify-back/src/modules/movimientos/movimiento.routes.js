const express = require("express");
const movimientoController = require("./movimiento.controller");

const router = express.Router();

router.get("/", movimientoController.listar);
router.get("/usuario/:usuarioId", movimientoController.listarPorUsuario);
router.get("/usuario/:usuarioId/recientes", movimientoController.listarRecientes);
router.get("/usuario/:usuarioId/resumen", movimientoController.resumen);
router.get("/usuario/:usuarioId/historial", movimientoController.historial);
router.get("/:id", movimientoController.obtenerPorId);
router.post("/", movimientoController.crear);
router.put("/:id", movimientoController.actualizar);
router.delete("/:id", movimientoController.eliminar);

module.exports = router;
