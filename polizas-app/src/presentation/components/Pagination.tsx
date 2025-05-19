import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  // Determinar qué páginas mostrar (siempre mostramos la página actual y algunas páginas alrededor)
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Siempre mostrar la primera página
    pageNumbers.push(0);
    
    // Agregar puntos suspensivos si hay un gap (solo si hay más de 3 páginas antes de la página actual)
    if (currentPage > 3) {
      pageNumbers.push(-1); // -1 representa "..."
    }
    
    // Mostrar páginas alrededor de la página actual
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i < totalPages - 1) {
        pageNumbers.push(i);
      }
    }
    
    // Agregar puntos suspensivos si hay un gap (solo si hay más de 3 páginas después de la página actual)
    if (currentPage < totalPages - 4) {
      pageNumbers.push(-2); // -2 representa "..." al final
    }
    
    // Siempre mostrar la última página si hay más de una página
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1);
    }
    
    return pageNumbers;
  };
  
  const showingInfo = () => {
    if (totalItems && itemsPerPage) {
      const start = currentPage * itemsPerPage + 1;
      const end = Math.min((currentPage + 1) * itemsPerPage, totalItems);
      return `Mostrando ${start}-${end} de ${totalItems}`;
    }
    return null;
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Información de resultados */}
      <div className="text-sm text-gray-700 mb-4 md:mb-0">
        {showingInfo()}
      </div>
      
      {/* Controles de paginación */}
      <div className="flex items-center space-x-1">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded-md ${
            currentPage === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-primary-600 hover:bg-primary-50'
          } border border-gray-300`}
        >
          Anterior
        </button>
        
        {/* Números de página */}
        <div className="hidden sm:flex">
          {getPageNumbers().map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber >= 0 ? (
                <button
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-600 hover:bg-primary-50'
                  } border border-gray-300 mx-1`}
                >
                  {pageNumber + 1}
                </button>
              ) : (
                <span className="px-2 py-1 text-gray-500">...</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-primary-600 hover:bg-primary-50'
          } border border-gray-300`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;
