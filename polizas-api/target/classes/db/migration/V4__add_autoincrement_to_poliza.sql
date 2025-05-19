-- Crear secuencia si no existe
CREATE SEQUENCE IF NOT EXISTS polizas_id_poliza_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Actualizar la secuencia para que empiece desde el último valor existente + 1
SELECT SETVAL('polizas_id_poliza_seq', COALESCE((SELECT MAX(id_poliza) FROM polizas), 0) + 1, false);

-- Modificar la tabla para que id_poliza sea auto-incrementable
ALTER TABLE polizas ALTER COLUMN id_poliza SET DEFAULT nextval('polizas_id_poliza_seq');
