USE finanzas_app;

ALTER TABLE usuarios
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;

ALTER TABLE categorias
  MODIFY COLUMN tipo ENUM('income', 'expense', 'saving', 'debt') NOT NULL;

ALTER TABLE movimientos
  MODIFY COLUMN type ENUM('income', 'expense', 'saving', 'debt') NOT NULL;

CREATE TABLE IF NOT EXISTS planes_libertad (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  meta DECIMAL(12,2) NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  estado ENUM('activo', 'cumplido', 'cancelado') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_planes_libertad_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

INSERT INTO categorias (nombre, tipo)
SELECT * FROM (
  SELECT 'abono-deuda', 'debt'
) AS seed(nombre, tipo)
WHERE NOT EXISTS (
  SELECT 1
  FROM categorias c
  WHERE c.nombre = seed.nombre
    AND c.tipo = seed.tipo
);
