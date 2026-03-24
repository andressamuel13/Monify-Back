const express = require("express");
const planLibertadController = require("./planLibertad.controller");

const router = express.Router();

router.get("/", planLibertadController.listar);
router.get("/usuario/:usuarioId", planLibertadController.listarPorUsuario);
router.get("/usuario/:usuarioId/resumen", planLibertadController.resumen);
router.get("/:id", planLibertadController.obtenerPorId);
router.post("/", planLibertadController.crear);
router.put("/:id", planLibertadController.actualizar);
router.delete("/:id", planLibertadController.eliminar);

module.exports = router;
