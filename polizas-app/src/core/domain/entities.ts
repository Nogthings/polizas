export interface Inventario {
  sku: number;
  nombre: string;
  cantidad: number;
}

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  puesto: string;
}

export interface Poliza {
  idPoliza: number;
  empleadoGenero: number;
  sku: number;
  cantidad: number;
  fecha: string;
}

// DTO para respuesta de la Poliza
export interface PolizaResponse {
  poliza: {
    idPoliza: number;
    cantidad: number;
  };
  empleado: {
    nombre: string;
    apellido: string;
  };
  detalleArticulo: {
    sku: number;
    nombre: string;
  };
}

export interface PolizaRequest {
  idPoliza?: number;
  empleadoGenero: number;
  sku: number;
  cantidad: number;
}

export interface MensajeResponse {
  mensaje: {
    idMensaje: string;
  };
}

export interface ApiResponse<T> {
  meta: {
    status: string;
  };
  data: T;
}
