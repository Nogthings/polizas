-- Creación de tablas según el PDF
CREATE TABLE IF NOT EXISTS inventario (
    sku BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS empleado (
    id_empleado BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    puesto VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS polizas (
    id_poliza BIGINT PRIMARY KEY,
    empleado_genero BIGINT NOT NULL,
    sku BIGINT NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP NOT NULL,
    CONSTRAINT fk_empleado FOREIGN KEY (empleado_genero) REFERENCES empleado(id_empleado),
    CONSTRAINT fk_inventario FOREIGN KEY (sku) REFERENCES inventario(sku)
);

-- Indices para mejorar el rendimiento de las consultas
CREATE INDEX idx_polizas_empleado ON polizas(empleado_genero);
CREATE INDEX idx_polizas_sku ON polizas(sku);
CREATE INDEX idx_polizas_fecha ON polizas(fecha);