const usuarioRepository = require("../usuarios/usuario.repository");
const httpError = require("../../utils/httpError");
const { getFirebaseAdmin } = require("../../config/firebaseAdmin");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { signToken } = require("../../utils/jwt");

function sanitizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function sanitizeNombre(nombre = "") {
  return String(nombre).trim().replace(/\s+/g, " ");
}

function buildAuthResponse(usuario, message) {
  const token = signToken({
    sub: usuario.id,
    email: usuario.email,
    provider: usuario.firebase_uid ? "google" : "email",
  });

  return {
    ok: true,
    message,
    data: {
      token,
      usuario,
    },
  };
}

function buildGoogleAuthResponse(usuario, message, firebasePayload) {
  const response = buildAuthResponse(usuario, message);

  return {
    ...response,
    data: {
      ...response.data,
      firebase: firebasePayload,
    },
  };
}

async function register(payload) {
  const nombre = sanitizeNombre(payload.nombre || payload.name);
  const email = sanitizeEmail(payload.email);
  const password = String(payload.password || "").trim();
  const confirmPassword = String(payload.confirmPassword || "").trim();

  if (!nombre || !email || !password || !confirmPassword) {
    throw httpError(400, "nombre, email, password y confirmPassword son obligatorios");
  }

  if (password.length < 6) {
    throw httpError(400, "La contrasena debe tener al menos 6 caracteres");
  }

  if (password !== confirmPassword) {
    throw httpError(400, "Las contrasenas no coinciden");
  }

  const existente = await usuarioRepository.findByEmail(email);

  if (existente) {
    throw httpError(409, "Ya existe una cuenta con ese correo");
  }

  const usuarioCreado = await usuarioRepository.create({
    nombre,
    email,
    password_hash: hashPassword(password),
  });

  return buildAuthResponse(usuarioCreado.data, "Usuario registrado correctamente");
}

async function login(payload) {
  const email = sanitizeEmail(payload.email);
  const password = String(payload.password || "").trim();

  if (!email || !password) {
    throw httpError(400, "email y password son obligatorios");
  }

  const usuario = await usuarioRepository.findByEmailWithPassword(email);

  if (!usuario || !usuario.password_hash) {
    throw httpError(401, "Correo o contrasena incorrectos");
  }

  const passwordOk = verifyPassword(password, usuario.password_hash);

  if (!passwordOk) {
    throw httpError(401, "Correo o contrasena incorrectos");
  }

  const { password_hash, ...safeUsuario } = usuario;
  return buildAuthResponse(safeUsuario, "Sesion iniciada correctamente");
}

async function googleLogin(payload) {
  if (!payload.idToken) {
    throw httpError(400, "idToken es obligatorio");
  }

  const admin = getFirebaseAdmin();

  if (!admin) {
    throw httpError(503, "Firebase no esta configurado en el servidor");
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

      return buildGoogleAuthResponse(
        actualizado.data,
        "Usuario autenticado correctamente",
        decodedToken
      );
    }

    const creado = await usuarioRepository.create({
      firebase_uid,
      nombre,
      email,
      foto_url,
    });

    return buildGoogleAuthResponse(
      creado.data,
      "Usuario autenticado y creado correctamente",
      decodedToken
    );
  }

  const actualizado = await usuarioRepository.update(usuario.id, {
    nombre,
    email,
    firebase_uid,
    foto_url,
  });

  return buildGoogleAuthResponse(
    actualizado.data,
    "Usuario autenticado correctamente",
    decodedToken
  );
}

async function me(reqUser = null) {
  if (!reqUser) {
    throw httpError(401, "Usuario no autenticado");
  }

  const usuario =
    (reqUser.id ? await usuarioRepository.findById(reqUser.id) : null) ||
    (reqUser.uid ? await usuarioRepository.findByFirebaseUid(reqUser.uid) : null) ||
    (reqUser.email ? await usuarioRepository.findByEmail(reqUser.email) : null);

  return {
    ok: true,
    message: "Perfil obtenido correctamente",
    data: {
      auth: reqUser,
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
  register,
  login,
  googleLogin,
  me,
  logout,
};
