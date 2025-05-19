import { apiClient } from "./apiClient";
import {
  ApiResponse,
  Empleado,
  Inventario,
  MensajeResponse,
  PolizaRequest,
  PolizaResponse,
} from "@core/domain/entities";

export const polizaRepository = {
  getAll: async (): Promise<PolizaResponse[]> => {
    const response = await apiClient.get<ApiResponse<PolizaResponse[]>>(
      "/polizas"
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<PolizaResponse> => {
    const response = await apiClient.get<ApiResponse<PolizaResponse>>(
      `/polizas/${id}`
    );
    return response.data.data;
  },

  create: async (poliza: PolizaRequest): Promise<PolizaResponse> => {
    const response = await apiClient.post<ApiResponse<PolizaResponse>>(
      "/polizas",
      poliza
    );
    return response.data.data;
  },

  update: async (
    id: number,
    poliza: PolizaRequest
  ): Promise<MensajeResponse> => {
    const response = await apiClient.put<ApiResponse<MensajeResponse>>(
      `/polizas/${id}`,
      poliza
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<MensajeResponse> => {
    const response = await apiClient.delete<ApiResponse<MensajeResponse>>(
      `/polizas/${id}`
    );
    return response.data.data;
  },
};

export const inventarioRepository = {
  getAll: async (): Promise<Inventario[]> => {
    const response = await apiClient.get<ApiResponse<Inventario[]>>(
      "/inventario"
    );
    return response.data.data;
  },

  getById: async (sku: number): Promise<Inventario> => {
    const response = await apiClient.get<ApiResponse<Inventario>>(
      `/inventario/${sku}`
    );
    return response.data.data;
  },

  create: async (inventario: Inventario): Promise<Inventario> => {
    const response = await apiClient.post<ApiResponse<Inventario>>(
      "/inventario",
      inventario
    );
    return response.data.data;
  },

  update: async (sku: number, inventario: Inventario): Promise<Inventario> => {
    const response = await apiClient.put<ApiResponse<Inventario>>(
      `/inventario/${sku}`,
      inventario
    );
    return response.data.data;
  },

  delete: async (sku: number): Promise<void> => {
    await apiClient.delete(`/inventario/${sku}`);
  },
};

export const empleadoRepository = {
  getAll: async (): Promise<Empleado[]> => {
    const response = await apiClient.get<ApiResponse<Empleado[]>>("/empleados");
    return response.data.data;
  },

  getById: async (id: number): Promise<Empleado> => {
    const response = await apiClient.get<ApiResponse<Empleado>>(
      `/empleados/${id}`
    );
    return response.data.data;
  },

  create: async (empleado: Empleado): Promise<Empleado> => {
    const response = await apiClient.post<ApiResponse<Empleado>>(
      "/empleados",
      empleado
    );
    return response.data.data;
  },

  update: async (id: number, empleado: Empleado): Promise<Empleado> => {
    const response = await apiClient.put<ApiResponse<Empleado>>(
      `/empleados/${id}`,
      empleado
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/empleados/${id}`);
  },
};
