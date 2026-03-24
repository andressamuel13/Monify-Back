const { getFirebaseAdmin } = require("../config/firebaseAdmin");
const { verifyToken } = require("../utils/jwt");
const usuarioRepository = require("../modules/usuarios/usuario.repository");
const httpError = require("../utils/httpError");

async function authMiddleware(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      throw httpError(401, "Token no proporcionado");
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      throw httpError(401, "Token no proporcionado");
    }

    try {
      const decodedToken = verifyToken(token);
      const usuario = await usuarioRepository.findById(decodedToken.sub);

      if (!usuario) {
        throw httpError(401, "Usuario no encontrado para el token");
      }

      req.user = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        provider: "email",
        tokenType: "jwt",
      };
      return next();
    } catch (_jwtError) {
      const admin = getFirebaseAdmin();

      if (!admin) {
        throw httpError(401, "Token invalido o expirado");
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        ...decodedToken,
        provider: "google",
        tokenType: "firebase",
      };
      return next();
    }
  } catch (error) {
    next(httpError(401, error.message || "Token invalido o expirado"));
  }
}

module.exports = authMiddleware;
