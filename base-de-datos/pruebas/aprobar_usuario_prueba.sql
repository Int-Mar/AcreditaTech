-- aprobar_usuario_prueba.sql
-- Deja a un USUARIO DE PRUEBA con las dos evaluaciones aprobadas
-- (técnica y salud). Sirve para probar avance al 100% y la Pre-Constancia.
-- Cambia el correo en las 2 partes. NO lo uses con cuentas reales.

-- 1. Crea las evaluaciones si no existen
INSERT INTO eevaluacion (id_usuario, tipo_evaluacion, calificacion, estado_aprobacion)
SELECT u.id_usuario, t.tipo, 80, 'Aprobado'
FROM musuario u
CROSS JOIN (VALUES (1), (2)) AS t(tipo)
WHERE u.correo = 'carpinterotest@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM eevaluacion e
    WHERE e.id_usuario = u.id_usuario AND e.tipo_evaluacion = t.tipo);

-- 2. Si ya existían, las marca como aprobadas
UPDATE eevaluacion SET calificacion = 80, estado_aprobacion = 'Aprobado'
WHERE id_usuario = (SELECT id_usuario FROM musuario WHERE correo = 'carpinterotest@gmail.com');
