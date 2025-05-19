import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@presentation/pages/HomePage';

// Páginas de Pólizas
import PolizasPage from '@presentation/pages/PolizasPage';
import PolizaForm from '@presentation/pages/PolizaForm';

// Páginas de Empleados
import EmpleadosPage from '@presentation/pages/EmpleadosPage';
import EmpleadoForm from '@presentation/pages/EmpleadoForm';

// Páginas de Inventario
import InventarioPage from '@presentation/pages/InventarioPage';
import InventarioForm from '@presentation/pages/InventarioForm';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Rutas de Pólizas */}
      <Route path="/polizas" element={<PolizasPage />} />
      <Route path="/polizas/nueva" element={<PolizaForm />} />
      <Route path="/polizas/editar/:id" element={<PolizaForm />} />
      
      {/* Rutas de Empleados */}
      <Route path="/empleados" element={<EmpleadosPage />} />
      <Route path="/empleados/nuevo" element={<EmpleadoForm />} />
      <Route path="/empleados/editar/:id" element={<EmpleadoForm />} />
      
      {/* Rutas de Inventario */}
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/inventario/nuevo" element={<InventarioForm />} />
      <Route path="/inventario/editar/:sku" element={<InventarioForm />} />
      
      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;