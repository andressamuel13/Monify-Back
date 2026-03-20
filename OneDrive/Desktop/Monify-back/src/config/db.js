const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "finanzas_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connection = await pool.getConnection();
try {
  await connection.ping();
  console.log("Conexión a la base de datos MySQL exitosa.");
} catch (error) {
  console.error("Error al conectar a la base de datos MySQL:", error);
} finally {
  connection.release();
}

module.exports = pool;
