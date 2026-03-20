const usuarioRepository = require("../usuarios/usuario.repository");
const httpError = require("../../utils/httpError");
const admin = require("../../config/firebaseAdmin");

async function googleLogin(payload) {
  if (!payload.idToken) {
    throw httpError(400, "idToken es obligatorio");
  }

  const decodedToken = await admin.auth().verifyIdToken(payload.idToken);

  const firebase_uid = decodedToken.uid;
  const nombre = decodedToken.name || payload.nombre || "Usuario";
  const email = decodedToken.email;
  const foto_url = decodedToken.picture || null;

  if (!email) {
    throw httpError(400, "El token de Firebase no contiene email");
  }

  let usuario = await usuarioRepository.findByFirebaseUid(firebase_uid);

  if (!usuario) {
    const existentePorEmail = await usuarioRepository.findByEmail(email);

    if (existentePorEmail) {
      const actualizado = await usuarioRepository.update(existentePorEmail.id, {
        firebase_uid,
        nombre,
        email,
        foto_url,
      });

      return {
        ok: true,
        message: "Usuario autenticado correctamente",
        data: {
          usuario: actualizado.data,
          firebase: decodedToken,
        },
      };
    }

    const creado = await usuarioRepository.create({
      firebase_uid,
      nombre,
      email,
      foto_url,
    });

    return {
      ok: true,
      message: "Usuario autenticado y creado correctamente",
      data: {
        usuario: creado.data,
        firebase: decodedToken,
      },
    };
  }

  const actualizado = await usuarioRepository.update(usuario.id, {
    nombre,
    email,
    firebase_uid,
    foto_url,
  });

  return {
    ok: true,
    message: "Usuario autenticado correctamente",
    data: {
      usuario: actualizado.data,
      firebase: decodedToken,
    },
  };
}

async function me(reqUser = null) {
  if (!reqUser) {
    throw httpError(401, "Usuario no autenticado");
  }

  const usuario =
    (await usuarioRepository.findByFirebaseUid(reqUser.uid)) ||
    (reqUser.email ? await usuarioRepository.findByEmail(reqUser.email) : null);

  return {
    ok: true,
    message: "Perfil obtenido correctamente",
    data: {
      firebase: reqUser,
      usuario,
    },
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
