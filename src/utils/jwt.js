const crypto = require("crypto");
const httpError = require("./httpError");

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw httpError(500, "Falta JWT_SECRET en las variables de entorno");
  }

  return secret;
}

function parseExpiresIn(value = "7d") {
  const normalized = String(value).trim();
  const match = normalized.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return amount * multipliers[unit];
}

function signToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = parseExpiresIn(process.env.JWT_EXPIRES_IN);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(body));
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function verifyToken(token) {
  const [headerEncoded, payloadEncoded, signature] = String(token || "").split(".");

  if (!headerEncoded || !payloadEncoded || !signature) {
    throw httpError(401, "Token JWT invalido");
  }

  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw httpError(401, "Firma JWT invalida");
  }

  const payload = JSON.parse(base64UrlDecode(payloadEncoded));
  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp || payload.exp < now) {
    throw httpError(401, "Token JWT expirado");
  }

  return payload;
}

module.exports = {
  signToken,
  verifyToken,
};
