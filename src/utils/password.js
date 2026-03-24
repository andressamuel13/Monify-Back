const crypto = require("crypto");

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== "string") {
    return false;
  }

  const [algorithm, salt, originalHash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !originalHash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  const originalBuffer = Buffer.from(originalHash, "hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");

  if (originalBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, derivedBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword,
  DIGEST,
};
