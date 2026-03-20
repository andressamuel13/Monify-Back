CREATE DATABASE IF NOT EXISTS finanzas_app;
USE finanzas_app;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  google_id VARCHAR(100) UNIQUE,
  foto_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('income', 'expense', 'saving') NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  categoria_id BIGINT UNSIGNED NOT NULL,
  type ENUM('income', 'expense', 'saving') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description VARCHAR(255) NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_movimientos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_movimientos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS objetivos_ahorro (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  meta DECIMAL(12,2) NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  estado ENUM('activo', 'cumplido', 'cancelado') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_objetivos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

INSERT INTO categorias (nombre, tipo)
SELECT * FROM (
  SELECT 'Salario', 'income' UNION ALL
  SELECT 'Freelance', 'income' UNION ALL
  SELECT 'Rappi', 'income' UNION ALL
  SELECT 'Ventas', 'income' UNION ALL
  SELECT 'Otros ingresos', 'income' UNION ALL
  SELECT 'Supermercado', 'expense' UNION ALL
  SELECT 'Moto', 'expense' UNION ALL
  SELECT 'Arriendo', 'expense' UNION ALL
  SELECT 'Deudas', 'expense' UNION ALL
  SELECT 'Entretenimiento', 'expense' UNION ALL
  SELECT 'Servicios', 'expense' UNION ALL
  SELECT 'Ahorro', 'saving'
) AS seed(nombre, tipo)
WHERE NOT EXISTS (
  SELECT 1
  FROM categorias c
  WHERE c.nombre = seed.nombre
    AND c.tipo = seed.tipo
);
