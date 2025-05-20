import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@presentation/layouts/MainLayout';
import Input from '@presentation/components/Input';
import Button from '@presentation/components/Button';
import { polizaUseCases } from '@core/application/useCases';
import { useToastNotification } from '@core/infrastructure/toast/ToastSystem';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastNotification();
  const [polizaIdSearch, setPolizaIdSearch] = useState<string>('');
  
  // Manejador para la búsqueda por ID
  const handleSearchById = () => {
    if (!polizaIdSearch || isNaN(Number(polizaIdSearch))) {
      toast.warning('Por favor, ingrese un ID de póliza válido');
      return;
    }
    
    const id = Number(polizaIdSearch);
    
    // Buscar la póliza por ID
    polizaUseCases.getPolizaById(id)
      .then(() => {
        // Navegar a la página de edición si se encuentra
        navigate(`/polizas/editar/${id}`);
        toast.success(`Póliza con ID ${id} encontrada`);
      })
      .catch(() => {
        toast.error(`No se encontró una póliza con el ID ${id}`);
      });
  };
  
  // Manejador para tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  return (
    <MainLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-700 mb-4">Sistema de Gestión de Pólizas</h1>
        <p className="text-lg mb-8">
          Gestiona el inventario, empleados y las pólizas de faltantes de manera eficiente.
        </p>
        
        {/* Componente de búsqueda de pólizas por ID */}
        <div className="max-w-md mx-auto mb-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Búsqueda Rápida de Pólizas</h2>
          <div className="space-y-4">
            <Input
              label="Buscar Póliza por ID"
              type="number"
              id="polizaIdSearch"
              placeholder="Ingrese ID de póliza"
              value={polizaIdSearch}
              onChange={(e) => setPolizaIdSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <Button
              onClick={handleSearchById}
              disabled={!polizaIdSearch}
              fullWidth
            >
              Buscar Póliza
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Los cards existentes de navegación */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="bg-primary-100 text-primary-700 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Pólizas</h2>
            <p className="text-gray-600 text-center mb-4">
              Generar y gestionar pólizas de faltantes asignadas a empleados.
            </p>
            <a 
              href="/polizas" 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Ir a Pólizas →
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="bg-primary-100 text-primary-700 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Inventario</h2>
            <p className="text-gray-600 text-center mb-4">
              Administra el inventario de artículos y sus existencias.
            </p>
            <a 
              href="/inventario" 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Ir a Inventario →
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="bg-primary-100 text-primary-700 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Empleados</h2>
            <p className="text-gray-600 text-center mb-4">
              Gestiona los datos de empleados para asignación de pólizas.
            </p>
            <a 
              href="/empleados" 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Ir a Empleados →
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;