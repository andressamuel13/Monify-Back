const pool = require("../../config/db");

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, nombre, tipo, activa, created_at, updated_at
     FROM categorias
     WHERE activa = 1
     ORDER BY tipo, nombre`
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findByTipo(tipo) {
  const [rows] = await pool.query(
    `SELECT id, nombre, tipo, activa, created_at, updated_at
     FROM categorias
     WHERE activa = 1 AND tipo = ?
     ORDER BY nombre`,
    [tipo]
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, tipo, activa, created_at, updated_at
     FROM categorias
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  findAll,
  findByTipo,
  findById,
};
