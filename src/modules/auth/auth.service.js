const usuarioRepository = require("../usuarios/usuario.repository");
const httpError = require("../../utils/httpError");

async function googleLogin(payload) {
  if (!payload.google_id || !payload.nombre || !payload.email) {
    throw httpError(400, "google_id, nombre y email son obligatorios");
  }

  let usuario = await usuarioRepository.findByGoogleId(payload.google_id);

  if (!usuario) {
    const existentePorEmail = await usuarioRepository.findByEmail(payload.email);

    if (existentePorEmail) {
      const actualizado = await usuarioRepository.update(existentePorEmail.id, {
        google_id: payload.google_id,
        nombre: payload.nombre,
        foto_url: payload.foto_url,
      });

      return {
        ok: true,
        message: "Usuario vinculado con Google correctamente",
        data: actualizado.data,
      };
    }

    const creado = await usuarioRepository.create(payload);

    return {
      ok: true,
      message: "Usuario autenticado y creado correctamente",
      data: creado.data,
    };
  }

  const actualizado = await usuarioRepository.update(usuario.id, {
    nombre: payload.nombre,
    email: payload.email,
    foto_url: payload.foto_url,
  });

  return {
    ok: true,
    message: "Usuario autenticado correctamente",
    data: actualizado.data,
  };
}

async function me(reqUser = null) {
  return {
    ok: true,
    message: "Endpoint listo. Falta conectarlo a session o JWT",
    data: reqUser,
  };
}

async function logout() {
  return {
    ok: true,
    message: "Logout listo. Falta invalidar session o token segun tu estrategia",
  };
}

module.exports = {
  googleLogin,
  me,
  logout,
};
