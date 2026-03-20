const pool = require("../../config/db");

async function findAll() {
  const [rows] = await pool.query(
    `SELECT
      m.id,
      m.usuario_id,
      m.categoria_id,
      c.nombre AS category,
      m.description,
      m.amount,
      m.date,
      m.type,
      m.created_at,
      m.updated_at
     FROM movimientos m
     INNER JOIN categorias c ON c.id = m.categoria_id
     ORDER BY m.date DESC, m.id DESC`
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT
      m.id,
      m.usuario_id,
      m.categoria_id,
      c.nombre AS category,
      m.description,
      m.amount,
      m.date,
      m.type,
      m.created_at,
      m.updated_at
     FROM movimientos m
     INNER JOIN categorias c ON c.id = m.categoria_id
     WHERE m.usuario_id = ?
     ORDER BY m.date DESC, m.id DESC`,
    [usuarioId]
  );

  return {
    ok: true,
    data: rows,
  };
}

async function findRecientesByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT
      m.id,
      m.usuario_id,
      m.categoria_id,
      c.nombre AS category,
      m.description,
      m.amount,
      m.date,
      m.type,
      m.created_at,
      m.updated_at
     FROM movimientos m
     INNER JOIN categorias c ON c.id = m.categoria_id
     WHERE m.usuario_id = ?
     ORDER BY m.date DESC, m.id DESC
     LIMIT 5`,
    [usuarioId]
  );

  return { ok: true, data: rows };
}

async function getResumenByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS ingresos,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS gastos
     FROM movimientos
     WHERE usuario_id = ?`,
    [usuarioId]
  );

  const ingresos = Number(rows[0].ingresos || 0);
  const gastos = Number(rows[0].gastos || 0);

  return {
    ok: true,
    data: {
      ingresos,
      gastos,
      balance: ingresos - gastos,
    },
  };
}

async function getHistorialByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT
      DATE_FORMAT(m.date, '%Y-%m') AS mes,
      COALESCE(SUM(CASE WHEN m.type = 'income' THEN m.amount ELSE 0 END), 0) AS ingresos,
      COALESCE(SUM(CASE WHEN m.type = 'expense' THEN m.amount ELSE 0 END), 0) AS gastos,
      COALESCE(SUM(CASE WHEN m.type = 'income' THEN m.amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN m.type = 'expense' THEN m.amount ELSE 0 END), 0) AS balance
     FROM movimientos m
     WHERE m.usuario_id = ?
     GROUP BY DATE_FORMAT(m.date, '%Y-%m')
     ORDER BY mes DESC`,
    [usuarioId]
  );

  return {
    ok: true,
    data: rows.map((row) => ({
      ...row,
      ingresos: Number(row.ingresos),
      gastos: Number(row.gastos),
      balance: Number(row.balance),
    })),
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT
      m.id,
      m.usuario_id,
      m.categoria_id,
      c.nombre AS category,
      m.description,
      m.amount,
      m.date,
      m.type,
      m.created_at,
      m.updated_at
     FROM movimientos m
     INNER JOIN categorias c ON c.id = m.categoria_id
     WHERE m.id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function create(payload) {
  const { usuario_id, categoria_id, type, amount, description = null, date } = payload;

  const [result] = await pool.query(
    `INSERT INTO movimientos (usuario_id, categoria_id, type, amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [usuario_id, categoria_id, type, amount, description, date]
  );

  const newItem = await findById(result.insertId);

  return {
    ok: true,
    data: newItem,
    message: "Movimiento creado de forma simulada",
  };
}

async function update(id, payload) {
  const fields = [];
  const values = [];

  if (payload.usuario_id !== undefined) {
    fields.push("usuario_id = ?");
    values.push(payload.usuario_id);
  }

  if (payload.categoria_id !== undefined) {
    fields.push("categoria_id = ?");
    values.push(payload.categoria_id);
  }

  if (payload.type !== undefined) {
    fields.push("type = ?");
    values.push(payload.type);
  }

  if (payload.amount !== undefined) {
    fields.push("amount = ?");
    values.push(payload.amount);
  }

  if (payload.description !== undefined) {
    fields.push("description = ?");
    values.push(payload.description);
  }

  if (payload.date !== undefined) {
    fields.push("date = ?");
    values.push(payload.date);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE movimientos SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  const updatedItem = await findById(id);

  return {
    ok: true,
    data: updatedItem,
    message: "Movimiento actualizado correctamente",
  };
}

async function remove(id) {
  await pool.query("DELETE FROM movimientos WHERE id = ?", [id]);
  return true;
}

module.exports = {
  findAll,
  findByUsuario,
  findRecientesByUsuario,
  getResumenByUsuario,
  getHistorialByUsuario,
  findById,
  create,
  update,
  remove,
};
