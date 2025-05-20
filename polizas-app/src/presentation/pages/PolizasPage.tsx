import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import Pagination from '@presentation/components/Pagination';
import Select from '@presentation/components/Select';
import { polizaUseCases, empleadoUseCases, inventarioUseCases } from '@core/application/useCases';
import { PolizaResponse } from '@core/domain/entities';
import { useToastNotification } from '@core/infrastructure/toast/ToastSystem';

const PolizasPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToastNotification();
  
  // Estado para controlar la paginación
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get('page') || '0')
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get('size') || '10')
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sortBy') || 'idPoliza'
  );
  const [sortDir, setSortDir] = useState<string>(
    searchParams.get('sortDir') || 'asc'
  );
  
  // Estado para los filtros
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number | undefined>(
    searchParams.get('empleadoId') ? Number(searchParams.get('empleadoId')) : undefined
  );
  const [selectedSku, setSelectedSku] = useState<number | undefined>(
    searchParams.get('sku') ? Number(searchParams.get('sku')) : undefined
  );
  
  // Estado para la confirmación de eliminación
  const [polizaToDelete, setPolizaToDelete] = useState<number | null>(null);
  
  // Efecto para actualizar los parámetros de URL cuando cambia la paginación o los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    
    if (selectedEmpleadoId) {
      params.set('empleadoId', selectedEmpleadoId.toString());
    }
    
    if (selectedSku) {
      params.set('sku', selectedSku.toString());
    }
    
    setSearchParams(params);
  }, [currentPage, pageSize, sortBy, sortDir, selectedEmpleadoId, selectedSku, setSearchParams]);
  
  // Consultas para obtener datos
  const { data: empleados, isLoading: isLoadingEmpleados } = useQuery({
    queryKey: ['empleados'],
    queryFn: empleadoUseCases.getAllEmpleados,
  });
  
  const { data: inventario, isLoading: isLoadingInventario } = useQuery({
    queryKey: ['inventario'],
    queryFn: inventarioUseCases.getAllInventario,
  });
  
  // Consulta para obtener pólizas paginadas con filtros
  const { 
    data: polizasPage, 
    isLoading: isLoadingPolizas, 
    isError: isErrorPolizas,
    refetch
  } = useQuery({
    queryKey: [
      'polizas', 
      'paginated', 
      currentPage, 
      pageSize, 
      sortBy, 
      sortDir, 
      selectedEmpleadoId, 
      selectedSku
    ],
    queryFn: () => polizaUseCases.getPaginatedPolizas(
      currentPage, 
      pageSize, 
      sortBy, 
      sortDir, 
      selectedEmpleadoId, 
      selectedSku
    )
  });
  
  // Mutación para eliminar una póliza
  const deletePolizaMutation = useMutation({
    mutationFn: (id: number) => polizaUseCases.deletePoliza(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['polizas', 'paginated'] 
      });
      
      // También invalidar inventario para actualizar las existencias
      queryClient.invalidateQueries({ 
        queryKey: ['inventario'] 
      });
      
      toast.success('Póliza eliminada exitosamente');
      
      // Si estamos en la última página y eliminamos el último elemento, volvemos a la página anterior
      if (polizasPage && polizasPage.content.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        refetch();
      }
      
      setPolizaToDelete(null);
    },
    onError: (error) => {
      toast.error(`Error al eliminar la póliza: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setPolizaToDelete(null);
    }
  });
  
  // Manejadores de eventos
  const handleCreate = () => {
    navigate('/polizas/nueva');
  };
  
  const handleEdit = (id: number) => {
    navigate(`/polizas/editar/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setPolizaToDelete(id);
    if (window.confirm('¿Está seguro de eliminar esta póliza? La cantidad será devuelta al inventario.')) {
      deletePolizaMutation.mutate(id);
    } else {
      setPolizaToDelete(null);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Volver a la primera página cuando se cambia el tamaño
  };
  
  const handleEmpleadoFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedEmpleadoId(value);
    setCurrentPage(0); // Reiniciar a la primera página al cambiar filtros
  };
  
  const handleSkuFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedSku(value);
    setCurrentPage(0); // Reiniciar a la primera página al cambiar filtros
  };
  
  const handleClearFilters = () => {
    setSelectedEmpleadoId(undefined);
    setSelectedSku(undefined);
    setCurrentPage(0);
    toast.info('Filtros limpiados', 2000);
  };
  
  const handleSort = (column: string) => {
    // Si hacemos clic en la misma columna, cambiamos la dirección
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    
    setCurrentPage(0); // Volver a la primera página cuando se cambia el orden
  };
  
  // Renderizado de la tabla de pólizas con ordenación
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    
    return sortDir === 'asc' 
      ? <span className="ml-1 text-primary-600">↑</span> 
      : <span className="ml-1 text-primary-600">↓</span>;
  };
  
  // Construir opciones para los filtros select
  const empleadoOptions = empleados
    ? [
        { value: '', label: 'Todos los empleados' },
        ...empleados.map(emp => ({
          value: emp.idEmpleado,
          label: `${emp.nombre} ${emp.apellido}`
        }))
      ]
    : [{ value: '', label: 'Cargando empleados...' }];
  
  const skuOptions = inventario
    ? [
        { value: '', label: 'Todos los artículos' },
        ...inventario.map(item => ({
          value: item.sku,
          label: `${item.nombre} (SKU: ${item.sku})`
        }))
      ]
    : [{ value: '', label: 'Cargando artículos...' }];
  
  // Renderizado de la lista de pólizas
  const renderPolizasList = () => {
    const isLoading = isLoadingPolizas || isLoadingEmpleados || isLoadingInventario;
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (isErrorPolizas) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error al cargar las pólizas. Por favor, intente nuevamente.
        </div>
      );
    }
    
    if (!polizasPage || !polizasPage.content || polizasPage.content.length === 0) {
      return (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No hay pólizas registradas con los filtros seleccionados.
          {(selectedEmpleadoId || selectedSku) && (
            <button 
              onClick={handleClearFilters}
              className="ml-2 text-primary-600 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      );
    }
    
    return (
      <>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('idPoliza')}
                >
                  ID {renderSortIcon('idPoliza')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('empleadoGenero')}
                >
                  Empleado {renderSortIcon('empleadoGenero')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('sku')}
                >
                  Artículo {renderSortIcon('sku')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('cantidad')}
                >
                  Cantidad {renderSortIcon('cantidad')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {polizasPage.content.map((poliza: PolizaResponse) => (
                <tr key={poliza.poliza.idPoliza} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {poliza.poliza.idPoliza}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {poliza.empleado.nombre} {poliza.empleado.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {poliza.detalleArticulo.nombre} (SKU: {poliza.detalleArticulo.sku})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {poliza.poliza.cantidad}
                    </span>
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
                        isLoading={deletePolizaMutation.isPending && polizaToDelete === poliza.poliza.idPoliza}
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
        
        {/* Componente de paginación */}
        {polizasPage.totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={polizasPage.totalPages}
            onPageChange={handlePageChange}
            totalItems={polizasPage.totalItems}
            itemsPerPage={pageSize}
          />
        )}
      </>
    );
  };
  
  // Opciones para el tamaño de página
  const pageSizeOptions = [
    { value: 5, label: '5 por página' },
    { value: 10, label: '10 por página' },
    { value: 20, label: '20 por página' },
    { value: 50, label: '50 por página' },
  ];
  
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Pólizas</h1>
          <Button onClick={handleCreate}>
            Nueva Póliza
          </Button>
        </div>
        
        <div className="flex flex-col space-y-4 mb-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Filtrar por Empleado"
                  id="empleadoFilter"
                  name="empleadoFilter"
                  value={selectedEmpleadoId || ''}
                  onChange={handleEmpleadoFilterChange}
                  options={empleadoOptions}
                />
              </div>
              <div>
                <Select
                  label="Filtrar por Artículo"
                  id="skuFilter"
                  name="skuFilter"
                  value={selectedSku || ''}
                  onChange={handleSkuFilterChange}
                  options={skuOptions}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="mb-4"
                  disabled={!selectedEmpleadoId && !selectedSku}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>
          
          {/* Indicador de filtros activos */}
          {(selectedEmpleadoId || selectedSku) && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center">
                <span className="mr-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm text-blue-700">Filtros activos:</span>
                {selectedEmpleadoId && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    Empleado: {empleados?.find(e => e.idEmpleado === selectedEmpleadoId)?.nombre || selectedEmpleadoId}
                  </span>
                )}
                {selectedSku && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    Artículo: {inventario?.find(i => i.sku === selectedSku)?.nombre || `SKU: ${selectedSku}`}
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-4">
          {/* Selector de tamaño de página */}
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              Mostrar:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {pageSizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {renderPolizasList()}
    </MainLayout>
  );
};

export default PolizasPage;