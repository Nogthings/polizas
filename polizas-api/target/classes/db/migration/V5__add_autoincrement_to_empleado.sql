-- Crear secuencia para autoincremento de ID en la tabla empleado
CREATE SEQUENCE IF NOT EXISTS empleado_id_empleado_seq
    START WITH 200
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Actualizar la secuencia para que empiece desde el último valor existente + 1
SELECT SETVAL('empleado_id_empleado_seq', COALESCE((SELECT MAX(id_empleado) FROM empleado), 0) + 1, false);

-- Modificar la tabla para que id_empleado sea auto-incrementable
ALTER TABLE empleado ALTER COLUMN id_empleado SET DEFAULT nextval('empleado_id_empleado_seq');
