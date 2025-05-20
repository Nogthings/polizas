import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import { empleadoUseCases } from '@core/application/useCases';
import { Empleado } from '@core/domain/entities';
import { useToastNotification } from '@core/infrastructure/toast/ToastSystem';

const EmpleadosPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedEmpleado, setSelectedEmpleado] = useState<number | null>(null);
  const toast = useToastNotification();
  
  // Consulta para obtener todos los empleados
  const { data: empleados, isLoading, isError } = useQuery({
    queryKey: ['empleados'],
    queryFn: empleadoUseCases.getAllEmpleados,
  });
  
  // Mutación para eliminar un empleado
  const deleteEmpleadoMutation = useMutation({
    mutationFn: (id: number) => empleadoUseCases.deleteEmpleado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      setSelectedEmpleado(null);
      toast.success('Empleado eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar el empleado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setSelectedEmpleado(null);
    }
  });
  
  // Manejadores de eventos
  const handleCreate = () => {
    navigate('/empleados/nuevo');
  };
  
  const handleEdit = (id: number) => {
    navigate(`/empleados/editar/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setSelectedEmpleado(id);
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      deleteEmpleadoMutation.mutate(id);
    } else {
      setSelectedEmpleado(null);
    }
  };
  
  // Renderizado de la lista de empleados
  const renderEmpleadosList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error al cargar los empleados. Por favor, intente nuevamente.
        </div>
      );
    }
    
    if (!empleados || empleados.length === 0) {
      return (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No hay empleados registrados.
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleados.map((empleado: Empleado) => (
              <tr key={empleado.idEmpleado} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {empleado.idEmpleado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empleado.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empleado.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {empleado.puesto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(empleado.idEmpleado)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(empleado.idEmpleado)}
                      isLoading={deleteEmpleadoMutation.isPending && selectedEmpleado === empleado.idEmpleado}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Empleados</h1>
        <Button onClick={handleCreate}>
          Nuevo Empleado
        </Button>
      </div>
      
      {renderEmpleadosList()}
    </MainLayout>
  );
};

export default EmpleadosPage;