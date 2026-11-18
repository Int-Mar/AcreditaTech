-- respuestas_debiles_prueba.sql
-- Simula que un USUARIO DE PRUEBA contestó la prueba de SALUD con la opción
-- de menor puntaje en todas las preguntas. Así todos los temas de salud quedan
-- en 50% o menos y GET /api/guias?refuerzo=1 devuelve las guías de salud.
-- Cambia el correo en las 3 partes. NO lo uses con cuentas reales.

-- 1. Asegura que exista la evaluación de salud (tipo 2) y la deja terminada
INSERT INTO eevaluacion (id_usuario, tipo_evaluacion, calificacion, estado_aprobacion)
SELECT u.id_usuario, 2, 0, 'No aprobado'
FROM musuario u
WHERE u.correo = 'carpinterotest@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM eevaluacion e
    WHERE e.id_usuario = u.id_usuario AND e.tipo_evaluacion = 2);

UPDATE eevaluacion SET calificacion = 0, estado_aprobacion = 'No aprobado'
WHERE tipo_evaluacion = 2
  AND id_usuario = (SELECT id_usuario FROM musuario WHERE correo = 'carpinterotest@gmail.com');

-- 2. Borra respuestas anteriores de esa evaluación
DELETE FROM erespuesta
WHERE id_evaluacion IN (
  SELECT e.id_evaluacion FROM eevaluacion e
  JOIN musuario u ON u.id_usuario = e.id_usuario
  WHERE u.correo = 'carpinterotest@gmail.com' AND e.tipo_evaluacion = 2);

-- 3. Responde cada pregunta de salud del oficio con su opción de menor puntaje
INSERT INTO erespuesta (id_evaluacion, id_pregunta, id_opcion, puntos)
SELECT e.id_evaluacion, p.id_pregunta, o.id_opcion, o.puntos
FROM musuario u
JOIN eevaluacion e ON e.id_usuario = u.id_usuario AND e.tipo_evaluacion = 2
JOIN cpregunta p   ON p.id_tipo_evaluacion = 2 AND p.id_oficio = u.id_oficio
JOIN LATERAL (
  SELECT id_opcion, puntos FROM copcion
  WHERE id_pregunta = p.id_pregunta
  ORDER BY puntos ASC, id_opcion ASC
  LIMIT 1
) o ON TRUE
WHERE u.correo = 'carpinterotest@gmail.com';
