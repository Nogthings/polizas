import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import { polizaUseCases } from '@core/application/useCases';
import { PolizaResponse } from '@core/domain/entities';

const PolizasPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPoliza, setSelectedPoliza] = useState<number | null>(null);
  
  // Consulta para obtener todas las pólizas
  const { data: polizas, isLoading, isError } = useQuery({
    queryKey: ['polizas'],
    queryFn: polizaUseCases.getAllPolizas,
  });
  
  // Mutación para eliminar una póliza
  const deletePolizaMutation = useMutation({
    mutationFn: (id: number) => polizaUseCases.deletePoliza(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polizas'] });
      setSelectedPoliza(null);
    },
  });
  
  // Manejadores de eventos
  const handleCreate = () => {
    navigate('/polizas/nueva');
  };
  
  const handleEdit = (id: number) => {
    navigate(`/polizas/editar/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setSelectedPoliza(id);
    if (window.confirm('¿Está seguro de eliminar esta póliza?')) {
      deletePolizaMutation.mutate(id);
    } else {
      setSelectedPoliza(null);
    }
  };
  
  // Renderizado de la lista de pólizas
  const renderPolizasList = () => {
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
          Error al cargar las pólizas. Por favor, intente nuevamente.
        </div>
      );
    }
    
    if (!polizas || polizas.length === 0) {
      return (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No hay pólizas registradas.
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {polizas.map((poliza: PolizaResponse) => (
              <tr key={poliza.poliza.idPoliza} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {poliza.poliza.idPoliza}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {poliza.detalleArticulo.nombre} (SKU: {poliza.detalleArticulo.sku})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {poliza.poliza.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {poliza.empleado.nombre} {poliza.empleado.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(poliza.poliza.idPoliza)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(poliza.poliza.idPoliza)}
                      isLoading={deletePolizaMutation.isPending && selectedPoliza === poliza.poliza.idPoliza}
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
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Pólizas</h1>
        <Button onClick={handleCreate}>
          Nueva Póliza
        </Button>
      </div>
      
      {renderPolizasList()}
    </MainLayout>
  );
};

export default PolizasPage;