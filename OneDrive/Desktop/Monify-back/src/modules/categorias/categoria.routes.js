const express = require("express");
const categoriaController = require("./categoria.controller");

const router = express.Router();

router.get("/", categoriaController.listar);
router.get("/tipo/:tipo", categoriaController.listarPorTipo);
router.get("/:id", categoriaController.obtenerPorId);

module.exports = router;
