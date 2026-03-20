const pool = require("../../config/db");

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, usuario_id, meta, fecha_inicio, fecha_fin, estado, created_at, updated_at
     FROM objetivos_ahorro
     ORDER BY id DESC`
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT id, usuario_id, meta, fecha_inicio, fecha_fin, estado, created_at, updated_at
     FROM objetivos_ahorro
     WHERE usuario_id = ?
     ORDER BY
       CASE WHEN estado = 'activo' THEN 0 ELSE 1 END,
       id DESC`,
    [usuarioId]
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, usuario_id, meta, fecha_inicio, fecha_fin, estado, created_at, updated_at
     FROM objetivos_ahorro
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function create(payload) {
  const {
    usuario_id,
    meta,
    fecha_inicio = null,
    fecha_fin = null,
    estado = "activo",
  } = payload;

  const [result] = await pool.query(
    `INSERT INTO objetivos_ahorro (usuario_id, meta, fecha_inicio, fecha_fin, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [usuario_id, meta, fecha_inicio, fecha_fin, estado]
  );

  const newItem = await findById(result.insertId);

  return {
    ok: true,
    data: newItem,
    message: "Objetivo de ahorro creado de forma simulada",
  };
}

async function update(id, payload) {
  const fields = [];
  const values = [];

  if (payload.usuario_id !== undefined) {
    fields.push("usuario_id = ?");
    values.push(payload.usuario_id);
  }

  if (payload.meta !== undefined) {
    fields.push("meta = ?");
    values.push(payload.meta);
  }

  if (payload.fecha_inicio !== undefined) {
    fields.push("fecha_inicio = ?");
    values.push(payload.fecha_inicio);
  }

  if (payload.fecha_fin !== undefined) {
    fields.push("fecha_fin = ?");
    values.push(payload.fecha_fin);
  }

  if (payload.estado !== undefined) {
    fields.push("estado = ?");
    values.push(payload.estado);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE objetivos_ahorro SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  const updatedItem = await findById(id);

  return {
    ok: true,
    data: updatedItem,
    message: "Objetivo de ahorro actualizado correctamente",
  };
}

async function remove(id) {
  await pool.query("DELETE FROM objetivos_ahorro WHERE id = ?", [id]);
  return true;
}

module.exports = {
  findAll,
  findByUsuario,
  findById,
  create,
  update,
  remove,
};
