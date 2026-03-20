const express = require("express");
const objetivoAhorroController = require("./objetivoAhorro.controller");

const router = express.Router();

router.get("/", objetivoAhorroController.listar);
router.get("/usuario/:usuarioId", objetivoAhorroController.listarPorUsuario);
router.get("/usuario/:usuarioId/resumen", objetivoAhorroController.resumen);
router.get("/:id", objetivoAhorroController.obtenerPorId);
router.post("/", objetivoAhorroController.crear);
router.put("/:id", objetivoAhorroController.actualizar);
router.delete("/:id", objetivoAhorroController.eliminar);

module.exports = router;
