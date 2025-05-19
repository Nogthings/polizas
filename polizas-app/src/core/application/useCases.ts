import {
  polizaRepository,
  inventarioRepository,
  empleadoRepository,
} from "@core/infrastructure/api/repositories";
import {
  PolizaRequest,
  PolizaResponse,
  Inventario,
  Empleado,
} from "@core/domain/entities";

// Poliza Use Cases
export const polizaUseCases = {
  getAllPolizas: async (): Promise<PolizaResponse[]> => {
    return polizaRepository.getAll();
  },

  getPolizaById: async (id: number): Promise<PolizaResponse> => {
    return polizaRepository.getById(id);
  },

  createPoliza: async (poliza: PolizaRequest): Promise<PolizaResponse> => {
    return polizaRepository.create(poliza);
  },

  updatePoliza: async (id: number, poliza: PolizaRequest) => {
    return polizaRepository.update(id, poliza);
  },

  deletePoliza: async (id: number) => {
    return polizaRepository.delete(id);
  },
};

// Inventario Use Cases
export const inventarioUseCases = {
  getAllInventario: async (): Promise<Inventario[]> => {
    return inventarioRepository.getAll();
  },

  getInventarioItem: async (sku: number): Promise<Inventario> => {
    return inventarioRepository.getById(sku);
  },

  createInventarioItem: async (item: Inventario): Promise<Inventario> => {
    return inventarioRepository.create(item);
  },

  updateInventarioItem: async (
    sku: number,
    item: Inventario
  ): Promise<Inventario> => {
    return inventarioRepository.update(sku, item);
  },

  deleteInventarioItem: async (sku: number): Promise<void> => {
    return inventarioRepository.delete(sku);
  },
};

// Empleado Use Cases
export const empleadoUseCases = {
  getAllEmpleados: async (): Promise<Empleado[]> => {
    return empleadoRepository.getAll();
  },

  getEmpleadoById: async (id: number): Promise<Empleado> => {
    return empleadoRepository.getById(id);
  },

  createEmpleado: async (empleado: Empleado): Promise<Empleado> => {
    return empleadoRepository.create(empleado);
  },

  updateEmpleado: async (id: number, empleado: Empleado): Promise<Empleado> => {
    return empleadoRepository.update(id, empleado);
  },

  deleteEmpleado: async (id: number): Promise<void> => {
    return empleadoRepository.delete(id);
  },
};
