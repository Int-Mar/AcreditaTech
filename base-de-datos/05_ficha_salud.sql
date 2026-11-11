-- Columna para que el administrador bloquee usuarios
ALTER TABLE musuario
  ADD COLUMN IF NOT EXISTS bloqueado boolean NOT NULL DEFAULT false;