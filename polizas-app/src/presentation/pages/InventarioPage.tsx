import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import { inventarioUseCases } from '@core/application/useCases';
import { Inventario } from '@core/domain/entities';

const InventarioPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  
  // Consulta para obtener todo el inventario
  const { data: inventario, isLoading, isError } = useQuery({
    queryKey: ['inventario'],
    queryFn: inventarioUseCases.getAllInventario,
  });
  
  // Mutación para eliminar un producto del inventario
  const deleteInventarioMutation = useMutation({
    mutationFn: (sku: number) => inventarioUseCases.deleteInventarioItem(sku),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      setSelectedSku(null);
    },
  });
  
  // Manejadores de eventos
  const handleCreate = () => {
    navigate('/inventario/nuevo');
  };
  
  const handleEdit = (sku: number) => {
    navigate(`/inventario/editar/${sku}`);
  };
  
  const handleDelete = (sku: number) => {
    setSelectedSku(sku);
    if (window.confirm('¿Está seguro de eliminar este artículo del inventario?')) {
      deleteInventarioMutation.mutate(sku);
    } else {
      setSelectedSku(null);
    }
  };
  
  // Renderizado de la lista de inventario
  const renderInventarioList = () => {
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
          Error al cargar el inventario. Por favor, intente nuevamente.
        </div>
      );
    }
    
    if (!inventario || inventario.length === 0) {
      return (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No hay artículos en el inventario.
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventario.map((item: Inventario) => (
              <tr key={item.sku} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.cantidad > 10 ? 'bg-green-100 text-green-800' : 
                    item.cantidad > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(item.sku)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(item.sku)}
                      isLoading={deleteInventarioMutation.isPending && selectedSku === item.sku}
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
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        <Button onClick={handleCreate}>
          Nuevo Producto
        </Button>
      </div>
      
      {renderInventarioList()}
    </MainLayout>
  );
};

export default InventarioPage;