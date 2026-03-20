const pool = require("../../config/db");

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, firebase_uid, foto_url, created_at, updated_at
     FROM usuarios
     ORDER BY id DESC`
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, firebase_uid, foto_url, created_at, updated_at
     FROM usuarios
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function findByFirebaseUid(firebaseUid) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, firebase_uid, foto_url, created_at, updated_at
     FROM usuarios
     WHERE firebase_uid = ?`,
    [firebaseUid]
  );

  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, firebase_uid, foto_url, created_at, updated_at
     FROM usuarios
     WHERE email = ?`,
    [email]
  );

  return rows[0] || null;
}

async function create(payload) {
  const { nombre, email, firebase_uid = null, foto_url = null } = payload;

  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, email, firebase_uid, foto_url)
     VALUES (?, ?, ?, ?)`,
    [nombre, email, firebase_uid, foto_url]
  );

  const usuario = await findById(result.insertId);

  return {
    ok: true,
    data: usuario,
    message: "Usuario creado correctamente",
  };
}

async function update(id, payload) {
  const fields = [];
  const values = [];

  if (payload.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(payload.nombre);
  }

  if (payload.email !== undefined) {
    fields.push("email = ?");
    values.push(payload.email);
  }

  if (payload.firebase_uid !== undefined) {
    fields.push("firebase_uid = ?");
    values.push(payload.firebase_uid);
  }

  if (payload.foto_url !== undefined) {
    fields.push("foto_url = ?");
    values.push(payload.foto_url);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  const usuario = await findById(id);

  return {
    ok: true,
    data: usuario,
    message: "Usuario actualizado correctamente",
  };
}

async function remove(id) {
  await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return true;
}

module.exports = {
  findAll,
  findById,
  findByFirebaseUid,
  findByEmail,
  create,
  update,
  remove,
};
