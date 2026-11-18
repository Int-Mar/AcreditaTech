-- limpiar_usuario_prueba.sql
-- Deja a un USUARIO DE PRUEBA como nuevo: sin constancia, sin respuestas y con
-- las evaluaciones en Pendiente. Córrelo al terminar tus pruebas.
-- Cambia el correo en las 4 partes. NO lo uses con cuentas reales.

-- 1. Borra la Pre-Constancia (va primero porque depende de la evaluación)
DELETE FROM mpre_constancia
WHERE id_usuario = (SELECT id_usuario FROM musuario WHERE correo = 'carpinterotest@gmail.com');

-- 2. Borra las respuestas guardadas
DELETE FROM erespuesta
WHERE id_evaluacion IN (
  SELECT e.id_evaluacion FROM eevaluacion e
  JOIN musuario u ON u.id_usuario = e.id_usuario
  WHERE u.correo = 'carpinterotest@gmail.com');

-- 3. Deja las evaluaciones como pendientes
UPDATE eevaluacion SET calificacion = 0, estado_aprobacion = 'Pendiente'
WHERE id_usuario = (SELECT id_usuario FROM musuario WHERE correo = 'carpinterotest@gmail.com');

-- 4. Regresa el estatus del usuario
UPDATE musuario SET estatus = 'En Diagnóstico'
WHERE correo = 'carpinterotest@gmail.com';
