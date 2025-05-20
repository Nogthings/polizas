import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import Pagination from '@presentation/components/Pagination';
import SearchBar from '@presentation/components/SearchBar';
import { inventarioUseCases } from '@core/application/useCases';
import { Inventario } from '@core/domain/entities';
import { useToastNotification } from '@core/infrastructure/toast/ToastSystem';

const InventarioPage: React.FC = () => {
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
    searchParams.get('sortBy') || 'sku'
  );
  const [sortDir, setSortDir] = useState<string>(
    searchParams.get('sortDir') || 'asc'
  );
  
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('search') || ''
  );
  const [activeSearch, setActiveSearch] = useState<string>(
    searchParams.get('search') || ''
  );
  
  // Estado para la eliminación
  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  
  // Efecto para actualizar los parámetros de URL cuando cambia la paginación
  useEffect(() => {
    const params = new URLSearchParams();
    
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    
    if (activeSearch) {
      params.set('search', activeSearch);
    }
    
    setSearchParams(params);
  }, [currentPage, pageSize, sortBy, sortDir, activeSearch, setSearchParams]);
  
  // Consulta para obtener inventario paginado
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventario', 'paginated', currentPage, pageSize, sortBy, sortDir, activeSearch],
    queryFn: () => inventarioUseCases.getPaginatedInventario(
      currentPage, 
      pageSize, 
      sortBy, 
      sortDir, 
      activeSearch
    )
  });
  
  // Mutación para eliminar un producto del inventario
  const deleteInventarioMutation = useMutation({
    mutationFn: (sku: number) => inventarioUseCases.deleteInventarioItem(sku),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['inventario', 'paginated'] 
      });
      
      toast.success('Artículo eliminado del inventario exitosamente');
      
      // Si estamos en la última página y eliminamos el último elemento, volvemos a la página anterior
      if (data && data.content.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        refetch();
      }
      
      setSelectedSku(null);
    },
    onError: (error) => {
      toast.error(`Error al eliminar el artículo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setSelectedSku(null);
    }
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearch = () => {
    setActiveSearch(searchTerm);
    setCurrentPage(0); // Volver a la primera página cuando se busca
    if (searchTerm) {
      toast.info(`Buscando: "${searchTerm}"`, 2000);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
    setCurrentPage(0);
    toast.info('Búsqueda limpiada', 2000);
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
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Volver a la primera página cuando se cambia el tamaño
  };
  
  // Renderizado de la tabla de inventario con ordenación
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    
    return sortDir === 'asc' 
      ? <span className="ml-1 text-primary-600">↑</span> 
      : <span className="ml-1 text-primary-600">↓</span>;
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
    
    if (!data || !data.content || data.content.length === 0) {
      return (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No hay artículos en el inventario {activeSearch ? `que coincidan con "${activeSearch}"` : ''}.
          {activeSearch && (
            <button 
              onClick={handleClearSearch}
              className="ml-2 text-primary-600 hover:underline"
            >
              Limpiar búsqueda
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
                  onClick={() => handleSort('sku')}
                >
                  SKU {renderSortIcon('sku')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('nombre')}
                >
                  Nombre {renderSortIcon('nombre')}
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
              {data.content.map((item: Inventario) => (
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
        
        {/* Componente de paginación */}
        {data.totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            totalItems={data.totalItems}
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
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
          <Button onClick={handleCreate}>
            Nuevo Producto
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-4">
          {/* Barra de búsqueda */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onSearch={handleSearch}
            placeholder="Buscar por nombre..."
          />
          
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
        
        {/* Indicador de búsqueda activa */}
        {activeSearch && (
          <div className="mb-4 flex items-center">
            <span className="text-sm text-gray-600">
              Resultados para: <strong>"{activeSearch}"</strong>
            </span>
            <button
              onClick={handleClearSearch}
              className="ml-2 text-primary-600 hover:underline text-sm"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
      
      {renderInventarioList()}
    </MainLayout>
  );
};

export default InventarioPage;