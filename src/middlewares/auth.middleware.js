const admin = require("../config/firebaseAdmin");
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

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    next(httpError(401, "Token de Firebase invalido o expirado"));
  }
}

module.exports = authMiddleware;
