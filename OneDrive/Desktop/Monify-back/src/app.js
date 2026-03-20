const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./modules/usuarios/usuario.routes");
const categoriaRoutes = require("./modules/categorias/categoria.routes");
const movimientoRoutes = require("./modules/movimientos/movimiento.routes");
const objetivoAhorroRoutes = require("./modules/objetivos-ahorro/objetivoAhorro.routes");
const authRoutes = require("./modules/auth/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/objetivos-ahorro", objetivoAhorroRoutes);

app.use(errorMiddleware);

module.exports = app;
